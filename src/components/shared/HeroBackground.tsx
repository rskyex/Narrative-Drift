"use client";

import { motion } from "framer-motion";

/**
 * Abstract atmospheric background for the landing page.
 * Face-free, text-free visual board — dark luxury / cybernetic tone.
 * Layered radial gradients, subtle grid, and drifting particle field.
 */
export function HeroBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Core atmospheric gradient — warm dark center */}
          <radialGradient id="hero-core" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="rgba(196, 181, 160, 0.04)" />
            <stop offset="40%" stopColor="rgba(196, 181, 160, 0.015)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Upper vignette */}
          <radialGradient id="hero-vignette" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="rgba(166, 124, 109, 0.025)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Cybernetic grid fade */}
          <linearGradient id="hero-grid-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(196, 181, 160, 0.03)" />
            <stop offset="50%" stopColor="rgba(196, 181, 160, 0.018)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Particle glow */}
          <radialGradient id="hero-particle">
            <stop offset="0%" stopColor="rgba(196, 181, 160, 0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Base atmospheric layers */}
        <rect width="1200" height="800" fill="url(#hero-core)" />
        <rect width="1200" height="800" fill="url(#hero-vignette)" />

        {/* Subtle perspective grid — converging lines */}
        <g opacity={0.4}>
          {/* Horizontal rules */}
          {[280, 340, 400, 460, 520, 580].map((y) => (
            <line
              key={`h-${y}`}
              x1={200}
              y1={y}
              x2={1000}
              y2={y}
              stroke="rgba(196, 181, 160, 0.025)"
              strokeWidth={0.5}
            />
          ))}
          {/* Vertical rules — slight convergence */}
          {[400, 500, 600, 700, 800].map((x) => {
            const dx = (x - 600) * 0.08;
            return (
              <line
                key={`v-${x}`}
                x1={x + dx}
                y1={260}
                x2={x - dx}
                y2={600}
                stroke="rgba(196, 181, 160, 0.02)"
                strokeWidth={0.5}
              />
            );
          })}
        </g>

        {/* Central horizon glow */}
        <ellipse
          cx={600}
          cy={420}
          rx={400}
          ry={3}
          fill="rgba(196, 181, 160, 0.04)"
        />

        {/* Orbiting ring — the "drift" sigil */}
        <motion.ellipse
          cx={600}
          cy={380}
          rx={180}
          ry={60}
          fill="none"
          stroke="rgba(196, 181, 160, 0.03)"
          strokeWidth={0.8}
          strokeDasharray="4 8"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "600px 380px" }}
        />

        {/* Scattered data particles */}
        {[
          { x: 340, y: 300, r: 1.2, delay: 0 },
          { x: 520, y: 260, r: 0.8, delay: 2 },
          { x: 780, y: 310, r: 1.0, delay: 4 },
          { x: 860, y: 480, r: 0.7, delay: 1 },
          { x: 380, y: 520, r: 0.9, delay: 3 },
          { x: 700, y: 560, r: 0.6, delay: 5 },
          { x: 460, y: 440, r: 0.8, delay: 2.5 },
          { x: 740, y: 380, r: 1.1, delay: 1.5 },
        ].map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="rgba(196, 181, 160, 0.15)"
            animate={{
              opacity: [0.1, 0.4, 0.1],
              cy: [p.y, p.y - 8, p.y],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* CSS gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 45%, transparent 0%, rgba(10, 10, 10, 0.7) 100%)",
        }}
      />
    </div>
  );
}
