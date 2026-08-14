import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import { fieldGuides } from "@/data/fieldGuides";

export const metadata: Metadata = {
  title: "Field Guide",
  description:
    "Two chapters written directly for people earlier in their own career: cracking DSA and technical interviews, and landing a first job with no track record yet.",
  alternates: { canonical: "/field-guide" },
  openGraph: {
    title: "Field Guide — The Weekend Builder",
    description: "Written directly to you, not about him — DSA/interview prep and landing a first job.",
    type: "website",
    url: "/field-guide",
  },
};

export default function FieldGuideIndexPage() {
  return (
    <>
      <section className="pt-32 pb-14 sm:pt-40 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            eyebrow="Chapters XIV & XV"
            title="Written directly to you, not about him."
            description="Where the rest of the book tells the story of what happened to him, these two chapters talk straight to whoever's reading this while preparing for their own interviews or first job search — the exact things he wishes someone had told him, without the vague encouragement that fills most advice on this topic."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {fieldGuides.map((g, i) => (
            <Reveal key={g.slug} delay={i * 0.08}>
              <Link
                href={`/field-guide/${g.slug}`}
                className="group flex h-full flex-col justify-between rounded-xl border border-line bg-ink-2/40 p-8 transition-colors hover:border-gold/50"
              >
                <div>
                  <Eyebrow className="text-[10px]">{g.eyebrow}</Eyebrow>
                  <h2 className="mt-4 font-display text-3xl leading-snug text-fg">{g.title}</h2>
                  <p className="mt-4 font-display text-lg italic leading-snug text-muted">&ldquo;{g.quote}&rdquo;</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{g.intro}</p>
                </div>
                <div className="mt-8 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-gold">
                  {g.sections.length} sections
                  <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
