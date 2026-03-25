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
          <div className="absolute inset-0 bg-drift-bg/70" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(10, 10, 10, 0.5) 100%)",
            }}
          />
        </motion.div>
      )}

      <div className="relative z-10 text-center max-w-xl mx-auto px-6">
        {/* Transition copy */}
        {transitionCopy && (
          <motion.p
            className="text-xs uppercase tracking-[0.35em] text-drift-accent/70 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            {transitionCopy}
          </motion.p>
        )}

        {/* Zone number */}
        <motion.p
          className="text-sm uppercase tracking-[0.4em] text-drift-muted/70 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Zone {toRoman(zone.id)}
        </motion.p>

        {/* Zone title */}
        <motion.h2
          className="font-serif text-5xl sm:text-6xl text-drift-text/90 mb-4 tracking-[-0.01em]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {zone.title}
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-base text-drift-muted/75 italic mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {zone.subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-base text-drift-text/70 leading-[1.8] mb-10"
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
          className="text-base text-drift-accent/70 italic font-serif leading-[1.7] max-w-sm mx-auto mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          &ldquo;{zone.epigraph}&rdquo;
        </motion.p>

        {/* Continue button — replaces auto-advance */}
        <motion.button
          className="text-drift-muted/70 hover:text-drift-text text-sm tracking-[0.25em] uppercase transition-colors duration-500 py-3 px-10 border border-drift-border/30 hover:border-drift-accent/40 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8, duration: 0.8 }}
          onClick={onComplete}
        >
          Enter Zone
        </motion.button>
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
