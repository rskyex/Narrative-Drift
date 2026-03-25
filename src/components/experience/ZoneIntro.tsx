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
          className="text-[10px] uppercase tracking-[0.4em] text-drift-muted/30 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Zone {toRoman(zone.id)}
        </motion.p>

        {/* Zone title */}
        <motion.h2
          className="font-serif text-4xl sm:text-5xl text-drift-text/85 mb-3 tracking-[-0.01em]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {zone.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-sm text-drift-muted/50 italic mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {zone.subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-sm text-drift-muted/40 leading-[1.8] mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {zone.description}
        </motion.p>

        {/* Divider */}
        <motion.div
          className="w-16 mx-auto mb-8 drift-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        />

        {/* Epigraph */}
        <motion.p
          className="text-[13px] text-drift-accent/35 italic font-serif leading-[1.7] max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
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
