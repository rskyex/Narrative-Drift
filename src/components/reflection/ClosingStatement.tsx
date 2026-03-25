"use client";

import { motion } from "framer-motion";

interface ClosingStatementProps {
  userName: string | null;
}

export function ClosingStatement({ userName }: ClosingStatementProps) {
  return (
    <motion.div
      className="space-y-6 text-center max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1.2 }}
    >
      <div className="w-12 h-[1px] bg-drift-border mx-auto" />

      <p className="text-drift-text/70 leading-relaxed text-lg">
        None of these choices felt consequential.
      </p>
      <p className="text-drift-text/70 leading-relaxed text-lg">
        Each one was convenient, reasonable, even helpful.
      </p>
      <p className="text-drift-accent/80 leading-relaxed text-lg font-serif text-xl mt-4">
        That is the point.
      </p>
      <p className="text-drift-muted leading-relaxed text-base mt-6">
        Drift doesn&apos;t announce itself. It accumulates in the ordinary — in the
        playlist you didn&apos;t choose, the reply you didn&apos;t write, the petition
        you signed with someone else&apos;s words.{" "}
        {userName && (
          <>
            The person called {userName} at the end of this experience is not quite
            the same person who began it. The AI that helped you along the way
            is partly responsible for who you became.
          </>
        )}
        {!userName && (
          <>
            The person at the end of this experience is not quite
            the same person who began it. The AI that helped you along the way
            is partly responsible for who you became.
          </>
        )}
      </p>

      <p className="text-drift-muted/50 text-sm mt-8">
        Each micro-concession to convenience is a micro-concession of self.
        Each zone was a chapter. Each chapter changed you. And the AI was there for all of it.
      </p>
    </motion.div>
  );
}
