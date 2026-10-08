import assert from "node:assert/strict";
import { PerspectiveCamera, Vector3, Euler } from "three";
import { devicePose, PROJECT_STOPS, PROJECT_BREAKS } from "../src/lib/device-choreography.ts";
import { fitDeviceCamera } from "../src/lib/device-framing.ts";

let samples = 0;
for (const [width, height] of [
  [280, 300],
  [327, 300],
  [638, 346],
  [440, 520],
  [760, 520],
  [1024, 390],
]) {
  for (const kind of ["laptop", "phone"]) {
    const camera = new PerspectiveCamera(
      kind === "phone" ? 35 : 34,
      width / height,
      0.1,
      100,
    );
    fitDeviceCamera(camera, kind, width, height);
    for (let step = 0; step <= 100; step++) {
      const points = [];
      const pose = devicePose(step / 100, kind === "phone");
      if (kind === "laptop") {
        const hinge = pose.hinge;
        for (const x of [-1.94, 1.94])
          for (const y of [-0.74, -0.49])
            for (const z of [-1.2, 1.46]) points.push(new Vector3(x, y, z));
        for (const x of [-1.94, 1.94])
          for (const y of [0, 2.46])
            for (const z of [-0.05, 0.08])
              points.push(
                new Vector3(x, y, z)
                  .applyEuler(new Euler(hinge, 0, 0))
                  .add(new Vector3(0, -0.52, -1.06)),
              );
        points.forEach((p) => p.multiplyScalar(pose.scale).applyEuler(new Euler(0, pose.rotationY, pose.rotationZ)));
      } else {
        for (const x of [-0.86, 0.86])
          for (const y of [-1.72, 1.72])
            for (const z of [-0.26, 0.14])
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
      }
      for (const point of points) {
        const projected = point.project(camera);
        assert.ok(
          Math.abs(projected.x) < 0.98 && Math.abs(projected.y) < 0.98,
          `${kind} clipped at ${width}×${height}, step ${step}: ${projected.toArray()}`,
        );
        samples++;
      }
    }
  }
}
console.log(
  `Passed: ${samples} projected device corners remain inside the frame across six viewport ratios and 101 scroll poses.`,
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
assert.ok(devicePose(0.96, false).hinge > 1.5, "Lid closes before the device exits");
assert.equal(devicePose(0, false, false).hinge, devicePose(1, false, false).hinge, "Reduced-motion view stays open");
console.log("Passed: readable project stops, continuous zoom, close-before-exit and reduced-motion pose.");
