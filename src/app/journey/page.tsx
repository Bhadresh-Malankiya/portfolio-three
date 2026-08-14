import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ReadingProgress from "@/components/ReadingProgress";
import JourneyTrack from "@/components/JourneyTrack";
import ParticleField from "@/components/ParticleField";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import ContactCTA from "@/components/ContactCTA";
import { chapters, foreword } from "@/data/chapters";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "The Story",
  description:
    "A Life in Code, Ownership, and the Habit of Starting Again — the full memoir behind the portfolio, in sixteen chapters.",
  alternates: { canonical: "/journey" },
  openGraph: {
    title: "The Weekend Builder — The Story",
    description: "A Life in Code, Ownership, and the Habit of Starting Again, in sixteen chapters.",
    type: "book",
    url: "/journey",
  },
};

export default function JourneyPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Book",
          name: "The Weekend Builder",
          alternateName: "A Life in Code, Ownership, and the Habit of Starting Again",
          author: { "@type": "Person", name: profile.name, url: `https://${profile.site}` },
          numberOfPages: chapters.length,
          bookFormat: "https://schema.org/EBook",
        }}
      />
      <ReadingProgress />
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        <ParticleField className="pointer-events-none absolute inset-0 h-full w-full opacity-50" count={40} goldRatio={0.12} />
        <div className="relative mx-auto max-w-4xl px-5 sm:px-8">
          <Reveal>
            <Eyebrow>A memoir, in sixteen chapters</Eyebrow>
            <h1 className="mt-5 text-balance font-display text-5xl leading-[1.02] text-fg sm:text-7xl">
              The Weekend Builder
            </h1>
            <p className="mt-4 font-display text-xl italic text-muted sm:text-2xl">
              A Life in Code, Ownership, and the Habit of Starting Again
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-2xl space-y-4 text-pretty leading-relaxed text-muted">
            <p className="font-display text-lg italic text-gold-bright">&ldquo;{foreword.quote}&rdquo;</p>
            {foreword.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <JourneyTrack chapters={chapters} />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <Reveal className="mb-8 max-w-2xl">
          <Eyebrow>Two chapters, written for you</Eyebrow>
          <p className="mt-3 text-pretty leading-relaxed text-muted">
            Chapters XIV and XV break format on purpose — instead of telling the story, they talk directly to
            whoever is reading this while preparing for their own interviews or first job search.
          </p>
          <Link
            href="/field-guide"
            className="group mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-gold"
          >
            Open the field guide
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <ContactCTA />
      </section>
    </>
  );
}
