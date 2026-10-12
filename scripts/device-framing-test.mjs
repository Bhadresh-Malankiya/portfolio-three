import assert from "node:assert/strict";
import { PerspectiveCamera, Vector3, Euler } from "three";
import { devicePose, DEVICE_TIMELINE, PROJECT_STOPS, PROJECT_BREAKS } from "../src/lib/device-choreography.ts";
import { fitDeviceCamera, DEVICE_DIMENSIONS } from "../src/lib/device-framing.ts";

let samples = 0;
for (const [width, height] of [
  [240, 360],
  [280, 300],
  [327, 300],
  [638, 346],
  [440, 520],
  [760, 520],
  [1024, 390],
  [1189, 570],
  [1354, 720],
  [1600, 990],
  [1600, 1550],
  [900, 1400],
  [2700, 780],
  [3440, 760],
  [3840, 1800],
]) {
  for (const kind of ["laptop", "phone"]) {
    const camera = new PerspectiveCamera(
      kind === "phone" ? 35 : 12,
      width / height,
      0.1,
      100,
    );
    fitDeviceCamera(camera, kind, width, height);
    assert.ok(camera.far - camera.near < 10, `${kind} depth range must stay close to its swept bounds`);
    assert.ok(camera.near > 0.5, `${kind} needs enough near-plane precision for thin glass`);
    for (let step = 0; step <= 100; step++) {
      const points = [];
      const pose = devicePose(step / 100, kind === "phone");
      if (kind === "laptop") {
        const hinge = pose.hinge;
        for (const x of [-1.915, 1.915])
          for (const y of [-0.712, -0.505])
            for (const z of [-1.36, 1.36]) points.push(new Vector3(x, y, z));
        for (const x of [-1.915, 1.915])
          for (const y of [0, 2.66])
            for (const z of [-0.03, 0.047])
              points.push(
                new Vector3(x, y, z)
                  .applyEuler(new Euler(hinge, 0, 0))
                  .add(new Vector3(0, -0.63 + DEVICE_DIMENSIONS.laptop.hingeY, -1.315)),
              );
        points.forEach((p) => p.multiplyScalar(pose.scale).applyEuler(new Euler(0, pose.rotationY, pose.rotationZ)).add(new Vector3(0, pose.lift, 0)));
      } else {
        for (const x of [-0.829, 0.829])
          for (const y of [-1.71, 1.71])
            for (const z of [-0.199, 0.099])
              points.push(
                new Vector3(x, y, z).multiplyScalar(pose.scale).applyEuler(
                  new Euler(0, pose.rotationY, pose.rotationZ),
                ),
              );
      }
      if (step === 52) {
        const bounds = points.map((point) => point.clone().project(camera));
        const filledWidth = (Math.max(...bounds.map(p => p.x)) - Math.min(...bounds.map(p => p.x))) / 2;
        const filledHeight = (Math.max(...bounds.map(p => p.y)) - Math.min(...bounds.map(p => p.y))) / 2;
        assert.ok(Math.max(filledWidth, filledHeight) > 0.72, `${kind} is too small at ${width}×${height}`);
        if (kind === "laptop") {
          const glass = new Vector3(0, DEVICE_DIMENSIONS.laptop.screenY, 0.025);
          const display = new Vector3(0, DEVICE_DIMENSIONS.laptop.screenY, 0.0255);
          for (const point of [glass, display]) point.applyEuler(new Euler(pose.hinge, 0, 0))
            .add(new Vector3(0, -0.63 + DEVICE_DIMENSIONS.laptop.hingeY, -1.315))
            .multiplyScalar(pose.scale).applyEuler(new Euler(0, pose.rotationY, pose.rotationZ))
            .add(new Vector3(0, pose.lift, 0)).project(camera);
          const depthSteps = Math.abs(glass.z - display.z) * 0.5 * (2 ** 24 - 1);
          assert.ok(depthSteps > 100, `Display/glass depth separation is too small at ${width}×${height}: ${depthSteps} depth steps`);
        }
        if (kind === "laptop" && width >= 1000) {
          const screen = [];
          for (const x of [-1.835, 1.835]) for (const y of [-1.191778, 1.191778]) {
            screen.push(new Vector3(x, y + 1.402, 0.0255)
              .applyEuler(new Euler(pose.hinge, 0, 0))
              .add(new Vector3(0, -0.63 + DEVICE_DIMENSIONS.laptop.hingeY, -1.315)).multiplyScalar(pose.scale)
              .applyEuler(new Euler(0, pose.rotationY, pose.rotationZ))
              .add(new Vector3(0, pose.lift, 0)).project(camera));
          }
          const screenWidth = (Math.max(...screen.map(p => p.x)) - Math.min(...screen.map(p => p.x))) * width / 2;

          assert.ok(screenWidth > Math.min(height * 0.82, width * 0.65), `Desktop screenshot must be large enough to read: ${width}×${height}, screen ${screenWidth}`);

        }
      }
      for (const point of points) {
        const projected = point.project(camera);
        assert.ok(
          Math.abs(projected.x) < 0.98 && Math.abs(projected.y) < 0.98 && projected.z > -1 && projected.z < 1,
          `${kind} clipped at ${width}×${height}, step ${step}: ${projected.toArray()}`,
        );
        samples++;
      }
    }
  }
}
console.log(
  `Passed: ${samples} projected device corners remain inside the frame across fifteen viewport ratios and 101 scroll poses.`,
);

for (const stop of PROJECT_STOPS) {
  const pose = devicePose(stop, false);
  assert.ok(pose.hinge < 0, "Each project stop must leave the MacBook open");
  assert.ok(pose.scale > 1, "Each project should move closer for reading");
}
for (const breakpoint of PROJECT_BREAKS) {
  const before = devicePose(breakpoint - 0.0001, false);
  const after = devicePose(breakpoint + 0.0001, false);
  assert.ok(Math.abs(before.scale - after.scale) < 0.001, "Zoom must not snap at project changes");
}
assert.ok(devicePose(DEVICE_TIMELINE.closeEnd, false).hinge > 1.5, "Lid closes before the device exits");
assert.equal(devicePose(DEVICE_TIMELINE.arriveEnd, false).hinge, Math.PI / 2, "The laptop arrives with its lid closed");
assert.equal(devicePose(DEVICE_TIMELINE.openStart, false).hinge, Math.PI / 2, "Opening starts after arrival finishes");
assert.ok(devicePose(DEVICE_TIMELINE.openEnd, false).hinge < 0, "Opening finishes before the first reading hold");
assert.ok(devicePose(DEVICE_TIMELINE.closeStart, false).hinge < 0, "The final project remains open for its entire reading hold");
assert.ok(DEVICE_TIMELINE.exitStart >= DEVICE_TIMELINE.closeEnd, "Exit cannot overlap lid closure");
assert.ok(DEVICE_TIMELINE.exitEnd - DEVICE_TIMELINE.exitStart >= 0.12, "Exit must have a visible, unhurried travel interval");
assert.ok(PROJECT_STOPS.every(stop => stop > DEVICE_TIMELINE.openEnd && stop < DEVICE_TIMELINE.closeStart), "Every selected chapter lands in the reading interval");
assert.ok(PROJECT_BREAKS.every((stop, index) => stop > PROJECT_STOPS[index] && stop < PROJECT_STOPS[index + 1]), "Caption transitions sit between the reading holds");
assert.equal(devicePose(0, false, false).hinge, devicePose(1, false, false).hinge, "Reduced-motion view stays open");
console.log("Passed: readable project stops, continuous zoom, close-before-exit and reduced-motion pose.");

assert.equal(devicePose(0.04, false).hinge, Math.PI / 2, "Lid waits until the section is pinned");
assert.equal(devicePose(0.04, true).rotationY, devicePose(0, true).rotationY, "Phone waits until the section is pinned");

const retainedCamera = new PerspectiveCamera(12, 2, 0.1, 100);
fitDeviceCamera(retainedCamera, "laptop", 1200, 600);
const measuredPosition = retainedCamera.position.clone();
fitDeviceCamera(retainedCamera, "laptop", 0, 0);
assert.deepEqual(retainedCamera.position, measuredPosition, "A transient zero-size layout must retain the fitted camera");
console.log("Passed: an unmeasured canvas cannot reset the fitted camera.");

const { laptop, phone } = DEVICE_DIMENSIONS;
assert.ok(Math.abs(laptop.depth / laptop.width - 221.2 / 312.6) < 0.000001, "MacBook footprint matches the 14-inch M4 Pro");
assert.ok(Math.abs((laptop.hingeY + 0.0205 + 0.067) / laptop.width - 15.5 / 312.6) < 0.000001, "MacBook closed stack matches published thickness");
assert.ok(laptop.hingeY - 0.0255 > 0.0735, "Closed display clears the raised keycaps");
assert.ok(Math.abs(laptop.screenWidth / laptop.screenHeight - 3024 / 1964) < 0.000001, "MacBook display keeps its native aspect ratio");
assert.ok(Math.abs(phone.width / phone.height - 71.45 / 149.61) < 0.000001, "iPhone body matches the 16 Pro outline");
assert.ok(Math.abs(phone.thickness / phone.height - 8.25 / 149.61) < 0.000001, "iPhone glass and rail stack matches 16 Pro thickness");
assert.ok(Math.abs(phone.screenWidth / phone.screenHeight - 1206 / 2622) < 0.0002, "iPhone active area matches native display aspect");
console.log("Passed: Apple hardware proportions, screen aspects and lid-to-keyboard clearance.");
