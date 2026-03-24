"use client";

import { motion } from "framer-motion";
import { useSessionStore } from "@/store/session-store";
import { getTotalEncounters } from "@/engine/narrative-engine";

export function ProgressThread() {
  const choiceCount = useSessionStore((s) => s.choiceHistory.length);
  const total = getTotalEncounters();
  const progress = (choiceCount / total) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-[2px] bg-drift-border/30">
      <motion.div
        className="h-full bg-drift-accent/40"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </div>
  );
}
