// Regression guard for the reference verifier scripts: the drift vectors
// and scoring maths must keep producing these exact results.
import { test } from "node:test";
import assert from "node:assert/strict";
import { REFERENCE_SCRIPTS, simulateRun } from "@/engine/verifier";
import { computeCumulativeDrift } from "@/engine/drift-model";
import { deriveArchetype } from "@/components/rpg/FinalDiagnostic";

const pts = (v) => Math.round(v * 100);

const EXPECTED = {
  A: {
    classification: "The Optimized",
    displacement: 22,
    axes: { autonomy: [20, -60], novelty: [20, 2], sociality: [20, 36], tempo: [20, 68], affect: [20, 8] },
  },
  B: {
    classification: "The Self-Authored",
    displacement: 12,
    axes: { autonomy: [20, 68], novelty: [20, 20], sociality: [20, -2], tempo: [20, 4], affect: [20, 14] },
  },
};

for (const [key, want] of Object.entries(EXPECTED)) {
  test(`verifier script ${key} reproduces its reference result`, () => {
    const run = simulateRun(REFERENCE_SCRIPTS[key].sequence);
    assert.equal(deriveArchetype(run.currentProfile).designation, want.classification);
    assert.equal(Math.round(computeCumulativeDrift(run.baselineProfile, run.currentProfile) * 100), want.displacement);
    for (const [axis, [origin, end]] of Object.entries(want.axes)) {
      assert.equal(pts(run.baselineProfile[axis]), origin, `${axis} origin`);
      assert.equal(pts(run.currentProfile[axis]), end, `${axis} end`);
    }
  });
}

test("reachable maximum displacement for the reference baseline", async () => {
  const { displacementFigures } = await import("@/engine/displacement");
  const a = simulateRun(REFERENCE_SCRIPTS.A.sequence);
  const b = simulateRun(REFERENCE_SCRIPTS.B.sequence);
  const fa = displacementFigures(a.baselineProfile, a.currentProfile);
  const fb = displacementFigures(b.baselineProfile, b.currentProfile);
  assert.equal(Number((fa.reachableMax * 100).toFixed(2)), 24.1);
  assert.equal(Math.round(fa.reachable * 100), 90);
  assert.equal(Math.round(fb.reachable * 100), 52);
  // The reachable maximum can never exceed the theoretical scale.
  assert.ok(fa.reachableMax <= 1 && fa.theoretical <= fa.reachableMax);
});
