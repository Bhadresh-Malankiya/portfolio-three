import { ImageResponse } from "next/og";
import { portfolioProjects } from "@/data/portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project case study by Bhadresh Malankiya";
export function generateStaticParams() { return portfolioProjects.map((p) => ({ slug: p.slug })); }
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = portfolioProjects.find((p) => p.slug === slug) ?? portfolioProjects[0];
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f6f3ee", color: "#18202b", padding: 72, fontFamily: "sans-serif" }}><div style={{ display: "flex", fontSize: 22, color: "#76531b" }}>{project.category} / {project.kind}</div><div style={{ display: "flex", flexDirection: "column" }}><div style={{ display: "flex", fontSize: project.name.length > 28 ? 56 : 76, fontWeight: 600, letterSpacing: -3, lineHeight: 1.1, maxWidth: 1030 }}>{project.name}</div><div style={{ display: "flex", fontSize: 28, lineHeight: 1.45, color: "#525c65", marginTop: 25, maxWidth: 940 }}>{project.oneLiner}</div></div><div style={{ display: "flex", fontSize: 22, color: "#76531b" }}>Engineering case study / Bhadresh Malankiya</div></div>, size);
}
