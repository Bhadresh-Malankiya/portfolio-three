import type { PortfolioProject } from "@/data/portfolio";

export default function ProjectVisual({ project }: { project: PortfolioProject }) {
  const voice = project.slug === "vocalxi";
  return <div className="pf-workflow-visual" role="img" aria-label={voice ? "Illustration of the VocalXI workflow: form questions, guided conversation, reviewed answers. Not a product screenshot." : `Project summary for ${project.name}; no public screenshot shown.`}>
    <p className="pf-eyebrow">{voice ? "VocalXI / Voice-to-forms workflow" : `${project.category} / Project overview`}</p>
    {voice ? <>{["Start with a form", "Answer through conversation", "Review structured answers"].map((label, i) => <div className="pf-workflow-row" key={label}><span>0{i + 1}</span><strong>{label}</strong>{i === 1 && <span className="pf-wave" aria-hidden="true">{Array.from({ length: 9 }, (_, n) => <i key={n} />)}</span>}</div>)}</> : <div className="pf-workflow-row"><strong>{project.name}</strong></div>}
    <p>{project.visualNote ?? "No public product screen is included. The case study describes the scope and my contribution."}</p>
  </div>;
}
