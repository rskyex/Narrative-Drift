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
      className="w-full max-w-5xl mx-auto px-6"
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
        <span className="text-sm uppercase tracking-[0.2em] text-drift-muted/70">
          Encounter {globalIndex} of {totalEncounters}
        </span>
        <div className="flex-1 h-[1px] bg-drift-border/30" />
      </motion.div>

      {/* Layout: Left = Scene + context (questions + AI images), Right = Choices */}
      <div className="flex flex-col lg:flex-row lg:gap-10 lg:items-start">
        {/* Left: Scene panel + context narrative */}
        <motion.div
          className="lg:w-[45%] flex-shrink-0 mb-8 lg:mb-0"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onAnimationComplete={() => setShowContext(true)}
        >
          <ScenePanel encounterId={encounter.id} zoneId={encounter.zoneId} />

          {/* Context narrative */}
          {showContext && (
            <motion.p
              className="text-base leading-[1.75] text-drift-text/85 mt-6 font-serif"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              onAnimationComplete={() => setShowChoices(true)}
            >
              {encounter.context}
            </motion.p>
          )}
        </motion.div>

        {/* Center/Right: System framing + choices */}
        <div className="lg:flex-1 flex items-start justify-center">
          {showChoices && (
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs text-drift-muted/80 mb-5 tracking-[0.15em] uppercase">
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
        </div>
      </div>
    </motion.div>
  );
}
