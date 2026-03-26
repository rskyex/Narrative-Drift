"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DriftProfile, DriftAxis, ProfileSnapshot } from "@/engine/types";
import { SubjectPortrait } from "@/components/rpg/SubjectPortrait";
import { getAxisLabels } from "@/engine/drift-model";
import { useState, useCallback } from "react";
import { TypeWriter } from "@/components/shared/TypeWriter";
import { FadeIn } from "@/components/shared/FadeIn";
import Image from "next/image";

const INTERLUDE_BG_IMAGE = "/hero.png";

const INTERLUDE_PORTRAIT_IMAGE: Record<number, string> = {
  1: "/interlude.png",
  2: "/interlude.png",
  3: "/Final Diagnostic.png",
};

interface InterludeRevealProps {
  interludeNumber: number;
  baselineProfile: DriftProfile;
  currentProfile: DriftProfile;
  previousProfile?: DriftProfile;
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

function getPortraitDriftObservation(
  interludeNumber: number,
  baseline: DriftProfile,
  current: DriftProfile
): string {
  const totalShift = AXES.reduce(
    (sum, axis) => sum + Math.abs(current[axis] - baseline[axis]),
    0
  );

  if (totalShift < 0.15) {
    return "Look closely. The face is the same face. But something in the posture of the gaze has shifted — a fraction of a degree. The kind of change that only becomes visible when you know to look for it.";
  }

  if (totalShift < 0.35) {
    const observations: Record<number, string> = {
      1: "The same person. But the eyes have adjusted to a different focal length — calibrated, perhaps, to the distance between a screen and a face. The change is subtle. It is also real.",
      2: "Still recognizable. But there is something smoother now, something slightly more efficient in the expression. As if a few small frictions have been polished away. Whether that is refinement or erosion depends on what you valued in the friction.",
      3: "The features have not changed. But the way they settle has. There is a different weight behind the expression — the weight of positions reinforced or quietly abandoned. The political self leaves traces on the face.",
    };
    return observations[interludeNumber] ?? observations[1];
  }

  const observations: Record<number, string> = {
    1: "The shift is legible now. Not dramatic — never dramatic. But the person looking back at you has been shaped by what they consumed. The feed did not change the face. It changed what the face is prepared to see.",
    2: "Convenience leaves its signature. The expression carries less of the effort that used to be present — less of the small labor of deciding, remembering, navigating without assistance. Something has been delegated that cannot be taken back.",
    3: "The civic self is visible in the face now. Whether it has expanded or contracted, the person who emerged from the information environment carries its architecture in their expression. The algorithm's influence is no longer hypothetical.",
  };
  return observations[interludeNumber] ?? observations[1];
}

export function InterludeReveal({
  interludeNumber,
  baselineProfile,
  currentProfile,
  previousProfile,
  snapshots,
  onContinue,
}: InterludeRevealProps) {
  const [stage, setStage] = useState<
    "narrative" | "portrait-drift" | "comparison" | "ready"
  >("narrative");
  const [narrativeComplete, setNarrativeComplete] = useState(false);

  const narrative = getDriftNarrative(interludeNumber, baselineProfile, currentProfile);
  const driftObservation = getPortraitDriftObservation(
    interludeNumber,
    baselineProfile,
    currentProfile
  );

  const handleNarrativeComplete = useCallback(() => {
    setNarrativeComplete(true);
  }, []);

  const portraitImage = INTERLUDE_PORTRAIT_IMAGE[interludeNumber] ?? "/interlude.png";

  return (
    <div className="fixed inset-0 z-30">
      {/* Solid dark base — always present so text is never unreadable */}
      <div className="absolute inset-0 bg-drift-bg" />

      {/* Full-screen background image (hero) */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <Image
          src={INTERLUDE_BG_IMAGE}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-drift-bg/70" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(10, 10, 10, 0.6) 100%)",
          }}
        />
      </motion.div>

      {/* Content — centered over full screen */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          {/* Stage 1: Reflective narrative — full screen, text + background only */}
          {stage === "narrative" && (
            <FadeIn key="narrative" className="text-center max-w-lg">
              <p className="text-sm uppercase tracking-[0.4em] text-drift-accent/80 mb-10">
                Interval — Observation {interludeNumber}
              </p>
              <p className="text-xl text-drift-text/90 leading-[1.8] font-serif">
                <TypeWriter
                  text={narrative}
                  speed={25}
                  onComplete={handleNarrativeComplete}
                />
              </p>
              {narrativeComplete && (
                <motion.button
                  className="mt-12 text-drift-text/70 hover:text-drift-text text-sm tracking-[0.25em] uppercase transition-all duration-300 py-3 px-10 border border-drift-border/50 hover:border-drift-accent/60 hover:bg-drift-surface/40 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  onClick={() => setStage("portrait-drift")}
                >
                  Continue
                </motion.button>
              )}
            </FadeIn>
          )}

          {/* Stage 2: Portrait drift moment */}
          {stage === "portrait-drift" && (
            <FadeIn key="portrait-drift">
              <div className="flex flex-col items-center justify-center space-y-8">
                <motion.p
                  className="text-sm uppercase tracking-[0.3em] text-drift-text/75"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Subject Under Observation
                </motion.p>

                {/* Portrait */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
                >
                  <Image
                    src={portraitImage}
                    alt="Subject under observation"
                    width={180}
                    height={180}
                    className="rounded-sm object-cover"
                  />
                </motion.div>

                {/* Drift observation text */}
                <motion.p
                  className="text-base text-drift-text/85 leading-relaxed font-serif text-center max-w-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.0, duration: 1.2 }}
                >
                  {driftObservation}
                </motion.p>

                {/* Subtle axis shift indicators */}
                <motion.div
                  className="flex gap-4 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.2 }}
                >
                  {AXES.map((axis) => {
                    const delta = currentProfile[axis] - baselineProfile[axis];
                    if (Math.abs(delta) < 0.02) return null;
                    return (
                      <div key={axis} className="text-center">
                        <div
                          className="w-[3px] mx-auto rounded-full mb-1"
                          style={{
                            height: `${Math.min(Math.abs(delta) * 80, 24)}px`,
                            backgroundColor:
                              delta > 0
                                ? "rgba(196, 181, 160, 0.35)"
                                : "rgba(166, 124, 109, 0.35)",
                          }}
                        />
                        <span className="text-[8px] text-drift-muted/60 uppercase tracking-wider">
                          {axis.slice(0, 3)}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>

                {/* Continue to comparison */}
                <motion.button
                  className="text-drift-text/70 hover:text-drift-text text-sm tracking-[0.25em] uppercase transition-all duration-300 mt-6 py-3 px-10 border border-drift-border/50 hover:border-drift-accent/60 hover:bg-drift-surface/40 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4.0 }}
                  onClick={() => setStage("comparison")}
                >
                  Continue
                </motion.button>
              </div>
            </FadeIn>
          )}

          {/* Stage 3: Side-by-side comparison */}
          {stage === "comparison" && (
            <FadeIn key="comparison">
              <div className="space-y-12">
                <p className="text-sm uppercase tracking-[0.4em] text-drift-text/75 text-center">
                  Drift Comparison — Before &amp; After
                </p>

                {/* Side-by-side portraits */}
                <div className="flex items-center justify-center gap-14">
                  <div className="text-center">
                    <Image
                      src="/baseline.png"
                      alt="Baseline self"
                      width={140}
                      height={140}
                      className="rounded-sm object-cover"
                    />
                    <p className="text-sm text-drift-text/70 mt-3 uppercase tracking-wider">
                      Baseline
                    </p>
                  </div>
                  <motion.div
                    className="text-drift-muted/40 text-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    →
                  </motion.div>
                  <div className="text-center">
                    <Image
                      src={portraitImage}
                      alt="Current self"
                      width={140}
                      height={140}
                      className="rounded-sm object-cover"
                    />
                    <p className="text-sm text-drift-text/70 mt-3 uppercase tracking-wider">
                      Current
                    </p>
                  </div>
                </div>

                {/* Axis deltas */}
                <motion.div
                  className="space-y-4 max-w-md mx-auto"
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
                        <span className="text-sm uppercase tracking-wider text-drift-text/75">
                          {axis}
                        </span>
                        <span
                          className={`text-sm font-mono ${
                            delta > 0 ? "text-drift-accent/80" : "text-drift-alert/80"
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
                  className="text-center pt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                >
                  <button
                    onClick={onContinue}
                    className="text-drift-text/70 hover:text-drift-text text-sm tracking-[0.25em] uppercase transition-all duration-300 py-3 px-10 border border-drift-border/50 hover:border-drift-accent/60 hover:bg-drift-surface/40 rounded"
                  >
                    Continue
                  </button>
                </motion.div>
              </div>
            </FadeIn>
          )}
      </div>
    </div>
  );
}
