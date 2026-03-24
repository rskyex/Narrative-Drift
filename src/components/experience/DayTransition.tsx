"use client";

import { motion } from "framer-motion";

interface DayTransitionProps {
  day: number;
  dayName: string;
  onComplete: () => void;
}

export function DayTransition({ day, dayName, onComplete }: DayTransitionProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 1800);
      }}
    >
      <div className="text-center">
        <motion.p
          className="font-serif text-4xl sm:text-5xl text-drift-text/80"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Day {day}
        </motion.p>
        <motion.p
          className="text-drift-muted text-lg mt-3 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {dayName}
        </motion.p>
      </div>
    </motion.div>
  );
}
