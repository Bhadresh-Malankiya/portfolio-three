import assert from "node:assert/strict";
import { flightStops, flightScrollStops, flightTimelineProgress, flightChapterAt, advanceFlightClock, createFlightClock, flightRevealSeconds, flightEntranceSeconds } from "../src/lib/hero-flight.ts";

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

const frame = { delta: .016, progress: .08, active: true, presented: true, reducedMotion: false };
let clock = createFlightClock();
let result;
for (let step = 0; step < 200; step++) {
  result = advanceFlightClock(clock, { ...frame, presented: false });
  clock = result.clock;
  assert.equal(result.arrival, 0, "Hidden WebGL preparation keeps the exact first pose");
  assert.equal(result.elapsed, 0, "Loading must not consume the entrance animation");
}
assert.equal(clock.presentedSeconds, 0);
result = advanceFlightClock(clock, { ...frame, delta: 0 });
assert.equal(result.arrival, 0, "The first presented frame matches the prepared frame");
clock = result.clock;
for (let step = 0; step < 6; step++) {
  result = advanceFlightClock(clock, { ...frame, delta: .05 });
  clock = result.clock;
  assert.equal(result.arrival, 0, "The plane stays stationary while the canvas fades in");
}
result = advanceFlightClock(clock, { ...frame, delta: .02 });
clock = result.clock;
assert.ok(Math.abs(clock.presentedSeconds - flightRevealSeconds) < 1e-12);
assert.ok(result.arrival < 1e-12, "The reveal completes before the entrance begins");
result = advanceFlightClock(clock, { ...frame, progress: .5 });
assert.ok(result.arrival > 0, "Visible time starts the entrance after the reveal");
assert.equal(result.velocity, 0, "The first moving frame cannot manufacture scroll velocity");
assert.equal(result.enteredBuild, false, "Restoring the build chapter is not a chapter transition");
clock = result.clock;

const beforePause = clock.presentedSeconds;
for (let step = 0; step < 100; step++) {
  result = advanceFlightClock(clock, { ...frame, delta: 10, active: false, progress: .9 });
  clock = result.clock;
  assert.equal(clock.presentedSeconds, beforePause, "Offscreen/background time is paused");
}
result = advanceFlightClock(clock, { ...frame, progress: .5 });
assert.equal(result.velocity, 0, "Resuming cannot turn an offscreen scroll into a hard bank");
assert.equal(result.enteredBuild, false, "Resuming in build cannot launch a speed burst");
assert.ok(result.clock.presentedSeconds > beforePause, "Resume continues instead of restarting");
clock = result.clock;

for (let step = 0; step < 150; step++) {
  const nextProgress = step % 2 ? .08 : .9;
  result = advanceFlightClock(clock, { ...frame, progress: nextProgress });
  assert.ok(result.clock.presentedSeconds >= clock.presentedSeconds, "Chapter changes never rewind the entrance clock");
  clock = result.clock;
}
assert.equal(result.arrival, 1, "The entrance finishes once and remains finished");
result = advanceFlightClock(clock, { ...frame, delta: 0, progress: .5 });
assert.equal(result.arrival, 1, "A layout-only frame cannot restart the entrance");
assert.equal(result.velocity, 0, "A zero-duration layout update has no velocity");
assert.equal(result.enteredBuild, false, "A zero-duration layout update cannot trigger a flight burst");
const resized = advanceFlightClock({ ...clock, wasPlaying: false }, { ...frame, progress: .5 });
assert.equal(resized.arrival, 1, "Reframing the camera preserves the completed entrance");
assert.equal(resized.velocity, 0, "The first frame after resizing does not interpret reframing as scroll velocity");
assert.equal(resized.enteredBuild, false);

let reduced = advanceFlightClock(createFlightClock(), { ...frame, reducedMotion: true, presented: false });
assert.equal(reduced.arrival, 1, "Reduced motion uses the settled pose from the first frame");
assert.equal(reduced.elapsed, 0);
assert.equal(reduced.clock.presentedSeconds, 0, "Even reduced motion does not consume hidden loading time");
reduced = advanceFlightClock(reduced.clock, { ...frame, reducedMotion: true });
assert.equal(reduced.clock.presentedSeconds, flightRevealSeconds + flightEntranceSeconds);
const reenabled = advanceFlightClock(reduced.clock, frame);
assert.equal(reenabled.arrival, 1, "Enabling motion later cannot replay the completed entrance");
assert.equal(reenabled.velocity, 0);

const steady = { presentedSeconds: 3, previousProgress: .08, wasPlaying: true };
const crossing = advanceFlightClock(steady, { ...frame, progress: .5 });
assert.equal(crossing.enteredBuild, true, "A genuine visible chapter transition retains the intended burst");
assert.equal(advanceFlightClock(crossing.clock, { ...frame, progress: .5 }).enteredBuild, false, "A chapter burst fires only once");
assert.equal(advanceFlightClock(steady, { ...frame, delta: 100 }).clock.presentedSeconds, 3.05, "A stalled frame cannot fast-forward the flight");
for (const delta of [-1, NaN, Infinity]) {
  assert.equal(advanceFlightClock(steady, { ...frame, delta }).clock.presentedSeconds, 3, "Invalid frame times cannot rewind or advance the animation");
}

console.log("Flight story and loading: continuous timeline, stable first pose, stationary reveal, pause/resume, no phantom bursts, reduced motion and no entrance replay passed.");
