import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectCaseStudy from "@/components/ProjectCaseStudy";
import "@/app/project-worlds.css";
import JsonLd from "@/components/JsonLd";
import { portfolioProjects as projects } from "@/data/portfolio";
import { profile } from "@/data/profile";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: `${project.oneLiner} ${project.metrics.map((m) => `${m.value} ${m.label}`).join(", ")}`,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} | Bhadresh Malankiya`,
      description: project.oneLiner,
      type: "article",
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const nextIndex = (index + 1) % projects.length;
  const next = projects[nextIndex];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: project.name,
          description: project.oneLiner,
          applicationCategory: project.category,
          operatingSystem: "Web",
          url: project.url,
          creator: {
            "@type": "Person",
            name: profile.name,
            url: `https://${profile.site}`,
          },
          ...(project.metrics.length
            ? {
                additionalProperty: project.metrics.map((m) => ({
                  "@type": "PropertyValue",
                  name: m.label,
                  value: m.value,
                })),
              }
            : {}),
        }}
      />
      <ProjectCaseStudy key={project.slug} project={project} next={next} />
    </>
  );
}
