"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore } from "@/store/session-store";
import { GrainOverlay } from "@/components/shared/GrainOverlay";
import {
  REFERENCE_SCRIPTS,
  formatSequence,
  parseSequence,
} from "@/engine/verifier";

const btnClass =
  "text-drift-text/70 hover:text-drift-text text-xs tracking-[0.25em] uppercase transition-all duration-300 py-3 px-6 border border-drift-border hover:border-drift-accent/60 hover:bg-drift-surface/40 rounded focus:outline-none focus-visible:ring-1 focus-visible:ring-drift-accent";

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const loadVerifierRun = useSessionStore((s) => s.loadVerifierRun);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState<string | null>(null);

  const run = (raw: string, label: string) => {
    const seq = parseSequence(raw);
    if (!seq) {
      setError(
        "That sequence is not valid. Use 5 calibration digits, a hyphen, then 9 encounter digits, each 0, 1 or 2."
      );
      return;
    }
    setError(null);
    setRunning(label);
    loadVerifierRun(seq, label);
    router.push("/diagnostic");
  };

  // ?script=A or ?script=B, or ?seq=00000-000000000, replays immediately.
  useEffect(() => {
    const script = params.get("script")?.toUpperCase();
    const seqParam = params.get("seq");
    if (script && REFERENCE_SCRIPTS[script]) {
      const s = REFERENCE_SCRIPTS[script];
      run(formatSequence(s.sequence), s.label);
    } else if (seqParam) {
      setCustom(seqParam);
      run(seqParam, `Sequence ${seqParam}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <main className="relative min-h-screen px-4 sm:px-6 py-20">
      <GrainOverlay />
      <div className="relative z-10 max-w-xl mx-auto space-y-10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-drift-text/70 mb-3">
            Verifier mode
          </p>
          <div className="w-16 drift-divider mb-8" />
          <h1 className="font-serif text-2xl sm:text-3xl text-drift-text/90 leading-[1.4] mb-5">
            Reproduce a run from a fixed choice sequence
          </h1>
          <p className="text-sm text-drift-text/75 leading-[1.8]">
            A replay feeds the listed option indices through the same scoring
            engine as the interactive experience and opens the final diagnostic.
            Replays send no analytics events, so they do not enter the collective
            statistics. Indices start at 0 and follow the order options appear
            on screen.
          </p>
        </div>

        {running && (
          <p role="status" className="text-sm text-drift-accent">
            Replaying {running}. Opening the diagnostic.
          </p>
        )}

        <ul className="space-y-3">
          {Object.entries(REFERENCE_SCRIPTS).map(([key, s]) => {
            const seq = formatSequence(s.sequence);
            return (
              <li
                key={key}
                className="border border-drift-border rounded p-5 bg-drift-surface/30 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm text-drift-text/90">{s.label}</p>
                  <p className="text-xs text-drift-text/60 mt-1">{s.description}</p>
                  <p className="text-xs font-mono text-drift-accent/80 mt-2 break-all">{seq}</p>
                </div>
                <button className={btnClass} onClick={() => run(seq, s.label)}>
                  Replay
                </button>
              </li>
            );
          })}
        </ul>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            run(custom, `Sequence ${custom.trim()}`);
          }}
        >
          <label htmlFor="seq" className="block text-xs uppercase tracking-[0.2em] text-drift-text/70">
            Custom sequence
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="seq"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="00000-000000000"
              inputMode="numeric"
              aria-describedby="seq-help"
              className="flex-1 min-w-0 bg-transparent border-b border-drift-border text-drift-text font-mono py-2 placeholder:text-drift-muted/70 focus:outline-none focus:border-drift-accent/60"
            />
            <button type="submit" className={btnClass}>
              Replay
            </button>
          </div>
          <p id="seq-help" className="text-xs text-drift-text/55">
            The sequence of any run is shown under &quot;Run record&quot; on its diagnostic page
            and in its downloaded JSON.
          </p>
          {error && (
            <p role="alert" className="text-xs text-drift-alert">
              {error}
            </p>
          )}
        </form>

        <Link href="/" className="inline-block text-xs text-drift-text/60 hover:text-drift-text underline underline-offset-4">
          Back to the experience
        </Link>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}
