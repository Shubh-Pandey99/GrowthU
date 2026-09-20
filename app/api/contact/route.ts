import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const MAX_NAME_LENGTH = 120;
const MAX_BRAND_LENGTH = 160;
const MAX_REQUIREMENT_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_EMAIL_LENGTH = 320;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  brand?: unknown;
  requirement?: unknown;
  message?: unknown;
  // Honeypot field. Real visitors never fill this in.
  website?: unknown;
};

type ValidatedContact = {
  name: string;
  email: string;
  brand: string;
  requirement: string;
  message: string;
};

/**
 * Extremely lightweight, best-effort in-memory rate limiter.
 *
 * Serverless functions on Vercel are not guaranteed to share memory across
 * invocations or instances, so this only throttles bursts that happen to
 * land on the same warm instance. It is a courtesy layer on top of the
 * honeypot field below, not a substitute for a real rate limiter (e.g. a
 * Vercel KV / Upstash Redis backed one) if abuse becomes a real problem.
 */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return false;
}

function getClientKey(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(value: string): string {
  return value.replace(/\n/g, "<br />");
}

function validate(payload: ContactPayload): { errors: string[]; data: ValidatedContact | null } {
  const errors: string[] = [];

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const brand = typeof payload.brand === "string" ? payload.brand.trim() : "";
  const requirement = typeof payload.requirement === "string" ? payload.requirement.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name) errors.push("Please enter your name.");
  else if (name.length > MAX_NAME_LENGTH) errors.push("Name is too long.");

  if (!email) errors.push("Please enter your email address.");
  else if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!brand) errors.push("Please enter your brand name.");
  else if (brand.length > MAX_BRAND_LENGTH) errors.push("Brand name is too long.");

  if (!requirement) errors.push("Please select what you need help with.");
  else if (requirement.length > MAX_REQUIREMENT_LENGTH) errors.push("That selection isn't valid.");

  if (!message) errors.push("Please enter a message.");
  else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.push("Message is too long. Please keep it under 5000 characters.");
  }

  if (errors.length > 0) return { errors, data: null };

  return { errors: [], data: { name, email, brand, requirement, message } };
}

export async function POST(request: NextRequest) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  // Honeypot check. Bots that auto-fill every field will fill this hidden
  // one in; real visitors never see or fill it. Respond as if it worked so
  // the bot doesn't learn to try something else.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const clientKey = getClientKey(request);
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again in a little while." },
      { status: 429 }
    );
  }

  const { errors, data } = validate(payload);
  if (!data) {
    return NextResponse.json({ success: false, error: errors[0] }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !contactEmail || !fromEmail) {
    console.error(
      "[contact] Missing required environment variable(s):",
      [
        !apiKey && "RESEND_API_KEY",
        !contactEmail && "CONTACT_EMAIL",
        !fromEmail && "CONTACT_FROM_EMAIL",
      ]
        .filter(Boolean)
        .join(", ")
    );
    return NextResponse.json(
      {
        success: false,
        error: "This form isn't fully configured yet. Please try again later.",
      },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const { name, email, brand, requirement, message } = data;

  const enquiryHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #153d31;">
      <h2 style="margin: 0 0 20px;">GrowthU — New Enquiry</h2>
      <p style="margin: 0 0 10px;"><strong>Name:</strong><br />${escapeHtml(name)}</p>
      <p style="margin: 0 0 10px;"><strong>Email:</strong><br />${escapeHtml(email)}</p>
      <p style="margin: 0 0 10px;"><strong>Brand:</strong><br />${escapeHtml(brand)}</p>
      <p style="margin: 0 0 10px;"><strong>Requirement:</strong><br />${escapeHtml(requirement)}</p>
      <p style="margin: 0 0 10px;"><strong>Message:</strong><br />${nl2br(escapeHtml(message))}</p>
    </div>
  `.trim();

  const enquiryText = [
    "GrowthU — New Enquiry",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Brand: ${brand}`,
    `Requirement: ${requirement}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: contactEmail,
      replyTo: email,
      subject: `New GrowthU Enquiry — ${name}`,
      html: enquiryHtml,
      text: enquiryText,
    });

    if (error) {
      console.error("[contact] Resend error sending enquiry email:", error);
      return NextResponse.json(
        { success: false, error: "Unable to send your enquiry. Please try again." },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[contact] Unexpected error sending enquiry email:", err);
    return NextResponse.json(
      { success: false, error: "Unable to send your enquiry. Please try again." },
      { status: 500 }
    );
  }

  // Best-effort acknowledgement email to the visitor. The enquiry to
  // CONTACT_EMAIL above is the operation that matters — if this optional
  // acknowledgement fails, we still report success to the visitor.
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "We received your GrowthU enquiry",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #153d31;">
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thanks for reaching out to GrowthU.</p>
          <p>We've received your enquiry and our team will get back to you soon.</p>
          <p>— GrowthU<br />Strategy. Content. Growth.</p>
        </div>
      `.trim(),
      text: `Hi ${name},\n\nThanks for reaching out to GrowthU.\n\nWe've received your enquiry and our team will get back to you soon.\n\n— GrowthU\nStrategy. Content. Growth.`,
    });
  } catch (err) {
    console.error("[contact] Acknowledgement email failed (non-critical):", err);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
