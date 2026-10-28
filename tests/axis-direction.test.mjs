// Every axis is drawn with negative values on the left label and positive
// values on the right label. This checks that the right-hand label of each
// axis means what a positive calibration delta means, and the left-hand label
// what a negative delta means.
import { test } from "node:test";
import assert from "node:assert/strict";
import { calibrationPrompts } from "@/engine/calibration";
import { getAxisLabels } from "@/engine/drift-model";

// What the most positive and most negative calibration answers on each axis
// express, written out from the answer wording in calibration.ts.
const MEANING = {
  autonomy: { positive: ["cal-a-self", "Self-directed"], negative: ["cal-a-seek", "Externally guided"] },
  novelty: { positive: ["cal-n-wander", "Novelty-seeking"], negative: ["cal-n-curate", "Familiar-seeking"] },
  sociality: { positive: ["cal-s-group", "Socially aligned"], negative: ["cal-s-alone", "Independent"] },
  tempo: { positive: ["cal-t-fast", "Optimized"], negative: ["cal-t-slow", "Deliberate"] },
  affect: { positive: ["cal-af-recent", "Expressive"], negative: ["cal-af-distant", "Reserved"] },
};

for (const prompt of calibrationPrompts) {
  const { axis } = prompt;
  test(`${axis}: positive end is labelled as the positive calibration answer means`, () => {
    const delta = (c) => c.driftVectors.filter((v) => v.axis === axis).reduce((s, v) => s + v.delta, 0);
    const byDelta = [...prompt.choices].sort((a, b) => delta(b) - delta(a));
    const mostPositive = byDelta[0];
    const mostNegative = byDelta[byDelta.length - 1];
    const [leftLabel, rightLabel] = getAxisLabels(axis);
    const want = MEANING[axis];

    assert.ok(delta(mostPositive) > 0, `${axis} has a positive calibration answer`);
    assert.ok(delta(mostNegative) < 0, `${axis} has a negative calibration answer`);
    assert.equal(mostPositive.id, want.positive[0], `most positive ${axis} answer`);
    assert.equal(mostNegative.id, want.negative[0], `most negative ${axis} answer`);
    assert.equal(rightLabel, want.positive[1], `${axis} right-hand (positive) label`);
    assert.equal(leftLabel, want.negative[1], `${axis} left-hand (negative) label`);
  });
}
