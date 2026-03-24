"use client";

import { motion } from "framer-motion";
import { DriftProfile, DriftAxis } from "@/engine/types";
import { getAxisLabels } from "@/engine/drift-model";
import { SubjectPortrait } from "./SubjectPortrait";

interface StatusSheetProps {
  profile: DriftProfile;
  userName: string | null;
  currentChapter?: number;
  totalChapters: number;
  compact?: boolean;
}

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

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
  const percentage = 50 + value * 50; // 0-100 where 50 is center

  return (
    <motion.div
      className="space-y-1"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] uppercase tracking-wider text-drift-muted/60">
          {axis}
        </span>
        <span className="text-[10px] text-drift-accent/70 font-mono">
          {descriptor}
        </span>
      </div>
      <div className="relative h-[2px] bg-drift-border/40 rounded-full">
        <div className="absolute left-1/2 top-0 w-[1px] h-full bg-drift-muted/20 -translate-x-1/2" />
        <motion.div
          className="absolute top-1/2 w-1.5 h-1.5 bg-drift-accent/80 rounded-full -translate-y-1/2 -translate-x-1/2"
          initial={{ left: "50%" }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 0.8, delay: index * 0.08 + 0.2 }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-[8px] text-drift-muted/30">{leftLabel}</span>
        <span className="text-[8px] text-drift-muted/30">{rightLabel}</span>
      </div>
    </motion.div>
  );
}

export function StatusSheet({
  profile,
  userName,
  currentChapter,
  totalChapters,
  compact = false,
}: StatusSheetProps) {
  return (
    <motion.div
      className="border border-drift-border/30 bg-drift-surface/30 backdrop-blur-sm rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-drift-border/20">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-drift-muted/50">
            Subject Dossier
          </span>
          {currentChapter && (
            <span className="text-[10px] font-mono text-drift-accent/50">
              {currentChapter}/{totalChapters}
            </span>
          )}
        </div>
        {userName && (
          <p className="text-sm text-drift-text/70 mt-1 font-serif">{userName}</p>
        )}
      </div>

      {/* Portrait */}
      {!compact && (
        <div className="flex justify-center py-4 border-b border-drift-border/10">
          <SubjectPortrait profile={profile} size={140} />
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
