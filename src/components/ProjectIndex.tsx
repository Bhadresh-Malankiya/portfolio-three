"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CornerDownRight } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import ProjectMotif from "@/components/ProjectMotif";
import { portfolioProjects, selectedWork } from "@/data/portfolio";
import { getProjectWorld } from "@/data/project-themes";

const projects = [...selectedWork, ...portfolioProjects.filter(project => !selectedWork.some(selected => selected.slug === project.slug))];

const filters = [
  "All work",
  "Employer products",
  "Client work",
  "Founder ventures",
  "Personal builds",
] as const;

type Filter = (typeof filters)[number];
const matches = (kind: string, filter: Filter) =>
  filter === "All work" ||
  (filter === "Employer products"
    ? ["Employer product", "Sole ownership"].includes(kind)
    : filter === "Personal builds"
      ? kind === "Personal build"
      : filter === "Founder ventures"
        ? kind === "Founder venture"
        : ["Client project", "Freelance"].includes(kind));

export default function ProjectIndex() {
  const [filter, setFilter] = useState<Filter>("All work");
  const [activeSlug, setActiveSlug] = useState(projects[0].slug);
  const visible = projects.filter(project => matches(project.kind, filter));
  const active = visible.find(project => project.slug === activeSlug) ?? visible[0];
  const world = active ? getProjectWorld(active.slug) : undefined;
  return (
    <div className="project-directory">
      <div className="directory-filters" role="group" aria-label="Filter projects by contribution">
        {filters.map(item => (
          <button key={item} onClick={() => setFilter(item)} aria-pressed={filter === item} aria-controls="project-directory-list">
            {item}<span aria-hidden="true">{projects.filter(project => matches(project.kind, item)).length}</span>
          </button>
        ))}
      </div>
      <div className="directory-status"><span role="status" aria-live="polite">{visible.length} {visible.length === 1 ? "project" : "projects"} in view</span><span>Each one has a story <CornerDownRight size={13} /></span></div>
      <div className="directory-layout">
        <ol className="directory-list" id="project-directory-list" aria-label={`${filter} project directory`}>
          {visible.map(project => <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} active={active?.slug === project.slug} onActivate={() => setActiveSlug(project.slug)} />)}
        </ol>
        {active && world && <aside className="directory-preview" aria-label="Selected project preview" style={{ "--preview-paper": world.paper, "--preview-soft": world.soft, "--preview-ink": world.ink, "--preview-accent": world.accent } as CSSProperties}>
          <div className="directory-preview-tab"><span>Project file</span><span>{String(projects.indexOf(active) + 1).padStart(2, "0")} / {projects.length}</span></div>
          <div className={`directory-preview-art preview-${world.motif}`}>
            <div className="directory-art-ruler" aria-hidden="true"><span>01</span><i /><span>02</span><i /><span>03</span></div>
            {active.images?.[0] ? <div className={`directory-preview-image ${active.frame === "phone" ? "is-phone" : ""}`}><Image src={active.images[0]} alt={`${active.name} product screen`} fill sizes="(min-width: 1200px) 540px, 45vw" className="object-contain" /></div> : <div className="directory-preview-concept"><span>{active.name.slice(0, 1)}</span><ProjectMotif motif={active.motif} accent="text-current" className="directory-preview-motif" /></div>}
            <span className="directory-art-label">{active.images?.length ? "Inside the product" : "Engineering study"}</span>
          </div>
          <div className="directory-preview-copy"><p className="directory-preview-category">{active.category} / {active.kind}</p><h2>{active.name}</h2><p>{active.oneLiner}</p><div className="directory-preview-tools">{active.tech.slice(0, 3).map(tech => <span key={tech}>{tech}</span>)}</div><Link href={`/projects/${active.slug}`}>Open the project <ArrowUpRight size={17} /></Link></div>
        </aside>}
      </div>
    </div>
  );
}
