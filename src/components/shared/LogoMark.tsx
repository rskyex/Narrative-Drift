"use client";

import { motion } from "framer-motion";

interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * Minimal brand sigil — an abstract drift mark.
 * Two concentric broken rings with a displaced center point,
 * evoking measurement, displacement, and the self observed.
 */
export function LogoMark({ size = 32, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      aria-label="Narrative Drift"
    >
      {/* Outer broken ring */}
      <circle
        cx={16}
        cy={16}
        r={14}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.5}
        strokeDasharray="6 3 2 3"
        opacity={0.3}
      />

      {/* Inner ring — slightly off-center to suggest drift */}
      <motion.circle
        cx={16.5}
        cy={15.8}
        r={8}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.4}
        strokeDasharray="3 4"
        opacity={0.25}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "16.5px 15.8px" }}
      />

      {/* Center point — the self */}
      <circle cx={16} cy={16} r={1.2} fill="currentColor" opacity={0.4} />

      {/* Displaced echo — where you drifted to */}
      <circle cx={17} cy={15.5} r={0.6} fill="currentColor" opacity={0.2} />
    </svg>
  );
}
