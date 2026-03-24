"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/store/session-store";
import { calibrationPrompts } from "@/engine/calibration";
import { Choice } from "@/engine/types";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { CalibrationPrompt } from "@/components/calibration/CalibrationPrompt";
import { FadeIn } from "@/components/shared/FadeIn";
import { TypeWriter } from "@/components/shared/TypeWriter";
import { useState } from "react";

export default function CalibrationPage() {
  const router = useRouter();
  const {
    calibrationIndex,
    makeCalibrationChoice,
    completeCalibration,
    phase,
  } = useSessionStore();
  const [showPrompts, setShowPrompts] = useState(false);

  useEffect(() => {
    if (phase !== "calibration") {
      router.push("/");
    }
  }, [phase, router]);

  const handleChoice = useCallback(
    (choice: Choice) => {
      makeCalibrationChoice(choice);

      // Check if calibration is complete
      if (calibrationIndex + 1 >= calibrationPrompts.length) {
        setTimeout(() => {
          completeCalibration();
          router.push("/baseline");
        }, 800);
      }
    },
    [calibrationIndex, makeCalibrationChoice, completeCalibration, router]
  );

  const currentPrompt = calibrationPrompts[calibrationIndex];
  if (!currentPrompt || phase !== "calibration") return null;

  return (
    <main className="relative min-h-screen flex items-center justify-center py-20">
      <GrainOverlay />

      <div className="relative z-10 w-full">
        <AnimatePresence mode="wait">
          {!showPrompts ? (
            <FadeIn key="intro" className="text-center max-w-xl mx-auto px-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/40 mb-8">
                Subject Calibration
              </p>
              <p className="text-lg text-drift-text/70 leading-relaxed font-serif">
                <TypeWriter
                  text="Before the experience begins, we need to establish who you are. Not who you think you should be. Who you are, today, in the small decisions."
                  speed={30}
                  onComplete={() => setTimeout(() => setShowPrompts(true), 1200)}
                />
              </p>
            </FadeIn>
          ) : (
            <CalibrationPrompt
              key={`cal-${currentPrompt.id}`}
              prompt={currentPrompt}
              index={calibrationIndex}
              total={calibrationPrompts.length}
              onChoice={handleChoice}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-[2px] bg-drift-border/30">
        <div
          className="h-full bg-drift-accent/40 transition-all duration-800 ease-out"
          style={{
            width: `${(calibrationIndex / calibrationPrompts.length) * 100}%`,
          }}
        />
      </div>
    </main>
  );
}
