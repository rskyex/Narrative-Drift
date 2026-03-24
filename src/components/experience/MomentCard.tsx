"use client";

import { motion } from "framer-motion";
import { Scenario, Choice } from "@/engine/types";
import { ChoiceOption } from "./ChoiceOption";
import { useState } from "react";

interface MomentCardProps {
  scenario: Scenario;
  onChoice: (choice: Choice) => void;
}

export function MomentCard({ scenario, onChoice }: MomentCardProps) {
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
      {/* Context */}
      <motion.p
        className="text-lg sm:text-xl leading-relaxed text-drift-text/90 mb-10"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        onAnimationComplete={() => setShowChoices(true)}
      >
        {scenario.context}
      </motion.p>

      {/* AI Framing */}
      {showChoices && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm text-drift-muted mb-6 tracking-wide uppercase">
            {scenario.aiFraming}
          </p>

          {/* Choices */}
          <div className="space-y-3">
            {scenario.choices.map((choice, i) => (
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
