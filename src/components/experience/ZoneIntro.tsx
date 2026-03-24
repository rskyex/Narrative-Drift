"use client";

import { motion } from "framer-motion";
import { Zone } from "@/engine/types";

interface ZoneIntroProps {
  zone: Zone;
  onComplete: () => void;
}

export function ZoneIntro({ zone, onComplete }: ZoneIntroProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 4500);
      }}
    >
      <div className="text-center max-w-lg mx-auto px-6">
        {/* Zone number */}
        <motion.p
          className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/40 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Zone {toRoman(zone.id)}
        </motion.p>

        {/* Zone title */}
        <motion.h2
          className="font-serif text-3xl sm:text-4xl text-drift-text/80 mb-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {zone.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-sm text-drift-muted/60 italic mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {zone.subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-sm text-drift-muted/40 leading-relaxed mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {zone.description}
        </motion.p>

        {/* Divider */}
        <motion.div
          className="w-12 h-[1px] bg-drift-border mx-auto mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        />

        {/* Epigraph */}
        <motion.p
          className="text-xs text-drift-accent/40 italic font-serif leading-relaxed max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          &ldquo;{zone.epigraph}&rdquo;
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
