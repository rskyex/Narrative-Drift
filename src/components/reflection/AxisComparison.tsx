"use client";

import { motion } from "framer-motion";
import { DriftAxis } from "@/engine/types";
import { getAxisLabels } from "@/engine/drift-model";

interface AxisComparisonProps {
  axis: DriftAxis;
  value: number;
  index: number;
}

export function AxisComparison({ axis, value, index }: AxisComparisonProps) {
  const [leftLabel, rightLabel] = getAxisLabels(axis);
  const percentage = Math.round(Math.abs(value) * 100);
  const direction = value < 0 ? "left" : value > 0 ? "right" : "center";

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="flex justify-between text-[13px]">
        <span className={value < 0 ? "text-drift-accent/80" : "text-drift-muted/75"}>
          {leftLabel}
        </span>
        <span className={value > 0 ? "text-drift-accent/80" : "text-drift-muted/75"}>
          {rightLabel}
        </span>
      </div>

      <div className="relative h-[3px] bg-drift-border rounded-full overflow-hidden">
        {/* Center mark */}
        <div className="absolute left-1/2 top-0 w-[1px] h-full bg-drift-muted/30 -translate-x-1/2" />

        {/* Drift bar */}
        {direction !== "center" && (
          <motion.div
            className="absolute top-0 h-full bg-drift-accent/60 rounded-full"
            initial={{
              left: "50%",
              width: 0,
            }}
            animate={{
              left: direction === "left" ? `${50 - Math.abs(value) * 50}%` : "50%",
              width: `${Math.abs(value) * 50}%`,
            }}
            transition={{
              duration: 1.2,
              delay: index * 0.15 + 0.3,
              ease: "easeOut",
            }}
          />
        )}

        {/* Current position marker */}
        <motion.div
          className="absolute top-1/2 w-2 h-2 bg-drift-accent rounded-full -translate-y-1/2 -translate-x-1/2"
          initial={{ left: "50%" }}
          animate={{ left: `${50 + value * 50}%` }}
          transition={{
            duration: 1.4,
            delay: index * 0.15 + 0.3,
            ease: "easeOut",
          }}
        />
      </div>

      {percentage > 0 && (
        <motion.p
          className="text-xs text-drift-muted/75 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.15 + 1 }}
        >
          {percentage}% toward {direction === "left" ? leftLabel.toLowerCase() : rightLabel.toLowerCase()}
        </motion.p>
      )}
    </motion.div>
  );
}
