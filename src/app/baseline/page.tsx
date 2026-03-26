"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore, useHasHydrated } from "@/store/session-store";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { HeroBackground } from "@/components/shared/HeroBackground";
import { FadeIn } from "@/components/shared/FadeIn";
import { TypeWriter } from "@/components/shared/TypeWriter";
import { SubjectPortrait } from "@/components/rpg/SubjectPortrait";
import { LogoMark } from "@/components/shared/LogoMark";
import { DriftAxis } from "@/engine/types";
import { getAxisLabels } from "@/engine/drift-model";
import Image from "next/image";

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

const axisReadings: Record<DriftAxis, Record<string, string>> = {
  autonomy: {
    pos: "Self-directed. You default to your own compass.",
    neg: "Externally guided. You trust the wisdom of others.",
    mid: "Contextual. You choose your frame per-situation.",
  },
  novelty: {
    pos: "Novelty-seeking. The unfamiliar draws you forward.",
    neg: "Depth-seeking. You prefer the known path, deeply walked.",
    mid: "Balanced. You move between the mapped and the unmapped.",
  },
  sociality: {
    pos: "Socially aligned. Others sharpen your thinking.",
    neg: "Independent. Your best work happens in solitude.",
    mid: "Selective. You engage deliberately, not reflexively.",
  },
  tempo: {
    pos: "Optimized. You value speed as a resource.",
    neg: "Deliberate. You give things the time they require.",
    mid: "Adaptive. No fixed tempo — you match the task.",
  },
  affect: {
    pos: "Expressive. You remain open to emotional signal.",
    neg: "Reserved. Feeling deeply and showing it are different.",
    mid: "Measured. A calibrated emotional register.",
  },
};

function getReading(axis: DriftAxis, value: number): string {
  const key = value > 0.08 ? "pos" : value < -0.08 ? "neg" : "mid";
  return axisReadings[axis][key];
}

function getDescriptor(axis: DriftAxis, value: number): string {
  const descriptors: Record<DriftAxis, (v: number) => string> = {
    autonomy: (v) => (v > 0.1 ? "Self-directed" : v < -0.1 ? "Guided" : "Neutral"),
    novelty: (v) => (v > 0.1 ? "Seeking" : v < -0.1 ? "Settled" : "Neutral"),
    sociality: (v) => (v > 0.1 ? "Communal" : v < -0.1 ? "Solitary" : "Neutral"),
    tempo: (v) => (v > 0.1 ? "Accelerated" : v < -0.1 ? "Deliberate" : "Neutral"),
    affect: (v) => (v > 0.1 ? "Expressive" : v < -0.1 ? "Reserved" : "Neutral"),
  };
  return descriptors[axis](value);
}

export default function BaselinePage() {
  const router = useRouter();
  const { baselineProfile, phase, enterZone } = useSessionStore();
  const hasHydrated = useHasHydrated();
  const [stage, setStage] = useState<"intro" | "portrait" | "sheet" | "ready">("intro");

  // Only redirect to landing for phases that precede baseline.
  // Do NOT redirect for forward phases (zone, interlude, etc.) — that would
  // race with the intentional router.push("/experience") in handleProceed.
  useEffect(() => {
    if (!hasHydrated) return;
    if (phase === "landing" || phase === "calibration") {
      router.push("/");
    }
  }, [phase, router, hasHydrated]);

  const handleProceed = useCallback(() => {
    enterZone(1);
    router.push("/experience");
  }, [enterZone, router]);

  if (!hasHydrated || phase !== "baseline") return null;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <HeroBackground />
      <GrainOverlay />

      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-30 px-6 py-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-drift-muted/50">
            <LogoMark size={48} />
            Baseline Self
          </span>
          <span className="text-[10px] font-mono text-drift-accent/50">
            Pre-drift state
          </span>
        </div>
      </div>

      {/* ─── Stage 1: Intro text ─── */}
        {stage === "intro" && (
          <FadeIn key="intro" className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-md">
              <p className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/55 mb-10">
                Calibration Complete
              </p>
              <p className="text-lg text-drift-text/75 leading-[1.8] font-serif">
                <TypeWriter
                  text="This is who you are before anything shifts. Remember this version of yourself. Every departure from this origin will be measured, recorded, and returned to you."
                  speed={30}
                  onComplete={() => setTimeout(() => setStage("portrait"), 1200)}
                />
              </p>
            </div>
          </FadeIn>
        )}

        {/* ─── Stage 2: Portrait reveal ─── */}
        {stage === "portrait" && (
          <FadeIn
            key="portrait"
            className="min-h-screen flex items-center justify-center px-6"
          >
            <div className="flex flex-col items-center">
              {/* Portrait with scan frame */}
              <div className="relative">
                {/* Corner brackets — larger for baseline */}
                <div className="absolute -inset-6 pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,10 L0,0 L10,0" fill="none" stroke="currentColor" className="text-drift-accent/20" strokeWidth="0.4" />
                    <path d="M90,0 L100,0 L100,10" fill="none" stroke="currentColor" className="text-drift-accent/20" strokeWidth="0.4" />
                    <path d="M100,90 L100,100 L90,100" fill="none" stroke="currentColor" className="text-drift-accent/20" strokeWidth="0.4" />
                    <path d="M10,100 L0,100 L0,90" fill="none" stroke="currentColor" className="text-drift-accent/20" strokeWidth="0.4" />
                  </svg>
                </div>

                  <Image
                  src="/baseline.png"
                  alt="Baseline self"
                  width={320}
                  height={320}
                  className="rounded-sm object-cover"
                />
              </div>

              {/* Label beneath portrait */}
              <div className="mt-6 text-center fade-in-up" style={{ animationDelay: "1s" }}>
                <p className="text-[10px] uppercase tracking-[0.25em] text-drift-accent/60">
                  Origin State Recorded
                </p>
              </div>

              {/* Continue to sheet */}
              <button
                className="mt-10 text-drift-text/70 hover:text-drift-text text-sm tracking-[0.25em] uppercase transition-all duration-300 py-3 px-10 border border-drift-border/50 hover:border-drift-accent/60 hover:bg-drift-surface/40 rounded fade-in-up"
                style={{ animationDelay: "2s" }}
                onClick={() => setStage("sheet")}
              >
                Examine the profile
              </button>
            </div>
          </FadeIn>
        )}

        {/* ─── Stage 3: Full subject sheet ─── */}
        {stage === "sheet" && (
          <FadeIn
            key="sheet"
            className="min-h-screen pt-20 pb-16 px-4 sm:px-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:gap-16 xl:gap-20 items-start">
                {/* ─── Left column: Portrait + meta ─── */}
                <div className="lg:w-[280px] flex-shrink-0 flex flex-col items-center lg:sticky lg:top-24 mb-10 lg:mb-0 w-full">
                  <div className="relative">
                    <div className="absolute -inset-4 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,10 L0,0 L10,0" fill="none" stroke="currentColor" className="text-drift-accent/15" strokeWidth="0.5" />
                        <path d="M90,0 L100,0 L100,10" fill="none" stroke="currentColor" className="text-drift-accent/15" strokeWidth="0.5" />
                        <path d="M100,90 L100,100 L90,100" fill="none" stroke="currentColor" className="text-drift-accent/15" strokeWidth="0.5" />
                        <path d="M10,100 L0,100 L0,90" fill="none" stroke="currentColor" className="text-drift-accent/15" strokeWidth="0.5" />
                      </svg>
                    </div>
                    <Image
                      src="/baseline.png"
                      alt="Baseline self"
                      width={260}
                      height={260}
                      className="rounded-sm object-cover"
                    />
                  </div>

                  <div className="mt-6 text-center space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-drift-accent/60">
                      Subject Baseline
                    </p>
                    <p className="text-[9px] font-mono text-drift-muted/50">
                      Pre-drift · Zone 0
                    </p>
                  </div>
                </div>

                {/* ─── Right column: Subject sheet ─── */}
                <div className="flex-1 w-full">
                  {/* Sheet header */}
                  <div
                    className="pb-5 mb-10 fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <h1 className="text-[11px] uppercase tracking-[0.3em] text-drift-muted/65 mb-3">
                      Subject Profile — Pre-Drift State
                    </h1>
                    <div className="drift-divider" />
                  </div>

                  {/* Axis readings */}
                  <div className="space-y-7">
                    {AXES.map((axis, i) => {
                      const value = baselineProfile[axis];
                      const pct = 50 + value * 50;
                      const [leftLabel, rightLabel] = getAxisLabels(axis);
                      const descriptor = getDescriptor(axis, value);
                      const reading = getReading(axis, value);

                      return (
                        <div
                          key={axis}
                          className="fade-in-up"
                          style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                        >
                          <div className="flex items-baseline justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-sm uppercase tracking-[0.2em] text-drift-text/85 font-medium">
                                {axis}
                              </span>
                              <span className="text-xs font-mono text-drift-accent/75">
                                {descriptor}
                              </span>
                            </div>
                            <span className="text-xs font-mono text-drift-muted/70">
                              {value > 0 ? "+" : ""}
                              {(value * 100).toFixed(0)}
                            </span>
                          </div>

                          {/* Bar */}
                          <div className="relative h-[2px] bg-drift-border/30 rounded-full mb-2">
                            <div className="absolute left-1/2 top-1/2 w-[1px] h-3 bg-drift-muted/15 -translate-x-1/2 -translate-y-1/2" />
                            <motion.div
                              className="absolute top-1/2 w-2 h-2 bg-drift-accent/80 rounded-full -translate-y-1/2 -translate-x-1/2"
                              initial={{ left: "50%" }}
                              animate={{ left: `${pct}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + i * 0.12, ease: "easeOut" }}
                            />
                          </div>

                          <div className="flex justify-between mb-2">
                            <span className="text-xs text-drift-text/60">{leftLabel}</span>
                            <span className="text-xs text-drift-text/60">{rightLabel}</span>
                          </div>

                          {/* Reading description */}
                          <p className="text-sm text-drift-text/70 leading-[1.7]">
                            {reading}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <div
                    className="mt-12 pt-8 fade-in-up"
                    style={{ animationDelay: "1.4s" }}
                  >
                    <div className="drift-divider mb-8" />
                    <p className="text-xs text-drift-muted/55 leading-[1.8] mb-10 max-w-md">
                      This is your origin state. The encounters ahead will apply quiet pressure
                      to each axis — through convenience, through framing, through the architecture
                      of choice itself. How you respond will determine how far you drift.
                    </p>

                    <button
                      onClick={handleProceed}
                      className="text-drift-text/70 hover:text-drift-text text-sm tracking-[0.25em] uppercase transition-all duration-300 py-3 px-10 border border-drift-border/50 hover:border-drift-accent/60 hover:bg-drift-surface/40 rounded fade-in-up"
                      style={{ animationDelay: "2s" }}
                    >
                      Enter the first zone
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
    </main>
  );
}
