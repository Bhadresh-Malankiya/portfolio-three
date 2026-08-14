"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ProjectFrame from "@/components/ProjectFrame";
import ProjectGallery from "@/components/ProjectGallery";
import type { Project } from "@/data/projects";

function ShowcasePanel({ project, index, total }: { project: Project; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 100, damping: 32, mass: 0.3 });

  // small → full-bleed → small again, as the panel scrolls through the pinned viewport
  const scale = useTransform(smooth, [0, 0.5, 1], [0.78, 1, 0.78]);
  const radius = useTransform(smooth, [0, 0.5, 1], [32, 10, 32]);
  const contentOpacity = useTransform(smooth, [0.18, 0.4, 0.62, 0.85], [0, 1, 1, 0]);
  const contentY = useTransform(smooth, [0.18, 0.5], [36, 0]);
  const counterOpacity = useTransform(smooth, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);

  const accent = index % 2 === 0 ? "text-gold" : "text-silver";

  return (
    <div ref={ref} className="relative h-[145vh] sm:h-[160vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-8">
        <motion.p
          style={{ opacity: counterOpacity }}
          className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-muted"
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} — selected work
        </motion.p>

        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative w-full max-w-5xl origin-center overflow-hidden border border-line-strong shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        >
          {project.images?.length ? (
            <ProjectGallery
              images={project.images}
              name={project.name}
              url={project.url}
              frame={project.frame}
              big
              bare
              mediaClassName="h-[52vh] sm:h-[60vh]"
            />
          ) : (
            <ProjectFrame motif={project.motif} accent={accent} url={project.url} big bare mediaClassName="h-[52vh] sm:h-[60vh]" />
          )}

          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent p-6 sm:p-10"
          >
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">
              {project.category} · {project.kind}
            </p>
            <h3 className="mt-2 font-display text-3xl leading-none text-fg sm:text-5xl">{project.name}</h3>
            <p className="mt-3 max-w-lg text-pretty text-sm text-muted sm:text-base">{project.oneLiner}</p>
            <div className="pointer-events-auto mt-5 flex flex-wrap items-end gap-x-6 gap-y-3">
              {project.metrics.slice(0, 3).map((m) => (
                <span key={m.label} className="font-mono text-sm text-gold-bright sm:text-base">
                  {m.value} <span className="text-xs text-muted">{m.label}</span>
                </span>
              ))}
              <Link
                href={`/projects/${project.slug}`}
                className="group ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong bg-ink/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg backdrop-blur transition-colors hover:border-gold hover:text-gold"
              >
                View project
                <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  return (
    <div className="relative">
      {projects.map((p, i) => (
        <ShowcasePanel key={p.slug} project={p} index={i} total={projects.length} />
      ))}
    </div>
  );
}
