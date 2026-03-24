"use client";

import { motion } from "framer-motion";
import { DriftProfile } from "@/engine/types";

interface SubjectPortraitProps {
  profile: DriftProfile;
  size?: number;
  className?: string;
}

/**
 * An abstract generative portrait that evolves with the drift profile.
 * Not a face — a psychometric visualization. A topography of self.
 *
 * Autonomy  → form coherence (unified vs. fragmented)
 * Novelty   → color spread (monochrome vs. polychrome)
 * Sociality → element density (sparse vs. clustered)
 * Tempo     → rhythm (slow orbit vs. tight rotation)
 * Affect    → luminance (dim vs. radiant)
 */
export function SubjectPortrait({ profile, size = 200, className }: SubjectPortraitProps) {
  const cx = size / 2;
  const cy = size / 2;

  // Derive visual parameters from the 5 axes (-1 to +1)
  const autonomy = profile.autonomy;
  const novelty = profile.novelty;
  const sociality = profile.sociality;
  const tempo = profile.tempo;
  const affect = profile.affect;

  // Form: base radius and distortion
  const baseRadius = size * 0.28;
  const distortion = (1 - autonomy) * 0.3; // less autonomy = more distortion
  const ringCount = Math.round(3 + (1 + sociality) * 2); // 1-7 rings based on sociality

  // Color: hue range based on novelty
  const baseHue = 35; // warm amber baseline
  const hueSpread = (1 + novelty) * 30; // 0-60 degree spread

  // Luminance from affect
  const baseLuminance = 0.15 + (1 + affect) * 0.15; // 0.15 - 0.45

  // Rotation speed from tempo
  const rotationDuration = 30 - tempo * 12; // 18-42 seconds

  // Generate rings
  const rings = Array.from({ length: ringCount }, (_, i) => {
    const t = i / Math.max(ringCount - 1, 1);
    const radius = baseRadius * (0.4 + t * 0.8);
    const hue = baseHue + (t - 0.5) * hueSpread;
    const opacity = baseLuminance * (1 - t * 0.4);
    const strokeWidth = 1 + (1 - t) * 1.5;

    // Distortion: ellipse vs circle
    const rx = radius * (1 + distortion * Math.sin(t * Math.PI * 2));
    const ry = radius * (1 - distortion * Math.sin(t * Math.PI * 2));
    const rotation = t * 360 * distortion;

    return { rx, ry, hue, opacity, strokeWidth, rotation, delay: t * 0.3 };
  });

  // Generate orbital nodes (sociality-driven)
  const nodeCount = Math.round(2 + (1 + sociality) * 3); // 0-8 nodes
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i / nodeCount) * Math.PI * 2;
    const orbitRadius = baseRadius * (0.6 + Math.sin(i * 1.7) * 0.3);
    const x = cx + Math.cos(angle) * orbitRadius;
    const y = cy + Math.sin(angle) * orbitRadius;
    const nodeRadius = 1.5 + Math.abs(affect) * 2;
    const hue = baseHue + (i / nodeCount) * hueSpread;
    return { x, y, nodeRadius, hue, delay: 0.5 + i * 0.08 };
  });

  // Central glyph: a point of coherence
  const coreRadius = 3 + (1 + autonomy) * 3; // larger = more autonomous
  const coreOpacity = baseLuminance + 0.2;

  return (
    <div className={className}>
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Background field */}
        <circle
          cx={cx}
          cy={cy}
          r={size * 0.45}
          fill="none"
          stroke={`hsla(${baseHue}, 20%, 30%, 0.05)`}
          strokeWidth={0.5}
        />

        {/* Rotating ring group */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: rotationDuration, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          {rings.map((ring, i) => (
            <motion.ellipse
              key={`ring-${i}`}
              cx={cx}
              cy={cy}
              rx={ring.rx}
              ry={ring.ry}
              fill="none"
              stroke={`hsla(${ring.hue}, 25%, 55%, ${ring.opacity})`}
              strokeWidth={ring.strokeWidth}
              transform={`rotate(${ring.rotation} ${cx} ${cy})`}
              initial={{ opacity: 0, rx: 0, ry: 0 }}
              animate={{ opacity: ring.opacity, rx: ring.rx, ry: ring.ry }}
              transition={{ duration: 1.2, delay: ring.delay, ease: "easeOut" }}
            />
          ))}
        </motion.g>

        {/* Counter-rotating node group */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: rotationDuration * 1.6, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          {nodes.map((node, i) => (
            <motion.circle
              key={`node-${i}`}
              cx={node.x}
              cy={node.y}
              r={node.nodeRadius}
              fill={`hsla(${node.hue}, 30%, 60%, ${baseLuminance * 0.8})`}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: 1, r: node.nodeRadius }}
              transition={{ duration: 0.8, delay: node.delay }}
            />
          ))}
        </motion.g>

        {/* Core identity marker */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={coreRadius}
          fill={`hsla(${baseHue}, 30%, 65%, ${coreOpacity})`}
          initial={{ opacity: 0, r: 0 }}
          animate={{ opacity: coreOpacity, r: coreRadius }}
          transition={{ duration: 1, delay: 0.3 }}
        />

        {/* Pulse emanation */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={coreRadius}
          fill="none"
          stroke={`hsla(${baseHue}, 25%, 55%, 0.15)`}
          strokeWidth={0.5}
          animate={{
            r: [coreRadius, coreRadius + 20],
            opacity: [0.2, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      </motion.svg>
    </div>
  );
}
