"use client";

import { motion } from "framer-motion";
import { Encounter, Choice } from "@/engine/types";
import { ChoiceOption } from "./ChoiceOption";
import { ScenePanel } from "@/components/scenes/ScenePanel";
import { useState } from "react";

interface MomentCardProps {
  encounter: Encounter;
  globalIndex: number;
  totalEncounters: number;
  onChoice: (choice: Choice) => void;
}

export function MomentCard({ encounter, globalIndex, totalEncounters, onChoice }: MomentCardProps) {
  const [showContext, setShowContext] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleChoice = (choice: Choice) => {
    setSelectedId(choice.id);
    setTimeout(() => onChoice(choice), 600);
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.6 }}
    >
      {/* Encounter header */}
      <motion.div
        className="mb-6 flex items-center gap-3"
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

      {/* Scene panel — the visual centerpiece */}
      <motion.div
        className="flex justify-center mb-10"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        onAnimationComplete={() => setShowContext(true)}
      >
        <ScenePanel encounterId={encounter.id} zoneId={encounter.zoneId} />
      </motion.div>

      {/* Context narrative — emotional framing beneath the visual */}
      {showContext && (
        <motion.p
          className="text-base sm:text-lg leading-[1.75] text-drift-text/75 mb-10 max-w-prose font-serif"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          onAnimationComplete={() => setShowChoices(true)}
        >
          {encounter.context}
        </motion.p>
      )}

      {/* System framing + choices */}
      {showChoices && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] text-drift-muted/60 mb-5 tracking-[0.15em] uppercase">
            {encounter.systemFraming}
          </p>

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
