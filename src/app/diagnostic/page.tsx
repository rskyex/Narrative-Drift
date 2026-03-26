"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore, useHasHydrated } from "@/store/session-store";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { HeroBackground } from "@/components/shared/HeroBackground";
import { TypeWriter } from "@/components/shared/TypeWriter";
import { FadeIn } from "@/components/shared/FadeIn";
import { LogoMark } from "@/components/shared/LogoMark";
import { FinalDiagnostic, deriveArchetype } from "@/components/rpg/FinalDiagnostic";
import { PathLog } from "@/components/rpg/PathLog";
import { DriftReveal } from "@/components/reflection/DriftReveal";
import { TimelineOfChange } from "@/components/reflection/TimelineOfChange";
import { AIInterventionMap, AIInterventionMapPage2 } from "@/components/reflection/AIInterventionMap";
import { ClosingStatement, ClosingCredits } from "@/components/reflection/ClosingStatement";
import { computeCumulativeDrift } from "@/engine/drift-model";
import { zones } from "@/engine/zones";
import Image from "next/image";

type RevealStage =
  | "intro-1"
  | "intro-2"
  | "diagnostic"
  | "timeline"
  | "pathlog"
  | "intervention"
  | "intervention-2"
  | "closing"
  | "credits";

/** Shared button style for all diagnostic navigation */
const btnClass =
  "block mx-auto text-drift-text/70 hover:text-drift-text text-sm tracking-[0.25em] uppercase transition-all duration-300 py-3 px-10 border border-drift-border/50 hover:border-drift-accent/60 hover:bg-drift-surface/40 rounded";

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
  const hasHydrated = useHasHydrated();
  const [stage, setStage] = useState<RevealStage>("intro-1");

  useEffect(() => {
    if (!hasHydrated) return;
    if (phase !== "diagnostic") {
      router.push("/");
    }
  }, [phase, router, hasHydrated]);

  const advance = useCallback((to: RevealStage) => {
    setStage(to);
  }, []);

  const handleRestart = () => {
    reset();
    router.push("/");
  };

  if (!hasHydrated || phase !== "diagnostic") return null;

  const archetype = deriveArchetype(currentProfile);
  const cumulativeDrift = computeCumulativeDrift(baselineProfile, currentProfile);
  const driftPercentage = Math.round(cumulativeDrift * 100);
  const zoneSummaries = zones.filter((z) =>
    choiceHistory.some((c) => c.zoneId === z.id)
  );

  const isIntroStage = stage === "intro-1" || stage === "intro-2";

  return (
    <main className="relative min-h-screen py-28 px-6">
      <HeroBackground />
      <GrainOverlay />

      {/* Fixed logo */}
      <div className="fixed top-4 left-6 z-50">
        <LogoMark size={36} className="text-drift-accent/50" />
      </div>

      {/* Intro stages — full width, centered */}
      {isIntroStage && (
        <div className="relative z-10 max-w-2xl mx-auto">
            {stage === "intro-1" && (
              <FadeIn key="intro-1" className="min-h-[40vh] flex items-center justify-center">
                <p className="text-xl sm:text-2xl text-drift-text/85 text-center font-serif leading-[1.6]">
                  <TypeWriter
                    text="Nine encounters. Three zones. A transformation assembled from choices so small they barely registered."
                    speed={40}
                    onComplete={() => setTimeout(() => advance("intro-2"), 1400)}
                  />
                </p>
              </FadeIn>
            )}

            {stage === "intro-2" && (
              <FadeIn key="intro-2" className="min-h-[40vh] flex items-center justify-center">
                <p className="text-xl sm:text-2xl text-drift-text/85 text-center font-serif leading-[1.6]">
                  <TypeWriter
                    text="What follows is the record — what shifted, by how much, and the system's role in each departure from who you were."
                    speed={40}
                    onComplete={() => setTimeout(() => advance("diagnostic"), 1600)}
                  />
                </p>
              </FadeIn>
            )}
        </div>
      )}

      {/* Post-intro stages — two column layout */}
      {!isIntroStage && (
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col lg:flex-row lg:gap-12">
          {/* Left sidebar — portrait + classification + displacement (persistent) */}
          <motion.aside
            className="lg:w-72 flex-shrink-0 lg:sticky lg:top-28 lg:self-start mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              {/* Portrait */}
              <div className="flex justify-center lg:justify-start">
                <Image
                  src="/Final Diagnostic.png"
                  alt="Final state"
                  width={200}
                  height={200}
                  className="rounded-sm object-cover"
                />
              </div>

              {/* Subject Classification */}
              <div className="space-y-3 text-center lg:text-left">
                <p className="text-[10px] uppercase tracking-[0.3em] text-drift-text/65">
                  Subject Classification
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl text-drift-accent/90 tracking-[-0.01em]">
                  {archetype.designation}
                </h3>
                <p className="text-[12px] text-drift-text/60 italic leading-relaxed">
                  {archetype.description}
                </p>
                {userName && (
                  <p className="text-[11px] text-drift-text/65 font-mono">
                    Subject: {userName}
                  </p>
                )}
              </div>

              {/* Total Displacement */}
              <div className="space-y-2 text-center lg:text-left">
                <div className="drift-divider" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-drift-text/65 pt-2">
                  Total Displacement
                </p>
                <p className="font-serif text-4xl text-drift-accent/85 font-light tracking-tight">
                  {driftPercentage}%
                </p>
                <p className="text-[10px] text-drift-text/60 leading-relaxed">
                  from baseline across {choiceHistory.length} encounters in {zoneSummaries.length} zones
                </p>
                <div className="drift-divider mt-2" />
              </div>
            </div>
          </motion.aside>

          {/* Right content — changes per stage */}
          <div className="flex-1 min-w-0">
              {/* Stage: Final Diagnostic — axis readings, interpretation, summary */}
              {stage === "diagnostic" && (
                <FadeIn key="diagnostic">
                  <div className="space-y-14">
                    <FinalDiagnostic
                      userName={userName}
                      initialProfile={baselineProfile}
                      currentProfile={currentProfile}
                      choices={choiceHistory}
                      snapshots={profileSnapshots}
                    />

                    <motion.button
                      className={btnClass}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.5 }}
                      onClick={() => advance("timeline")}
                    >
                      Trace the timeline
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
                      className={btnClass}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                      onClick={() => advance("pathlog")}
                    >
                      Examine the record
                    </motion.button>
                  </div>
                </FadeIn>
              )}

              {/* Stage: Path log + drift visualization */}
              {stage === "pathlog" && (
                <FadeIn key="pathlog">
                  <div className="space-y-10">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-drift-text/70 mb-3">
                        Full Decision Record
                      </p>
                      <div className="w-16 drift-divider" />
                    </div>

                    <PathLog choices={choiceHistory} />

                    {/* Drift visualization */}
                    <div className="pt-10">
                      <DriftReveal
                        initialProfile={baselineProfile}
                        currentProfile={currentProfile}
                      />
                    </div>

                    <motion.button
                      className={btnClass}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      onClick={() => advance("intervention")}
                    >
                      Map the system&apos;s influence
                    </motion.button>
                  </div>
                </FadeIn>
              )}

              {/* Stage: AI Intervention Map — Page 1 (System Summary + Exposure + Reinforcement) */}
              {stage === "intervention" && (
                <FadeIn key="intervention">
                  <div className="space-y-8">
                    <AIInterventionMap
                      choices={choiceHistory}
                      baselineProfile={baselineProfile}
                      currentProfile={currentProfile}
                    />

                    <motion.button
                      className={btnClass}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                      onClick={() => advance("intervention-2")}
                    >
                      Continue
                    </motion.button>
                  </div>
                </FadeIn>
              )}

              {/* Stage: AI Intervention Map — Page 2 (Memory + Preference + Judgment) */}
              {stage === "intervention-2" && (
                <FadeIn key="intervention-2">
                  <div className="space-y-8">
                    <AIInterventionMapPage2
                      choices={choiceHistory}
                      baselineProfile={baselineProfile}
                      currentProfile={currentProfile}
                    />

                    <motion.button
                      className={btnClass}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                      onClick={() => advance("closing")}
                    >
                      Continue
                    </motion.button>
                  </div>
                </FadeIn>
              )}

              {/* Stage: Closing statement — left: logo+title, right: text */}
              {stage === "closing" && (
                <FadeIn key="closing">
                  <div className="space-y-16 py-16">
                    <ClosingStatement userName={userName} />

                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                    >
                      <button
                        onClick={() => advance("credits")}
                        className={btnClass}
                      >
                        Continue
                      </button>
                    </motion.div>
                  </div>
                </FadeIn>
              )}

              {/* Stage: Credits — links to project LP and creator HP */}
              {stage === "credits" && (
                <FadeIn key="credits">
                  <div className="py-16">
                    <ClosingCredits onRestart={handleRestart} />
                  </div>
                </FadeIn>
              )}
          </div>
        </div>
      )}
    </main>
  );
}
