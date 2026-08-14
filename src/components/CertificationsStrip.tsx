"use client";

import { motion } from "framer-motion";
import { RevealGroup, revealItem } from "@/components/Reveal";
import { profile } from "@/data/profile";

export default function CertificationsStrip() {
  return (
    <RevealGroup className="mt-6 flex flex-wrap gap-3" stagger={0.05}>
      {profile.certifications.map((c) => (
        <motion.span key={c} variants={revealItem} className="rounded-full border border-line px-4 py-2 text-xs text-muted">
          {c}
        </motion.span>
      ))}
    </RevealGroup>
  );
}
