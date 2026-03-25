"use client";

import { motion } from "framer-motion";

interface DayTransitionProps {
  title: string;
  subtitle: string;
  onComplete: () => void;
}

/**
 * @deprecated Replaced by ZoneIntro component.
 * Kept for backwards compatibility but no longer used in the main flow.
 */
export function DayTransition({ title, subtitle, onComplete }: DayTransitionProps) {
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
        <motion.h2
          className="font-serif text-3xl sm:text-4xl text-drift-text/80 mb-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="text-sm text-drift-muted/60 italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {subtitle}
        </motion.p>
      </div>
    </motion.div>
  );
}
