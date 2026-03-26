"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useSessionStore, useHasHydrated } from "@/store/session-store";
import { calibrationPrompts } from "@/engine/calibration";
import { applyDrift, getAxisLabels } from "@/engine/drift-model";
import { Choice, DriftAxis, DriftProfile } from "@/engine/types";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { HeroBackground } from "@/components/shared/HeroBackground";
import { LogoMark } from "@/components/shared/LogoMark";
import { FadeIn } from "@/components/shared/FadeIn";
import { TypeWriter } from "@/components/shared/TypeWriter";
import { cn } from "@/lib/utils";
import Image from "next/image";

const ALL_AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

export default function CalibrationPage() {
  const router = useRouter();
  const {
    calibrationIndex,
    currentProfile,
    makeCalibrationChoice,
    completeCalibration,
    phase,
  } = useSessionStore();

  const hasHydrated = useHasHydrated();
  const [stage, setStage] = useState<"intro" | "active">("intro");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewProfile, setPreviewProfile] = useState<DriftProfile | null>(null);

  // Only redirect to landing if the user hasn't reached calibration yet.
  // Do NOT redirect for forward phases (baseline, zone, etc.) — that would
  // race with the intentional router.push("/baseline") in handleChoice.
  useEffect(() => {
    if (!hasHydrated) return;
    if (phase === "landing") {
      router.push("/");
    }
  }, [phase, router, hasHydrated]);

  // Reset selection state when calibration index changes
  useEffect(() => {
    setSelectedId(null);
    setPreviewProfile(null);
  }, [calibrationIndex]);

  const currentPrompt = calibrationPrompts[calibrationIndex];
  const calibratedAxes = useMemo(
    () => calibrationPrompts.slice(0, calibrationIndex).map((p) => p.axis),
    [calibrationIndex]
  );

  const handleHover = useCallback(
    (choice: Choice | null) => {
      if (selectedId) return;
      if (!choice) {
        setPreviewProfile(null);
        return;
      }
      setPreviewProfile(applyDrift(currentProfile, choice.driftVectors));
    },
    [currentProfile, selectedId]
  );

  const handleChoice = useCallback(
    (choice: Choice) => {
      setSelectedId(choice.id);
      setPreviewProfile(null);

      setTimeout(() => {
        makeCalibrationChoice(choice);

        if (calibrationIndex + 1 >= calibrationPrompts.length) {
          setTimeout(() => {
            completeCalibration();
            router.push("/baseline");
          }, 600);
        }
      }, 500);
    },
    [calibrationIndex, makeCalibrationChoice, completeCalibration, router]
  );

  if (!hasHydrated || !currentPrompt || phase !== "calibration") return null;

  const displayProfile = previewProfile ?? currentProfile;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <HeroBackground />
      <GrainOverlay />

      {/* Top progress rail */}
      <div className="fixed top-0 left-0 right-0 z-40 h-[1px] bg-drift-border/20">
        <motion.div
          className="h-full bg-drift-accent/50"
          animate={{ width: `${(calibrationIndex / calibrationPrompts.length) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-30 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-drift-accent/70">
            <span className="hidden md:block"><LogoMark size={48} /></span>
            <span className="hidden md:inline">Subject Calibration</span>
          </span>
          <span className="text-[10px] font-mono text-drift-accent/70">
            {calibrationIndex + 1} / {calibrationPrompts.length}
          </span>
        </div>
      </div>

      {stage === "intro" ? (
          <FadeIn key="intro" className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-lg">
              <div className="w-8 h-[1px] bg-drift-accent/30 mx-auto mb-8" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/55 mb-10">
                Baseline Calibration
              </p>
              <p className="text-lg text-drift-text/75 leading-[1.8] font-serif">
                <TypeWriter
                  text="Before we begin, I need to understand who you are. Five questions. Answer honestly — not who you aspire to be, but who you are in the small, unwitnessed moments where character reveals itself."
                  speed={28}
                  onComplete={() => setTimeout(() => setStage("active"), 1400)}
                />
              </p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn
            key="active"
            className="min-h-screen pt-16 pb-12 px-4 sm:px-6"
          >
            <div className="max-w-6xl mx-auto h-full flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-20 min-h-[calc(100vh-7rem)]">
              {/* ─── LEFT: Subject Preview ─── */}
              <div className="lg:w-[340px] xl:w-[380px] flex-shrink-0 flex flex-col items-center lg:items-center py-6 lg:py-0">
                {/* Portrait with scan frame */}
                <div className="relative">
                  {/* Corner brackets */}
                  <div className="absolute -inset-4 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,12 L0,0 L12,0" fill="none" stroke="currentColor" className="text-drift-accent/15" strokeWidth="0.5" />
                      <path d="M88,0 L100,0 L100,12" fill="none" stroke="currentColor" className="text-drift-accent/15" strokeWidth="0.5" />
                      <path d="M100,88 L100,100 L88,100" fill="none" stroke="currentColor" className="text-drift-accent/15" strokeWidth="0.5" />
                      <path d="M12,100 L0,100 L0,88" fill="none" stroke="currentColor" className="text-drift-accent/15" strokeWidth="0.5" />
                    </svg>
                  </div>

                  <motion.div
                    key="portrait"
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Image
                      src="/baseline.png"
                      alt="Subject portrait"
                      width={280}
                      height={280}
                      className="rounded-sm object-cover"
                    />
                  </motion.div>
                </div>

                {/* Live axis readout */}
                <div className="mt-6 w-full max-w-[300px] space-y-3">
                  {ALL_AXES.map((axis) => {
                    const isCalibrated = calibratedAxes.includes(axis);
                    const isActive = currentPrompt.axis === axis;
                    const value = displayProfile[axis];
                    const pct = 50 + value * 50;
                    const [leftLabel, rightLabel] = getAxisLabels(axis);

                    return (
                      <motion.div
                        key={axis}
                        className={cn(
                          "transition-opacity duration-500",
                          isCalibrated || isActive ? "opacity-100" : "opacity-30"
                        )}
                        layout
                      >
                        <div className="flex items-baseline justify-between mb-1">
                          <span
                            className={cn(
                              "text-sm uppercase tracking-wider font-medium",
                              isActive ? "text-drift-accent" : "text-drift-text/70"
                            )}
                          >
                            {axis}
                          </span>
                          {(isCalibrated || isActive) && (
                            <motion.span
                              className="text-xs font-mono text-drift-accent/80"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              {value > 0 ? "+" : ""}
                              {(value * 100).toFixed(0)}
                            </motion.span>
                          )}
                        </div>
                        <div className="relative h-[2px] bg-drift-border/40 rounded-full">
                          <div className="absolute left-1/2 top-1/2 w-[1px] h-2 bg-drift-muted/20 -translate-x-1/2 -translate-y-1/2" />
                          {(isCalibrated || (isActive && previewProfile)) && (
                            <motion.div
                              className={cn(
                                "absolute top-1/2 w-2 h-2 rounded-full -translate-y-1/2 -translate-x-1/2",
                                isActive && previewProfile
                                  ? "bg-drift-accent/60"
                                  : "bg-drift-accent/80"
                              )}
                              initial={{ left: "50%" }}
                              animate={{ left: `${pct}%` }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                            />
                          )}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-drift-text/60">{leftLabel}</span>
                          <span className="text-xs text-drift-text/60">{rightLabel}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* ─── RIGHT: Calibration Prompt ─── */}
              <div className="flex-1 flex items-center min-h-0 py-6 lg:py-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPrompt.id}
                    className="w-full max-w-xl"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Axis being calibrated */}
                    <div className="flex items-center gap-3 mb-10">
                      <div className="w-8 h-[1px] bg-drift-accent/25" />
                      <span className="text-xs uppercase tracking-[0.25em] text-drift-accent/80">
                        Calibrating: {currentPrompt.axis}
                      </span>
                    </div>

                    {/* Context */}
                    <p className="text-base text-drift-text/65 leading-[1.7] mb-5 max-w-md">
                      {currentPrompt.context}
                    </p>

                    {/* Prompt */}
                    <h2 className="font-serif text-xl sm:text-2xl text-drift-text/90 mb-12 leading-[1.5]">
                      {currentPrompt.prompt}
                    </h2>

                    {/* Choices */}
                    <div className="space-y-2">
                      {currentPrompt.choices.map((choice, i) => {
                        const isSelected = selectedId === choice.id;
                        const isDisabled = selectedId !== null;

                        return (
                          <motion.button
                            key={choice.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{
                              opacity: isDisabled && !isSelected ? 0.25 : 1,
                              y: 0,
                            }}
                            transition={{ duration: 0.35, delay: i * 0.08 }}
                            onClick={() => handleChoice(choice)}
                            onMouseEnter={() => handleHover(choice)}
                            onMouseLeave={() => handleHover(null)}
                            disabled={isDisabled}
                            className={cn(
                              "w-full text-left px-5 py-4 rounded border transition-all duration-300 group",
                              "bg-transparent border-drift-border/30",
                              !isDisabled && "hover:border-drift-accent/30 hover:bg-drift-surface/40 cursor-pointer",
                              isSelected && "border-drift-accent/50 bg-drift-surface/50",
                              isDisabled && !isSelected && "cursor-default"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              {/* Selection indicator */}
                              <div className={cn(
                                "mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-300",
                                isSelected ? "bg-drift-accent/80" : "bg-drift-border/40",
                                !isDisabled && "group-hover:bg-drift-accent/40"
                              )} />
                              <div>
                                <p className="text-drift-text/90 text-sm leading-relaxed">
                                  {choice.label}
                                </p>
                                {choice.subtext && (
                                  <p className="text-drift-text/55 text-sm mt-1 leading-relaxed">
                                    {choice.subtext}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </FadeIn>
        )}
    </main>
  );
}
