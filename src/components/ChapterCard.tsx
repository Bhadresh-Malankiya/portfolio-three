"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { Chapter } from "@/data/chapters";
import Reveal from "@/components/Reveal";
import ChapterCover from "@/components/ChapterCover";
import ChapterIcon from "@/components/ChapterIcon";

export default function ChapterCard({ chapter, index }: { chapter: Chapter; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Reveal as="div" delay={index % 2 === 0 ? 0 : 0.04} y={30}>
      <article
        id={chapter.id}
        className="group relative scroll-mt-28 overflow-hidden rounded-xl border border-line-strong bg-paper text-paper-ink transition-transform duration-500 hover:-translate-y-1"
      >
        <div className="relative h-20 sm:h-24">
          <ChapterCover seed={chapter.id} className="absolute inset-0 h-full w-full" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-7xl italic leading-none text-white/10 sm:text-8xl"
          >
            {chapter.number}
          </span>
          <div className="absolute -bottom-6 left-6 flex h-12 w-12 items-center justify-center rounded-full border border-paper-ink/10 bg-paper shadow-md sm:left-9">
            <ChapterIcon icon={chapter.icon} size={20} className="text-paper-ink/70" strokeWidth={1.6} />
          </div>
        </div>

        <div className="relative z-10 px-6 pb-6 pt-10 sm:px-10 sm:pb-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-paper-ink/10 pb-5">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-sm text-paper-ink/40">{chapter.number}</span>
              <h3 className="font-display text-2xl leading-tight sm:text-3xl">{chapter.title}</h3>
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper-ink/50">
              {chapter.era}
            </span>
          </div>

          <blockquote className="mt-6 max-w-2xl border-l-2 border-gold/60 pl-4 font-display text-xl italic leading-snug text-paper-ink/90 sm:text-2xl">
            &ldquo;{chapter.quote}&rdquo;
          </blockquote>

          <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-paper-ink/75">{chapter.summary}</p>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-5 max-w-2xl space-y-4 border-t border-paper-ink/10 pt-5">
                  {chapter.body.map((p, i) => (
                    <p key={i} className="text-pretty leading-relaxed text-paper-ink/75">
                      {p}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-paper-ink/60 transition-colors hover:text-paper-ink"
          >
            <Plus size={14} className={`transition-transform ${open ? "rotate-45" : ""}`} />
            {open ? "Collapse chapter" : "Keep reading"}
          </button>
        </div>
      </article>
    </Reveal>
  );
}
