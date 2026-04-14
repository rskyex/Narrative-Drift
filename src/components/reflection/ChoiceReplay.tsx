"use client";

import { motion } from "framer-motion";
import { ChoiceRecord } from "@/engine/types";
import { zones } from "@/engine/zones";

interface ChoiceReplayProps {
  choices: ChoiceRecord[];
  onSelectDivergence: (encounterId: string) => void;
}

export function ChoiceReplay({ choices, onSelectDivergence }: ChoiceReplayProps) {
  // Group choices by zone
  const zoneIds = Array.from(new Set(choices.map((c) => c.zoneId)));

  return (
    <div className="space-y-8">
      {zoneIds.map((zoneId) => {
        const zone = zones.find((z) => z.id === zoneId);
        const zoneChoices = choices.filter((c) => c.zoneId === zoneId);

        return (
          <div key={zoneId} className="space-y-3">
            <p className="text-xs text-drift-text/50 uppercase tracking-[0.2em]">
              Zone {zoneId} — {zone?.title ?? "Unknown"}
            </p>

            {zoneChoices.map((choice, i) => (
              <motion.div
                key={choice.encounterId}
                className="border-l border-drift-border/30 pl-5 py-3 group"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <p className="text-sm text-drift-text/80 mb-2">
                  {choice.choiceLabel}
                </p>
                <button
                  onClick={() => onSelectDivergence(choice.encounterId)}
                  className="text-xs text-drift-text/40 hover:text-drift-accent tracking-[0.15em] uppercase transition-colors duration-300"
                >
                  Diverge here
                </button>
              </motion.div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
