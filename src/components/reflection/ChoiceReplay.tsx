"use client";

import { motion } from "framer-motion";
import { ChoiceRecord } from "@/engine/types";
import { scenarios } from "@/engine/scenarios";

interface ChoiceReplayProps {
  choices: ChoiceRecord[];
}

export function ChoiceReplay({ choices }: ChoiceReplayProps) {
  return (
    <div className="space-y-6">
      {choices.map((choice, i) => {
        const scenario = scenarios.find((s) => s.id === choice.scenarioId);
        if (!scenario) return null;

        return (
          <motion.div
            key={choice.choiceId}
            className="border-l-2 border-drift-border pl-5 py-2"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <p className="text-xs text-drift-muted/50 uppercase tracking-wide mb-1">
              Day {scenario.day} — {scenario.dayName}
            </p>
            <p className="text-drift-text/80 text-sm mb-2">
              {choice.choiceLabel}
            </p>
            <div className="space-y-1">
              {choice.driftVectors.map((v, j) => (
                <p key={j} className="text-xs text-drift-muted leading-relaxed">
                  {v.description}
                </p>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
