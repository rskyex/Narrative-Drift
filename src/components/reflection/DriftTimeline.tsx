"use client";

import { motion } from "framer-motion";
import { ChoiceRecord } from "@/engine/types";
import { getProfileSnapshots, computeCumulativeDrift, createInitialProfile } from "@/engine/drift-model";

interface DriftTimelineProps {
  choices: ChoiceRecord[];
}

export function DriftTimeline({ choices }: DriftTimelineProps) {
  const snapshots = getProfileSnapshots(choices);
  const initial = createInitialProfile();

  return (
    <div className="relative py-8">
      {/* Connecting line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-drift-border -translate-y-1/2" />

      <div className="relative flex justify-between items-center">
        {/* Start node */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-3 h-3 rounded-full bg-drift-border border border-drift-muted/30" />
          <span className="text-[10px] text-drift-muted/40 mt-2">Start</span>
        </motion.div>

        {/* Choice nodes */}
        {snapshots.map((snapshot, i) => {
          const drift = computeCumulativeDrift(initial, snapshot.profile);
          const intensity = Math.min(drift * 3, 1);

          return (
            <motion.div
              key={i}
              className="relative z-10 flex flex-col items-center group"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.12 }}
            >
              <div
                className="w-3 h-3 rounded-full border border-drift-accent/40 transition-transform group-hover:scale-150"
                style={{
                  backgroundColor: `rgba(196, 181, 160, ${0.2 + intensity * 0.6})`,
                }}
              />
              <span className="text-[10px] text-drift-muted/40 mt-2">
                {snapshot.zoneId > 0 ? `Z${snapshot.zoneId}` : "Cal"}
              </span>

              {/* Hover tooltip */}
              <div className="absolute bottom-full mb-4 hidden group-hover:block w-48 p-3 bg-drift-surface border border-drift-border rounded-lg shadow-xl text-left">
                <p className="text-xs text-drift-text/70 leading-relaxed">
                  {snapshot.choiceLabel}
                </p>
                <p className="text-[10px] text-drift-muted mt-1">
                  Drift: {Math.round(drift * 100)}%
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
