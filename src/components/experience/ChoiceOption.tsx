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
        "w-full text-left px-6 py-5 rounded-lg border transition-all duration-300",
        "bg-drift-surface/40 border-drift-border/60",
        !disabled && "hover:bg-drift-surface/70 hover:border-drift-accent/25 cursor-pointer",
        selected && "border-drift-accent/40 bg-drift-surface/60",
        disabled && !selected && "cursor-default"
      )}
    >
      <p className="text-lg text-drift-text/90 leading-[1.6]">{choice.label}</p>
      {choice.subtext && (
        <p className="text-drift-text/65 text-base mt-2 leading-[1.6]">
          {choice.subtext}
        </p>
      )}
    </motion.button>
  );
}
