import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";
import { mailHref, phoneHref, whatsappHref } from "@/lib/contact-links";
import ContactForm from "@/components/ContactForm";
import { profile } from "@/data/profile";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact Bhadresh",
  description: "Hiring a Senior Full Stack Engineer or Tech Lead? Send Bhadresh Malankiya a message.",
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
        <span>Surat, India</span>
      </div>
      <div className="contact-page-layout">
        <header className="contact-page-intro">
          <p className="contact-kicker"><span aria-hidden="true">↗</span> Open to new roles</p>
          <h1 id="contact-heading">Let’s talk<br />about the <em>role.</em></h1>
          <p className="contact-page-description">Senior Full Stack Engineer and Technical Lead.<br />Node.js, React, TypeScript and LLM features.</p>
          <div className="contact-recipient">
            <span className="contact-recipient-mark" aria-hidden="true">BM<span>↗</span></span>
            <div><span className="contact-small-label">Your note goes to</span><p>{profile.shortName} Malankiya</p><span>Senior Full Stack · Tech Lead · Applied AI</span></div>
          </div>
          <div className="contact-actions" role="group" aria-label="Reach Bhadresh directly">
            <a className="contact-action contact-action-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={20} /><span><strong>WhatsApp me</strong><small>Starts a chat with a hello already written</small></span></a>
            <a className="contact-action contact-action-call" href={phoneHref}><Phone size={19} aria-hidden="true" /><span><strong>Call me</strong><small>{profile.phone}</small></span></a>
            <a className="contact-action contact-action-mail" href={mailHref}><Mail size={19} aria-hidden="true" /><span><strong>Email me</strong><small>{profile.email}</small></span></a>
          </div>
          <div className="contact-direct"><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn: in/bhadresh-malankiya<ArrowUpRight size={15} aria-hidden="true" /></a></div>
        </header>
        <div className="contact-letter">
          <div className="contact-letter-heading"><span className="contact-small-label">A note to Bhadresh</span><span aria-hidden="true">01 · HELLO</span></div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
