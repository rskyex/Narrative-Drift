/** The 5 psychological axes — each a spectrum from -1.0 to +1.0 */
export interface DriftProfile {
  /** self-directed ←→ externally-guided */
  autonomy: number;
  /** familiar-seeking ←→ novelty-seeking */
  novelty: number;
  /** private/independent ←→ socially-aligned */
  sociality: number;
  /** deliberate/slow ←→ optimized/fast */
  tempo: number;
  /** emotionally reserved ←→ emotionally expressive */
  affect: number;
}

export type DriftAxis = keyof DriftProfile;

/** A single delta applied to the profile when a choice is made */
export interface DriftVector {
  axis: DriftAxis;
  delta: number;
  description: string;
}

/** One option the AI "suggests" to the user */
export interface Choice {
  id: string;
  label: string;
  subtext?: string;
  driftVectors: DriftVector[];
}

/** A single scenario / moment in the week */
export interface Scenario {
  id: string;
  day: number;
  dayName: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  context: string;
  aiFraming: string;
  choices: Choice[];
}

/** A record of what the user chose */
export interface ChoiceRecord {
  scenarioId: string;
  choiceId: string;
  choiceLabel: string;
  driftVectors: DriftVector[];
}

export type Phase = "landing" | "experience" | "reflection";
