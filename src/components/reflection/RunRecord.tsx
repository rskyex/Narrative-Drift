"use client";

import Link from "next/link";
import { ChoiceRecord } from "@/engine/types";
import {
  calibrationChoiceIndex,
  encounterChoiceIndex,
  formatSequence,
} from "@/engine/verifier";
import { calibrationPrompts } from "@/engine/calibration";

interface RunRecordProps {
  calibrationChoiceIds: string[];
  choices: ChoiceRecord[];
  verifierRun: string | null;
  onDownload: () => void;
}

/**
 * Small, unobtrusive block in the diagnostic sidebar: the exact choice
 * sequence for this run, a link that replays it, and the JSON export.
 */
export function RunRecord({ calibrationChoiceIds, choices, verifierRun, onDownload }: RunRecordProps) {
  const calibration = calibrationChoiceIds.map((id, i) => calibrationChoiceIndex(i, id));
  const encounters = choices.map((c) => encounterChoiceIndex(c.encounterId, c.choiceId));
  const complete =
    calibration.length === calibrationPrompts.length &&
    calibration.every((i) => i >= 0) &&
    encounters.every((i) => i >= 0);
  const seq = complete ? formatSequence({ calibration, encounters }) : null;

  return (
    <div className="space-y-2 text-center lg:text-left">
      <p className="text-[10px] uppercase tracking-[0.3em] text-drift-text/65">Run record</p>
      {verifierRun && (
        <p className="text-[11px] text-drift-accent/80">Verifier replay: {verifierRun}</p>
      )}
      {seq ? (
        <p className="text-[11px] text-drift-text/70 leading-relaxed">
          Choice sequence{" "}
          <span className="font-mono text-drift-text/85" data-testid="run-sequence">{seq}</span>
          <br />
          <Link
            href={`/verify?seq=${seq}`}
            className="underline underline-offset-4 hover:text-drift-text"
          >
            Replay this sequence
          </Link>
        </p>
      ) : (
        <p className="text-[11px] text-drift-text/60 leading-relaxed">
          Calibration choices were not recorded for this session, so the full sequence is unavailable.
        </p>
      )}
      <button
        onClick={onDownload}
        className="text-[11px] tracking-[0.15em] uppercase text-drift-text/75 hover:text-drift-text border border-drift-border/60 hover:border-drift-accent/60 rounded px-3 py-2 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-drift-accent"
      >
        Download result (JSON)
      </button>
    </div>
  );
}
