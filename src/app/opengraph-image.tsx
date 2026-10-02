import { ImageResponse } from "next/og";
import { identity } from "@/data/portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Bhadresh Malankiya — Senior Full-Stack & AI Engineer";
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f6f3ee", color: "#18202b", padding: 72, fontFamily: "sans-serif" }}><div style={{ display: "flex", fontSize: 22, color: "#76531b" }}>{identity.name} / {identity.role}</div><div style={{ display: "flex", flexDirection: "column", fontSize: 88, fontWeight: 600, letterSpacing: -4, lineHeight: 1.05 }}><span>I build products</span><span style={{ color: "#76531b" }}>people rely on.</span></div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 21, color: "#525c65" }}><span>React · Next.js · Node.js · Applied AI</span><span>{identity.site}</span></div></div>, size);
}
