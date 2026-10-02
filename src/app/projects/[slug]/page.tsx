import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import ProjectFrame from "@/components/ProjectFrame";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectHeroFrame from "@/components/ProjectHeroFrame";
import ProjectMotif from "@/components/ProjectMotif";
import Reveal from "@/components/Reveal";
import Eyebrow from "@/components/Eyebrow";
import ContactCTA from "@/components/ContactCTA";
import JsonLd from "@/components/JsonLd";
import { projects } from "@/data/projects";
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
      title: `${project.name} — The Weekend Builder`,
      description: project.oneLiner,
      type: "article",
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const nextIndex = (index + 1) % projects.length;
  const next = projects[nextIndex];
  const accent = index % 2 === 0 ? "text-gold" : "text-silver";
  const nextAccent = nextIndex % 2 === 0 ? "text-gold" : "text-silver";

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
          creator: { "@type": "Person", name: profile.name, url: `https://${profile.site}` },
          ...(project.metrics.length
            ? { additionalProperty: project.metrics.map((m) => ({ "@type": "PropertyValue", name: m.label, value: m.value })) }
            : {}),
        }}
      />
      <section className="relative overflow-hidden pt-32 pb-10 sm:pt-40 sm:pb-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-muted hover:text-gold"
            >
              <ArrowLeft size={13} /> All projects
            </Link>
          </Reveal>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal delay={0.05} className="max-w-2xl">
              <Eyebrow>
                {project.category} · {project.kind}
              </Eyebrow>
              <h1 className="mt-4 text-balance font-display text-4xl leading-[1.02] text-fg sm:text-6xl">
                {project.name}
              </h1>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">{project.oneLiner}</p>
            </Reveal>

            {project.url && (
              <Reveal delay={0.1}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-fg transition-colors hover:border-gold hover:text-gold"
                >
                  Visit {project.url.replace("https://", "")}
                  <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal delay={0.1}>
          <ProjectHeroFrame>
            {project.images?.length ? (
              <ProjectGallery images={project.images} name={project.name} url={project.url} frame={project.frame} big />
            ) : (
              <ProjectFrame motif={project.motif} accent={accent} url={project.url} big />
            )}
          </ProjectHeroFrame>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">The story</p>
            </Reveal>
            {project.narrative.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="text-pretty leading-relaxed text-fg/85">{p}</p>
              </Reveal>
            ))}
          </div>

          <div className="space-y-8">
            {project.metrics.length > 0 && (
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">By the numbers</p>
                <dl className="mt-4 border-t border-line">
                  {project.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="group flex items-baseline justify-between gap-4 border-b border-line px-1 py-3 transition-colors hover:bg-ink-2/50"
                    >
                      <dt className="text-xs text-muted transition-colors group-hover:text-fg/80">{m.label}</dt>
                      <dd className="font-mono text-lg text-gold-bright transition-transform group-hover:scale-105">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}

            <Reveal delay={0.05}>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">Role & status</p>
              <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <p className="text-fg/85">{project.role}</p>
                <p className="text-muted">{project.status}</p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">{project.techLabel ?? "Built with"}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
                {project.tech.map((t) => (
                  <span key={t} className="rounded border border-line px-2.5 py-1 font-mono text-[11px] text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <Link
          href={`/projects/${next.slug}`}
          className="group mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8"
        >
          <div className="flex items-center gap-5">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md border border-line-strong bg-ink-3 transition-transform duration-500 group-hover:scale-105 sm:h-20 sm:w-32">
              {next.images?.length ? (
                <Image
                  src={next.images[0]}
                  alt={`${next.name} preview`}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <ProjectMotif motif={next.motif} accent={nextAccent} className="h-full w-full" />
              )}
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Next project</p>
              <p className="mt-2 font-display text-2xl text-fg group-hover:text-gold-bright sm:text-3xl">
                {next.name}
              </p>
            </div>
          </div>
          <ArrowRight
            size={22}
            className="shrink-0 self-end text-muted transition-transform group-hover:translate-x-2 group-hover:text-gold sm:self-auto"
          />
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <ContactCTA />
      </section>
    </>
  );
}
