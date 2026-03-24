"use client";

import { motion } from "framer-motion";
import { Choice } from "@/engine/types";
import { cn } from "@/lib/utils";

interface ChoiceOptionProps {
  choice: Choice;
  index: number;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

export function ChoiceOption({
  choice,
  index,
  selected,
  disabled,
  onSelect,
}: ChoiceOptionProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: selected ? 1 : disabled ? 0.3 : 1,
        y: 0,
        scale: selected ? 1.01 : 1,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.12,
      }}
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "w-full text-left p-5 rounded-lg border transition-all duration-300",
        "bg-drift-surface/50 border-drift-border",
        !disabled && "hover:bg-drift-surface hover:border-drift-accent/20 cursor-pointer",
        selected && "border-drift-accent/40 bg-drift-surface",
        disabled && !selected && "cursor-default"
      )}
    >
      <p className="text-drift-text/90 leading-relaxed">{choice.label}</p>
      {choice.subtext && (
        <p className="text-drift-muted text-sm mt-1.5 leading-relaxed">
          {choice.subtext}
        </p>
      )}
    </motion.button>
  );
}
