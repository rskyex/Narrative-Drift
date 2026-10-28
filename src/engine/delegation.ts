/**
 * Delegation: whether a choice accepted what the AI or interface proposed in
 * its scene. Read from each option's followsSystemSuggestion tag in zones.ts,
 * so it is measured separately from the autonomy axis.
 */
import { zones } from "./zones";
import { ChoiceRecord } from "./types";

const TAG = new Map<string, boolean>(
  zones.flatMap((z) => z.encounters.flatMap((e) => e.choices.map((c) => [`${e.id}/${c.id}`, c.followsSystemSuggestion] as const)))
);

/** True when the recorded choice followed the system's suggestion. */
export function followsSystemSuggestion(choice: Pick<ChoiceRecord, "encounterId" | "choiceId">): boolean {
  return TAG.get(`${choice.encounterId}/${choice.choiceId}`) === true;
}

/** Count and rounded share of choices that followed the system's suggestion. */
export function systemAlignedRate(choices: Pick<ChoiceRecord, "encounterId" | "choiceId">[]) {
  const count = choices.filter(followsSystemSuggestion).length;
  return { count, pct: choices.length > 0 ? Math.round((count / choices.length) * 100) : 0 };
}
