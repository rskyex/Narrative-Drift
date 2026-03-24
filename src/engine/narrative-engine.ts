import { Scenario } from "./types";
import { scenarios } from "./scenarios";

export function getScenario(index: number): Scenario | null {
  return scenarios[index] ?? null;
}

export function getTotalScenarios(): number {
  return scenarios.length;
}

export function isExperienceComplete(completedCount: number): boolean {
  return completedCount >= scenarios.length;
}
