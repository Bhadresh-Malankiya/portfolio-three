import Link from "next/link";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectVisual from "@/components/ProjectVisual";
import type { PortfolioProject } from "@/data/portfolio";

export default function ProjectShowcase({ projects }: { projects: PortfolioProject[] }) {
  return <div className="pf-shell">{projects.map((project, index) => <article className="pf-work-entry" key={project.slug} aria-labelledby={`work-${project.slug}`}>
    <div><span className="pf-work-number">{String(index + 1).padStart(2, "0")} / {project.category} · {project.kind}</span><h3 id={`work-${project.slug}`}>{project.name}</h3><p className="pf-project-description">{project.oneLiner}</p><p className="pf-contribution"><strong>My contribution</strong>{project.contribution}</p><div className="pf-tags" aria-label="Selected technologies">{project.tech.slice(0, 4).map((tech) => <span key={tech}>{tech}</span>)}</div><div className="pf-actions"><Link className="pf-button pf-button-primary" href={`/projects/${project.slug}`}>Read case study ↗</Link>{project.url && <a className="pf-text-link" href={project.url} target="_blank" rel="noopener noreferrer">Visit website ↗</a>}</div></div>
    <div>{project.images?.length ? <ProjectGallery images={project.images} name={project.name} frame={project.frame} url={project.url} captions={project.imageCaptions} /> : <ProjectVisual project={project} />}</div><span className="pf-work-progress" aria-hidden="true" />
  </article>)}</div>;
}
