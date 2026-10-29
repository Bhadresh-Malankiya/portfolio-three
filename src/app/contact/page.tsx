import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { profile } from "@/data/profile";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact Bhadresh",
  description: "Hiring a Senior Full Stack Engineer or Tech Lead? Send Bhadresh Malankiya a message. Available immediately.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Bhadresh Malankiya",
    description: "Hiring for a senior full stack or tech lead role? Start a conversation with Bhadresh.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <section className="contact-page" aria-labelledby="contact-heading">
      <div className="contact-page-topline">
        <Link href="/"><ArrowLeft size={15} aria-hidden="true" /> Back to the portfolio</Link>
        <span>Available now</span>
      </div>
      <div className="contact-page-layout">
        <header className="contact-page-intro">
          <p className="contact-kicker"><span aria-hidden="true">↗</span> Open to new roles</p>
          <h1 id="contact-heading">Let’s talk<br />about the <em>role.</em></h1>
          <p className="contact-page-description">Senior Full Stack Engineer and Technical Lead.<br />Node.js, React, TypeScript and LLM features.<br />Available immediately.</p>
          <div className="contact-recipient">
            <span className="contact-recipient-mark" aria-hidden="true">BM<span>↗</span></span>
            <div><span className="contact-small-label">Your note goes to</span><p>{profile.shortName} Malankiya</p><span>Senior Full Stack · Tech Lead · Applied AI</span></div>
          </div>
          <div className="contact-direct"><span className="contact-small-label">Prefer your own inbox?</span><a href={`mailto:${profile.email}`}><Mail size={15} aria-hidden="true" />{profile.email}<ArrowUpRight size={15} aria-hidden="true" /></a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn: in/bhadresh-malankiya<ArrowUpRight size={15} aria-hidden="true" /></a><a href={`tel:${profile.phone.replace(/\s/g, "")}`}>{profile.phone}<ArrowUpRight size={15} aria-hidden="true" /></a></div>
        </header>
        <div className="contact-letter">
          <div className="contact-letter-heading"><span className="contact-small-label">A note to Bhadresh</span><span aria-hidden="true">01 — HELLO</span></div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
