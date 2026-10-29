"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { LinkedinIcon } from "@/components/SocialIcons";
import { profile } from "@/data/profile";
import { downloads } from "@/data/downloads";
import "@/app/human-story.css";

export default function ContactCTA() {
  const reduced = useReducedMotion();
  return (
    <div className="contact-panel contact-finale">
      <div className="finale-topline"><span>06 / OPEN TO NEW ROLES</span><span>AVAILABLE NOW ↗ SURAT, INDIA</span></div>
      <div className="finale-invitation"><p>Hiring a senior full stack<br />engineer or tech lead?</p><ArrowDown size={32} strokeWidth={1} aria-hidden="true" /></div>
      <Link className="finale-main-link" href="/contact" aria-label="Let’s talk. Contact Bhadresh"><motion.h2 initial={reduced ? false : { y: 34 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>Let’s <em>talk.</em></motion.h2><span className="finale-arrow"><ArrowUpRight strokeWidth={0.8} aria-hidden="true" /></span></Link>
      <div className="finale-bottomline"><a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={17} /></a><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN<LinkedinIcon size={15} /></a><a href={downloads.resume.file} download={downloads.resume.filename}>DOWNLOAD RÉSUMÉ<Download size={16} /></a></div>
      <div className="finale-footnote"><span>FULL STACK / TECH LEAD / APPLIED AI</span><span>Based in Surat, India. Working across time zones.</span></div>
    </div>
  );
}
