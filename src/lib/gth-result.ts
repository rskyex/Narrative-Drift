/**
 * Export a Narrative Drift run as a gth-result/v1 document.
 * Schema: see SCHEMA.md in the govern-the-human repository.
 *
 * Contains no personal content: the name entered on the landing page is
 * never included. Inputs are recorded as option indices only.
 */
import { ChoiceRecord, DriftAxis, DriftProfile } from "@/engine/types";
import { computeCumulativeDrift } from "@/engine/drift-model";
import { deriveArchetype } from "@/components/rpg/FinalDiagnostic";
import { calibrationPrompts } from "@/engine/calibration";
import {
  calibrationChoiceIndex,
  encounterChoiceIndex,
  formatSequence,
  orderedEncounters,
} from "@/engine/verifier";

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

/** Same rounding the diagnostic page uses for display. */
const pts = (v: number) => Number((v * 100).toFixed(0));

export const INSTRUMENT_VERSION =
  process.env.NEXT_PUBLIC_INSTRUMENT_VERSION || "unknown";

export interface BuildArgs {
  baselineProfile: DriftProfile;
  currentProfile: DriftProfile;
  choices: ChoiceRecord[];
  calibrationChoiceIds: string[];
  verifierRun: string | null;
}

export function buildGthResult({
  baselineProfile,
  currentProfile,
  choices,
  calibrationChoiceIds,
  verifierRun,
}: BuildArgs) {
  const calibration = calibrationChoiceIds.map((id, i) => calibrationChoiceIndex(i, id));
  const encounters = choices.map((c) => encounterChoiceIndex(c.encounterId, c.choiceId));
  const calibrationComplete =
    calibration.length === calibrationPrompts.length && calibration.every((i) => i >= 0);

  // Same definition as the diagnostic summary: a choice is system-aligned
  // when it moves the autonomy axis toward external guidance.
  const isAligned = (c: ChoiceRecord) =>
    c.driftVectors.some((v) => v.axis === "autonomy" && v.delta < 0);
  const alignedCount = choices.filter(isAligned).length;
  const alignedPct = choices.length > 0 ? Math.round((alignedCount / choices.length) * 100) : 0;

  const axisDelta = (c: ChoiceRecord, axis: DriftAxis) =>
    Math.round(c.driftVectors.filter((v) => v.axis === axis).reduce((s, v) => s + v.delta, 0) * 100);

  const zoneOf = new Map(orderedEncounters().map((e) => [e.id, e.zoneId]));

  const axes = Object.fromEntries(
    AXES.map((axis) => [
      axis,
      {
        origin: pts(baselineProfile[axis]),
        end: pts(currentProfile[axis]),
        change: Math.round((currentProfile[axis] - baselineProfile[axis]) * 100),
      },
    ])
  );

  return {
    schema: "gth-result/v1",
    instrument: {
      name: "narrative-drift",
      version: INSTRUMENT_VERSION,
      url: "https://narrative-drift.vercel.app",
    },
    generated_at: new Date().toISOString(),
    inputs: {
      mode: verifierRun ? "verifier" : "interactive",
      script: verifierRun,
      calibration_choices: calibrationComplete ? calibration : null,
      encounter_choices: encounters,
      sequence: calibrationComplete
        ? formatSequence({ calibration, encounters })
        : null,
      note: "Option indices are 0-based in the order shown on screen. Calibration first (5), then encounters in play order (9).",
    },
    outputs: {
      classification: deriveArchetype(currentProfile).designation,
      total_displacement_pct: Math.round(computeCumulativeDrift(baselineProfile, currentProfile) * 100),
      system_aligned_pct: alignedPct,
      system_aligned_count: alignedCount,
      encounter_count: choices.length,
      axis_scale: "points from -100 to +100",
      axes,
      encounters: choices.map((c, i) => ({
        id: c.encounterId,
        zone: zoneOf.get(c.encounterId) ?? c.zoneId,
        choice_index: encounters[i],
        choice_id: c.choiceId,
        system_aligned: isAligned(c),
        autonomy_delta: axisDelta(c, "autonomy"),
        tempo_delta: axisDelta(c, "tempo"),
      })),
    },
    privacy: {
      processing: "client-side",
      personal_content_included: false,
      excluded: ["name entered on the landing page"],
    },
  };
}

export type GthResult = ReturnType<typeof buildGthResult>;

export function downloadGthResult(args: BuildArgs) {
  const doc = buildGthResult(args);
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = doc.generated_at.slice(0, 10);
  a.href = url;
  a.download = `narrative-drift-result-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
