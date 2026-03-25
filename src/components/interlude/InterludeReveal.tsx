"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DriftProfile, DriftAxis, ProfileSnapshot } from "@/engine/types";
import { SubjectPortrait } from "@/components/rpg/SubjectPortrait";
import { getAxisLabels } from "@/engine/drift-model";
import { useState, useCallback } from "react";
import { TypeWriter } from "@/components/shared/TypeWriter";
import { FadeIn } from "@/components/shared/FadeIn";

interface InterludeRevealProps {
  interludeNumber: number;
  baselineProfile: DriftProfile;
  currentProfile: DriftProfile;
  snapshots: ProfileSnapshot[];
  onContinue: () => void;
}

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

function getDriftNarrative(
  interludeNumber: number,
  baseline: DriftProfile,
  current: DriftProfile
): string {
  // Find the axis that moved the most during this zone
  let maxDelta = 0;
  let maxAxis: DriftAxis = "autonomy";

  for (const axis of AXES) {
    const delta = Math.abs(current[axis] - baseline[axis]);
    if (delta > maxDelta) {
      maxDelta = delta;
      maxAxis = axis;
    }
  }

  const direction = current[maxAxis] > baseline[maxAxis] ? "toward" : "away from";

  const narratives: Record<number, Record<DriftAxis, string>> = {
    1: {
      autonomy:
        `The feed shaped your choices more than you expected. Your ${maxAxis} shifted ${direction} the algorithmic center — not dramatically, but detectably. The curation was gentle. That is what made it effective.`,
      novelty:
        `Three encounters with recommendation systems, and your novelty orientation has shifted. The feed did not force you anywhere — it simply made certain paths easier than others. You moved ${direction} the familiar.`,
      sociality:
        `The feed's influence registered most clearly in how you relate to others' patterns. Your social orientation drifted ${direction} alignment with the collective signal.`,
      tempo:
        `Speed was the quiet variable. The feed's architecture rewarded certain temporal patterns, and your tempo shifted ${direction} optimization. Not a choice you made — a rhythm you absorbed.`,
      affect:
        `The emotional register shifted. Three encounters with curated content, and your affect moved ${direction} expression. The feed doesn't ask how you feel. It decides what you feel about.`,
    },
    2: {
      autonomy:
        `The companion delegated well — perhaps too well. Your autonomy shifted ${direction} self-direction as the AI offered to carry more of the decision-making weight. Convenience has a direction.`,
      novelty:
        `With an AI companion managing the details, your relationship to novelty shifted. You moved ${direction} the unfamiliar — the companion's optimization has a narrowing effect on the territory you encounter.`,
      sociality:
        `The AI companion mediated your connections. Your sociality shifted ${direction} the communal as the system positioned itself between you and others. A helpful intermediary is still an intermediary.`,
      tempo:
        `The companion's core promise is speed — and your tempo responded. You shifted ${direction} optimization. Each task the AI completed for you recalibrated your sense of how long things should take.`,
      affect:
        `Delegating tasks to an AI companion changed your emotional landscape. Your affect shifted ${direction} expression. When a system handles the friction, it also handles some of the feeling.`,
    },
    3: {
      autonomy:
        `The political information environment tested your autonomy most directly. You shifted ${direction} self-direction as AI systems offered to mediate your civic understanding. The political self is the self most vulnerable to convenience.`,
      novelty:
        `In the political arena, novelty means encountering genuinely different perspectives. Your orientation shifted ${direction} the unfamiliar — the information environment either expanded or narrowed your civic horizon.`,
      sociality:
        `Politics is inherently social, and the AI-mediated environment shaped your relationship to collective action. Your sociality shifted ${direction} alignment — the algorithm made consensus visible and dissent invisible.`,
      tempo:
        `Civic engagement takes time — or it used to. Your tempo shifted ${direction} optimization as AI offered to compress the work of democratic participation into quick, efficient actions.`,
      affect:
        `Political engagement carries emotional weight. Your affect shifted ${direction} expression through the zone. The question is whether the AI compressed the emotion along with the information.`,
    },
  };

  return narratives[interludeNumber]?.[maxAxis] ??
    `Something shifted during the last zone. The movement was subtle — a fraction of a degree along the ${maxAxis} axis. But fractions accumulate.`;
}

export function InterludeReveal({
  interludeNumber,
  baselineProfile,
  currentProfile,
  snapshots,
  onContinue,
}: InterludeRevealProps) {
  const [stage, setStage] = useState<"narrative" | "comparison" | "ready">("narrative");

  const narrative = getDriftNarrative(interludeNumber, baselineProfile, currentProfile);

  const handleNarrativeComplete = useCallback(() => {
    setTimeout(() => setStage("comparison"), 1200);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {stage === "narrative" && (
          <FadeIn key="narrative" className="min-h-[40vh] flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/40 mb-8">
              Interlude {interludeNumber}
            </p>
            <p className="text-lg text-drift-text/70 leading-relaxed font-serif text-center max-w-lg">
              <TypeWriter
                text={narrative}
                speed={25}
                onComplete={handleNarrativeComplete}
              />
            </p>
          </FadeIn>
        )}

        {stage === "comparison" && (
          <FadeIn key="comparison">
            <div className="space-y-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/40 text-center">
                Profile Comparison
              </p>

              {/* Side-by-side portraits */}
              <div className="flex items-center justify-center gap-12">
                <div className="text-center">
                  <SubjectPortrait profile={baselineProfile} size={120} />
                  <p className="text-[10px] text-drift-muted/40 mt-3 uppercase tracking-wider">
                    Baseline
                  </p>
                </div>
                <motion.div
                  className="text-drift-muted/20 text-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  →
                </motion.div>
                <div className="text-center">
                  <SubjectPortrait profile={currentProfile} size={120} />
                  <p className="text-[10px] text-drift-muted/40 mt-3 uppercase tracking-wider">
                    Current
                  </p>
                </div>
              </div>

              {/* Axis deltas */}
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {AXES.map((axis, i) => {
                  const baseline = baselineProfile[axis];
                  const current = currentProfile[axis];
                  const delta = current - baseline;
                  if (Math.abs(delta) < 0.01) return null;

                  return (
                    <motion.div
                      key={axis}
                      className="flex items-center justify-between border-l border-drift-border/30 pl-4 py-1"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.1 }}
                    >
                      <span className="text-[10px] uppercase tracking-wider text-drift-muted/50">
                        {axis}
                      </span>
                      <span
                        className={`text-[11px] font-mono ${
                          delta > 0 ? "text-drift-accent/60" : "text-drift-alert/60"
                        }`}
                      >
                        {delta > 0 ? "+" : ""}{(delta * 100).toFixed(0)}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Continue button */}
              <motion.div
                className="text-center pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
              >
                <button
                  onClick={onContinue}
                  className="text-drift-muted hover:text-drift-text text-sm tracking-widest uppercase transition-colors duration-300 py-2 px-6"
                >
                  Continue
                </button>
              </motion.div>
            </div>
          </FadeIn>
        )}
      </AnimatePresence>
    </div>
  );
}
