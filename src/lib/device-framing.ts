import { MathUtils, PerspectiveCamera, Vector3 } from "three";

export const DEVICE_MAX_SCALE = 1.08;

/** Reserve room for the complete device through its hinge/turn animation. */
export function fitDeviceCamera(
  camera: PerspectiveCamera,
  kind: "laptop" | "phone",
  width: number,
  height: number,
) {
  const aspect = Math.max(0.1, width / Math.max(1, height));
  const halfHeight = 2.24 * DEVICE_MAX_SCALE;
  const halfWidth = (kind === "phone" ? 1.24 : 2.48) * DEVICE_MAX_SCALE;
  const distance =
    Math.max(halfHeight, halfWidth / aspect) /
    Math.tan(MathUtils.degToRad(camera.fov / 2));
  const target = new Vector3(0, kind === "phone" ? 0 : 0.3, 0);
  camera.aspect = aspect;
  camera.position.copy(
    new Vector3(0, kind === "phone" ? 0.03 : 0.35, 1)
      .normalize()
      .multiplyScalar(distance)
      .add(target),
  );
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld();
}
