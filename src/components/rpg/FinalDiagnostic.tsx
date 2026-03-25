"use client";

import { motion } from "framer-motion";
import { DriftProfile, DriftAxis, ChoiceRecord, ProfileSnapshot } from "@/engine/types";
import { computeCumulativeDrift } from "@/engine/drift-model";
import { zones } from "@/engine/zones";
import Image from "next/image";

interface FinalDiagnosticProps {
  userName: string | null;
  initialProfile: DriftProfile;
  currentProfile: DriftProfile;
  choices: ChoiceRecord[];
  snapshots?: ProfileSnapshot[];
}

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

interface ArchetypeResult {
  designation: string;
  description: string;
  analysis: string;
}

function deriveArchetype(profile: DriftProfile): ArchetypeResult {
  const dominant = AXES.reduce((a, b) =>
    Math.abs(profile[a]) > Math.abs(profile[b]) ? a : b
  );

  const dominantDir = profile[dominant] > 0 ? "positive" : "negative";

  const archetypeMap: Record<string, Record<string, ArchetypeResult>> = {
    autonomy: {
      positive: {
        designation: "The Unmediated",
        description: "One who resists the algorithmic frame",
        analysis: "You consistently chose to act without intermediation. Where convenience was offered, you chose friction. This is not stubbornness — it is a kind of insistence on remaining the author of your own experience. The question is whether this insistence can sustain itself against the gradual normalization of delegation.",
      },
      negative: {
        designation: "The Delegated",
        description: "One who yields to the curated path",
        analysis: "You found it natural to accept what was offered. This is not weakness — it is the reasonable response to systems designed to be accepted. But each acceptance is a small transfer of authorship. The self that emerges is not less real, but it is less distinctly yours.",
      },
    },
    novelty: {
      positive: {
        designation: "The Divergent",
        description: "One who seeks beyond the profile",
        analysis: "You were drawn to what lay outside your established patterns. The algorithm offered you a mirror; you chose the window. This tendency toward the unfamiliar suggests a self that resists the comfort of being known — even by a system that knows you well.",
      },
      negative: {
        designation: "The Convergent",
        description: "One who gravitates toward the known",
        analysis: "You preferred the territory you recognize. There is depth in this — a willingness to inhabit a smaller world more fully. But the risk is that the boundary between preference and confinement becomes invisible when the walls are built from your own history.",
      },
    },
    sociality: {
      positive: {
        designation: "The Networked",
        description: "One whose choices align with the collective",
        analysis: "Your decisions tended toward connection — with people, with consensus, with shared patterns. You are porous to others in a way that an algorithm can exploit but cannot replicate. The social self is the most legible self, and therefore the most exposed to curation.",
      },
      negative: {
        designation: "The Singular",
        description: "One who maintains distance from the chorus",
        analysis: "You moved away from the social signal. Not toward isolation, but toward a kind of independence that resists the gravitational pull of collective opinion. In a world of personalized consensus, this is both a strength and a vulnerability.",
      },
    },
    tempo: {
      positive: {
        designation: "The Optimized",
        description: "One who values efficiency above texture",
        analysis: "You chose speed consistently. The eight minutes saved, the instant decision, the pre-selected option. Efficiency is not shallow — it is the logic of a life with finite time. But time saved is not time lived. The question is what you did with the minutes you recovered.",
      },
      negative: {
        designation: "The Unhurried",
        description: "One who chooses duration over dispatch",
        analysis: "You resisted the pressure to be fast. Where the system offered to compress your experience, you chose to let it breathe. Slowness is not inefficiency — it is a different relationship to time, one that algorithms cannot model because they cannot value what they cannot measure.",
      },
    },
    affect: {
      positive: {
        designation: "The Resonant",
        description: "One whose emotional register remains open",
        analysis: "You chose the options that asked more of you emotionally. The handwritten reply, the recipe from memory, the book instead of the feed. Affect is the dimension most resistant to optimization — and most vulnerable to its erosion.",
      },
      negative: {
        designation: "The Contained",
        description: "One whose emotional surface remains undisturbed",
        analysis: "You kept your emotional investment conservative. This is not coldness — it is a kind of economy. But the contained self risks becoming the efficient self, and the efficient self is the easiest self for an algorithm to serve.",
      },
    },
  };

  const result = archetypeMap[dominant]?.[dominantDir];
  if (result) return result;

  return {
    designation: "The Composite",
    description: "One whose pattern resists simple classification",
    analysis: "Your choices did not converge on a single pattern. This is perhaps the most honest result — the self is not a vector but a field, and your journey through the three zones reflected the genuine complexity of navigating mediated experience without a predetermined stance.",
  };
}

function generateAxisReading(axis: DriftAxis, value: number): string {
  const readings: Record<DriftAxis, Record<string, string>> = {
    autonomy: {
      high: "Strong self-direction. You chose your own path more often than the curated one.",
      mid: "A measured stance — neither fully autonomous nor fully guided.",
      low: "Significant delegation to algorithmic judgment. The path of least resistance became the default path.",
    },
    novelty: {
      high: "Active divergence from your established profile. You sought what the system would not have predicted.",
      mid: "An even distribution between the familiar and the new.",
      low: "Gravitational pull toward the known. Your profile deepened rather than broadened.",
    },
    sociality: {
      high: "Oriented toward connection and collective alignment.",
      mid: "A balanced relationship between solitude and community.",
      low: "Preference for independent action. The social signal was deprioritized.",
    },
    tempo: {
      high: "Acceleration was the consistent preference. Speed over texture.",
      mid: "No strong temporal bias. Some haste, some deliberation.",
      low: "Consistent choice of the slower option. Duration valued over efficiency.",
    },
    affect: {
      high: "Emotional engagement remained high. You chose presence over convenience.",
      mid: "Moderate emotional investment across encounters.",
      low: "Emotional economy. The path of minimal affective expenditure.",
    },
  };

  const level = value > 0.1 ? "high" : value < -0.1 ? "low" : "mid";
  return readings[axis][level];
}

/** Generate a zone-by-zone transformation summary */
function generateZoneSummary(choices: ChoiceRecord[]): { zoneId: number; title: string; subtitle: string; choiceCount: number }[] {
  const summaries: { zoneId: number; title: string; subtitle: string; choiceCount: number }[] = [];
  for (const zone of zones) {
    const zoneChoices = choices.filter((c) => c.zoneId === zone.id);
    if (zoneChoices.length > 0) {
      summaries.push({
        zoneId: zone.id,
        title: zone.title,
        subtitle: zone.subtitle,
        choiceCount: zoneChoices.length,
      });
    }
  }
  return summaries;
}

/** Generate final subject diagnostic summary */
function generateDiagnosticSummary(
  userName: string | null,
  archetype: ArchetypeResult,
  baseline: DriftProfile,
  current: DriftProfile,
  choices: ChoiceRecord[],
  driftPercentage: number
): string {
  const subject = userName || "The subject";

  // Count delegation vs autonomy choices
  const delegatedCount = choices.filter((c) =>
    c.driftVectors.some((v) => v.axis === "autonomy" && v.delta < 0)
  ).length;
  const autonomousCount = choices.filter((c) =>
    c.driftVectors.some((v) => v.axis === "autonomy" && v.delta > 0)
  ).length;

  // Find most stable and most shifted axes
  let minShift = Infinity;
  let maxShift = 0;
  let stableAxis: DriftAxis = "autonomy";
  let shiftedAxis: DriftAxis = "autonomy";

  for (const axis of AXES) {
    const d = Math.abs(current[axis] - baseline[axis]);
    if (d < minShift) {
      minShift = d;
      stableAxis = axis;
    }
    if (d > maxShift) {
      maxShift = d;
      shiftedAxis = axis;
    }
  }

  const delegationRatio = choices.length > 0
    ? Math.round((delegatedCount / choices.length) * 100)
    : 0;

  let summary = `${subject} entered the experience as a baseline self — unmediated, uncurated, carrying only the orientations established during calibration. `;

  if (driftPercentage <= 15) {
    summary += `Over nine encounters, the profile shifted minimally (${driftPercentage}% total displacement). This stability suggests either strong prior convictions or a consistent strategy of resistance to algorithmic influence. `;
  } else if (driftPercentage <= 35) {
    summary += `Over nine encounters, the profile shifted measurably (${driftPercentage}% total displacement). The drift was distributed across multiple axes, suggesting a subject responsive to contextual pressure but not uniformly susceptible. `;
  } else {
    summary += `Over nine encounters, the profile shifted significantly (${driftPercentage}% total displacement). The magnitude of change indicates a subject who engaged deeply with each zone's framing — whether through acceptance or reaction, the system's influence registered. `;
  }

  summary += `The ${shiftedAxis} axis showed the greatest movement, while ${stableAxis} remained most stable. `;

  if (delegationRatio >= 60) {
    summary += `In ${delegationRatio}% of encounters, ${subject.toLowerCase() === "the subject" ? "the subject" : "they"} chose options that delegated decision-making to the system. This pattern — classified as "${archetype.designation}" — reflects not a failure of will but an environment designed to make delegation feel rational. `;
  } else if (delegationRatio <= 30) {
    summary += `In only ${delegationRatio}% of encounters did ${subject.toLowerCase() === "the subject" ? "the subject" : "they"} delegate to the system. This resistance — classified as "${archetype.designation}" — came at a cost: more time, more effort, more friction. The question is whether that cost remains sustainable. `;
  } else {
    summary += `The delegation pattern was mixed (${delegationRatio}% system-aligned choices), suggesting a subject who navigated each encounter on its own terms rather than from a fixed stance. Classification as "${archetype.designation}" reflects the dominant tendency, not the whole picture. `;
  }

  summary += `The experience is now complete. The distance between who ${subject.toLowerCase() === "the subject" ? "the subject was" : "they were"} and who ${subject.toLowerCase() === "the subject" ? "the subject is" : "they are"} was not created by any single choice. It accumulated — in the ordinary, in the convenient, in the reasonable.`;

  return summary;
}

export function FinalDiagnostic({
  userName,
  initialProfile,
  currentProfile,
  choices,
  snapshots,
}: FinalDiagnosticProps) {
  const archetype = deriveArchetype(currentProfile);
  const cumulativeDrift = computeCumulativeDrift(initialProfile, currentProfile);
  const driftPercentage = Math.round(cumulativeDrift * 100);
  const zoneSummaries = generateZoneSummary(choices);
  const diagnosticSummary = generateDiagnosticSummary(
    userName,
    archetype,
    initialProfile,
    currentProfile,
    choices,
    driftPercentage
  );

  return (
    <motion.div
      className="space-y-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Header */}
      <div className="text-center">
        <motion.p
          className="text-sm uppercase tracking-[0.4em] text-drift-muted/70 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Subject Diagnostic — Final State
        </motion.p>
        <motion.div
          className="w-16 mx-auto drift-divider"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
      </div>

      {/* Transformation portraits — baseline vs final */}
      <motion.div
        className="flex items-center justify-center gap-12 sm:gap-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.2 }}
      >
        <div className="text-center">
          <Image
            src="/baseline.png"
            alt="Baseline self"
            width={140}
            height={140}
            className="rounded-sm object-cover"
          />
          <p className="text-[9px] text-drift-muted/55 mt-4 uppercase tracking-[0.2em]">
            Baseline
          </p>
          <div className="mt-2 space-y-0.5">
            {AXES.map((axis) => (
              <p key={axis} className="text-[8px] font-mono text-drift-muted/60">
                {axis.slice(0, 3)}: {initialProfile[axis] > 0 ? "+" : ""}{(initialProfile[axis] * 100).toFixed(0)}
              </p>
            ))}
          </div>
        </div>
        <motion.div
          className="text-drift-muted/15 text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          →
        </motion.div>
        <div className="text-center">
          <Image
            src="/Final Diagnostic.png"
            alt="Final state"
            width={140}
            height={140}
            className="rounded-sm object-cover"
          />
          <p className="text-[9px] text-drift-muted/55 mt-4 uppercase tracking-[0.2em]">
            Final
          </p>
          <div className="mt-2 space-y-0.5">
            {AXES.map((axis) => (
              <p key={axis} className="text-[8px] font-mono text-drift-muted/60">
                {axis.slice(0, 3)}: {currentProfile[axis] > 0 ? "+" : ""}{(currentProfile[axis] * 100).toFixed(0)}
              </p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Archetype designation */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/60">
          Subject Classification
        </p>
        <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-drift-accent/85 tracking-[-0.01em]">
          {archetype.designation}
        </h3>
        <p className="text-[13px] text-drift-muted/50 italic leading-relaxed">
          {archetype.description}
        </p>
        {userName && (
          <p className="text-[11px] text-drift-muted/60 mt-3 font-mono">
            Subject: {userName}
          </p>
        )}
      </motion.div>

      {/* Cumulative drift */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <div className="drift-divider mb-8" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/60 mb-3">
          Total Displacement
        </p>
        <p className="font-serif text-5xl sm:text-6xl text-drift-accent/75 font-light tracking-tight">
          {driftPercentage}%
        </p>
        <p className="text-[11px] text-drift-muted/55 mt-2 leading-relaxed">
          from baseline across {choices.length} encounters in {zoneSummaries.length} zones
        </p>
        <div className="drift-divider mt-8" />
      </motion.div>

      {/* Zone journey */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.8 }}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/60 text-center mb-6">
          Zone Progression
        </p>
        {zoneSummaries.map((summary, i) => (
          <motion.div
            key={summary.zoneId}
            className="flex items-center gap-4 border-l border-drift-border/25 pl-5 py-1"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.2 + i * 0.15 }}
          >
            <div className="w-7 h-7 rounded-full border border-drift-accent/25 flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-mono text-drift-accent/50">
                {summary.zoneId}
              </span>
            </div>
            <div>
              <p className="text-sm text-drift-text/80">
                {summary.title}
              </p>
              <p className="text-[10px] text-drift-muted/55">
                {summary.subtitle} — {summary.choiceCount} encounters
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Axis readings — baseline vs final */}
      <motion.div
        className="space-y-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.8 }}
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-drift-muted/60 text-center mb-2">
          Axis Readings — Origin vs. Terminal State
        </p>
        {AXES.map((axis, i) => (
          <motion.div
            key={axis}
            className="border-l border-drift-border/25 pl-5"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3 + i * 0.15, duration: 0.5 }}
          >
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-[0.15em] text-drift-muted/60">
                {axis}
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-[9px] font-mono text-drift-muted/60">
                  {initialProfile[axis] > 0 ? "+" : ""}{(initialProfile[axis] * 100).toFixed(0)}
                </span>
                <span className="text-drift-muted/15 text-xs">→</span>
                <span className="text-[11px] font-mono text-drift-accent/45">
                  {currentProfile[axis] > 0 ? "+" : ""}{(currentProfile[axis] * 100).toFixed(0)}
                </span>
                <span
                  className={`text-[9px] font-mono ${
                    currentProfile[axis] - initialProfile[axis] >= 0
                      ? "text-drift-accent/30"
                      : "text-drift-alert/30"
                  }`}
                >
                  ({currentProfile[axis] - initialProfile[axis] >= 0 ? "+" : ""}
                  {Math.round((currentProfile[axis] - initialProfile[axis]) * 100)})
                </span>
              </div>
            </div>
            <p className="text-xs text-drift-text/80 leading-[1.7]">
              {generateAxisReading(axis, currentProfile[axis])}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Interpretive Analysis */}
      <motion.div
        className="bg-drift-surface/30 border border-drift-border/15 rounded-lg p-7 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1.2 }}
      >
        <p className="text-[10px] uppercase tracking-[0.25em] text-drift-muted/55 mb-5">
          Diagnostic Interpretation
        </p>
        <p className="text-sm text-drift-text/70 leading-[1.8]">
          {archetype.analysis}
        </p>
      </motion.div>

      {/* Subject Diagnostic Summary */}
      <motion.div
        className="bg-drift-surface/30 border border-drift-border/15 rounded-lg p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5, duration: 1 }}
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-drift-muted/60 mb-4">
          Subject Diagnostic Summary
        </p>
        <p className="text-xs text-drift-text/80 leading-relaxed">
          {diagnosticSummary}
        </p>
      </motion.div>
    </motion.div>
  );
}
