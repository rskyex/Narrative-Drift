"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSessionStore, useHasHydrated } from "@/store/session-store";
import { deriveArchetype } from "@/components/rpg/FinalDiagnostic";
import { computeCumulativeDrift } from "@/engine/drift-model";
import { DriftProfile, DriftAxis } from "@/engine/types";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import { HeroBackground } from "@/components/shared/HeroBackground";
import { LogoMark } from "@/components/shared/LogoMark";
import { AxisComparison } from "@/components/reflection/AxisComparison";

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

const btnClass =
  "text-drift-text/70 hover:text-drift-text text-sm tracking-[0.25em] uppercase transition-all duration-300 py-3 px-10 border border-drift-border/50 hover:border-drift-accent/60 hover:bg-drift-surface/40 rounded";

export default function ReplayResultPage() {
  const router = useRouter();
  const {
    isReplaying,
    currentProfile,
    replayProfile,
    exitReplay,
    reset,
  } = useSessionStore();
  const hasHydrated = useHasHydrated();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isReplaying || !replayProfile) {
      router.push("/diagnostic");
    }
  }, [hasHydrated, isReplaying, replayProfile, router]);

  if (!hasHydrated || !isReplaying || !replayProfile) return null;

  const originalArchetype = deriveArchetype(currentProfile);
  const replayArchetype = deriveArchetype(replayProfile);
  const divergenceDrift = computeCumulativeDrift(currentProfile, replayProfile);

  const handleReturnToOriginal = () => {
    exitReplay();
    router.push("/diagnostic");
  };

  const handleBeginAgain = () => {
    exitReplay();
    reset();
    router.push("/");
  };

  return (
    <main className="relative min-h-screen py-28 px-6">
      <HeroBackground />
      <GrainOverlay />

      <div className="fixed top-6 left-6 z-50 hidden md:block">
        <LogoMark size={72} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="text-xs uppercase tracking-[0.4em] text-drift-text/50 mb-4">
            Counterfactual Diagnostic
          </p>
          <div className="w-16 mx-auto drift-divider" />
        </motion.div>

        {/* Two-column comparison */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Original path */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-drift-text/50">
                Your original path
              </p>
              <h3 className="font-serif text-2xl text-drift-text/85">
                {originalArchetype.designation}
              </h3>
              <p className="text-xs text-drift-text/50 italic">
                {originalArchetype.description}
              </p>
            </div>
            <div className="space-y-5">
              {AXES.map((axis, i) => (
                <AxisComparison
                  key={axis}
                  axis={axis}
                  value={currentProfile[axis]}
                  index={i}
                />
              ))}
            </div>
          </motion.div>

          {/* Alternate path */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.25em] text-drift-accent/70">
                Your alternate path
              </p>
              <h3 className="font-serif text-2xl text-drift-accent/90">
                {replayArchetype.designation}
              </h3>
              <p className="text-xs text-drift-accent/50 italic">
                {replayArchetype.description}
              </p>
            </div>
            <div className="space-y-5">
              {AXES.map((axis, i) => (
                <AxisComparison
                  key={axis}
                  axis={axis}
                  value={replayProfile[axis]}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divergence measurement */}
        <motion.div
          className="mt-16 text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <div className="w-24 mx-auto drift-divider" />
          <p className="text-base text-drift-text/80 font-serif leading-relaxed pt-4">
            The distance between these two selves is {divergenceDrift.toFixed(2)}.
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <button className={btnClass} onClick={handleReturnToOriginal}>
            Return to your original results
          </button>
          <button className={btnClass} onClick={handleBeginAgain}>
            Begin again
          </button>
        </motion.div>
      </div>
    </main>
  );
}
