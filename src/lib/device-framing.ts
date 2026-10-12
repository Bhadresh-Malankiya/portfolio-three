import { Euler, MathUtils, PerspectiveCamera, Vector3 } from "three";

export const DEVICE_MAX_SCALE = 1.08;

// Apple 2024 hardware proportions. Scene units remain independent of physical scale.
export const DEVICE_DIMENSIONS = {
  laptop: {
    width: 3.8,
    depth: 3.8 * 221.2 / 312.6,
    closedThickness: 3.8 * 15.5 / 312.6,
    lidHeight: 2.65,
    hingeY: 3.8 * 15.5 / 312.6 - 0.0205 - 0.067,
    hingeZ: -1.315,
    screenWidth: 3.67,
    screenHeight: 3.67 * 1964 / 3024,
    screenY: 1.402,
  },
  phone: {
    height: 3.4,
    width: 3.4 * 71.45 / 149.61,
    thickness: 3.4 * 8.25 / 149.61,
    radius: 0.365,
    screenWidth: 3.4 * 66.57 / 149.61,
    screenHeight: 3.4 * 144.79 / 149.61,
    screenRadius: 0.321,
  },
} as const;

/** Fit the swept hardware bounds, rather than a large imaginary square. */
export function fitDeviceCamera(
  camera: PerspectiveCamera,
  kind: "laptop" | "phone",
  width: number,
  height: number,
) {
  // A collapsed or not-yet-measured canvas must not reset an already fitted camera.
  if (width <= 1 || height <= 1) return;
  camera.aspect = Math.max(0.1, width / height);
  const target = new Vector3(0, kind === "phone" ? 0 : 0.6, 0);
  const direction = new Vector3(0, kind === "phone" ? 0.015 : 0.13, 1).normalize();
  const points: Vector3[] = [];
  for (let step = 0; step <= 24; step++) {
    if (kind === "phone") {
      for (const x of [-0.829, 0.829])
        for (const y of [-1.71, 1.71])
          for (const z of [-0.199, 0.099])
            points.push(new Vector3(x, y, z).multiplyScalar(DEVICE_MAX_SCALE)
              .applyEuler(new Euler(0, Math.PI * step / 24 - 0.6, -0.045)));
    } else {
      const lift = 0.85 * (1 - step / 24);
      const hinge = MathUtils.lerp(Math.PI / 2, -0.13, step / 24);
      for (const yaw of [-0.24, 0.14]) {
        const rotation = new Euler(0, yaw, 0);
        for (const x of [-1.915, 1.915])
          for (const y of [-0.712, -0.505])
            for (const z of [-1.36, 1.36])
              points.push(new Vector3(x, y, z).multiplyScalar(DEVICE_MAX_SCALE).applyEuler(rotation).add(new Vector3(0, lift, 0)));
        for (const x of [-1.915, 1.915])
          for (const y of [0, 2.66])
            for (const z of [-0.03, 0.047])
              points.push(new Vector3(x, y, z).applyEuler(new Euler(hinge, 0, 0))
                .add(new Vector3(0, -0.63 + DEVICE_DIMENSIONS.laptop.hingeY, -1.315)).multiplyScalar(DEVICE_MAX_SCALE).applyEuler(rotation).add(new Vector3(0, lift, 0)));
      }
    }
  }
  function place(distance: number) {
    camera.position.copy(direction).multiplyScalar(distance).add(target);
    camera.lookAt(target);
    // The glass and display are fractions of a millimetre apart. Keep depth
    // precision local to the product instead of the Canvas 0.1–1000 defaults.
    camera.near = Math.max(0.1, distance - 6);
    camera.far = distance + 6;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  }
  let near = 2;
  let far = 160;
  const projected = new Vector3();
  for (let i = 0; i < 18; i++) {
    const distance = (near + far) / 2;
    place(distance);
    const fits = points.every((point) => {
      projected.copy(point).project(camera);
      return Math.abs(projected.x) <= 0.89 && Math.abs(projected.y) <= 0.89 && projected.z < 1;
    });
    if (fits) far = distance;
    else near = distance;
  }
  place(far);
  let nearestSurface = Infinity;
  let furthestSurface = -Infinity;
  for (const point of points) {
    const depth = -projected.copy(point).sub(camera.position).dot(direction);
    nearestSurface = Math.min(nearestSurface, depth);
    furthestSurface = Math.max(furthestSurface, depth);
  }
  camera.near = Math.max(0.1, nearestSurface - 0.6);
  camera.far = furthestSurface + 0.6;
  camera.updateProjectionMatrix();
}
