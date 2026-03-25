"use client";

import { motion } from "framer-motion";
import { ChoiceRecord, DriftAxis, DriftProfile } from "@/engine/types";
import { zones } from "@/engine/zones";

interface AIInterventionMapProps {
  choices: ChoiceRecord[];
  baselineProfile: DriftProfile;
  currentProfile: DriftProfile;
}

interface InterventionCategory {
  id: string;
  label: string;
  description: string;
  findings: string[];
}

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

function analyzeExposureShaping(choices: ChoiceRecord[]): string[] {
  const findings: string[] = [];
  const zone1Choices = choices.filter((c) => c.zoneId === 1);
  const zone3Choices = choices.filter((c) => c.zoneId === 3);

  if (zone1Choices.length > 0) {
    const acceptedFeed = zone1Choices.some(
      (c) => c.choiceId === "z1e1-accept" || c.choiceId === "z1e2-top"
    );
    if (acceptedFeed) {
      findings.push(
        "The feed presented algorithmically ranked content as the default view. By engaging with top-ranked items, you consumed what the system decided was most relevant — not what was most important."
      );
    } else {
      findings.push(
        "The feed positioned curated content at the point of least resistance. You chose to override the default in at least one encounter, but the architecture consistently favored the pre-selected option."
      );
    }
  }

  if (zone3Choices.length > 0) {
    findings.push(
      "Political content was arranged by predicted engagement, not informational value. Opposing perspectives were structurally deprioritized — present, but buried beneath the fold."
    );
  }

  findings.push(
    "Across all zones, the system shaped what you encountered before you made a single choice. The menu was curated. The sequence was optimized. Exposure preceded agency."
  );

  return findings;
}

function analyzeReinforcementLoops(choices: ChoiceRecord[]): string[] {
  const findings: string[] = [];

  // Check for patterns where user repeatedly chose algorithm-aligned options
  const delegatedCount = choices.filter((c) =>
    c.driftVectors.some((v) => v.axis === "autonomy" && v.delta < 0)
  ).length;

  const autonomousCount = choices.filter((c) =>
    c.driftVectors.some((v) => v.axis === "autonomy" && v.delta > 0)
  ).length;

  if (delegatedCount >= autonomousCount) {
    findings.push(
      "Each time you accepted an algorithmic recommendation, the next recommendation became more precisely calibrated. Acceptance trained the system to offer more of what you would accept — a feedback loop that narrows without announcing its contraction."
    );
  } else {
    findings.push(
      "You resisted the reinforcement cycle more often than not. But the system still learned from your refusals — what you rejected shaped the next offering as much as what you chose."
    );
  }

  const tempoChoices = choices.filter((c) =>
    c.driftVectors.some((v) => v.axis === "tempo" && v.delta > 0)
  );
  if (tempoChoices.length >= 2) {
    findings.push(
      "Speed was reinforced structurally: each fast choice made the next fast option feel more natural. The system rewarded efficiency with smoother interfaces and shorter paths. Slowness was never penalized — it was simply made to feel unnecessary."
    );
  }

  findings.push(
    "Reinforcement loops operated below the threshold of attention. No single repetition was noticeable. The pattern only becomes visible in aggregate."
  );

  return findings;
}

function analyzeMemoryMediation(choices: ChoiceRecord[]): string[] {
  const findings: string[] = [];

  const zone2Choices = choices.filter((c) => c.zoneId === 2);
  const usedMemory = zone2Choices.some(
    (c) => c.choiceId === "z2e2-memory" || c.choiceId === "z2e3-dismiss"
  );

  if (usedMemory) {
    findings.push(
      "In at least one encounter, you chose personal memory over algorithmic suggestion. The system offered to replace recollection with retrieval — your mother's recipe with an optimized alternative. You declined."
    );
  } else if (zone2Choices.length > 0) {
    findings.push(
      "When given the option between personal memory and algorithmic suggestion, you chose the system's version. Over time, this substitution becomes invisible — the AI's recommendation feels like your own preference because it was built from your history."
    );
  }

  findings.push(
    "The system reconstructed your preferences from behavioral traces — clicks, dwell time, skips, replays. This reconstruction was presented back to you as self-knowledge. What the algorithm remembered about you gradually replaced what you remembered about yourself."
  );

  return findings;
}

function analyzePreferenceConstruction(
  choices: ChoiceRecord[],
  baseline: DriftProfile,
  current: DriftProfile
): string[] {
  const findings: string[] = [];

  // Find most shifted axis
  let maxDelta = 0;
  let maxAxis: DriftAxis = "autonomy";
  for (const axis of AXES) {
    const d = Math.abs(current[axis] - baseline[axis]);
    if (d > maxDelta) {
      maxDelta = d;
      maxAxis = axis;
    }
  }

  findings.push(
    `Your strongest shift was along the ${maxAxis} axis. This was not a preference you arrived at independently — it was constructed through a sequence of choices, each one shaped by what the system presented and how it framed the alternatives.`
  );

  const noveltyDelta = current.novelty - baseline.novelty;
  if (noveltyDelta < -0.05) {
    findings.push(
      "Your novelty orientation narrowed. The system identified your preferences and served more of the same, creating the sensation of satisfaction while contracting the territory of your experience. You preferred what was offered because what was offered was built from what you preferred."
    );
  } else if (noveltyDelta > 0.05) {
    findings.push(
      "Your novelty orientation expanded — but the expansion was still bounded by the system's model of acceptable divergence. Even your exploration was curated. The unfamiliar was pre-screened for palatability."
    );
  }

  findings.push(
    "Preference construction is the quietest intervention. It does not override your will. It builds your will from materials it selected."
  );

  return findings;
}

function analyzeJudgmentAcceleration(choices: ChoiceRecord[]): string[] {
  const findings: string[] = [];

  const zone3Choices = choices.filter((c) => c.zoneId === 3);
  const usedSummary = zone3Choices.some((c) => c.choiceId === "z3e2-use");
  const signedDraft = zone3Choices.some((c) => c.choiceId === "z3e3-sign");

  if (usedSummary || signedDraft) {
    findings.push(
      "In the political zone, you accepted AI-compressed civic information at least once. The system reduced hours of deliberation to seconds of consumption. The judgment arrived faster — but it arrived pre-formed."
    );
  } else if (zone3Choices.length > 0) {
    findings.push(
      "You resisted AI-mediated civic shortcuts. But the option was always present, and its presence redefined the baseline: doing your own research became the laborious alternative rather than the default."
    );
  }

  findings.push(
    "Judgment acceleration compresses the space between stimulus and conclusion. The AI did not tell you what to think. It reduced the time available for thinking — and in that compression, nuance was the first casualty."
  );

  findings.push(
    "Across nine encounters, the system consistently offered to make decisions faster. Speed was never framed as a tradeoff. It was framed as a gift."
  );

  return findings;
}

function buildInterventionCategories(
  choices: ChoiceRecord[],
  baseline: DriftProfile,
  current: DriftProfile
): InterventionCategory[] {
  return [
    {
      id: "exposure",
      label: "Exposure Shaping",
      description: "What the system showed — and what it chose not to show",
      findings: analyzeExposureShaping(choices),
    },
    {
      id: "reinforcement",
      label: "Reinforcement Loops",
      description: "How each choice trained the next offering",
      findings: analyzeReinforcementLoops(choices),
    },
    {
      id: "memory",
      label: "Memory Mediation",
      description: "How the system participated in what you remember",
      findings: analyzeMemoryMediation(choices),
    },
    {
      id: "preference",
      label: "Preference Construction",
      description: "How your preferences were built from curated materials",
      findings: analyzePreferenceConstruction(choices, baseline, current),
    },
    {
      id: "judgment",
      label: "Judgment Acceleration",
      description: "How the system compressed the time available for thinking",
      findings: analyzeJudgmentAcceleration(choices),
    },
  ];
}

export function AIInterventionMap({
  choices,
  baselineProfile,
  currentProfile,
}: AIInterventionMapProps) {
  const categories = buildInterventionCategories(
    choices,
    baselineProfile,
    currentProfile
  );

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header */}
      <div className="text-center">
        <motion.p
          className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/60 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          AI Intervention Map
        </motion.p>
        <motion.div
          className="w-12 h-[1px] bg-drift-border mx-auto mb-4"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        />
        <motion.p
          className="text-sm text-drift-muted/65 max-w-md mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          A record of how the system participated in your transformation.
          Not what you chose — but what shaped the choosing.
        </motion.p>
      </div>

      {/* Intervention categories */}
      {categories.map((category, catIndex) => (
        <motion.div
          key={category.id}
          className="border-l border-drift-border/30 pl-5"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + catIndex * 0.3, duration: 0.6 }}
        >
          <div className="mb-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-drift-accent/70 mb-1">
              {category.label}
            </h4>
            <p className="text-[10px] text-drift-muted/60 italic">
              {category.description}
            </p>
          </div>

          <div className="space-y-3">
            {category.findings.map((finding, fIndex) => (
              <motion.p
                key={fIndex}
                className="text-xs text-drift-text/70 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: 1.0 + catIndex * 0.3 + fIndex * 0.15,
                  duration: 0.5,
                }}
              >
                {finding}
              </motion.p>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Summary */}
      <motion.div
        className="bg-drift-surface/40 border border-drift-border/20 rounded-lg p-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.8 }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-drift-muted/60 mb-3">
          System Summary
        </p>
        <p className="text-xs text-drift-text/70 leading-relaxed">
          Across {choices.length} encounters, the AI operated through five
          concurrent channels: shaping what you were exposed to, reinforcing
          patterns through repetition, mediating your relationship to memory,
          constructing preferences from behavioral data, and accelerating
          judgment beyond the speed of reflection. None of these interventions
          required your awareness. None of them required your consent. Each one
          was experienced as convenience.
        </p>
      </motion.div>
    </motion.div>
  );
}
