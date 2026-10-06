import { MathUtils, PerspectiveCamera, Vector3 } from "three";

/** Reserve room for the complete device through its hinge/turn animation. */
export function fitDeviceCamera(
  camera: PerspectiveCamera,
  kind: "laptop" | "phone",
  width: number,
  height: number,
) {
  const aspect = Math.max(0.1, width / Math.max(1, height));
  const halfHeight = kind === "phone" ? 2.24 : 2.08;
  const halfWidth = kind === "phone" ? 1.24 : 2.48;
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
