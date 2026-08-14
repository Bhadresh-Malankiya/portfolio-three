"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { chapters } from "@/data/chapters";
import Reveal, { RevealGroup, revealItem } from "@/components/Reveal";
import { motion } from "framer-motion";

const featured = ["roots", "kali-linux-nights", "owning-extendedforms", "mb-systems", "weekends-that-mattered"];

export default function JourneyTeaser() {
  const picked = featured
    .map((id) => chapters.find((c) => c.id === id)!)
    .filter(Boolean);

  return (
    <div className="grid gap-3">
      <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" stagger={0.07}>
        {picked.map((c) => (
          <motion.div key={c.id} variants={revealItem}>
            <Link
              href={`/journey#${c.id}`}
              className="group flex h-full flex-col justify-between rounded-lg border border-line bg-ink-2/40 p-5 transition-colors hover:border-gold/50"
            >
              <div>
                <span className="font-mono text-xs text-gold">{c.number}</span>
                <p className="mt-2 font-display text-base leading-snug text-fg">{c.title}</p>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted italic">&ldquo;{c.quote}&rdquo;</p>
            </Link>
          </motion.div>
        ))}
      </RevealGroup>
      <Reveal className="pt-2">
        <Link
          href="/journey"
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-gold"
        >
          Read all sixteen chapters
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </div>
  );
}
