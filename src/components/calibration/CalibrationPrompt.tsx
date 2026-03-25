"use client";

import { motion } from "framer-motion";
import { CalibrationPrompt as CalibrationPromptType, Choice } from "@/engine/types";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CalibrationPromptProps {
  prompt: CalibrationPromptType;
  index: number;
  total: number;
  onChoice: (choice: Choice) => void;
}

export function CalibrationPrompt({
  prompt,
  index,
  total,
  onChoice,
}: CalibrationPromptProps) {
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
      {/* Progress indicator */}
      <motion.div
        className="mb-10 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-8 h-[1px] bg-drift-border" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-drift-muted/40">
          Calibration {index + 1} of {total}
        </span>
        <div className="flex-1 h-[1px] bg-drift-border/30" />
      </motion.div>

      {/* Context */}
      <motion.p
        className="text-sm text-drift-muted/50 leading-relaxed mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {prompt.context}
      </motion.p>

      {/* Main prompt */}
      <motion.h2
        className="font-serif text-2xl sm:text-3xl text-drift-text/90 mb-10 leading-relaxed"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {prompt.prompt}
      </motion.h2>

      {/* Choices */}
      <div className="space-y-3">
        {prompt.choices.map((choice, i) => (
          <motion.button
            key={choice.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: selectedId === null ? 1 : selectedId === choice.id ? 1 : 0.3,
              y: 0,
              scale: selectedId === choice.id ? 1.01 : 1,
            }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
            onClick={() => handleChoice(choice)}
            disabled={selectedId !== null}
            className={cn(
              "w-full text-left p-5 rounded-lg border transition-all duration-300",
              "bg-drift-surface/50 border-drift-border",
              selectedId === null && "hover:bg-drift-surface hover:border-drift-accent/20 cursor-pointer",
              selectedId === choice.id && "border-drift-accent/40 bg-drift-surface",
              selectedId !== null && selectedId !== choice.id && "cursor-default"
            )}
          >
            <p className="text-drift-text/90 leading-relaxed">{choice.label}</p>
            {choice.subtext && (
              <p className="text-drift-muted text-sm mt-1.5 leading-relaxed">
                {choice.subtext}
              </p>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
