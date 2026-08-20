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
  const scale = useTransform(smooth, [0, 0.5, 1], [0.82, 1, 0.82]);
  const radius = useTransform(smooth, [0, 0.5, 1], [28, 10, 28]);
  const contentOpacity = useTransform(smooth, [0.18, 0.4, 0.62, 0.85], [0, 1, 1, 0]);
  const contentY = useTransform(smooth, [0.18, 0.5], [24, 0]);
  const counterOpacity = useTransform(smooth, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);

  const accent = index % 2 === 0 ? "text-gold" : "text-silver";

  return (
    <div ref={ref} className="relative h-[150vh] sm:h-[165vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-8">
        <motion.p
          style={{ opacity: counterOpacity }}
          className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-muted"
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} — selected work
        </motion.p>

        <motion.div style={{ scale }} className="relative w-full max-w-5xl origin-center">
          {/* The frame and the caption are separate boxes stacked in normal
              flow — deliberately NOT a text overlay on top of the image, so
              a tall phone screenshot (or any frame) never gets its content
              covered by the caption gradient. */}
          <motion.div
            style={{ borderRadius: radius }}
            className="overflow-hidden border border-line-strong shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
          >
            {project.images?.length ? (
              <ProjectGallery
                images={project.images}
                name={project.name}
                url={project.url}
                frame={project.frame}
                big
                mediaClassName="h-[44vh] sm:h-[52vh]"
              />
            ) : (
              <ProjectFrame motif={project.motif} accent={accent} url={project.url} big mediaClassName="h-[44vh] sm:h-[52vh]" />
            )}
          </motion.div>

          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="mt-5 rounded-xl border border-line-strong bg-ink-2/60 p-5 backdrop-blur sm:p-8"
          >
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-gold">
              {project.category} · {project.kind}
            </p>
            <h3 className="mt-2 font-display text-2xl leading-none text-fg sm:text-4xl">{project.name}</h3>
            <p className="mt-3 max-w-lg text-pretty text-sm text-muted sm:text-base">{project.oneLiner}</p>
            <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-3">
              {project.metrics.slice(0, 3).map((m) => (
                <span key={m.label} className="font-mono text-sm text-gold-bright sm:text-base">
                  {m.value} <span className="text-xs text-muted">{m.label}</span>
                </span>
              ))}
              <Link
                href={`/projects/${project.slug}`}
                className="group ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-fg transition-colors hover:border-gold hover:text-gold"
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
