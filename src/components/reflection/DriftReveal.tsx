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

    </div>
  );
}
