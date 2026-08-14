import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug) ?? projects[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090a",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", gap: 8, fontSize: 22, color: "#e3a857", letterSpacing: 4, textTransform: "uppercase" }}>
          <span>{project.category}</span>
          <span>·</span>
          <span>{project.kind}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, color: "#f2f1ee", lineHeight: 1.05, fontWeight: 600, maxWidth: 1000 }}>
            {project.name}
          </div>
          <div style={{ fontSize: 28, color: "#8f8f95", marginTop: 24, maxWidth: 900 }}>{project.oneLiner}</div>
        </div>

        <div style={{ display: "flex", gap: 40 }}>
          {project.metrics.slice(0, 3).map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 34, color: "#f4c572" }}>{m.value}</div>
              <div style={{ fontSize: 18, color: "#8f8f95", textTransform: "uppercase", letterSpacing: 2 }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
