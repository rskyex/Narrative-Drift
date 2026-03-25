"use client";

import { motion } from "framer-motion";
import { DriftProfile, DriftAxis } from "@/engine/types";
import { getAxisLabels } from "@/engine/drift-model";
import Image from "next/image";

interface StatusSheetProps {
  profile: DriftProfile;
  userName: string | null;
  currentZone?: number;
  totalZones: number;
  compact?: boolean;
}

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

const ZONE_AVATAR: Record<number, string> = {
  1: "/baseline.png",
  2: "/interlude.png",
  3: "/interlude.png",
};

const axisDescriptors: Record<DriftAxis, (v: number) => string> = {
  autonomy: (v) =>
    v > 0.15 ? "Self-directed" : v < -0.15 ? "Yielding" : "Neutral",
  novelty: (v) =>
    v > 0.15 ? "Seeking" : v < -0.15 ? "Settled" : "Neutral",
  sociality: (v) =>
    v > 0.15 ? "Communal" : v < -0.15 ? "Solitary" : "Neutral",
  tempo: (v) =>
    v > 0.15 ? "Accelerated" : v < -0.15 ? "Deliberate" : "Neutral",
  affect: (v) =>
    v > 0.15 ? "Expressive" : v < -0.15 ? "Reserved" : "Neutral",
};

function AxisBar({ axis, value, index }: { axis: DriftAxis; value: number; index: number }) {
  const [leftLabel, rightLabel] = getAxisLabels(axis);
  const descriptor = axisDescriptors[axis](value);
  const percentage = 50 + value * 50;

  return (
    <motion.div
      className="space-y-1"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <div className="flex justify-between items-baseline">
        <span className="text-xs uppercase tracking-wider text-drift-text/80 font-medium">
          {axis}
        </span>
        <span className="text-xs text-drift-accent/80 font-mono">
          {descriptor}
        </span>
      </div>
      <div className="relative h-[2px] bg-drift-border/40 rounded-full">
        <div className="absolute left-1/2 top-0 w-[1px] h-full bg-drift-muted/20 -translate-x-1/2" />
        <motion.div
          className="absolute top-1/2 w-2 h-2 bg-drift-accent/80 rounded-full -translate-y-1/2 -translate-x-1/2"
          initial={{ left: "50%" }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 0.8, delay: index * 0.08 + 0.2 }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-[11px] text-drift-muted/70">{leftLabel}</span>
        <span className="text-[11px] text-drift-muted/70">{rightLabel}</span>
      </div>
    </motion.div>
  );
}

export function StatusSheet({
  profile,
  userName,
  currentZone,
  totalZones,
  compact = false,
}: StatusSheetProps) {
  return (
    <motion.div
      className="border border-drift-border/20 bg-drift-surface/25 backdrop-blur-sm rounded-lg overflow-hidden rpg-panel-glow"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-drift-border/20">
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-[0.2em] text-drift-text/75 font-medium">
            Subject Dossier
          </span>
          {currentZone && (
            <span className="text-sm font-mono text-drift-accent/70">
              Zone {currentZone}/{totalZones}
            </span>
          )}
        </div>
        {userName && (
          <p className="text-sm text-drift-text/70 mt-1 font-serif">{userName}</p>
        )}
      </div>

      {/* Portrait */}
      {!compact && currentZone && (
        <div className="flex justify-center py-4 border-b border-drift-border/10">
          <Image
            src={ZONE_AVATAR[currentZone] ?? "/baseline.png"}
            alt="Zone avatar"
            width={180}
            height={180}
            className="rounded-sm object-cover"
          />
        </div>
      )}

      {/* Axes */}
      <div className="px-4 py-3 space-y-3">
        {AXES.map((axis, i) => (
          <AxisBar key={axis} axis={axis} value={profile[axis]} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
