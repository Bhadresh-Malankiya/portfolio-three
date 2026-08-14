import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: "#e3a857" }} />
          <div style={{ display: "flex", fontSize: 22, color: "#8f8f95", letterSpacing: 4, textTransform: "uppercase" }}>
            {profile.location} · sole owner, 2 SaaS products
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, color: "#f2f1ee", lineHeight: 1, fontWeight: 600 }}>The Weekend</div>
          <div style={{ fontSize: 104, color: "#f4c572", lineHeight: 1, fontWeight: 600, fontStyle: "italic" }}>
            Builder.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#8f8f95", maxWidth: 700 }}>
            {profile.name} — Senior Full Stack Engineer &amp; Technical Lead
          </div>
          <div style={{ fontSize: 22, color: "#8f8f95" }}>{profile.site}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
