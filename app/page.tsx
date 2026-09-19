"use client";

import { FormEvent, useState } from "react";

const plans = [
  { eyebrow: "Start", name: "Basic", volume: "1 Reel • 15 Posts", price: "₹899", features: ["1 Reel", "15 Static Posts", "Content Creation", "Basic Captions & Hashtags", "Monthly Report"], audience: "New businesses, local brands and entrepreneurs who want a professional and consistent start." },
  { eyebrow: "Popular", name: "Growth", volume: "4 Reels • 100 Posts", price: "₹2,899", features: ["4 Reels", "100 Static Posts", "Content Creation", "Advanced Captions & Hashtags", "Monthly Report", "Strategy Support"], audience: "Growing brands that want regular content, reels and an organized strategy.", featured: true },
  { eyebrow: "Maximum", name: "Prime", volume: "12 Reels • 150 Posts", price: "₹4,899", features: ["12 Reels", "150 Static Posts", "Content Creation", "Advanced Captions & Hashtags", "Monthly Report", "Strategy & Growth Support", "Competitor Analysis"], audience: "Established businesses and ambitious brands aiming for stronger reach and competitive positioning." },
];

const system = [["01", "Discover", "Understand your brand & goals"], ["02", "Create", "Design content that stands out"], ["03", "Publish", "Stay visible & consistent"], ["04", "Grow", "Measure, improve & scale"]];
const workflow = [["01", "Audit", "We look at your current page, see what competitors are doing, and set clear goals for your brand."], ["02", "Plan", "We build a full monthly content calendar with ideas, captions, and exact posting dates for you."], ["03", "Create & Post", "Our team designs all your posts. Once ready, we schedule and post everything automatically."], ["04", "Grow", "We track what gets the most views and use that data to make next month's content even better."]];

function Arrow() { return <span aria-hidden="true">→</span>; }

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); event.currentTarget.reset(); };
  return (
    <main>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Main navigation">
          <a className="wordmark" href="#home" onClick={closeMenu}>Growth<span>U</span></a>
          <button className="menu-button" aria-expanded={menuOpen} aria-controls="nav-links" onClick={() => setMenuOpen(!menuOpen)}><span></span><span></span><span></span><span className="sr-only">Toggle navigation</span></button>
          <div id="nav-links" className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            {[['Home','home'],['About','about'],['Services','services'],['Process','process'],['Pricing','pricing'],['Contact','contact']].map(([label, id]) => <a key={id} href={`#${id}`} onClick={closeMenu}>{label}</a>)}
            <a className="button nav-cta" href="#contact" onClick={closeMenu}>Let&apos;s Grow <Arrow /></a>
          </div>
        </nav>
      </header>

      <section className="hero section" id="home">
        <div className="orb orb-one"></div><div className="orb orb-two"></div>
        <div className="container hero-grid" id="main">
          <div className="hero-copy">
            <p className="kicker">Social Media Management Agency</p>
            <p className="hero-brand">GrowthU <em>Grow beyond limits</em></p>
            <h1>Your Content.<br />Your Growth.</h1>
            <p className="lede">A creative roadmap for brands that want to look better, connect deeper and grow stronger online.</p>
            <div className="button-row"><a className="button" href="#contact">Let&apos;s Build Your Presence <Arrow /></a><a className="text-link" href="#pricing">View Plans <Arrow /></a></div>
          </div>
          <aside className="pillar-panel" aria-label="GrowthU core pillars">
            <p className="panel-label">The GrowthU way</p>
            {[['01','Strategy','Clear direction'],['02','Content','Creative consistency'],['03','Growth','Real momentum']].map(([n,t,d]) => <div className="pillar" key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></div>)}
          </aside>
        </div>
        <div className="hero-rule container"><span>Scroll to discover</span><i></i><span>Strategy · Content · Growth</span></div>
      </section>

      <section className="section system" id="services">
        <div className="container"><div className="section-heading split-heading"><p className="kicker">A considered approach</p><h2>Not just posts.<br /><i>A growth system.</i></h2><div><p>At GrowthU, we turn social media into a consistent brand-building machine.</p><p>Every plan is designed around one simple idea: your audience should see your brand, remember your brand and eventually choose your brand.</p></div></div>
          <div className="system-grid">{system.map(([num,title,copy]) => <article className="system-item" key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
          <blockquote>“Your brand deserves more than random posts.”</blockquote>
        </div>
      </section>

      <section className="section philosophy" id="about"><div className="orb orb-three"></div><div className="container">
        <p className="kicker">Our core philosophy</p><div className="beliefs"><article><span>01</span><h2>Our Mission</h2><p>To help growing businesses <strong>Grow Beyond Limits.</strong> We handle all your social media content and scheduling, so you can focus 100% on running your business.</p></article><article><span>02</span><h2>Our Vision</h2><p>To be the best digital growth partner for modern brands, making high-quality, professional social media management simple, fast, and accessible.</p></article></div>
        <div className="value-grid">{[["Strategy","We research your audience and competitors to ensure every post has a clear goal."],["Content","We create beautiful posts, graphics, and Reels designed to grab attention."],["Growth","We use the right hashtags and engagement tactics to keep your reach growing every month."]].map(([title,copy], index) => <article className="value-card" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </div></section>

      <section className="section process" id="process"><div className="container"><div className="section-heading"><p className="kicker">A clear rhythm, every month</p><h2>How we work<br />together.</h2></div><div className="process-line">{workflow.map(([number,title,copy]) => <article key={number}><div className="node"><span>{number}</span></div><h3>{title}</h3><p>{copy}</p></article>)}</div>
        <div className="routine"><p className="routine-label">The weekly routine</p>{[["Mon–Tue","Review numbers and create new content ideas."],["Wed–Thu","Schedule posts, write captions, and get approvals."],["Fri–Sun","Monitor engagement and watch for new trends."]].map(([day,copy]) => <div key={day}><strong>{day}</strong><p>{copy}</p></div>)}</div>
      </div></section>

      <section className="section pricing" id="pricing"><div className="container"><div className="pricing-intro"><div><p className="kicker">Built for your next stage</p><h2>Pick your<br />growth level.</h2></div><p>Three plans. Three levels of momentum.<br />One goal: grow your brand beyond limits.</p></div><div className="pricing-grid">{plans.map(plan => <article className={`price-card ${plan.featured ? 'featured' : ''}`} key={plan.name}>{plan.featured && <p className="popular">Most popular</p>}<p className="plan-eyebrow">{plan.eyebrow}</p><h3>{plan.name}</h3><p className="volume">{plan.volume}</p><p className="price"><strong>{plan.price}</strong> / month</p><ul>{plan.features.map(item => <li key={item}>{item}<span>✓</span></li>)}</ul><div className="perfect"><strong>Perfect for</strong><p>{plan.audience}</p></div><a className="price-action" href="#contact">Let&apos;s build your presence <Arrow /></a></article>)}</div></div></section>

      <section className="section final-cta"><div className="container cta-shell"><div className="cta-copy"><p className="kicker">The next step is simple</p><h2>Ready to<br />grow beyond limits?</h2><p>Choose a plan. Share your goals.<br />Let GrowthU handle the creative consistency.</p><a className="button light-button" href="#contact">DM us to get started <Arrow /></a></div><div className="cta-diagram"><article><span>01</span><h3>Your Brand</h3><p>Your vision becomes the direction.</p></article><div className="diagram-arrow">↓</div><article><span>02</span><h3>Our Strategy</h3><p>Our content turns direction into action.</p></article></div></div></section>

      <section className="section contact" id="contact"><div className="container contact-grid"><div><p className="kicker">Start the conversation</p><h2>Let&apos;s make your<br />brand <i>seen.</i></h2><p className="contact-copy">Tell us a little about where you want to go. We&apos;ll take it from there.</p><div className="contact-mark"><strong>GrowthU</strong><span>Social Media Management Agency</span><em>Strategy · Content · Growth</em></div></div><form onSubmit={submit} aria-label="Contact GrowthU">{sent && <p className="success" role="status">Thank you — your enquiry is ready for our team. We&apos;ll be in touch soon.</p>}<label>Name<input name="name" autoComplete="name" required /></label><label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Phone / WhatsApp<input name="phone" type="tel" autoComplete="tel" required /></label><label>Interested Plan<select name="plan" defaultValue="" required><option value="" disabled>Select a plan</option><option>Basic</option><option>Growth</option><option>Prime</option><option>Not sure yet</option></select></label><label className="full">Message<textarea name="message" rows={4} required></textarea></label><button className="button form-submit" type="submit">Let&apos;s Grow <Arrow /></button><p className="form-note">This form is ready for your preferred email or CRM integration.</p></form></div></section>
      <footer><div className="container"><a className="wordmark" href="#home">Growth<span>U</span></a><p>Grow beyond limits.</p><p>© {new Date().getFullYear()} GrowthU</p></div></footer>
    </main>
  );
}
