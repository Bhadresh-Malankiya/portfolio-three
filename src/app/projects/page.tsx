import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "@/components/ProjectCard";
import ContactCTA from "@/components/ContactCTA";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Thirteen products and platforms — two owned solo end to end, one built purely on weekends, the rest delivered for employers and clients across fintech, medtech, logistics, and legal.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — The Weekend Builder",
    description: "Thirteen products, one habit: see something worth doing, and begin.",
    type: "website",
    url: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <section className="pt-32 pb-14 sm:pt-40 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            eyebrow={`${projects.length} projects, one habit`}
            title="Different budgets, different owners, the same instinct: see something worth doing, and begin."
            description="Two products owned outright. One built purely on weekends. The rest shipped for employers and clients across edtech, fintech, medtech, logistics, and legal — real users, real numbers, no highlight-reel editing."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <ContactCTA />
      </section>
    </>
  );
}
