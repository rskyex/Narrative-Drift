import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Narrative Drift — An interactive exploration of algorithmic influence";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle radial gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(196, 181, 160, 0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(196, 181, 160, 0.5), transparent)",
            display: "flex",
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            position: "relative",
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: 72,
              fontFamily: "Georgia, Cambria, serif",
              color: "#e8e8e8",
              letterSpacing: "-0.02em",
              fontWeight: 400,
              margin: 0,
              lineHeight: 1,
            }}
          >
            Narrative Drift
          </h1>

          {/* Divider */}
          <div
            style={{
              width: 60,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(196, 181, 160, 0.6), transparent)",
              display: "flex",
            }}
          />

          {/* Subtitle */}
          <p
            style={{
              fontSize: 20,
              color: "rgba(196, 181, 160, 0.85)",
              fontFamily: "Georgia, Cambria, serif",
              fontStyle: "italic",
              margin: 0,
              letterSpacing: "0.01em",
            }}
          >
            An interactive exploration of algorithmic influence
          </p>

          {/* Tagline */}
          <p
            style={{
              fontSize: 14,
              color: "rgba(232, 232, 232, 0.45)",
              letterSpacing: "0.25em",
              textTransform: "uppercase" as const,
              margin: 0,
              marginTop: 12,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Three zones. Nine encounters. One question.
          </p>
        </div>

        {/* Bottom: Govern the Human credit */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "rgba(232, 232, 232, 0.35)",
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              fontFamily: "system-ui, sans-serif",
              margin: 0,
            }}
          >
            A Govern the Human project
          </p>
        </div>

        {/* Corner accents */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            width: 24,
            height: 24,
            borderTop: "1px solid rgba(196, 181, 160, 0.2)",
            borderLeft: "1px solid rgba(196, 181, 160, 0.2)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            width: 24,
            height: 24,
            borderTop: "1px solid rgba(196, 181, 160, 0.2)",
            borderRight: "1px solid rgba(196, 181, 160, 0.2)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            width: 24,
            height: 24,
            borderBottom: "1px solid rgba(196, 181, 160, 0.2)",
            borderLeft: "1px solid rgba(196, 181, 160, 0.2)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
            width: 24,
            height: 24,
            borderBottom: "1px solid rgba(196, 181, 160, 0.2)",
            borderRight: "1px solid rgba(196, 181, 160, 0.2)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
