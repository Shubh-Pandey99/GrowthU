"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const engine = [
  ["01", "Discover", "Understand your audience, competitors and positioning."],
  ["02", "Strategy", "Build a content direction with a clear job to do."],
  ["03", "Create", "Turn the strategy into content people want to consume."],
  ["04", "Publish", "Consistency creates the momentum your brand needs."],
  ["05", "Grow", "Measure what works and deliberately double down."],
  ["06", "Learn", "Every result makes the next cycle more effective."],
];

const services: [string, string, string, string[]][] = [
  ["01", "Strategy", "Find the signal before we make the noise.", ["Positioning", "Audience research", "Content pillars", "Growth roadmap"]],
  ["02", "Content", "Creative built to earn a second look.", ["Reels", "Carousels", "Stories", "Content calendar"]],
  ["03", "Social", "A reliable publishing rhythm, managed end to end.", ["Scheduling", "Captions", "Community cues", "Monthly reporting"]],
  ["04", "Creative", "A distinct visual point of view for every channel.", ["Art direction", "Campaign concepts", "Design systems", "Templates"]],
  ["05", "Growth", "Turn reporting into sharper decisions and next moves.", ["Performance review", "Optimisation", "Trend analysis", "Iteration"]],
];

const plans = [
  { stage: "starting", eyebrow: "Start", name: "Basic", volume: "1 Reel · 15 Posts", price: "₹899", features: ["1 Reel", "15 Static Posts", "Content Creation", "Basic Captions & Hashtags", "Monthly Report"] },
  { stage: "growing", eyebrow: "Recommended", name: "Growth", volume: "4 Reels · 100 Posts", price: "₹2,899", features: ["4 Reels", "100 Static Posts", "Content Creation", "Advanced Captions & Hashtags", "Monthly Report", "Strategy Support"] },
  { stage: "scaling", eyebrow: "Maximum", name: "Prime", volume: "12 Reels · 150 Posts", price: "₹4,899", features: ["12 Reels", "150 Static Posts", "Content Creation", "Advanced Captions & Hashtags", "Monthly Report", "Strategy & Growth Support", "Competitor Analysis"] },
];

function Arrow() { return <span aria-hidden="true" className="arrow">→</span>; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [engineIndex, setEngineIndex] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [stage, setStage] = useState("growing");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const submittingRef = useRef(false);
  useEffect(() => {
    const onScroll = () => document.documentElement.classList.toggle("has-scrolled", window.scrollY > 18);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      brand: formData.get("organization"),
      requirement: formData.get("need"),
      message: formData.get("message"),
      website: formData.get("website"), // honeypot, left empty by real visitors
    };
    submittingRef.current = true;
    setStatus("submitting");
    setErrorMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (response.ok && result?.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMessage(result?.error || "Something went wrong while sending your enquiry. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong while sending your enquiry. Please try again.");
    } finally {
      submittingRef.current = false;
    }
  };
  const closeMenu = () => setMenuOpen(false);
  const service = services[serviceIndex];
  return <main>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="nav-wrap"><nav className="nav container" aria-label="Main navigation">
      <a className="wordmark" href="#home" onClick={closeMenu}>Growth<span>U</span></a>
      <button className="menu-button" aria-expanded={menuOpen} aria-controls="nav-links" onClick={() => setMenuOpen(!menuOpen)}><span></span><span></span><span></span><span className="sr-only">Toggle navigation</span></button>
      <div id="nav-links" className={`nav-links ${menuOpen ? "is-open" : ""}`}>{[["Home", "home"], ["About", "about"], ["Services", "services"], ["Process", "process"], ["Pricing", "pricing"], ["Contact", "contact"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={closeMenu}>{label}</a>)}<a className="button nav-cta" href="#contact" onClick={closeMenu}>Start Growing <Arrow /></a></div>
    </nav></header>

    <section className="hero" id="home"><div className="hero-orb"></div><div className="container hero-grid" id="main">
      <div className="hero-copy"><p className="kicker">Social media × content × growth</p><h1>Turn attention<br />into <i>growth.</i></h1><p className="lede">GrowthU builds content systems for brands that want more than likes — strategy, creative and consistent execution designed to move the business forward.</p><div className="button-row"><a className="button" href="#contact">Build My Growth System <Arrow /></a><a className="text-link" href="#engine">See how it works <span>↓</span></a></div></div>
      <aside className="growth-signal" aria-label="Growth signal: Content, attention, engagement, trust, growth"><p className="panel-label">Live growth signal</p>{["Content", "Attention", "Engagement", "Trust", "Growth"].map((item, index) => <div className="signal" key={item}><span>0{index + 1}</span><strong>{item}</strong>{index < 4 && <i>↓</i>}</div>)}<p className="signal-note">A considered system, not a content lottery.</p></aside>
    </div><div className="hero-rule container"><span className="scroll-cue">Scroll to discover<i className="scroll-arrow" aria-hidden="true">↓</i></span><i className="rule-line" aria-hidden="true"></i><span>Strategy · Content · Growth</span></div></section>

    <section className="section engine" id="engine"><div className="container"><div className="section-heading engine-head"><div><p className="kicker">01 — The Growth Engine</p><h2>Not just posts.<br /><i>A growth system.</i></h2></div><p>Every piece of content has a job. Together, they make a cycle that gets more intelligent as it moves.</p></div>
      <div className="engine-layout"><div className="engine-path" role="tablist" aria-label="Growth engine stages">{engine.map(([num, title], index) => <button role="tab" aria-selected={engineIndex === index} className={engineIndex === index ? "active" : ""} onClick={() => setEngineIndex(index)} key={title}><span>{num}</span><b>{title}</b><i>{index === engine.length - 1 ? "↺" : "↓"}</i></button>)}</div><article className="engine-detail"><p className="kicker">Stage {engine[engineIndex][0]}</p><div className="detail-number">{engine[engineIndex][0]}</div><h3>{engine[engineIndex][1]}</h3><p>{engine[engineIndex][2]}</p><div className="engine-progress"><span style={{ width: `${((engineIndex + 1) / engine.length) * 100}%` }}></span></div><small>Growth is a cycle. The line always leads back to discovery.</small></article></div></div></section>

    <section className="section content-lab" id="about"><div className="container"><div className="section-heading split-heading"><div><p className="kicker">02 — Content Lab</p><h2>Content should<br />look good. <i>It should<br />do something.</i></h2></div><p>Not filler. We use concepts, formats and visual cues to make your brand easier to recognise — and harder to scroll past.</p></div>
      <div className="content-wall"><article className="lab-card big card-reel"><span>Reel / Creative</span><strong>MAKE<br />THE SCROLL<br /><em>STOP.</em></strong><small>Motion-led concept</small></article><article className="lab-card note"><span>Strategy note</span><p>“The best content feels obvious after it works.”</p><small>Positioning / Audience</small></article><article className="lab-card quote"><span>Carousel / Copy</span><strong>A POINT<br />OF VIEW<br />IS A GROWTH<br />TOOL.</strong><small>Swipe to explore →</small></article><article className="lab-card analytics"><span>Reporting / Learn</span><div className="chart"><i></i><i></i><i></i><i></i><i></i></div><strong>What made them stay?</strong><small>Look for the signal, then make more.</small></article></div></div></section>

    <section className="statement" aria-label="Strategy, Content, Growth"><div className="container statement-inner">{[["Strategy", "We find the signal before we create the content."], ["Content", "We turn the strategy into content people remember."], ["Growth", "We measure what moves and build more of it."]].map(([word, copy], index) => <article key={word}><span>0{index + 1}</span><h2>{word}</h2><p>{copy}</p></article>)}</div></section>

    <section className="section services" id="services"><div className="container"><div className="section-heading"><p className="kicker">03 — What we build</p><h2>An agency<br />operating <i>system.</i></h2></div><div className="service-system"><div className="service-tabs" role="tablist" aria-label="Services">{services.map(([num, title], index) => <button role="tab" aria-selected={serviceIndex === index} className={serviceIndex === index ? "active" : ""} onClick={() => setServiceIndex(index)} key={title}><span>{num}</span>{title}<Arrow /></button>)}</div><article className="service-panel"><p className="kicker">{service[0]} / {service[1]}</p><h3>{service[2]}</h3><ul>{service[3].map(item => <li key={item}>{item}<span>↗</span></li>)}</ul><a className="text-link" href="#contact">Build this into my system <Arrow /></a></article></div></div></section>

    <section className="section process" id="process"><div className="container"><div className="section-heading split-heading"><div><p className="kicker">04 — How we work</p><h2>Ideas into<br /><i>momentum.</i></h2></div><p>There is no mystery in the process — just a clear rhythm that gives good ideas a chance to compound.</p></div><div className="timeline">{[["01", "Audit", "We understand where you are."], ["02", "Plan", "We build the roadmap."], ["03", "Create", "We turn strategy into content."], ["04", "Grow", "We learn, optimise and scale."]].map(([num, title, copy]) => <article key={title}><span>{num}</span><i></i><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className="section proof"><div className="container proof-grid"><div><p className="kicker">05 — Proof over promises</p><h2>Built around<br /><i>measurable growth.</i></h2></div><div><p>Good reporting should lead to better work, not just a prettier spreadsheet. GrowthU measures the moments that matter to your business.</p><div className="measurements">{["Reach", "Engagement", "Content output", "Lead generation"].map(item => <div key={item}><span>○</span>{item}<small>Measurement framework</small></div>)}</div><p className="proof-note">Real client metrics will live here as GrowthU case studies are published. No invented numbers. Ever.</p></div></div></section>

    <section className="section work"><div className="container"><div className="work-head"><p className="kicker">06 — Selected work</p><h2>Work with<br />a <i>purpose.</i></h2><p>A flexible showcase structure, ready for real GrowthU projects and outcomes.</p></div><div className="work-grid">{[["01", "Brand Growth", "Strategy / Content system"], ["02", "Campaign Direction", "Creative / Social"]].map(([num, title, meta]) => <article key={num}><div className="work-visual"><span>{num}</span><b>GROWTH<br />IN<br />MOTION</b></div><div><p>{meta}</p><h3>{title}</h3><a href="#contact">View strategy <Arrow /></a></div></article>)}</div></div></section>

    <section className="section pricing" id="pricing"><div className="container"><div className="pricing-intro"><div><p className="kicker">07 — Choose your growth stage</p><h2>Pick your<br /><i>momentum.</i></h2></div><p>Three plans. One shared goal:<br />grow your brand beyond limits.</p></div><div className="stage-switch" aria-label="Choose your growth stage">{[["starting", "Starting"], ["growing", "Growing"], ["scaling", "Scaling"]].map(([id, label]) => <button className={stage === id ? "active" : ""} onClick={() => setStage(id)} key={id}>{label}</button>)}</div><div className="pricing-grid">{plans.map(plan => <article className={`price-card ${plan.stage === stage ? "featured" : ""}`} key={plan.name}><p className="plan-eyebrow">{plan.eyebrow}</p><h3>{plan.name}</h3><p className="volume">{plan.volume}</p><p className="price"><strong>{plan.price}</strong> / month</p><ul>{plan.features.map(item => <li key={item}>{item}<span>✓</span></li>)}</ul><a className="price-action" href="#contact">Choose {plan.name} <Arrow /></a></article>)}</div></div></section>

    <section className="final-cta"><div className="container cta-shell"><div><p className="kicker">The next move</p><h2>Ready to grow<br />beyond <i>posting?</i></h2><p>Let&apos;s build a content system that actually moves your brand forward.</p><a className="button light-button" href="#contact">Start Your Growth Journey <Arrow /></a></div><div className="cta-loop" aria-hidden="true"><span>Strategy</span><i>→</i><span>Content</span><i>→</i><span>Growth</span><i>↺</i></div></div></section>

    <section className="section contact" id="contact"><div className="container contact-grid"><div><p className="kicker">08 — Start the conversation</p><h2>Let&apos;s build<br />something that <i>grows.</i></h2><p className="contact-copy">Tell us a little about where you want to go. We&apos;ll make the right next step clear.</p><div className="contact-mark"><strong>GrowthU</strong><span>Social Media Management Agency</span><em>Strategy · Content · Growth</em></div></div><form onSubmit={submit} aria-label="Contact GrowthU"><label className="hp-field" aria-hidden="true">Leave this field blank<input name="website" tabIndex={-1} autoComplete="off" /></label><label>Name<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Brand<input name="organization" autoComplete="organization" required /></label><label>What do you need help with?<select name="need" defaultValue="" required><option value="" disabled>Select an area</option><option>Strategy</option><option>Content</option><option>Social media</option><option>Creative</option><option>Growth</option></select></label><label className="full">Message<textarea name="message" rows={4} required /></label>{status === "success" && <p className="form-notice is-success" role="status">Thanks — your enquiry has been received. We&apos;ll be in touch soon.</p>}{status === "error" && <p className="form-notice is-error" role="alert">{errorMessage}</p>}<button className="button form-submit" type="submit" disabled={status === "submitting"}>{status === "submitting" ? "Sending..." : <>Start the Conversation <Arrow /></>}</button><p className="form-note">Your enquiry goes straight to our team — no forms lost, no fake confirmations.</p></form></div></section>
    <footer><div className="container"><a className="wordmark" href="#home">Growth<span>U</span></a><p>Strategy. Content. Growth.</p><p>© {new Date().getFullYear()} GrowthU</p></div></footer>
  </main>;
}
