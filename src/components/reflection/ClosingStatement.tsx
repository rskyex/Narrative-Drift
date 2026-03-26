"use client";

import { motion } from "framer-motion";
import Image from "next/image";
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
      {/* Left side — Logo and title, as large as possible */}
      <div className="lg:w-1/2 flex flex-col items-center lg:items-center justify-center lg:sticky lg:top-28 space-y-8">
        <LogoMark size="30vw" />
        <div className="text-center space-y-3">
          <h2 className="wordmark text-5xl sm:text-6xl md:text-7xl text-drift-text">
            Narrative Drift
          </h2>
          <p className="text-lg text-drift-muted italic">
            An interactive exploration of algorithmic influence
          </p>
        </div>
      </div>

      {/* Right side — Closing text */}
      <div className="lg:w-1/2 space-y-8">
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
      className="space-y-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1.2 }}
    >
      <div className="w-16 mx-auto drift-divider" />

      <p className="text-2xl uppercase tracking-[0.3em] text-drift-accent text-center font-serif font-semibold">
        Continue exploring
      </p>

      {/* Project context */}
      <div className="text-center max-w-xl mx-auto">
        <p className="text-base text-drift-text/90 leading-[1.8]">
          Narrative Drift is part of the <span className="text-drift-accent font-semibold">Govern the Human</span> project
          — an initiative exploring how emerging technologies reshape human agency, identity, and governance.
        </p>
      </div>

      {/* Two cards: Govern the Human + Creator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Govern the Human */}
        <a
          href="https://govern-the-human.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="group block border border-drift-border/30 rounded-lg overflow-hidden hover:border-drift-accent/50 transition-all duration-300"
        >
          {/* Thumbnail with OG image + logo overlay */}
          <div className="aspect-[16/9] bg-drift-surface/60 relative overflow-hidden">
            <Image
              src="/govern the human og.png"
              alt="Govern the Human"
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <div className="p-5 space-y-2">
            <h3 className="font-serif text-xl text-drift-text group-hover:text-drift-accent transition-colors">
              Govern the Human
            </h3>
            <p className="text-sm text-drift-text/75 leading-relaxed">
              An exploration of how emerging technologies reshape governance,
              agency, and the boundaries of the human self.
            </p>
          </div>
        </a>

        {/* Creator: Risa Koyanagi */}
        <a
          href="https://risakoyanagi.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="group block border border-drift-border/30 rounded-lg overflow-hidden hover:border-drift-accent/50 transition-all duration-300"
        >
          {/* Thumbnail with OG image + logo overlay */}
          <div className="aspect-[16/9] bg-drift-surface/60 relative overflow-hidden">
            <Image
              src="/risa koyanagi og.png"
              alt="Risa Koyanagi"
              fill
              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <div className="p-5 space-y-2">
            <h3 className="font-serif text-xl text-drift-text group-hover:text-drift-accent transition-colors">
              Creator: Risa Koyanagi
            </h3>
            <p className="text-sm text-drift-text/75 leading-relaxed">
              Risa Koyanagi is a Cambridge Future Scholar working at the intersection
              of space, nuclear, cyber and emerging technology governance.
            </p>
          </div>
        </a>
      </div>

      {/* Return */}
      <div className="text-center">
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
