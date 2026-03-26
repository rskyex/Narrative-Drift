"use client";

import { motion } from "framer-motion";
import { LogoMark } from "@/components/shared/LogoMark";

interface ClosingStatementProps {
  userName: string | null;
}

export function ClosingStatement({ userName }: ClosingStatementProps) {
  return (
    <motion.div
      className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1.5 }}
    >
      {/* Left side — Logo and title */}
      <div className="lg:w-1/3 flex flex-col items-center lg:items-start lg:sticky lg:top-28 space-y-6">
        <LogoMark size={80} className="text-drift-accent/80" />
        <div className="text-center lg:text-left space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl text-drift-text/90 tracking-[-0.01em]">
            Narrative Drift
          </h2>
          <p className="text-sm text-drift-muted/80 italic">
            An interactive exploration of algorithmic influence
          </p>
        </div>
      </div>

      {/* Right side — Closing text */}
      <div className="lg:w-2/3 space-y-8">
        <p className="text-drift-text/90 leading-[1.8] text-lg">
          Not one of these choices felt consequential in the moment.
        </p>
        <p className="text-drift-text/90 leading-[1.8] text-lg">
          Each was convenient. Reasonable. Even, at times, helpful.
        </p>
        <p className="text-drift-accent/90 leading-[1.6] font-serif text-2xl mt-6">
          That is precisely the mechanism.
        </p>
        <p className="text-drift-text/85 leading-[1.8] text-[15px] mt-8">
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

        <p className="text-drift-text/75 text-sm mt-10 leading-[1.8]">
          Each micro-concession to convenience is a micro-transfer of self.
          The drift was never dramatic. It did not need to be.
        </p>
      </div>
    </motion.div>
  );
}

/** Final credits page with navigation links */
export function ClosingCredits({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.div
      className="space-y-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1.2 }}
    >
      <div className="w-16 mx-auto drift-divider" />

      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.3em] text-drift-text/60">
          Continue exploring
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://governthehuman.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-drift-text/70 hover:text-drift-text text-sm tracking-[0.25em] uppercase transition-all duration-300 py-3 px-10 border border-drift-border/50 hover:border-drift-accent/60 hover:bg-drift-surface/40 rounded"
          >
            Govern the Human
          </a>
          <a
            href="https://rskyex.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-drift-text/70 hover:text-drift-text text-sm tracking-[0.25em] uppercase transition-all duration-300 py-3 px-10 border border-drift-border/50 hover:border-drift-accent/60 hover:bg-drift-surface/40 rounded"
          >
            Creator
          </a>
        </div>
      </div>

      <div>
        <button
          onClick={onRestart}
          className="text-drift-text/50 hover:text-drift-text/70 text-xs tracking-[0.25em] uppercase transition-all duration-300 py-2 px-8"
        >
          Return to origin
        </button>
      </div>
    </motion.div>
  );
}
