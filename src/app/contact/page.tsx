import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { profile } from "@/data/profile";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact Bhadresh",
  description: "Have a project or a role in mind? Send Bhadreshkumar Malankiya a message about full-stack engineering, applied AI or product development.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "A note to Bhadresh — The Weekend Builder",
    description: "A project, a role, or a problem worth solving. Start a conversation with Bhadresh.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <section className="contact-page" aria-labelledby="contact-heading">
      <div className="contact-page-topline">
        <Link href="/"><ArrowLeft size={15} aria-hidden="true" /> Back to the portfolio</Link>
        <span>Let’s make something happen.</span>
      </div>
      <div className="contact-page-layout">
        <header className="contact-page-intro">
          <p className="contact-kicker"><span aria-hidden="true">↗</span> A conversation comes first</p>
          <h1 id="contact-heading">What’s<br />on your <em>mind?</em></h1>
          <p className="contact-page-description">A product to build. A team to join.<br />A problem you haven’t quite figured out.<br />I’d like to hear about it.</p>
          <div className="contact-recipient">
            <span className="contact-recipient-mark" aria-hidden="true">BM<span>↗</span></span>
            <div><span className="contact-small-label">Your note goes to</span><p>{profile.shortName} Malankiya</p><span>Engineering · Product · Applied AI</span></div>
          </div>
          <div className="contact-direct"><span className="contact-small-label">Prefer your own inbox?</span><a href={`mailto:${profile.email}`}><Mail size={15} aria-hidden="true" />{profile.email}<ArrowUpRight size={15} aria-hidden="true" /></a></div>
        </header>
        <div className="contact-letter">
          <div className="contact-letter-heading"><span className="contact-small-label">A note to Bhadresh</span><span aria-hidden="true">01 — HELLO</span></div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
