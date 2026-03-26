"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChoiceRecord } from "@/engine/types";
import { zones } from "@/engine/zones";

interface PathLogProps {
  choices: ChoiceRecord[];
  compact?: boolean;
}

function getZoneTitle(zoneId: number): string {
  return zones.find((z) => z.id === zoneId)?.title ?? `Zone ${zoneId}`;
}

export function PathLog({ choices, compact = false }: PathLogProps) {
  if (choices.length === 0) {
    return (
      <motion.div
        className="border border-drift-border/30 bg-drift-surface/30 backdrop-blur-sm rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="px-4 py-3 border-b border-drift-border/20">
          <span className="text-[10px] uppercase tracking-[0.2em] text-drift-text/70">
            Path Log
          </span>
        </div>
        <div className="px-4 py-6 text-center">
          <p className="text-[11px] text-drift-text/60 italic">No encounters recorded</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="border border-drift-border/30 bg-drift-surface/30 backdrop-blur-sm rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="px-4 py-3 border-b border-drift-border/20">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.2em] text-drift-text/70">
            Path Log
          </span>
          <span className="text-[10px] font-mono text-drift-text/60">
            {choices.length} encounter{choices.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className={`${compact ? "max-h-48" : "max-h-72"} overflow-y-auto`}>
        <AnimatePresence mode="popLayout">
          {choices.map((choice, i) => (
            <motion.div
              key={choice.choiceId}
              className="px-4 py-3 border-b border-drift-border/10 last:border-b-0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start gap-3">
                {/* Zone indicator */}
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full border border-drift-accent/30 flex items-center justify-center">
                    <span className="text-[9px] font-mono text-drift-accent/60">
                      {choice.zoneId}
                    </span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  {/* Zone label */}
                  <p className="text-[9px] uppercase tracking-wider text-drift-text/60 mb-0.5">
                    {getZoneTitle(choice.zoneId)}
                  </p>

                  {/* Choice made */}
                  <p className="text-[11px] text-drift-text/85 leading-relaxed">
                    {choice.choiceLabel}
                  </p>

                  {/* Drift effects */}
                  {!compact && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {choice.driftVectors.map((v, j) => (
                        <span
                          key={j}
                          className={`text-[9px] px-1.5 py-0.5 rounded ${
                            v.delta > 0
                              ? "bg-drift-accent/15 text-drift-accent/80"
                              : "bg-drift-alert/15 text-drift-alert/80"
                          }`}
                        >
                          {v.axis} {v.delta > 0 ? "+" : ""}{Math.round(v.delta * 100)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
