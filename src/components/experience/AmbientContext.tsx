"use client";

import { motion } from "framer-motion";

interface AmbientContextProps {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
}

const ambientColors: Record<string, string> = {
  morning: "radial-gradient(ellipse at 50% 30%, rgba(180, 160, 120, 0.03) 0%, transparent 70%)",
  afternoon: "radial-gradient(ellipse at 50% 40%, rgba(160, 160, 160, 0.02) 0%, transparent 70%)",
  evening: "radial-gradient(ellipse at 50% 50%, rgba(100, 120, 160, 0.03) 0%, transparent 70%)",
  night: "radial-gradient(ellipse at 50% 60%, rgba(60, 60, 100, 0.04) 0%, transparent 70%)",
};

export function AmbientContext({ timeOfDay }: AmbientContextProps) {
  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      style={{ background: ambientColors[timeOfDay] }}
    />
  );
}
