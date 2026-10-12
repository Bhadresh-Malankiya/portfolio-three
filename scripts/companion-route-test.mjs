import assert from "node:assert/strict";
import { sampleCompanionRoute, validateCompanionRoute, compileCompanionRoute, routeDistanceAtScroll, sampleCompanionRouteDistance } from "../src/lib/companion-route.ts";

const right = { x: 0, y: 0 };
const left = { x: -1288, y: 0 };
const about = { x: -1288, y: -160 };
const legs = [
  { start: 300, end: 1000, from: right, to: left, mode: "run" },
  { start: 1600, end: 2300, from: left, to: right, mode: "run" },
  { start: 4000, end: 4500, from: right, to: about, mode: "fly", lift: 40 },
  { start: 4900, end: 5400, from: about, to: left, mode: "fly", lift: 12 },
  { start: 6000, end: 6800, from: left, to: right, mode: "run" },
];
validateCompanionRoute(legs);
assert.deepEqual(sampleCompanionRoute(0, []), { ...right, phase: "rest", flight: 0, progress: 0, legIndex: -1 });
assert.equal(sampleCompanionRoute(-Infinity, legs).x, right.x);
assert.equal(sampleCompanionRoute(Infinity, legs).x, right.x);
assert.throws(() => sampleCompanionRoute(NaN, legs));
for (const mode of ["run", "fly"]) {
  const stationary = [{ start: 0, end: 100, from: right, to: right, mode, lift: 0 }];
  validateCompanionRoute(stationary);
  assert.equal(sampleCompanionRoute(50, stationary).phase, "rest");
  assert.equal(sampleCompanionRoute(50, stationary).flight, 0);
}

let samples = 0;
for (const [index, leg] of legs.entries()) {
  let previousX = leg.from.x;
  for (let step = 0; step <= 1000; step++) {
    const scroll = leg.start + (leg.end - leg.start) * step / 1000;
    const sample = sampleCompanionRoute(scroll, legs);
    assert.ok([sample.x, sample.y, sample.flight, sample.progress].every(Number.isFinite));
    assert.ok(sample.x >= Math.min(leg.from.x, leg.to.x) - 1e-9 && sample.x <= Math.max(leg.from.x, leg.to.x) + 1e-9);
    assert.ok(sample.y >= Math.min(leg.from.y, leg.to.y) - (leg.lift ?? 0) - 1e-9);
    assert.ok(sample.y <= Math.max(leg.from.y, leg.to.y) + 1e-9);
    assert.ok(sample.flight >= 0 && sample.flight <= 1);
    const sign = Math.sign(leg.to.x - leg.from.x);
    assert.ok((sample.x - previousX) * sign >= -1e-9, "Horizontal movement does not reverse within a leg");
    if (leg.mode === "run") {
      assert.equal(sample.y, leg.from.y, "Ground runs remain on their level margin");
      assert.equal(sample.flight, 0, "Ordinary crossings never use a flight pose");
    }
    if (step > 0 && step < 1000) assert.equal(sample.phase, leg.mode);
    previousX = sample.x;
    samples++;
  }
  const beginning = sampleCompanionRoute(leg.start, legs);
  const ending = sampleCompanionRoute(leg.end, legs);
  assert.deepEqual([beginning.x, beginning.y, beginning.phase], [leg.from.x, leg.from.y, "rest"]);
  assert.deepEqual([ending.x, ending.y, ending.phase], [leg.to.x, leg.to.y, "rest"]);
  const epsilon = (leg.end - leg.start) * 1e-5;
  const after = sampleCompanionRoute(leg.start + epsilon, legs);
  const before = sampleCompanionRoute(leg.end - epsilon, legs);
  assert.ok(Math.hypot(after.x - beginning.x, after.y - beginning.y) / epsilon < .0001, "Departure velocity starts at zero");
  assert.ok(Math.hypot(ending.x - before.x, ending.y - before.y) / epsilon < .0001, "Arrival velocity ends at zero");
  if (index < legs.length - 1) {
    const dwell = sampleCompanionRoute((leg.end + legs[index + 1].start) / 2, legs);
    assert.deepEqual([dwell.x, dwell.y, dwell.phase, dwell.flight], [leg.to.x, leg.to.y, "rest", 0], "Reading stops hold their exact position");
  }
}
const positions = Array.from({ length: 701 }, (_, i) => i * 10);
const forward = positions.map(scroll => sampleCompanionRoute(scroll, legs));
const reverse = [...positions].reverse().map(scroll => sampleCompanionRoute(scroll, legs)).reverse();
assert.deepEqual(forward, reverse, "The route is identical in both scroll directions");
for (const scroll of [4500, 200, 6750, 4300, 0, 1300, 7000]) {
  const expected = sampleCompanionRoute(scroll, legs);
  sampleCompanionRoute(7000 - scroll, legs);
  assert.deepEqual(sampleCompanionRoute(scroll, legs), expected, "Rapid jumps cannot create queued or stale routes");
}
assert.throws(() => validateCompanionRoute([{ ...legs[0], end: 300 }]));
assert.throws(() => validateCompanionRoute([{ ...legs[0], to: { ...left, y: -20 } }]));
assert.throws(() => validateCompanionRoute([legs[0], { ...legs[1], start: 900 }]));
assert.throws(() => validateCompanionRoute([legs[0], { ...legs[1], from: right }]));
assert.throws(() => validateCompanionRoute([{ ...legs[2], lift: -1 }]));
console.log(`Companion route: ${samples.toLocaleString()} positions passed; dwell, reversal, grounded runs, bounded flights and zero-velocity landings verified.`);

const compiled = compileCompanionRoute(legs);
let maximumCurveError = 0;
let previousDistance = 0;
for (let scroll = 0; scroll <= 7000; scroll += 2) {
  const desired = routeDistanceAtScroll(scroll, compiled);
  assert.ok(desired >= previousDistance, "Scroll-to-distance mapping is monotonic");
  assert.ok(desired >= 0 && desired <= compiled.totalDistance, "Physical distance stays within its path");
  const sample = sampleCompanionRouteDistance(desired, compiled);
  const expected = sampleCompanionRoute(scroll, legs);
  maximumCurveError = Math.max(maximumCurveError, Math.hypot(sample.x - expected.x, sample.y - expected.y));
  assert.equal(sample.phase, expected.phase, "Distance sampling preserves the scroll route movement mode");
  assert.ok(Math.abs(sample.flight - expected.flight) < 1e-8, "Flight pose stays matched to its physical path");
  previousDistance = desired;
}
assert.ok(maximumCurveError < .1, "Compiled chords stay within one tenth of a pixel of this route");
for (const [index, segment] of compiled.legs.entries()) {
  assert.ok(segment.endDistance - segment.startDistance >= Math.hypot(segment.leg.to.x - segment.leg.from.x, segment.leg.to.y - segment.leg.from.y) - 1e-9);
  const position = sampleCompanionRouteDistance(segment.endDistance, compiled);
  assert.deepEqual([position.x, position.y, position.phase], [segment.leg.to.x, segment.leg.to.y, "rest"]);
  if (index < compiled.legs.length - 1) {
    assert.equal(routeDistanceAtScroll((segment.leg.end + compiled.legs[index + 1].leg.start) / 2, compiled), segment.endDistance, "Dwell scroll adds no physical path length");
  }
}
let previousPoint = sampleCompanionRouteDistance(0, compiled);
for (let distance = 3.5; distance < compiled.totalDistance; distance += 3.5) {
  const point = sampleCompanionRouteDistance(distance, compiled);
  assert.ok(Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y) <= 3.5 + 1e-9, "A physical distance cap also caps actual screen displacement");
  assert.ok(point.x >= left.x - 1e-9 && point.x <= right.x + 1e-9);
  assert.ok(point.y >= -200 && point.y <= 0);
  previousPoint = point;
}
const distances = Array.from({ length: 1001 }, (_, i) => compiled.totalDistance * i / 1000);
assert.deepEqual(
  distances.map(distance => sampleCompanionRouteDistance(distance, compiled)),
  [...distances].reverse().map(distance => sampleCompanionRouteDistance(distance, compiled)).reverse(),
  "Physical route reversal is deterministic",
);
const empty = compileCompanionRoute([], { x: -20, y: -10 });
assert.equal(empty.totalDistance, 0);
for (const value of [-Infinity, -100, 0, 50, Infinity]) {
  assert.equal(routeDistanceAtScroll(value, empty), 0);
  assert.deepEqual(sampleCompanionRouteDistance(value, empty), { x: -20, y: -10, phase: "rest", flight: 0, progress: 0, legIndex: -1 });
}
const zero = compileCompanionRoute([{ start: 0, end: 100, from: right, to: right, mode: "run" }]);
assert.equal(zero.totalDistance, 0);
assert.equal(sampleCompanionRouteDistance(0, zero).phase, "rest");
const hop = compileCompanionRoute([{ start: 0, end: 100, from: right, to: right, mode: "fly", lift: 40 }]);
assert.ok(Math.abs(hop.totalDistance - 80) < 1e-9, "A vertical flight measures both ascent and descent");
assert.equal(sampleCompanionRouteDistance(40, hop).y, -40);
assert.equal(sampleCompanionRouteDistance(40, hop).phase, "fly");
assert.throws(() => sampleCompanionRouteDistance(NaN, compiled));
assert.throws(() => routeDistanceAtScroll(NaN, compiled));
console.log(`Physical route: ${compiled.totalDistance.toFixed(1)}px; curve error ${maximumCurveError.toFixed(3)}px; bounded speed, matched flight pose, reversal and empty routes passed.`);
