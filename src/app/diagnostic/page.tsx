"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/store/session-store";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { TypeWriter } from "@/components/shared/TypeWriter";
import { FadeIn } from "@/components/shared/FadeIn";
import { FinalDiagnostic } from "@/components/rpg/FinalDiagnostic";
import { PathLog } from "@/components/rpg/PathLog";
import { DriftReveal } from "@/components/reflection/DriftReveal";
import { TimelineOfChange } from "@/components/reflection/TimelineOfChange";
import { AIInterventionMap } from "@/components/reflection/AIInterventionMap";
import { ClosingStatement } from "@/components/reflection/ClosingStatement";

type RevealStage =
  | "intro-1"
  | "intro-2"
  | "diagnostic"
  | "timeline"
  | "pathlog"
  | "intervention"
  | "closing";

export default function DiagnosticPage() {
  const router = useRouter();
  const {
    baselineProfile,
    currentProfile,
    profileSnapshots,
    choiceHistory,
    userName,
    phase,
    reset,
  } = useSessionStore();
  const [stage, setStage] = useState<RevealStage>("intro-1");

  useEffect(() => {
    if (phase !== "diagnostic") {
      router.push("/");
    }
  }, [phase, router]);

  const advance = useCallback((to: RevealStage) => {
    setStage(to);
  }, []);

  const handleRestart = () => {
    reset();
    router.push("/");
  };

  if (phase !== "diagnostic") return null;

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
                  text="Nine encounters. Three zones. Each one a chapter in a transformation you may not have noticed."
                  speed={40}
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
                  text="Here is what the experience revealed — and how AI participated in the change."
                  speed={40}
                  onComplete={() => setTimeout(() => advance("diagnostic"), 1500)}
                />
              </p>
            </FadeIn>
          )}

          {/* Stage: Final Diagnostic — portraits, archetype, axes, summary */}
          {stage === "diagnostic" && (
            <FadeIn key="diagnostic">
              <div className="space-y-12">
                <FinalDiagnostic
                  userName={userName}
                  initialProfile={baselineProfile}
                  currentProfile={currentProfile}
                  choices={choiceHistory}
                  snapshots={profileSnapshots}
                />

                <motion.button
                  className="block mx-auto text-drift-muted/50 hover:text-drift-muted text-sm tracking-widest uppercase transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 5 }}
                  onClick={() => advance("timeline")}
                >
                  View the timeline
                </motion.button>
              </div>
            </FadeIn>
          )}

          {/* Stage: Timeline of Change */}
          {stage === "timeline" && (
            <FadeIn key="timeline">
              <div className="space-y-8">
                <TimelineOfChange
                  choices={choiceHistory}
                  baselineProfile={baselineProfile}
                />

                <motion.button
                  className="block mx-auto text-drift-muted/50 hover:text-drift-muted text-sm tracking-widest uppercase transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  onClick={() => advance("pathlog")}
                >
                  Review the path
                </motion.button>
              </div>
            </FadeIn>
          )}

          {/* Stage: Path log + drift visualization */}
          {stage === "pathlog" && (
            <FadeIn key="pathlog">
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/40 mb-2">
                    Complete Path Record
                  </p>
                  <div className="w-12 h-[1px] bg-drift-border mx-auto" />
                </div>

                <PathLog choices={choiceHistory} />

                {/* Drift visualization */}
                <div className="pt-8">
                  <DriftReveal
                    initialProfile={baselineProfile}
                    currentProfile={currentProfile}
                  />
                </div>

                <motion.button
                  className="block mx-auto text-drift-muted/50 hover:text-drift-muted text-sm tracking-widest uppercase transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={() => advance("intervention")}
                >
                  See how the system shaped you
                </motion.button>
              </div>
            </FadeIn>
          )}

          {/* Stage: AI Intervention Map */}
          {stage === "intervention" && (
            <FadeIn key="intervention">
              <div className="space-y-8">
                <AIInterventionMap
                  choices={choiceHistory}
                  baselineProfile={baselineProfile}
                  currentProfile={currentProfile}
                />

                <motion.button
                  className="block mx-auto text-drift-muted/50 hover:text-drift-muted text-sm tracking-widest uppercase transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4 }}
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
