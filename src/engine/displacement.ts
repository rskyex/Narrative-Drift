/**
 * Reachable displacement. computeCumulativeDrift divides by the theoretical
 * maximum distance (every axis moving the full -1..+1 span), which the nine
 * scripted encounters cannot come close to. This module finds, for a given
 * baseline, the largest displacement any combination of encounter choices can
 * actually produce, by trying every combination (3^9 = 19,683) through the
 * same applyDrift used in play. The drift vectors and scoring are unchanged.
 */
import { applyDrift, computeCumulativeDrift } from "./drift-model";
import { orderedEncounters } from "./verifier";
import { DriftProfile } from "./types";

export interface ReachableMaximum {
  /** Largest reachable displacement, on the same 0-1 scale as computeCumulativeDrift. */
  max: number;
  /** One choice sequence (0-based option indices, play order) that reaches it. */
  encounters: number[];
}

const cache = new Map<string, ReachableMaximum>();

export function maxReachableDrift(baseline: DriftProfile): ReachableMaximum {
  const key = JSON.stringify(baseline);
  const hit = cache.get(key);
  if (hit) return hit;

  const encs = orderedEncounters();
  let best: ReachableMaximum = { max: 0, encounters: [] };
  const path: number[] = [];
  const visit = (i: number, profile: DriftProfile) => {
    if (i === encs.length) {
      const d = computeCumulativeDrift(baseline, profile);
      if (d > best.max) best = { max: d, encounters: [...path] };
      return;
    }
    encs[i].choices.forEach((choice, k) => {
      path.push(k);
      visit(i + 1, applyDrift(profile, choice.driftVectors));
      path.pop();
    });
  };
  visit(0, baseline);

  cache.set(key, best);
  return best;
}

export interface DisplacementFigures {
  /** Share of the theoretical maximum (the figure shown before this change). */
  theoretical: number;
  /** Share of the largest displacement the encounters can reach from this baseline. */
  reachable: number;
  /** That largest reachable displacement, as a share of the theoretical maximum. */
  reachableMax: number;
}

export function displacementFigures(baseline: DriftProfile, current: DriftProfile): DisplacementFigures {
  const theoretical = computeCumulativeDrift(baseline, current);
  const reachableMax = maxReachableDrift(baseline).max;
  return { theoretical, reachable: reachableMax > 0 ? theoretical / reachableMax : 0, reachableMax };
}
