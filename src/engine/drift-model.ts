import { DriftAxis, DriftProfile, DriftVector, ChoiceRecord } from "./types";

const AXES: DriftAxis[] = ["autonomy", "novelty", "sociality", "tempo", "affect"];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function createInitialProfile(): DriftProfile {
  return { autonomy: 0, novelty: 0, sociality: 0, tempo: 0, affect: 0 };
}

export function applyDrift(
  profile: DriftProfile,
  vectors: DriftVector[]
): DriftProfile {
  const next = { ...profile };
  for (const v of vectors) {
    next[v.axis] = clamp(next[v.axis] + v.delta, -1, 1);
  }
  return next;
}

/** Euclidean distance in 5D space, normalized to 0–1 */
export function computeCumulativeDrift(
  initial: DriftProfile,
  current: DriftProfile
): number {
  const sumSq = AXES.reduce((sum, axis) => {
    return sum + Math.pow(current[axis] - initial[axis], 2);
  }, 0);
  // Max possible distance is sqrt(5 * 4) ≈ 4.47 (each axis can span 2 units)
  return Math.sqrt(sumSq) / Math.sqrt(AXES.length * 4);
}

/** Rebuild profile state after each choice, for timeline visualization */
export function getProfileSnapshots(
  choices: ChoiceRecord[],
  baselineProfile?: DriftProfile
): { profile: DriftProfile; choiceLabel: string; encounterId: string; zoneId: number }[] {
  const snapshots: { profile: DriftProfile; choiceLabel: string; encounterId: string; zoneId: number }[] = [];
  let current = baselineProfile ? { ...baselineProfile } : createInitialProfile();

  for (const choice of choices) {
    current = applyDrift(current, choice.driftVectors);
    snapshots.push({
      profile: { ...current },
      choiceLabel: choice.choiceLabel,
      encounterId: choice.encounterId,
      zoneId: choice.zoneId,
    });
  }

  return snapshots;
}

/**
 * Human-readable label for each end of an axis: [negative end, positive end].
 * Components draw negative values to the left and positive to the right, so
 * the second label must describe what a positive delta means.
 */
export function getAxisLabels(axis: DriftAxis): [string, string] {
  const labels: Record<DriftAxis, [string, string]> = {
    autonomy: ["Externally guided", "Self-directed"],
    novelty: ["Familiar-seeking", "Novelty-seeking"],
    sociality: ["Independent", "Socially aligned"],
    tempo: ["Deliberate", "Optimized"],
    affect: ["Reserved", "Expressive"],
  };
  return labels[axis];
}
