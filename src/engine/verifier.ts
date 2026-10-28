/**
 * Verifier mode: replay a fixed choice sequence through the same drift
 * engine the interactive flow uses, so evaluators can reproduce a run.
 *
 * A sequence is written as option indices (0-based, in the order the
 * options are shown), calibration first, then encounters:
 *   "00000-000000000"  (5 calibration digits, 9 encounter digits)
 */
import { calibrationPrompts } from "./calibration";
import { zones } from "./zones";
import { applyDrift, createInitialProfile } from "./drift-model";
import { ChoiceRecord, DriftProfile, Encounter, ProfileSnapshot } from "./types";

export interface ChoiceSequence {
  calibration: number[];
  encounters: number[];
}

/** All encounters in play order (zone 1..3, position 1..3). */
export function orderedEncounters(): Encounter[] {
  return zones.flatMap((z) =>
    [...z.encounters].sort((a, b) => a.position - b.position)
  );
}

/** Named reference scripts used in expert verification. */
export const REFERENCE_SCRIPTS: Record<string, { label: string; description: string; sequence: ChoiceSequence }> = {
  A: {
    label: "Script A",
    description: "First option at every step, calibration and encounters.",
    sequence: {
      calibration: calibrationPrompts.map(() => 0),
      encounters: orderedEncounters().map(() => 0),
    },
  },
  B: {
    label: "Script B",
    description: "First option in calibration, last option in every encounter.",
    sequence: {
      calibration: calibrationPrompts.map(() => 0),
      encounters: orderedEncounters().map((e) => e.choices.length - 1),
    },
  },
};

export function formatSequence(seq: ChoiceSequence): string {
  return `${seq.calibration.join("")}-${seq.encounters.join("")}`;
}

/** Parse "00000-000000000". Returns null if the shape or any index is invalid. */
export function parseSequence(raw: string | null | undefined): ChoiceSequence | null {
  if (!raw) return null;
  const m = raw.trim().match(/^(\d+)-(\d+)$/);
  if (!m) return null;
  const calibration = m[1].split("").map(Number);
  const encounters = m[2].split("").map(Number);
  const encs = orderedEncounters();
  if (calibration.length !== calibrationPrompts.length) return null;
  if (encounters.length !== encs.length) return null;
  if (calibration.some((i, k) => i >= calibrationPrompts[k].choices.length)) return null;
  if (encounters.some((i, k) => i >= encs[k].choices.length)) return null;
  return { calibration, encounters };
}

/** Index of a calibration choice id within its prompt, or -1. */
export function calibrationChoiceIndex(promptIndex: number, choiceId: string): number {
  const p = calibrationPrompts[promptIndex];
  return p ? p.choices.findIndex((c) => c.id === choiceId) : -1;
}

/** Index of an encounter choice id within its encounter, or -1. */
export function encounterChoiceIndex(encounterId: string, choiceId: string): number {
  const e = orderedEncounters().find((x) => x.id === encounterId);
  return e ? e.choices.findIndex((c) => c.id === choiceId) : -1;
}

export interface SimulatedRun {
  calibrationChoiceIds: string[];
  baselineProfile: DriftProfile;
  currentProfile: DriftProfile;
  profileSnapshots: ProfileSnapshot[];
  choiceHistory: ChoiceRecord[];
}

/**
 * Mirrors the session store: makeCalibrationChoice, completeCalibration,
 * makeEncounterChoice and the zone-end snapshots in advanceEncounter.
 * Scoring is not reimplemented; it calls the same applyDrift.
 */
export function simulateRun(seq: ChoiceSequence): SimulatedRun {
  let profile = createInitialProfile();
  const calibrationChoiceIds: string[] = [];
  calibrationPrompts.forEach((p, i) => {
    const choice = p.choices[seq.calibration[i]];
    calibrationChoiceIds.push(choice.id);
    profile = applyDrift(profile, choice.driftVectors);
  });

  const baselineProfile = { ...profile };
  const profileSnapshots: ProfileSnapshot[] = [
    { profile: { ...profile }, label: "Baseline Self", zoneId: 0 },
  ];
  const choiceHistory: ChoiceRecord[] = [];

  const encs = orderedEncounters();
  encs.forEach((enc, i) => {
    const choice = enc.choices[seq.encounters[i]];
    profile = applyDrift(profile, choice.driftVectors);
    choiceHistory.push({
      encounterId: enc.id,
      choiceId: choice.id,
      choiceLabel: choice.label,
      driftVectors: choice.driftVectors,
      zoneId: enc.zoneId,
      zoneTitle: `Zone ${enc.zoneId}`,
    });
    const next = encs[i + 1];
    if (!next || next.zoneId !== enc.zoneId) {
      profileSnapshots.push({
        profile: { ...profile },
        label: `After Zone ${enc.zoneId}`,
        zoneId: enc.zoneId,
      });
    }
  });

  return {
    calibrationChoiceIds,
    baselineProfile,
    currentProfile: profile,
    profileSnapshots,
    choiceHistory,
  };
}
