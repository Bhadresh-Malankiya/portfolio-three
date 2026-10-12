import assert from "node:assert/strict";
import { createCueState, updateCompanionCue } from "../src/lib/companion-cues.ts";

function controller() {
  let state = createCueState();
  let now = 0;
  let result;
  return {
    get state() { return state; },
    step(id, eligible, milliseconds = 20, deltaMs = milliseconds) {
      now += milliseconds;
      const before = JSON.stringify(state);
      result = updateCompanionCue(state, { now, id, eligible, deltaMs });
      assert.equal(JSON.stringify(state), before, "Previous states remain immutable");
      state = result.state;
      assert.equal(result.visible, state.visible);
      return result;
    },
    hold(id, milliseconds, eligible = true) {
      assert.equal(milliseconds % 20, 0);
      for (let elapsed = 0; elapsed < milliseconds; elapsed += 20) this.step(id, eligible);
      return result;
    },
  };
}

const arrival = controller();
assert.deepEqual(
  [arrival.step("work", true).visible, arrival.state.stableMs],
  [false, 0],
  "Entering a section cannot display its cue in the same frame",
);
assert.equal(arrival.hold("work", 240).visible, false);
assert.equal(arrival.step("work", true).visible, true, "260ms of stable eligibility reveals the cue");
assert.equal(arrival.state.cues.work.visibleMs, 0, "Eligibility time is not counted as reading time");
assert.equal(arrival.hold("work", 1780).state.cues.work.read, false);
assert.equal(arrival.step("work", true).state.cues.work.read, true);
assert.equal(arrival.hold("work", 4680).visible, true);
assert.deepEqual(
  [arrival.step("work", true).visible, arrival.state.cues.work.visibleMs],
  [false, 6500],
  "The uninterrupted presentation lasts 6500ms of actual visible time",
);
assert.equal(arrival.hold("work", 40_000).pending, false, "A completed visit does not schedule an idle animation loop or repeat itself");

const skipped = controller();
skipped.step("hero", false);
skipped.step("work", false);
skipped.step("mobile", true);
skipped.hold("mobile", 260);
assert.equal(skipped.step("work", true).visible, false, "Changing sections immediately hides the previous cue");
assert.equal(skipped.hold("work", 260).visible, true, "A fast-skipped unread section still introduces itself when revisited");
assert.equal(skipped.state.cues.mobile.visibleMs, 0, "A newly displayed cue does not receive exposure from the next section");

const unread = controller();
unread.step("work", true);
unread.hold("work", 260);
unread.hold("work", 1000);
assert.equal(unread.step("work", false).visible, false);
assert.equal(unread.state.cues.work.visibleMs, 1000);
assert.equal(unread.hold("work", 6000, false).pending, false, "Hidden movement cannot consume the presentation or keep an idle loop alive");
unread.step("work", true);
assert.equal(unread.hold("work", 240).visible, false);
assert.equal(unread.step("work", true).visible, true, "An interrupted unread cue retries after a fresh stability window");
unread.hold("work", 600);
unread.step("about", false);
unread.step("work", true);
assert.equal(unread.state.cues.work.visibleMs, 1600, "Unread progress is retained across section visits");
assert.equal(unread.hold("work", 260).visible, true);
assert.equal(unread.hold("work", 200).state.cues.work.read, true, "Separate genuinely visible intervals accumulate toward the reading threshold");
assert.equal(unread.step("work", false).pending, false);
assert.equal(unread.hold("work", 30_000).visible, false, "An interrupted read cue stays suppressed throughout the same visit");

const cooldown = controller();
cooldown.step("work", true);
cooldown.hold("work", 260);
cooldown.hold("work", 1800);
cooldown.hold("work", 30_000);
cooldown.step("about", false);
const firstDeadline = cooldown.state.cues.work.cooldownUntil;
assert.equal(firstDeadline, cooldown.state.updatedAt + 20_000, "Cooldown starts when the read visit ends, not when it was first read");
cooldown.step("work", true, 19_000);
assert.equal(cooldown.hold("work", 2000).pending, false, "A return during cooldown stays blocked even after its deadline passes");
cooldown.step("about", false);
assert.equal(cooldown.state.cues.work.cooldownUntil, firstDeadline, "A suppressed revisit does not postpone the original cooldown");
cooldown.step("work", true);
assert.equal(cooldown.state.cues.work.visibleMs, 0, "A later eligible visit gets a fresh presentation");
assert.equal(cooldown.state.cues.work.read, false);
assert.equal(cooldown.hold("work", 260).visible, true);

const background = controller();
background.step("about", true);
background.hold("about", 260);
background.hold("about", 600);
background.step("about", false);
background.step("about", false, 120_000, 120_000);
assert.equal(background.state.cues.about.visibleMs, 600);
assert.equal(background.step("about", true, 30_000, 30_000).visible, false, "A suspended interval cannot instantly satisfy stable eligibility");
assert.equal(background.hold("about", 260).visible, true);
background.step("about", true, 60_000, 20);
assert.equal(background.state.cues.about.visibleMs, 620, "Wall-clock gaps never add unobserved reading time");
background.step("about", true, 60_000, 60_000);
assert.equal(background.state.cues.about.visibleMs, 720, "Even an incorrectly large frame delta cannot consume an entire cue");

const interruptedArrival = controller();
interruptedArrival.step("work", true);
interruptedArrival.hold("work", 240);
interruptedArrival.step("work", false);
assert.equal(interruptedArrival.state.stableMs, 0);
interruptedArrival.step("work", true);
assert.equal(interruptedArrival.hold("work", 240).visible, false, "Separate eligibility windows cannot accumulate toward arrival");
assert.equal(interruptedArrival.step("work", true).visible, true);

const unusual = controller();
unusual.step("__proto__", true);
assert.equal(unusual.hold("__proto__", 260).visible, true, "Section ids cannot accidentally read inherited record properties");
unusual.step("__proto__", true, 20, NaN);
assert.equal(unusual.state.cues.__proto__.visibleMs, 0);
unusual.step("__proto__", true, 20, -20);
assert.equal(unusual.state.cues.__proto__.visibleMs, 0);

console.log("Companion cues: stable arrival, visible exposure, unread replay, read suppression, end-of-visit cooldown, fast skips and suspended-tab timing passed.");
