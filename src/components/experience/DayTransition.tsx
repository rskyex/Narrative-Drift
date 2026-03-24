"use client";

import { motion } from "framer-motion";
import { Chapter } from "@/engine/types";

interface DayTransitionProps {
  day: number;
  dayName: string;
  chapter: Chapter;
  onComplete: () => void;
}

export function DayTransition({ day, dayName, chapter, onComplete }: DayTransitionProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 3200);
      }}
    >
      <div className="text-center max-w-lg mx-auto px-6">
        {/* Chapter number */}
        <motion.p
          className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/40 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Chapter {toRoman(chapter.number)}
        </motion.p>

        {/* Chapter title */}
        <motion.h2
          className="font-serif text-3xl sm:text-4xl text-drift-text/80 mb-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {chapter.title}
        </motion.h2>

        {/* Day / Zone */}
        <motion.div
          className="flex items-center justify-center gap-3 text-drift-muted/60 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <span className="text-sm">{dayName}</span>
          <span className="w-1 h-1 rounded-full bg-drift-muted/30" />
          <span className="text-sm italic">{chapter.zone}</span>
        </motion.div>

        {/* Zone description */}
        <motion.p
          className="text-sm text-drift-muted/40 leading-relaxed mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {chapter.zoneDescription}
        </motion.p>

        {/* Epigraph */}
        <motion.p
          className="text-xs text-drift-accent/40 italic font-serif leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          &ldquo;{chapter.epigraph}&rdquo;
        </motion.p>
      </div>
    </motion.div>
  );
}

function toRoman(num: number): string {
  const numerals: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  let remaining = num;
  for (const [value, symbol] of numerals) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}
