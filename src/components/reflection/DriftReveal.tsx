"use client";

import { motion } from "framer-motion";
import { DriftProfile, DriftAxis } from "@/engine/types";
import { computeCumulativeDrift } from "@/engine/drift-model";
import { AxisComparison } from "./AxisComparison";

interface DriftRevealProps {
  initialProfile: DriftProfile;
  currentProfile: DriftProfile;
}

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

export function DriftReveal({ initialProfile, currentProfile }: DriftRevealProps) {
  const cumulativeDrift = computeCumulativeDrift(initialProfile, currentProfile);
  const driftPercentage = Math.round(cumulativeDrift * 100);

  return (
    <div className="space-y-14">
      <div className="space-y-7">
        {AXES.map((axis, i) => (
          <AxisComparison
            key={axis}
            axis={axis}
            value={currentProfile[axis]}
            index={i}
          />
        ))}
      </div>

      <motion.div
        className="text-center pt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.2 }}
      >
        <div className="drift-divider mb-8" />
        <p className="text-drift-muted/65 text-[10px] tracking-[0.3em] uppercase mb-3">
          Cumulative drift
        </p>
        <p className="font-serif text-5xl text-drift-accent/80 tracking-tight">
          {driftPercentage}%
        </p>
        <p className="text-drift-muted/60 text-[11px] mt-2">
          from where you started
        </p>
      </motion.div>
    </div>
  );
}
