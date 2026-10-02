"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import Reveal from "@/components/Reveal";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectHeroFrame from "@/components/ProjectHeroFrame";

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const container = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(projects[0]?.slug);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start center", "end center"],
  });
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting)
            setActive(entry.target.id.replace("work-", ""));
        }
      },
      { rootMargin: "-25% 0px -50% 0px" },
    );
    container.current
      ?.querySelectorAll("article")
      .forEach((article) => observer.observe(article));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="selected-projects" ref={container}>
      <nav className="work-chapters" aria-label="Selected project chapters">
        <span className="work-chapters-label">work.index</span>
        {projects.map((project, index) => (
          <a
            key={project.slug}
            href={`#work-${project.slug}`}
            aria-current={active === project.slug ? "location" : undefined}
          >
            <span>0{index + 1}</span>
            {project.name.replace(" Admin Solution", "")}
          </a>
        ))}
        <motion.div
          className="work-chapter-progress"
          aria-hidden="true"
          style={{ scaleX: reduced ? 1 : scrollYProgress }}
        />
      </nav>
      {projects.map((project, index) => (
        <article
          key={project.slug}
          id={`work-${project.slug}`}
          className="selected-project"
          aria-labelledby={`title-${project.slug}`}
        >
          <div className="project-editorial">
            <Reveal>
              <span className="project-number">0{index + 1}</span>
              <p className="eyebrow mt-6">
                {project.category} / {project.kind}
              </p>
              <h3 id={`title-${project.slug}`}>{project.name}</h3>
              <p className="project-description">{project.oneLiner}</p>
              <p className="project-role">
                <span>{"// my contribution"}</span>
                {project.role}
              </p>
              <div className="project-outcomes">
                {project.metrics.slice(0, 2).map((metric) => (
                  <div key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
              <div className="project-stack">
                {project.tech.slice(0, 4).join(" / ")}
              </div>
              <div className="project-actions">
                <Link href={`/projects/${project.slug}`} className="text-link">
                  readCaseStudy() <ArrowUpRight size={17} />
                </Link>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    liveSite() <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </Reveal>
          </div>
          <div className="project-visual">
            <ProjectHeroFrame>
              <ProjectGallery
                images={project.images ?? []}
                name={project.name}
                url={project.url}
                frame={project.frame}
                big
              />
            </ProjectHeroFrame>
          </div>
        </article>
      ))}
    </div>
  );
}
