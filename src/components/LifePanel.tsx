"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Plus, LayoutDashboard, Server, Sparkles, Workflow, Rocket, Users } from "lucide-react";
import { deliveryExpertise } from "@/data/skills";
import "@/app/human-story.css";

const journey = [
  { year: "Now", title: "Open to the next role", role: "Senior Full Stack Engineer · Technical Lead", detail: "Available immediately. Looking for a product team where I can own outcomes, lead engineers and ship AI features that matter." },
  { year: "2022–2026", title: "ExpressTech Systems", role: "Senior Software Engineer · Technical Lead", detail: "Led a team of five on ExtendedForms.io (400K+ users, 10M+ online exams, 3x revenue growth) and built Quzo.ai, an AI assessment platform, from first commit to launch. Owned performance, releases, the public API and enterprise escalations." },
  { year: "2018–2022", title: "HQ Infosystem", role: "Full Stack Developer", detail: "Delivered 15+ web applications across edtech, logistics, fintech and e-commerce with React, Node.js and Laravel, including Stripe Connect payouts and APIs serving 50K+ daily requests. Completed my engineering degree alongside this full-time role." },
];
const capabilityIcons = [LayoutDashboard, Server, Sparkles, Workflow, Rocket, Users];
const impact = [
  { value: "400K+", label: "ExtendedForms users", href: "/projects/extendedforms-io" },
  { value: "10M+", label: "Online exams delivered", href: "/projects/extendedforms-io" },
  { value: "5", label: "Engineers led at ExpressTech", href: "#experience" },
  { value: "8+", label: "Years building production software", href: "/projects" },
];

export default function LifePanel() {
  const [role, setRole] = useState<number | null>(0);
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const orbitRotation = useTransform(scrollYProgress, [0, 1], [-18, 30]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [16, -16]);
  return (
    <section className="life-section page-shell field-journal" id="about" ref={section}>
      <div className="journal-inner">
        <div className="journal-folio"><span>06 / THE PERSON BEHIND THE BUILD</span><span>SURAT, INDIA ↗ WORKING EVERYWHERE</span></div>
        <header className="journal-heading">
          <h2>The code is only<br /><em>half the story.</em></h2>
          <div className="journal-intro"><span className="journal-asterisk" aria-hidden="true">✳</span><p>I’m Bhadresh. A senior engineer who leads teams, talks to customers and owns what ships to production.</p><span className="journal-role">SENIOR FULL STACK ENGINEER · TECH LEAD</span></div>
        </header>
        <div className="journal-spread">
          <div className="journal-portrait-column">
            <figure className="journal-portrait">
              <div className="journal-portrait-disc" aria-hidden="true" />
              <motion.div className="journal-portrait-orbit" aria-hidden="true" style={reduced ? undefined : { rotate: orbitRotation }}><svg viewBox="0 0 600 600">
                <ellipse cx="300" cy="300" rx="281" ry="196" fill="none" stroke="currentColor" strokeWidth="1" />
                <ellipse cx="300" cy="300" rx="281" ry="196" fill="none" stroke="currentColor" strokeWidth="1" transform="rotate(62 300 300)" />
                <circle cx="38" cy="235" r="7" fill="currentColor" /><path d="M491 418h28m-14-14v28M90 437h18m-9-9v18" stroke="currentColor" strokeWidth="2" />
              </svg></motion.div>
              <span className="journal-portrait-number" aria-hidden="true">BM.</span>
              <motion.div className="journal-portrait-image" style={reduced ? undefined : { y: portraitY }}><Image src="/images/profile.png" alt="Bhadresh Malankiya" fill sizes="(min-width: 900px) 45vw, 90vw" /></motion.div>
              <div className="journal-portrait-note"><span>Builder by habit.</span><ArrowDownRight size={36} strokeWidth={1} /></div>
              <figcaption><strong>Bhadresh Malankiya</strong><span>SENIOR ENGINEER / TECHNICAL LEAD</span></figcaption>
              <span className="journal-portrait-stamp" aria-hidden="true">IDEAS<br />INTO<br /><b>PRODUCTION.</b></span>
            </figure>
            <div className="journal-founder-note"><span>NOTE TO SELF / 001</span><p>Own the problem.<br />Stay for the outcome.</p><small>Four years leading ExtendedForms taught me that performance, releases and customer trust are one job.</small><Link href="/projects/extendedforms-io">Read the ExtendedForms story <ArrowUpRight size={15} /></Link></div>
          </div>
          <div className="journal-career" id="experience">
            <div className="journal-subheading"><span>THE LONG WAY ROUND</span><span>2018 → NOW</span></div><h3>A little more<br />ownership, every time.</h3>
            <ol className="journal-timeline">{journey.map((item, index) => (
              <li key={item.title} data-active={role === index}>
                <button type="button" onClick={() => setRole(role === index ? null : index)} aria-expanded={role === index} aria-controls={role === index ? `career-detail-${index}` : undefined}><span className="journal-year">{item.year}</span><span className="journal-position"><strong>{item.title}</strong><small>{item.role}</small></span><Plus size={19} strokeWidth={1.5} aria-hidden="true" /></button>
                <AnimatePresence initial={false}>{role === index && <motion.div id={`career-detail-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}><p>{item.detail}</p></motion.div>}</AnimatePresence>
              </li>
            ))}</ol>
            <a className="journal-story-link" href="/downloads/bhadresh-malankiya-resume.pdf" download="Bhadresh-Malankiya-Resume.pdf">Download the résumé <ArrowUpRight size={18} /></a>
          </div>
        </div>
        <dl className="journal-impact" aria-label="Experience and product impact">{impact.map((item, index) => <div key={item.label}><dt><Link href={item.href}><span className="journal-metric-index" aria-hidden="true">0{index + 1} /</span><strong>{item.value}</strong><ArrowUpRight size={20} /></Link></dt><dd>{item.label}</dd></div>)}</dl>
        <div className="journal-toolbox" id="expertise">
          <div className="journal-toolbox-heading"><div><span className="journal-kicker">THE WORKING TOOLBOX</span><h3>From the interface<br />to the infrastructure.</h3></div><p>One product, many moving parts.<br />I connect them.</p></div>
          <div className="journal-capabilities">{deliveryExpertise.map((item, index) => <motion.div key={item.code} className="journal-capability" initial={reduced ? false : { y: 20 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, delay: index % 3 * 0.06 }}>{(() => { const Icon = capabilityIcons[index]; return Icon ? <Icon className="journal-capability-icon" size={26} strokeWidth={1.4} aria-hidden="true" /> : null; })()}<span>{item.code}</span><h4>{item.title}</h4><p>{item.detail}</p><small>{item.tools}</small></motion.div>)}</div>
        </div>
      </div>
    </section>
  );
}
