"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";
import { phoneHref, whatsappHref } from "@/lib/contact-links";
import { profile } from "@/data/profile";
import "@/app/quick-contact.css";

/**
 * Quiet contact dock, bottom-left. It stays out of the opening story and
 * steps aside when the page's own contact section is on screen, so it never
 * covers the work or repeats the same buttons twice.
 */
export default function QuickContact() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(pathname !== "/");

  useEffect(() => {
    let contactOnScreen = false;
    const contact = document.getElementById("contact");
    const hero = document.getElementById("hero");
    const update = () => {
      const pastHero = !hero || window.scrollY > hero.offsetHeight - window.innerHeight * 0.6;
      setVisible(pastHero && !contactOnScreen);
    };
    let observer: IntersectionObserver | undefined;
    if (contact) {
      observer = new IntersectionObserver(([entry]) => {
        contactOnScreen = entry.isIntersecting;
        update();
      }, { rootMargin: "0px 0px -20% 0px" });
      observer.observe(contact);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  if (pathname === "/contact") return null;
  return (
    <nav className="quick-contact" data-visible={visible} aria-label="Contact Bhadresh directly" inert={!visible}>
      <a className="quick-contact-primary" href={whatsappHref} target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon size={17} />
        <span>WhatsApp me</span>
      </a>
      <a className="quick-contact-icon" href={phoneHref} aria-label={`Call Bhadresh on ${profile.phone}`}>
        <Phone size={16} aria-hidden="true" />
      </a>
      <a className="quick-contact-icon" href={`mailto:${profile.email}`} aria-label={`Email Bhadresh at ${profile.email}`}>
        <Mail size={16} aria-hidden="true" />
      </a>
    </nav>
  );
}
