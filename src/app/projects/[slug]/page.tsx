import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/ProjectGallery";
import ProjectVisual from "@/components/ProjectVisual";
import JsonLd from "@/components/JsonLd";
import { identity, portfolioProjects } from "@/data/portfolio";

export function generateStaticParams() { return portfolioProjects.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolioProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: project.name, description: `${project.oneLiner} ${project.role}.`, alternates: { canonical: `/projects/${project.slug}` }, openGraph: { title: `${project.name} — Bhadresh Malankiya`, description: project.oneLiner, type: "article", url: `/projects/${project.slug}` } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = portfolioProjects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = portfolioProjects[index];
  const next = portfolioProjects[(index + 1) % portfolioProjects.length];
  return <div className="pf-page"><JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: `${project.name} — engineering case study`, description: project.oneLiner, author: { "@type": "Person", name: identity.name }, mainEntityOfPage: `https://${identity.site}/projects/${project.slug}`, about: { "@type": "Thing", name: project.name, url: project.url } }} />
    <header className="pf-shell pf-page-header"><Link href="/projects" className="pf-back-link">← All projects</Link><p className="pf-eyebrow">{project.category} / {project.kind}</p><h1>{project.name}</h1><p className="pf-lead">{project.oneLiner}</p><div className="pf-case-summary"><div><strong>My role</strong>{project.role}</div><div><strong>Project context</strong>{project.status}</div></div>{project.url && <div className="pf-actions"><a href={project.url} target="_blank" rel="noopener noreferrer" className="pf-button">Visit website ↗</a></div>}</header>
    <section className="pf-shell" aria-label={`${project.name} visual evidence`}>{project.images?.length ? <ProjectGallery images={project.images} name={project.name} url={project.url} frame={project.frame} captions={project.imageCaptions} big /> : <ProjectVisual project={project} />}</section>
    <div className="pf-shell pf-case-body"><article><h2>The problem</h2><p>{project.problem}</p><h2>What I contributed</h2><p>{project.contribution}</p>{project.narrative.map((paragraph, i) => <p key={i}>{paragraph}</p>)}{project.decisions.length > 0 && <><h2>Engineering decisions</h2><ul>{project.decisions.map((decision) => <li key={decision}>{decision}</li>)}</ul></>}{project.outcomes.length > 0 && <><h2>What the work delivered</h2><ul>{project.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></>}</article><aside><h2>Technology & scope</h2><div className="pf-tags">{project.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>{project.metrics.length > 0 && <><h2>Product scale</h2>{project.metrics.map((metric) => <div className="pf-metric" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}<small>Historical portfolio-reported figures from the contribution period; not a live analytics feed.</small></>}<h2>Discuss this work</h2><p>Happy to talk through the context and technical trade-offs.</p><a className="pf-text-link" href={`mailto:${identity.email}?subject=${encodeURIComponent(`Discussing ${project.name}`)}`}>Start a conversation ↗</a></aside></div>
    <div className="pf-shell"><Link href={`/projects/${next.slug}`} className="pf-next-project"><span><span className="pf-eyebrow">Next case study</span><br /><strong>{next.name}</strong></span><span aria-hidden="true">→</span></Link></div>
    <section className="pf-shell pf-section"><p className="pf-eyebrow">From this project to your team</p><h2>Need someone who can<br /><em>connect the whole product?</em></h2><div className="pf-actions"><a className="pf-button pf-button-primary" href={`mailto:${identity.email}?subject=Engineering%20opportunity`}>Discuss a role ↗</a><a className="pf-button" href={identity.resume} download>Download résumé ↓</a></div></section>
  </div>;
}
