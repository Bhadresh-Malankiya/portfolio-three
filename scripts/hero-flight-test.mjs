import assert from "node:assert/strict";
import { flightStops, flightScrollStops, flightTimelineProgress, flightChapterAt } from "../src/lib/hero-flight.ts";

let previous = 0;
for (let step = 0; step <= 1000; step++) {
  const scroll = step / 1000;
  const progress = flightTimelineProgress(scroll);
  assert.ok(progress >= previous && progress >= 0 && progress <= 1, "Flight is continuous and moves forward with the scroll");
  if (scroll >= .64) {
    assert.ok(progress >= .86, "The completed aircraft remains visible for the final 36% of the scroll");
    assert.equal(flightChapterAt(progress), 2, "Cruise keeps the final story chapter");
  }
  previous = progress;
}
flightScrollStops.forEach((stop, index) => assert.equal(flightChapterAt(flightTimelineProgress(stop)), index, "Chapter links land in the intended story"));
flightStops.forEach((stop, index) => assert.equal(flightChapterAt(stop), index, "Mobile chapter controls match desktop"));
assert.equal(flightTimelineProgress(-1), flightStops[0]);
assert.equal(flightTimelineProgress(2), 1);
console.log("Flight story: continuous scroll, three chapter destinations and sustained final cruise passed.");
