import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0f14",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 10,
            height: 10,
            borderRadius: 2,
            background: "#e3a857",
            boxShadow: "0 0 14px 4px rgba(227,168,87,0.55)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
