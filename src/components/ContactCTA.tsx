import { ArrowUpRight, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { downloads } from "@/data/downloads";
import Reveal from "@/components/Reveal";

export default function ContactCTA() {
  return (
    <Reveal className="contact-panel">
      <p className="eyebrow">08 // contact</p>
      <h2>
        Have something
        <br />
        <em>in mind?</em>
      </h2>
      <p>
        Hiring a senior full-stack engineer, or need help with a product?
        <br className="hidden sm:block" /> Send me a little context. I read and
        reply to my own email.
      </p>
      <div className="flex flex-wrap gap-3 mt-8">
        <a href={`mailto:${profile.email}`} className="button-primary">
          sendMessage() <ArrowUpRight size={17} />
        </a>
        <a
          href={downloads.resume.file}
          download={downloads.resume.filename}
          className="button-secondary"
        >
          resume.pdf <Download size={16} />
        </a>
      </div>
      <a className="contact-email" href={`mailto:${profile.email}`}>
        {profile.email} <ArrowUpRight size={17} />
      </a>
    </Reveal>
  );
}
