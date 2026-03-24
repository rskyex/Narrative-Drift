"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/store/session-store";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { TypeWriter } from "@/components/shared/TypeWriter";
import { FadeIn } from "@/components/shared/FadeIn";
import { DriftReveal } from "@/components/reflection/DriftReveal";
import { DriftTimeline } from "@/components/reflection/DriftTimeline";
import { ChoiceReplay } from "@/components/reflection/ChoiceReplay";
import { ClosingStatement } from "@/components/reflection/ClosingStatement";

type RevealStage = "intro-1" | "intro-2" | "reveal" | "timeline" | "replay" | "closing";

export default function ReflectionPage() {
  const router = useRouter();
  const { initialProfile, currentProfile, choiceHistory, userName, reset } =
    useSessionStore();
  const [stage, setStage] = useState<RevealStage>("intro-1");

  const advance = useCallback((to: RevealStage) => {
    setStage(to);
  }, []);

  const handleRestart = () => {
    reset();
    router.push("/");
  };

  return (
    <main className="relative min-h-screen py-24 px-6">
      <GrainOverlay />

      <div className="relative z-10 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Stage: Intro line 1 */}
          {stage === "intro-1" && (
            <FadeIn key="intro-1" className="min-h-[30vh] flex items-center justify-center">
              <p className="text-xl sm:text-2xl text-drift-text/70 text-center font-serif">
                <TypeWriter
                  text="Over seven days, you made seven choices."
                  speed={45}
                  onComplete={() => setTimeout(() => advance("intro-2"), 1200)}
                />
              </p>
            </FadeIn>
          )}

          {/* Stage: Intro line 2 */}
          {stage === "intro-2" && (
            <FadeIn key="intro-2" className="min-h-[30vh] flex items-center justify-center">
              <p className="text-xl sm:text-2xl text-drift-text/70 text-center font-serif">
                <TypeWriter
                  text="Here is what changed."
                  speed={50}
                  onComplete={() => setTimeout(() => advance("reveal"), 1500)}
                />
              </p>
            </FadeIn>
          )}

          {/* Stage: Drift visualization */}
          {stage === "reveal" && (
            <FadeIn key="reveal">
              <div className="space-y-16">
                <DriftReveal
                  initialProfile={initialProfile}
                  currentProfile={currentProfile}
                />

                <motion.button
                  className="block mx-auto text-drift-muted/50 hover:text-drift-muted text-sm tracking-widest uppercase transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  onClick={() => advance("timeline")}
                >
                  How it happened
                </motion.button>
              </div>
            </FadeIn>
          )}

          {/* Stage: Timeline */}
          {stage === "timeline" && (
            <FadeIn key="timeline">
              <div className="space-y-12">
                <h2 className="text-sm text-drift-muted uppercase tracking-widest text-center">
                  The week
                </h2>

                <DriftTimeline choices={choiceHistory} />

                <motion.button
                  className="block mx-auto text-drift-muted/50 hover:text-drift-muted text-sm tracking-widest uppercase transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={() => advance("replay")}
                >
                  Review each choice
                </motion.button>
              </div>
            </FadeIn>
          )}

          {/* Stage: Choice replay */}
          {stage === "replay" && (
            <FadeIn key="replay">
              <div className="space-y-12">
                <h2 className="text-sm text-drift-muted uppercase tracking-widest text-center">
                  Your choices and their effects
                </h2>

                <ChoiceReplay choices={choiceHistory} />

                <motion.button
                  className="block mx-auto text-drift-muted/50 hover:text-drift-muted text-sm tracking-widest uppercase transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  onClick={() => advance("closing")}
                >
                  Continue
                </motion.button>
              </div>
            </FadeIn>
          )}

          {/* Stage: Closing statement */}
          {stage === "closing" && (
            <FadeIn key="closing">
              <div className="space-y-16 py-12">
                <ClosingStatement userName={userName} />

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3 }}
                >
                  <button
                    onClick={handleRestart}
                    className="text-drift-muted/30 hover:text-drift-muted/60 text-xs tracking-widest uppercase transition-colors"
                  >
                    Start over
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
