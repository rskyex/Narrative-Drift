"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/store/session-store";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { FadeIn } from "@/components/shared/FadeIn";
import { TypeWriter } from "@/components/shared/TypeWriter";
import { SubjectPortrait } from "@/components/rpg/SubjectPortrait";
import { DriftAxis } from "@/engine/types";
import { getAxisLabels } from "@/engine/drift-model";
import { useState } from "react";

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

function baselineReading(axis: DriftAxis, value: number): string {
  const descriptions: Record<DriftAxis, Record<string, string>> = {
    autonomy: {
      pos: "You lean toward self-direction. Decisions feel like they belong to you.",
      neg: "You're comfortable accepting guidance. Good information deserves trust.",
      mid: "No strong lean. You adapt your approach to the situation.",
    },
    novelty: {
      pos: "You gravitate toward the unfamiliar. Known territory feels like limitation.",
      neg: "You value the well-mapped path. Depth over breadth.",
      mid: "A balance between the known and the new.",
    },
    sociality: {
      pos: "Others activate something in you. Connection is generative.",
      neg: "Your clearest thinking happens alone. Solitude is productive.",
      mid: "Selective engagement. Neither isolated nor immersed.",
    },
    tempo: {
      pos: "You favor speed. Time saved is time recovered.",
      neg: "You favor duration. Things worth doing deserve their full time.",
      mid: "No strong temporal bias. Speed and care as needed.",
    },
    affect: {
      pos: "Emotionally open. You stay receptive to what arrives.",
      neg: "Emotionally conservative. Feeling deeply doesn't require showing it.",
      mid: "A measured emotional register.",
    },
  };

  const key = value > 0.08 ? "pos" : value < -0.08 ? "neg" : "mid";
  return descriptions[axis][key];
}

export default function BaselinePage() {
  const router = useRouter();
  const { baselineProfile, userName, phase, enterZone } = useSessionStore();
  const [stage, setStage] = useState<"intro" | "reveal" | "ready">("intro");

  useEffect(() => {
    if (phase !== "baseline") {
      router.push("/");
    }
  }, [phase, router]);

  const handleProceed = useCallback(() => {
    enterZone(1);
    router.push("/experience");
  }, [enterZone, router]);

  if (phase !== "baseline") return null;

  return (
    <main className="relative min-h-screen py-24 px-6">
      <GrainOverlay />

      <div className="relative z-10 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <FadeIn key="intro" className="min-h-[30vh] flex items-center justify-center">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/40 mb-8">
                  Baseline Self
                </p>
                <p className="text-xl text-drift-text/70 font-serif leading-relaxed">
                  <TypeWriter
                    text="This is you — before the encounters begin. Remember this shape. It will change."
                    speed={35}
                    onComplete={() => setTimeout(() => setStage("reveal"), 1500)}
                  />
                </p>
              </div>
            </FadeIn>
          )}

          {stage === "reveal" && (
            <FadeIn key="reveal">
              <div className="space-y-10">
                {/* Portrait */}
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  <SubjectPortrait profile={baselineProfile} size={180} />
                </motion.div>

                {/* Subject name */}
                {userName && (
                  <motion.p
                    className="text-center text-sm text-drift-muted/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Subject: {userName}
                  </motion.p>
                )}

                {/* Axis readings */}
                <motion.div
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  {AXES.map((axis, i) => {
                    const [leftLabel, rightLabel] = getAxisLabels(axis);
                    const value = baselineProfile[axis];
                    const percentage = 50 + value * 50;

                    return (
                      <motion.div
                        key={axis}
                        className="space-y-2"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + i * 0.15 }}
                      >
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] uppercase tracking-wider text-drift-muted/60">
                            {axis}
                          </span>
                          <span className="text-[10px] font-mono text-drift-accent/50">
                            {value > 0 ? "+" : ""}{(value * 100).toFixed(0)}
                          </span>
                        </div>
                        <div className="relative h-[2px] bg-drift-border/40 rounded-full">
                          <div className="absolute left-1/2 top-0 w-[1px] h-full bg-drift-muted/20 -translate-x-1/2" />
                          <motion.div
                            className="absolute top-1/2 w-1.5 h-1.5 bg-drift-accent/80 rounded-full -translate-y-1/2 -translate-x-1/2"
                            initial={{ left: "50%" }}
                            animate={{ left: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: 1.6 + i * 0.15 }}
                          />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[8px] text-drift-muted/30">{leftLabel}</span>
                          <span className="text-[8px] text-drift-muted/30">{rightLabel}</span>
                        </div>
                        <p className="text-xs text-drift-text/40 leading-relaxed">
                          {baselineReading(axis, value)}
                        </p>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Proceed button */}
                <motion.div
                  className="text-center pt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5 }}
                >
                  <button
                    onClick={handleProceed}
                    className="text-drift-muted hover:text-drift-text text-sm tracking-widest uppercase transition-colors duration-300 py-2 px-6"
                  >
                    Enter the experience
                  </button>
                </motion.div>
              </div>
            </FadeIn>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
