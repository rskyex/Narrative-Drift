"use client";

import { motion } from "framer-motion";
import { ChoiceRecord, DriftProfile, DriftAxis } from "@/engine/types";
import {
  getProfileSnapshots,
  computeCumulativeDrift,
} from "@/engine/drift-model";
import { zones } from "@/engine/zones";

interface TimelineOfChangeProps {
  choices: ChoiceRecord[];
  baselineProfile: DriftProfile;
}

const AXES: DriftAxis[] = [
  "autonomy",
  "novelty",
  "sociality",
  "tempo",
  "affect",
];

function getZoneTitle(zoneId: number): string {
  return zones.find((z) => z.id === zoneId)?.title ?? `Zone ${zoneId}`;
}

function getDominantShift(
  prev: DriftProfile,
  curr: DriftProfile
): { axis: DriftAxis; delta: number } | null {
  let maxDelta = 0;
  let maxAxis: DriftAxis = "autonomy";
  for (const axis of AXES) {
    const d = Math.abs(curr[axis] - prev[axis]);
    if (d > maxDelta) {
      maxDelta = d;
      maxAxis = axis;
    }
  }
  if (maxDelta < 0.01) return null;
  return { axis: maxAxis, delta: curr[maxAxis] - prev[maxAxis] };
}

export function TimelineOfChange({
  choices,
  baselineProfile,
}: TimelineOfChangeProps) {
  const snapshots = getProfileSnapshots(choices, baselineProfile);

  // Build zone boundaries for visual grouping
  const zoneBoundaries: number[] = [];
  let lastZone = 0;
  snapshots.forEach((s, i) => {
    if (s.zoneId !== lastZone) {
      zoneBoundaries.push(i);
      lastZone = s.zoneId;
    }
  });

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="text-center">
        <motion.p
          className="font-serif text-2xl sm:text-3xl text-drift-accent/90 tracking-[-0.01em] mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Timeline of Change
        </motion.p>
        <motion.div
          className="w-12 h-[1px] bg-drift-border mx-auto"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
      </div>

      {/* Timeline entries */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-0 bottom-0 w-[1px] bg-drift-border/30" />

        {/* Baseline node */}
        <motion.div
          className="relative flex items-start gap-4 mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative z-10 w-[15px] h-[15px] rounded-full border-2 border-drift-muted/40 bg-drift-bg flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs uppercase tracking-wider text-drift-text/70">
              Baseline Established
            </p>
            <p className="text-sm text-drift-text/85 mt-0.5">
              Calibration complete. Profile recorded.
            </p>
          </div>
        </motion.div>

        {/* Choice nodes grouped by zone */}
        {snapshots.map((snapshot, i) => {
          const isZoneStart = zoneBoundaries.includes(i);
          const prevProfile =
            i === 0
              ? baselineProfile
              : snapshots[i - 1].profile;
          const shift = getDominantShift(prevProfile, snapshot.profile);
          const cumulDrift = computeCumulativeDrift(
            baselineProfile,
            snapshot.profile
          );
          const intensity = Math.min(cumulDrift * 3, 1);

          return (
            <div key={i}>
              {/* Zone header */}
              {isZoneStart && (
                <motion.div
                  className="relative flex items-start gap-4 mb-4 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="relative z-10 w-[15px] flex-shrink-0 flex justify-center">
                    <div className="w-[9px] h-[9px] rotate-45 border border-drift-accent/40 bg-drift-bg" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-drift-accent/80">
                    {getZoneTitle(snapshot.zoneId)}
                  </p>
                </motion.div>
              )}

              {/* Choice entry */}
              <motion.div
                className="relative flex items-start gap-4 mb-4"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.12 }}
              >
                <div
                  className="relative z-10 w-[15px] h-[15px] rounded-full flex-shrink-0 mt-0.5 border"
                  style={{
                    borderColor: `rgba(196, 181, 160, ${0.2 + intensity * 0.5})`,
                    backgroundColor: `rgba(196, 181, 160, ${0.05 + intensity * 0.2})`,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-drift-text/85 leading-relaxed">
                    {snapshot.choiceLabel}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {shift && (
                      <span
                        className={`text-xs font-mono ${
                          shift.delta > 0
                            ? "text-drift-accent/80"
                            : "text-drift-alert/80"
                        }`}
                      >
                        {shift.axis} {shift.delta > 0 ? "+" : ""}
                        {Math.round(shift.delta * 100)}
                      </span>
                    )}
                    <span className="text-xs font-mono text-drift-text/60">
                      drift: {Math.round(cumulDrift * 100)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}

        {/* Final node */}
        <motion.div
          className="relative flex items-start gap-4 mt-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + snapshots.length * 0.12 + 0.2 }}
        >
          <div className="relative z-10 w-[15px] h-[15px] rounded-full border-2 border-drift-accent/60 bg-drift-bg flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs uppercase tracking-wider text-drift-accent/80">
              Final State
            </p>
            <p className="text-sm text-drift-text/85 mt-0.5">
              {Math.round(
                computeCumulativeDrift(
                  baselineProfile,
                  snapshots.length > 0
                    ? snapshots[snapshots.length - 1].profile
                    : baselineProfile
                ) * 100
              )}
              % displacement from baseline
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
