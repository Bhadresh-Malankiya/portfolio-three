import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import "@/app/project-worlds.css";
import ProjectIndex from "@/components/ProjectIndex";
import { portfolioProjects as projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Products and platforms built through employer engineering, founder-led work, and client delivery across SaaS, AI, commerce, and enterprise systems.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — The Weekend Builder",
    description:
      "SaaS, voice AI, e-commerce, and client projects by Bhadreshkumar Malankiya.",
    type: "website",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <div className="work-directory-page">
      <header className="directory-intro case-container">
        <div className="directory-topline"><Link href="/"><ArrowLeft size={14} /> Back to the studio</Link><span>Product engineering / The collected work</span></div>
        <div className="directory-title"><div><span className="case-label">The project index</span><h1>Different problems.<br /><em>Same curiosity.</em></h1></div><span className="directory-project-total" aria-label={`${projects.length} projects`}><b>{String(projects.length).padStart(2, "0")}</b><span>builds &<br />collaborations</span></span></div>
        <div className="directory-intro-bottom"><p>Voice products, assessment platforms, client work and weekend experiments. The screens are the beginning; the decisions are in the details.</p><span>Explore by contribution ↓</span></div>
      </header>
      <section className="directory-body case-container" aria-label="Explore the project collection"><ProjectIndex /></section>
      <div className="directory-closing"><div className="case-container"><p>What are you<br /><em>working on?</em></p><Link href="/contact">Let’s talk about it <ArrowUpRight size={20} /></Link></div></div>
    </div>
  );
}
