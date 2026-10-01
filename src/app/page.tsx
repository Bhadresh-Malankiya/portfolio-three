import Image from "next/image";
import Link from "next/link";
import ProjectShowcase from "@/components/ProjectShowcase";
import { identity, selectedWork, expertise, portfolioProjects } from "@/data/portfolio";

export default function Home() {
  return (
    <div className="pf-page">
      <section className="pf-shell pf-hero" aria-labelledby="hero-title">
        <div className="pf-hero-copy">
          <p className="pf-eyebrow">Bhadresh Malankiya / Product-minded engineering</p>
          <p className="pf-role">{identity.role}</p>
          <h1 id="hero-title">I build products<br />people <em>rely on.</em></h1>
          <p className="pf-lead">From the first interface to the systems behind it. I bring full-stack engineering, applied AI and hands-on technical leadership together.</p>
          <div className="pf-actions">
            <a href="#work" className="pf-button pf-button-primary">View selected work <span aria-hidden="true">↗</span></a>
            <a href={identity.resume} download className="pf-button">Download résumé <span aria-hidden="true">↓</span></a>
          </div>
          <p className="pf-hero-note">React / Next.js / TypeScript / Node.js / Applied AI</p>
        </div>
        <div className="pf-system" aria-label="Three connected areas of my engineering work">
          <div className="pf-system-top"><span className="pf-eyebrow">From idea to working product</span><span aria-hidden="true">↗</span></div>
          <div className="pf-system-orbit" aria-hidden="true" />
          {expertise.map((item, i) => (
            <details key={item.title} className="pf-layer" name="engineering-layers" open={i === 0}>
              <summary><span className="pf-layer-number">{item.number}</span><span><strong>{item.title}</strong><small>{item.stack}</small></span><span className="pf-layer-toggle" aria-hidden="true">+</span></summary>
              <div className="pf-layer-body"><p>{item.description}</p><Link href={item.href}>{item.example} <span aria-hidden="true">↗</span></Link></div>
            </details>
          ))}
          <p className="pf-system-caption">Different layers. One product perspective.<br /><span>Open a layer to explore the work behind it.</span></p>
        </div>
      </section>
      <section className="pf-proof" aria-label="Experience at a glance"><div className="pf-shell pf-proof-grid">
        <div><strong>8+ years</strong><span>Building production software</span></div>
        <div><strong>Full-stack ownership</strong><span>Interface, backend and delivery</span></div>
        <div><strong>Founder perspective</strong><span>Building VocalXI at AscendXI</span></div>
      </div></section>
      <section id="work" className="pf-section pf-work" aria-labelledby="work-title">
        <div className="pf-shell"><div className="pf-section-heading"><div><p className="pf-eyebrow">01 / Selected work</p><h2 id="work-title">Real products.<br /><em>Clear contributions.</em></h2></div><p>Four different contexts. A closer look at what I built, the decisions behind it, and the interfaces people use.</p></div></div>
        <ProjectShowcase projects={selectedWork} />
        <div className="pf-shell pf-work-end"><p>More work across SaaS, enterprise, mobile and real-time systems.</p><Link href="/projects" className="pf-button">Explore all {portfolioProjects.length} projects <span aria-hidden="true">↗</span></Link></div>
      </section>
      <section id="expertise" className="pf-dark pf-section" aria-labelledby="expertise-title"><div className="pf-shell">
        <div className="pf-section-heading"><div><p className="pf-eyebrow">02 / How I work</p><h2 id="expertise-title">The interface is only<br /><em>the beginning.</em></h2></div><p>I connect the visible experience with the engineering underneath—then stay involved through delivery, feedback and iteration.</p></div>
        <div className="pf-expertise-grid">{expertise.map((item) => <article className="pf-expertise-item" key={item.title}><span className="pf-step">{item.number}</span><h3>{item.title}</h3><p>{item.description}</p><p className="pf-stack-label">{item.stack}</p><Link href={item.href} className="pf-text-link">See it in practice <span aria-hidden="true">↗</span></Link></article>)}</div>
        <div className="pf-method"><span>Understand the problem</span><span aria-hidden="true">→</span><span>Build the useful core</span><span aria-hidden="true">→</span><span>Test real journeys</span><span aria-hidden="true">→</span><span>Improve with evidence</span></div>
      </div></section>
      <section id="about" className="pf-shell pf-section pf-about" aria-labelledby="about-title">
        <figure className="pf-portrait"><div className="pf-portrait-image"><Image src="/images/profile.png" alt="Bhadresh Malankiya" fill sizes="(min-width: 1024px) 410px, (min-width: 600px) 50vw, 90vw" className="pf-portrait-photo" style={{ objectFit: "contain", objectPosition: "center bottom" }} /></div><figcaption><strong>Bhadresh Malankiya</strong><span>Surat, India · Building with a global perspective</span></figcaption></figure>
        <div><p className="pf-eyebrow">03 / About me</p><h2 id="about-title">An engineer who<br /><em>thinks in products.</em></h2><div className="pf-prose"><p>I am a full-stack and AI engineer with 8+ years of experience across SaaS, client products and enterprise systems. I like understanding the problem first, then taking responsibility for the complete journey—from a usable interface to the services that keep it running.</p><p>At ExpressTech Systems, my work included ExtendedForms and Quzo.ai. Today, my portfolio also includes my own work through AscendXI and VocalXI. I bring the same care to product decisions, technical trade-offs and working with other engineers.</p><p>I am interested in senior engineering and technical leadership opportunities where clear thinking and hands-on delivery both matter.</p></div>
        <div className="pf-career"><div><span>Product engineering</span><strong>ExpressTech Systems</strong><small>June 2022 – September 2026</small></div><div><span>Founder-led work</span><strong>AscendXI / VocalXI</strong><small>AI products and software delivery</small></div></div>
        <div className="pf-actions"><a href="https://ascendxi.com" target="_blank" rel="noopener noreferrer" className="pf-text-link">Explore AscendXI ↗</a><Link href="/journey" className="pf-text-link">The story beyond the résumé ↗</Link></div></div>
      </section>
      <section id="contact" className="pf-contact pf-section" aria-labelledby="contact-title"><div className="pf-shell"><p className="pf-eyebrow">04 / Start a conversation</p><div className="pf-contact-grid"><div><h2 id="contact-title">Have a role with<br /><em>something worth building?</em></h2><p>Let’s talk about the product, the team and the engineering challenges ahead.</p></div><div className="pf-contact-actions"><a href={`mailto:${identity.email}?subject=Engineering%20opportunity`} className="pf-button pf-button-primary">Discuss a role <span aria-hidden="true">↗</span></a><a href={identity.resume} download className="pf-button">Download résumé ↓</a><a className="pf-email" href={`mailto:${identity.email}`}>{identity.email}</a></div></div></div></section>
    </div>
  );
}
