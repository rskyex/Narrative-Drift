"use client";

import { motion } from "framer-motion";
import { Zone } from "@/engine/types";
import Image from "next/image";

interface ZoneIntroProps {
  zone: Zone;
  onComplete: () => void;
}

/**
 * Map zone IDs to their transition images.
 * transition-1 = entering Zone 1 (after baseline)
 * transition-2 = entering Zone 2
 * transition-4 = entering Zone 3 (transition-3 not present; transition-4 used)
 */
const ZONE_TRANSITION_IMAGE: Record<number, string> = {
  1: "/transition-1.png",
  2: "/transition-2.png",
  3: "/transition-4.png",
};

const ZONE_TRANSITION_COPY: Record<number, string> = {
  1: "Rendering the first environment",
  2: "Updating the conditions of choice",
  3: "Recalibrating the subject model",
};

export function ZoneIntro({ zone, onComplete }: ZoneIntroProps) {
  const transitionImage = ZONE_TRANSITION_IMAGE[zone.id];
  const transitionCopy = ZONE_TRANSITION_COPY[zone.id];

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
      {/* Transition image — atmospheric backdrop */}
      {transitionImage && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <Image
            src={transitionImage}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-drift-bg/75" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(10, 10, 10, 0.5) 100%)",
            }}
          />
        </motion.div>
      )}

      <div className="relative z-10 text-center max-w-lg mx-auto px-6">
        {/* Transition copy */}
        {transitionCopy && (
          <motion.p
            className="text-[9px] uppercase tracking-[0.35em] text-drift-accent/50 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            {transitionCopy}
          </motion.p>
        )}

        {/* Zone number */}
        <motion.p
          className="text-[10px] uppercase tracking-[0.4em] text-drift-muted/50 mb-8"
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
          className="text-sm text-drift-muted/65 italic mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {zone.subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-sm text-drift-muted/60 leading-[1.8] mb-10"
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
          className="text-[13px] text-drift-accent/55 italic font-serif leading-[1.7] max-w-sm mx-auto"
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
