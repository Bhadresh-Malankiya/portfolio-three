import assert from "node:assert/strict";
import { sampleAvatarStride } from "../src/lib/avatar-locomotion.ts";

let samples = 0;
let maximumContactDrift = 0;
for (const amount of [.05, .2, .4, .6, .8, 1]) {
  for (let frame = 0; frame < 1200; frame++) {
    const phase = frame / 1200 * Math.PI * 2;
    const stride = sampleAvatarStride(phase, amount);
    for (const leg of [stride.right, stride.left]) {
      for (const angle of [leg.hip, leg.knee, leg.ankle]) assert.ok(Number.isFinite(angle), "Joint angles remain finite");
      assert.ok(leg.knee >= 0 && leg.knee < Math.PI, "Knees only bend in their anatomical direction");
      const forward = -.205 * Math.sin(leg.hip) - .205 * Math.sin(leg.hip + leg.knee);
      const down = -.205 * Math.cos(leg.hip) - .205 * Math.cos(leg.hip + leg.knee);
      assert.ok(Math.abs(forward - leg.forward) < 1e-9, "Joint chain reaches the intended stride position");
      assert.ok(Math.abs(down + stride.bodyY + .41 - leg.lift) < 1e-9, "Joint chain reaches the intended foot height");
      if (leg.grounded) {
        assert.equal(leg.lift, 0, "Contact foot stays on the floor");
        maximumContactDrift = Math.max(maximumContactDrift, Math.abs(down + stride.bodyY + .41));
      } else {
        assert.ok(leg.lift >= 0, "The recovering foot clears the floor");
      }
      samples++;
    }
    const opposite = sampleAvatarStride(phase + Math.PI, amount);
    assert.ok(Math.abs(stride.right.hip - opposite.left.hip) < 1e-9, "Left and right strides alternate by half a cycle");
  }
}
assert.ok(maximumContactDrift < 1e-9, "Contact foot stays planted through body weight shifts");
console.log(`Avatar locomotion: ${samples.toLocaleString()} joint samples passed; maximum contact drift ${maximumContactDrift.toExponential(2)}.`);
