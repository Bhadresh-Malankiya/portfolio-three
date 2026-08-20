import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import ProjectFrame from "@/components/ProjectFrame";
import ProjectGallery from "@/components/ProjectGallery";
import Reveal from "@/components/Reveal";

const ACCENTS = ["text-gold", "text-silver"];

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const accent = ACCENTS[index % ACCENTS.length];
  const hasImages = !!project.images?.length;

  return (
    <Reveal delay={(index % 6) * 0.06} className="h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-ink-2/40 transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.7)]"
      >
        <div className="overflow-hidden">
          <div className="transition-transform duration-500 ease-out group-hover:scale-[1.06]">
            {hasImages ? (
              <ProjectGallery
                images={project.images!.slice(0, 1)}
                name={project.name}
                url={project.url}
                frame={project.frame}
                bare
                fill
                className="rounded-none border-0"
              />
            ) : (
              <ProjectFrame motif={project.motif} accent={accent} url={project.url} bare className="rounded-none border-0" />
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{project.category}</p>
              <h3 className="mt-1 font-display text-xl text-fg">{project.name}</h3>
            </div>
            <ArrowUpRight
              size={18}
              className="mt-1 shrink-0 text-muted transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
            />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{project.oneLiner}</p>

          {project.metrics.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-gold-bright">
              {project.metrics.slice(0, 2).map((m) => (
                <span key={m.label}>
                  {m.value} <span className="text-muted">{m.label}</span>
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted">
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
