import assert from "node:assert/strict";
import { scheduleDevicePreparation } from "../src/lib/device-preparation.ts";

function harness({ loaded = false, idleSupported = true } = {}) {
  let time = 0, nextId = 0, calls = 0;
  const jobs = new Map(), idle = new Map(), events = new Map();
  globalThis.document = { readyState: loaded ? "complete" : "loading" };
  globalThis.window = {
    setTimeout(callback, delay) { const id = ++nextId; jobs.set(id, { callback, at: time + delay }); return id; },
    clearTimeout(id) { jobs.delete(id); },
    addEventListener(name, callback) { events.set(name, callback); },
    removeEventListener(name) { events.delete(name); },
    ...(idleSupported ? {
      requestIdleCallback(callback) { const id = ++nextId; idle.set(id, callback); return id; },
      cancelIdleCallback(id) { idle.delete(id); },
    } : {}),
  };
  return {
    prepare: () => { calls++; },
    get calls() { return calls; },
    load: () => events.get("load")?.(),
    tick(duration) {
      time += duration;
      let pending;
      while ((pending = [...jobs].find(([, job]) => job.at <= time))) {
        jobs.delete(pending[0]); pending[1].callback();
      }
    },
    idle() { for (const [id, callback] of idle) { idle.delete(id); callback(); } },
  };
}

let clock = harness();
let cancel = scheduleDevicePreparation(clock.prepare);
clock.tick(1000);
assert.equal(clock.calls, 0, "Warming must wait for critical page assets");
clock.load(); clock.tick(0); clock.idle(); clock.load(); clock.tick(5000); clock.idle();
assert.equal(clock.calls, 1, "The load event and deadline must not schedule duplicate warming");
cancel();

clock = harness();
cancel = scheduleDevicePreparation(clock.prepare);
clock.tick(2200); clock.idle();
assert.equal(clock.calls, 1, "A third party that stalls window.load must not block preparation indefinitely");
cancel();

clock = harness({ loaded: true });
cancel = scheduleDevicePreparation(clock.prepare, 220);
clock.tick(219); clock.idle();
assert.equal(clock.calls, 0, "Staggered devices must not initialize in the same task");
clock.tick(1); cancel(); clock.idle();
assert.equal(clock.calls, 0, "Unmount must cancel already-enqueued idle work");

clock = harness();
cancel = scheduleDevicePreparation(clock.prepare); cancel();
clock.load(); clock.tick(5000); clock.idle();
assert.equal(clock.calls, 0, "Unmount before page load must remove events and deadline timers");

clock = harness({ loaded: true, idleSupported: false });
cancel = scheduleDevicePreparation(clock.prepare);
clock.tick(0); clock.tick(80);
assert.equal(clock.calls, 1, "Browsers without requestIdleCallback must still prepare the models");
cancel();
console.log("Passed: page-load ordering, bounded deadline, one-time warm-up, staggered work, cancellation, and idle fallback.");
