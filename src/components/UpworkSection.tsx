"use client";

import Image from "next/image";
import { ArrowUpRight, BadgeCheck, ShieldCheck } from "lucide-react";
import Reveal, { RevealGroup, revealItem } from "@/components/Reveal";
import { motion } from "framer-motion";
import Counter from "@/components/Counter";
import UpworkTestimonials from "@/components/UpworkTestimonials";
import { upwork } from "@/data/upwork";

function StatBlock({ value, prefix, suffix, label }: { value: number; prefix?: string; suffix?: string; label: string }) {
  return (
    <div>
      <p className="font-mono text-2xl text-gold-bright sm:text-3xl">
        <Counter value={value} prefix={prefix} suffix={suffix} />
      </p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{label}</p>
    </div>
  );
}

export default function UpworkSection() {
  return (
    <div>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal>
          <a
            href={upwork.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg transition-colors hover:border-gold hover:text-gold"
          >
            <BadgeCheck size={13} className="text-gold" />
            Verified Upwork freelancer
            <ArrowUpRight size={12} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          <div className="mt-6 space-y-4">
            {upwork.bio.map((p) => (
              <p key={p} className="text-pretty leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
            {upwork.stats.map((s) => (
              <StatBlock key={s.label} {...s} />
            ))}
          </div>

          <RevealGroup className="mt-8 flex flex-wrap items-center gap-2.5" stagger={0.05}>
            {upwork.verifications.map((v) => (
              <motion.span
                key={v}
                variants={revealItem}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-muted"
              >
                <ShieldCheck size={12} className="text-gold" /> {v}
              </motion.span>
            ))}
          </RevealGroup>

          <a
            href={upwork.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-bright"
          >
            View live profile on Upwork
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <Reveal delay={0.12} className="mx-auto w-full max-w-[300px]">
          <a
            href={upwork.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the verified Upwork profile in a new tab"
            className="group block"
          >
            <div className="relative overflow-hidden rounded-[1.8rem] border-[6px] border-ink-2 bg-ink-3/70 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.65)] transition-transform duration-500 group-hover:-translate-y-1.5">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-1.5">
                <div className="h-1 w-10 rounded-full bg-white/25" />
              </div>
              <div className="relative aspect-[1320/1994]">
                <Image
                  src={upwork.proofImage}
                  alt="Bhadresh's verified Upwork profile — $10K+ earned, 12 jobs, 1,157 hours logged"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
            </div>
            <span className="mt-4 flex items-center justify-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors group-hover:text-gold">
              bhadreshmalankiya on Upwork
              <ArrowUpRight size={12} />
            </span>
          </a>
        </Reveal>
      </div>

      <div className="mt-16 sm:mt-20">
        <UpworkTestimonials items={upwork.testimonials} />
      </div>

      <Reveal className="-mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:-mt-10">
        {upwork.quickPraise.map((q) => (
          <p key={q} className="font-mono text-xs italic text-muted">
            {q}
          </p>
        ))}
      </Reveal>
    </div>
  );
}
