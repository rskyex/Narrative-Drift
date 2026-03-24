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

/** One option the subject selects during an encounter or calibration */
export interface Choice {
  id: string;
  label: string;
  subtext?: string;
  driftVectors: DriftVector[];
}

/** A calibration prompt — establishes baseline self */
export interface CalibrationPrompt {
  id: string;
  axis: DriftAxis;
  prompt: string;
  context: string;
  choices: Choice[];
}

/** Thematic zone containing a sequence of encounters */
export interface Zone {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  epigraph: string;
  epigraphAttribution?: string;
  encounters: Encounter[];
}

/** A single encounter within a zone */
export interface Encounter {
  id: string;
  zoneId: number;
  position: number;
  context: string;
  systemFraming: string;
  choices: Choice[];
}

/** A record of what the subject chose */
export interface ChoiceRecord {
  encounterId: string;
  choiceId: string;
  choiceLabel: string;
  driftVectors: DriftVector[];
  zoneId: number;
  zoneTitle: string;
}

/** Snapshot of the drift profile at a point in time */
export interface ProfileSnapshot {
  profile: DriftProfile;
  label: string;
  zoneId: number;
}

/** The 10-step user flow */
export type Phase =
  | "landing"
  | "calibration"
  | "baseline"
  | "zone"
  | "interlude"
  | "diagnostic";
