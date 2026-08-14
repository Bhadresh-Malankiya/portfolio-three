import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";
import { fieldGuides } from "@/data/fieldGuides";
import { profile } from "@/data/profile";

export function generateStaticParams() {
  return fieldGuides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = fieldGuides.find((g) => g.slug === slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.intro,
    alternates: { canonical: `/field-guide/${guide.slug}` },
    openGraph: {
      title: `${guide.title} — The Weekend Builder`,
      description: guide.intro,
      type: "article",
      url: `/field-guide/${guide.slug}`,
    },
  };
}

export default async function FieldGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = fieldGuides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const other = fieldGuides.find((g) => g.slug !== slug)!;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: guide.title,
          description: guide.intro,
          author: { "@type": "Person", name: profile.name },
          articleSection: guide.sections.map((s) => s.heading),
        }}
      />
      <section className="pt-32 pb-14 sm:pt-40 sm:pb-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <Reveal>
            <Link
              href="/field-guide"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted hover:text-gold"
            >
              <ArrowLeft size={13} /> Field guide
            </Link>
            <Eyebrow className="mt-8">{guide.eyebrow}</Eyebrow>
            <h1 className="mt-4 text-balance font-display text-4xl leading-[1.05] text-fg sm:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-6 font-display text-xl italic leading-snug text-gold-bright sm:text-2xl">
              &ldquo;{guide.quote}&rdquo;
            </p>
            <p className="mt-6 text-pretty leading-relaxed text-muted">{guide.intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <ol className="space-y-10">
          {guide.sections.map((s, i) => (
            <Reveal key={s.heading} as="li" delay={Math.min(i * 0.05, 0.3)}>
              <div className="flex gap-5">
                <span className="mt-1 shrink-0 font-mono text-sm text-gold/70">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="font-display text-2xl leading-snug text-fg">{s.heading}</h2>
                  <p className="mt-3 text-pretty leading-relaxed text-muted">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="border-t border-line">
        <Link
          href={`/field-guide/${other.slug}`}
          className="group mx-auto flex max-w-3xl items-center justify-between px-5 py-10 sm:px-8"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Next guide</p>
            <p className="mt-2 font-display text-xl text-fg group-hover:text-gold-bright sm:text-2xl">
              {other.title}
            </p>
          </div>
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <ContactCTA />
      </section>
    </>
  );
}
