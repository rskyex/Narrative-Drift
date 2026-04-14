"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ArchetypeRow {
  final_result: string;
  n: number;
  pct: number;
}

interface CollectiveContextProps {
  currentArchetype: string;
}

export function CollectiveContext({ currentArchetype }: CollectiveContextProps) {
  const [distribution, setDistribution] = useState<ArchetypeRow[] | null>(null);

  useEffect(() => {
    fetch("/api/collective")
      .then((res) => res.json())
      .then((data) => {
        if (data.distribution) {
          setDistribution(data.distribution);
        }
      })
      .catch(() => {
        // Silently fail — component renders nothing
      });
  }, []);

  if (!distribution) return null;

  const totalSessions = distribution.reduce((sum, row) => sum + row.n, 0);
  if (totalSessions < 10) return null;

  const currentRow = distribution.find(
    (row) => row.final_result === currentArchetype
  );

  return (
    <motion.div
      className="mt-12 space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2, duration: 1 }}
    >
      <div className="drift-divider" />

      <p className="text-xs uppercase tracking-[0.25em] text-drift-text/50">
        Among those who came before
      </p>

      {currentRow && (
        <p className="text-sm text-drift-accent tracking-wide">
          {currentArchetype} — {currentRow.pct}% of all subjects
        </p>
      )}

      <div className="space-y-1.5 pt-1">
        {distribution.map((row) => {
          const isCurrent = row.final_result === currentArchetype;
          return (
            <p
              key={row.final_result}
              className={`text-sm font-mono ${
                isCurrent
                  ? "text-drift-accent"
                  : "text-drift-text/60"
              }`}
            >
              {row.final_result}
              <span className="text-drift-text/40 ml-3">
                {row.pct}%
              </span>
            </p>
          );
        })}
      </div>

      <p className="text-xs text-drift-text/50 pt-2">
        {totalSessions} journeys recorded
      </p>
    </motion.div>
  );
}
