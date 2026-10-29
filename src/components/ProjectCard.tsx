import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { getProjectWorld } from "@/data/project-themes";

export default function ProjectCard({
  project,
  index = 0,
  active = false,
  onActivate,
}: {
  project: Project;
  index?: number;
  active?: boolean;
  onActivate?: () => void;
}) {
  const world = getProjectWorld(project.slug);
  return (
    <li className={`directory-entry ${active ? "is-current" : ""}`} style={{ "--entry-accent": world.accent, "--entry-paper": world.soft } as CSSProperties}>
      <Link
        href={`/projects/${project.slug}`}
        onPointerEnter={onActivate}
        onFocus={onActivate}
        className="directory-entry-link"
      >
        <span className="directory-number">{String(index + 1).padStart(2, "0")}</span>
        <span className="directory-mobile-preview" aria-hidden="true">
          {project.images?.[0] ? <Image src={project.images[0]} alt="" fill sizes="72px" className="object-contain" /> : <span>{project.name.slice(0, 1)}</span>}
        </span>
        <div className="directory-project-name"><span className="directory-project-category">{project.category}</span><h2>{project.name}</h2><span className="directory-project-kind">{project.experiment ? <span className="experiment-badge">Experiment</span> : project.kind}</span></div>
        <ArrowUpRight size={21} className="directory-entry-arrow" />
      </Link>
    </li>
  );
}
