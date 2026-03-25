"use client";

import { motion } from "framer-motion";

interface ClosingStatementProps {
  userName: string | null;
}

export function ClosingStatement({ userName }: ClosingStatementProps) {
  return (
    <motion.div
      className="space-y-8 text-center max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1.5 }}
    >
      <div className="w-16 mx-auto drift-divider" />

      <p className="text-drift-text/80 leading-[1.8] text-lg">
        Not one of these choices felt consequential in the moment.
      </p>
      <p className="text-drift-text/80 leading-[1.8] text-lg">
        Each was convenient. Reasonable. Even, at times, helpful.
      </p>
      <p className="text-drift-accent/70 leading-[1.6] font-serif text-2xl mt-6">
        That is precisely the mechanism.
      </p>
      <p className="text-drift-muted/80 leading-[1.8] text-[15px] mt-8">
        Drift does not announce itself. It accumulates in the ordinary — in the
        playlist you didn&apos;t select, the reply you didn&apos;t compose, the petition
        you signed in someone else&apos;s voice.{" "}
        {userName && (
          <>
            The person called {userName} who exits this experience is not quite
            the person who entered it. The distance between them was not chosen.
            It was accumulated — with the quiet assistance of systems designed to be accepted.
          </>
        )}
        {!userName && (
          <>
            The person who exits this experience is not quite
            the person who entered it. The distance between them was not chosen.
            It was accumulated — with the quiet assistance of systems designed to be accepted.
          </>
        )}
      </p>

      <p className="text-drift-muted/60 text-sm mt-10 leading-[1.8]">
        Each micro-concession to convenience is a micro-transfer of self.
        The drift was never dramatic. It did not need to be.
      </p>
    </motion.div>
  );
}
