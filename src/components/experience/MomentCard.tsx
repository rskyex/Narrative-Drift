"use client";

import { motion } from "framer-motion";
import { Encounter, Choice } from "@/engine/types";
import { ChoiceOption } from "./ChoiceOption";
import { useState } from "react";

interface MomentCardProps {
  encounter: Encounter;
  globalIndex: number;
  totalEncounters: number;
  onChoice: (choice: Choice) => void;
}

export function MomentCard({ encounter, globalIndex, totalEncounters, onChoice }: MomentCardProps) {
  const [showChoices, setShowChoices] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleChoice = (choice: Choice) => {
    setSelectedId(choice.id);
    setTimeout(() => onChoice(choice), 600);
  };

  return (
    <motion.div
      className="max-w-prose mx-auto px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.6 }}
    >
      {/* Encounter header */}
      <motion.div
        className="mb-8 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-8 h-[1px] bg-drift-border" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-drift-muted/40">
          Encounter {globalIndex} of {totalEncounters}
        </span>
        <div className="flex-1 h-[1px] bg-drift-border/30" />
      </motion.div>

      {/* Context */}
      <motion.p
        className="text-lg sm:text-xl leading-relaxed text-drift-text/90 mb-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        onAnimationComplete={() => setShowChoices(true)}
      >
        {encounter.context}
      </motion.p>

      {/* System Framing */}
      {showChoices && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-drift-muted mb-6 tracking-wide uppercase">
            {encounter.systemFraming}
          </p>

          {/* Choices */}
          <div className="space-y-3">
            {encounter.choices.map((choice, i) => (
              <ChoiceOption
                key={choice.id}
                choice={choice}
                index={i}
                selected={selectedId === choice.id}
                disabled={selectedId !== null}
                onSelect={() => handleChoice(choice)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
