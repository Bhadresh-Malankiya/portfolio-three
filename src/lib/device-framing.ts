import { Euler, MathUtils, PerspectiveCamera, Vector3 } from "three";

export const DEVICE_MAX_SCALE = 1.08;

/** Fit the swept hardware bounds, rather than a large imaginary square. */
export function fitDeviceCamera(
  camera: PerspectiveCamera,
  kind: "laptop" | "phone",
  width: number,
  height: number,
) {
  camera.aspect = Math.max(0.1, width / Math.max(1, height));
  const target = new Vector3(0, kind === "phone" ? 0 : 0.6, 0);
  const direction = new Vector3(0, kind === "phone" ? 0.015 : 0.13, 1).normalize();
  const points: Vector3[] = [];
  for (let step = 0; step <= 24; step++) {
    if (kind === "phone") {
      for (const x of [-0.86, 0.86])
        for (const y of [-1.72, 1.72])
          for (const z of [-0.27, 0.14])
            points.push(new Vector3(x, y, z).multiplyScalar(DEVICE_MAX_SCALE)
              .applyEuler(new Euler(0, Math.PI * step / 24 - 0.6, -0.045)));
    } else {
      const lift = 0.85 * (1 - step / 24);
      const hinge = MathUtils.lerp(Math.PI / 2, -0.13, step / 24);
      for (const yaw of [-0.24, 0.14]) {
        const rotation = new Euler(0, yaw, 0);
        for (const x of [-1.94, 1.94])
          for (const y of [-0.74, -0.49])
            for (const z of [-1.2, 1.46])
              points.push(new Vector3(x, y, z).multiplyScalar(DEVICE_MAX_SCALE).applyEuler(rotation).add(new Vector3(0, lift, 0)));
        for (const x of [-1.94, 1.94])
          for (const y of [0, 2.46])
            for (const z of [-0.05, 0.1])
              points.push(new Vector3(x, y, z).applyEuler(new Euler(hinge, 0, 0))
                .add(new Vector3(0, -0.52, -1.06)).multiplyScalar(DEVICE_MAX_SCALE).applyEuler(rotation).add(new Vector3(0, lift, 0)));
      }
    }
  }
  function place(distance: number) {
    camera.position.copy(direction).multiplyScalar(distance).add(target);
    camera.lookAt(target);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }
  let near = 2;
  let far = 40;
  const projected = new Vector3();
  for (let i = 0; i < 18; i++) {
    const distance = (near + far) / 2;
    place(distance);
    const fits = points.every((point) => {
      projected.copy(point).project(camera);
      return Math.abs(projected.x) <= 0.95 && Math.abs(projected.y) <= 0.95 && projected.z < 1;
    });
    if (fits) far = distance;
    else near = distance;
  }
  place(far);
}
