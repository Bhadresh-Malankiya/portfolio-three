"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { downloads } from "@/data/downloads";
import "@/app/human-story.css";

export default function ContactCTA() {
  const reduced = useReducedMotion();
  return (
    <div className="contact-panel contact-finale">
      <div className="finale-topline"><span>07 / THE NEXT CHAPTER IS OPEN</span><span>SURAT, INDIA ↗ YOUR TIME ZONE</span></div>
      <div className="finale-invitation"><p>Bring the problem.<br />I’ll bring a notebook.</p><ArrowDown size={32} strokeWidth={1} aria-hidden="true" /></div>
      <a className="finale-main-link" href={`mailto:${profile.email}`} aria-label={`Let's build. Email Bhadresh at ${profile.email}`}><motion.h2 initial={reduced ? false : { y: 34 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>Let’s <em>build.</em></motion.h2><span className="finale-arrow"><ArrowUpRight strokeWidth={0.8} aria-hidden="true" /></span></a>
      <div className="finale-bottomline"><a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={17} /></a><a href={downloads.resume.file} download={downloads.resume.filename}>TAKE THE RÉSUMÉ<Download size={16} /></a></div>
      <div className="finale-footnote"><span>ENGINEERING / PRODUCT / APPLIED AI</span><span>Good work starts with a conversation.</span></div>
    </div>
  );
}
