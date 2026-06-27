import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "linear-gradient(160deg, #38BDF8 0%, #3B82F6 50%, #2563EB 100%)",
          borderRadius: 8,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 7,
            left: 7,
            display: "flex",
            alignItems: "flex-end",
            gap: 3,
          }}
        >
          <div style={{ width: 4, height: 6, borderRadius: 2, background: "rgba(255,255,255,0.85)" }} />
          <div style={{ width: 4, height: 10, borderRadius: 2, background: "rgba(255,255,255,0.9)" }} />
          <div style={{ width: 4, height: 14, borderRadius: 2, background: "rgba(255,255,255,0.95)" }} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 6,
            right: 7,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#E0F2FE",
            boxShadow: "0 0 6px rgba(56,189,248,0.8)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
