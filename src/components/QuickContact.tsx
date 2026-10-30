"use client";

import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";
import { phoneHref, whatsappHref } from "@/lib/contact-links";
import "@/app/quick-contact.css";

/**
 * Always-visible call and WhatsApp buttons, fixed to the bottom-left on every
 * page except /contact, which carries the same two actions in its own layout.
 */
export default function QuickContact() {
  const pathname = usePathname();
  if (pathname === "/contact") return null;
  return (
    <nav className="quick-contact" aria-label="Contact Bhadresh directly">
      <a className="quick-contact-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon size={20} />
        <span>WhatsApp me</span>
      </a>
      <a className="quick-contact-call" href={phoneHref}>
        <Phone size={18} aria-hidden="true" />
        <span>Call me</span>
      </a>
    </nav>
  );
}
