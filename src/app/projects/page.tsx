import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import ProjectIndex from "@/components/ProjectIndex";
import ContactCTA from "@/components/ContactCTA";
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
    <>
      <section className="pt-32 pb-14 sm:pt-40 sm:pb-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            as="h1"
            eyebrow={`// ${projects.length} projects`}
            title="projects/"
            description="Explore SaaS platforms, AI tools, and client products. Each project includes my contribution, the technology, and the results."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <ProjectIndex />
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <ContactCTA />
      </section>
    </>
  );
}
