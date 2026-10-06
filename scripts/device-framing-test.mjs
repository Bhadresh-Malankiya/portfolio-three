import assert from "node:assert/strict";
import { PerspectiveCamera, Vector3, Euler } from "three";
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
    for (let step = 0; step <= 24; step++) {
      const points = [];
      if (kind === "laptop") {
        const hinge = Math.PI / 2 + ((-0.13 - Math.PI / 2) * step) / 24;
        for (const x of [-1.94, 1.94])
          for (const y of [-0.74, -0.49])
            for (const z of [-1.2, 1.2]) points.push(new Vector3(x, y, z));
        for (const x of [-1.94, 1.94])
          for (const y of [0, 2.27])
            for (const z of [-0.05, 0.08])
              points.push(
                new Vector3(x, y, z)
                  .applyEuler(new Euler(hinge, 0, 0))
                  .add(new Vector3(0, -0.52, -1.06)),
              );
        points.forEach((p) => p.applyEuler(new Euler(0, -0.18, 0)));
      } else {
        for (const x of [-0.86, 0.86])
          for (const y of [-1.72, 1.72])
            for (const z of [-0.26, 0.14])
              points.push(
                new Vector3(x, y, z).applyEuler(
                  new Euler(0, (Math.PI * step) / 24 - 0.16, -0.07),
                ),
              );
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
  `Passed: ${samples} projected device corners remain inside the frame across six viewport ratios and 25 poses.`,
);
