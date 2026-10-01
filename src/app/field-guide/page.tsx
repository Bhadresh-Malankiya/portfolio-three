import type { Metadata } from "next";
import Link from "next/link";
import { fieldGuides } from "@/data/fieldGuides";

export const metadata: Metadata = {
  title: "Field guides",
  description: "Practical reading on technical interviews, DSA and finding your first engineering role.",
  alternates: { canonical: "/field-guide" },
};

export default function FieldGuideIndexPage() {
  return <div className="pf-page"><header className="pf-shell pf-page-header"><p className="pf-eyebrow">Notes for the next step</p><h1>Field guides for<br /><em>your engineering journey.</em></h1><p className="pf-lead">Two chapters from The Weekend Builder, focused on technical interviews and finding your first role. Explore the ideas, then adapt them to your own situation.</p></header><section className="pf-shell pf-project-grid" aria-label="Available field guides">{fieldGuides.map((guide) => <article key={guide.slug} className="pf-project-card"><p className="pf-work-number">{guide.eyebrow}</p><h2><Link href={`/field-guide/${guide.slug}`}>{guide.title}</Link></h2><p>{guide.intro}</p><Link href={`/field-guide/${guide.slug}`} className="pf-text-link">Read {guide.sections.length} sections ↗</Link></article>)}</section></div>;
}
