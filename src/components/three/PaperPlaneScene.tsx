"use client";

import { Component, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import {
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  OrthographicCamera,
  SRGBColorSpace,
  Vector3,
} from "three";

type Props = {
  progress: MotionValue<number>;
  reducedMotion?: boolean;
  active?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
};

type Point = [number, number, number];

const NOSE: Point = [3.4, 0, 0];
const TAIL: Point = [-1.42, 0, 0];
const THICKNESS = 0.018;

function smooth(from: number, to: number, value: number) {
  const t = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

// A closed paper sheet: the blue underside and narrow cut edge remain real
// geometry when the wings fold, rather than disappearing at grazing angles.
function createWing(side: -1 | 1) {
  const tip: Point = [-2.7, 0, 2.25 * side];
  const crease: Point = [-1.722, 0, 0.53 * side];
  const vertices: number[] = [];
  const geometry = new BufferGeometry();
  const triangle = (a: Point, b: Point, c: Point, material: number) => {
    const start = vertices.length / 3;
    vertices.push(...a, ...b, ...c);
    geometry.addGroup(start, 3, material);
  };
  const surface = (point: Point, top: boolean): Point => [
    point[0],
    top ? THICKNESS / 2 : -THICKNESS / 2,
    point[2],
  ];
  const topTriangle = (a: Point, b: Point, c: Point, material: number) => {
    const points = side === 1 ? [a, b, c] : [a, c, b];
    triangle(surface(points[0], true), surface(points[1], true), surface(points[2], true), material);
  };
  topTriangle(NOSE, TAIL, crease, 1);
  topTriangle(NOSE, crease, tip, 0);
  const perimeter = side === 1 ? [NOSE, TAIL, tip] : [NOSE, tip, TAIL];
  triangle(surface(perimeter[0], false), surface(perimeter[2], false), surface(perimeter[1], false), 2);
  for (let i = 0; i < perimeter.length; i += 1) {
    const a = perimeter[i];
    const b = perimeter[(i + 1) % perimeter.length];
    triangle(surface(a, true), surface(a, false), surface(b, false), 3);
    triangle(surface(a, true), surface(b, false), surface(b, true), 3);
  }
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createKeel() {
  const geometry = new BufferGeometry();
  const a = [3.38, -0.006, 0.022];
  const b = [-1.41, -0.006, 0.022];
  const c = [-1.64, -0.78, 0.022];
  const d = [3.38, -0.006, -0.022];
  const e = [-1.41, -0.006, -0.022];
  const f = [-1.64, -0.78, -0.022];
  geometry.setAttribute("position", new Float32BufferAttribute([
    ...a, ...b, ...c, ...d, ...f, ...e,
    ...a, ...d, ...f, ...a, ...f, ...c,
    ...b, ...c, ...f, ...b, ...f, ...e,
    ...a, ...b, ...e, ...a, ...e, ...d,
  ], 3));
  geometry.computeVertexNormals();
  return geometry;
}

function Wing({ side, hinge }: { side: -1 | 1; hinge: React.RefObject<Group | null> }) {
  const geometry = useMemo(() => createWing(side), [side]);
  const seams = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute([
      3.35, 0.011, 0.005 * side, -1.722, 0.011, 0.53 * side,
      -1.722, 0.011, 0.53 * side, -2.692, 0.011, 2.235 * side,
    ], 3));
    return g;
  }, [side]);
  useEffect(() => () => {
    geometry.dispose();
    seams.dispose();
  }, [geometry, seams]);
  return (
    <group ref={hinge}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial attach="material-0" color="#f4f0df" roughness={0.66} metalness={0} clearcoat={0.06} />
        <meshStandardMaterial attach="material-1" color="#ccceb8" roughness={0.78} />
        <meshPhysicalMaterial attach="material-2" color="#254ada" roughness={0.54} metalness={0.08} clearcoat={0.12} />
        <meshStandardMaterial attach="material-3" color="#faf7e8" roughness={0.78} />
      </mesh>
      <lineSegments geometry={seams}>
        <lineBasicMaterial color="#888b7d" transparent opacity={0.42} />
      </lineSegments>
    </group>
  );
}

function fitCamera(camera: OrthographicCamera, width: number, height: number) {
  camera.zoom = Math.min(width / 7.9, height / 4.25);
  camera.lookAt(new Vector3(0, 0.15, 0));
  camera.updateProjectionMatrix();
}

function FoldedPlane({ progress, reducedMotion = false, active = true, onReady, onUnavailable }: Props) {
  const group = useRef<Group>(null);
  const leftWing = useRef<Group>(null);
  const rightWing = useRef<Group>(null);
  const ready = useRef(false);
  const readyFrame = useRef<number | null>(null);
  const elapsed = useRef(0);
  const { camera, size, invalidate, gl, scene } = useThree();
  const keel = useMemo(() => createKeel(), []);

  useEffect(() => () => keel.dispose(), [keel]);
  useEffect(() => () => {
    if (readyFrame.current !== null) cancelAnimationFrame(readyFrame.current);
  }, []);

  useLayoutEffect(() => {
    // Reserve room for the complete fold and bank, including the nose and keel.
    // The same physical plane fits a wide theatre and a narrow portrait stage.
    fitCamera(camera as OrthographicCamera, size.width, size.height);
    invalidate();
  }, [camera, size.width, size.height, invalidate]);

  useEffect(() => {
    const canvas = gl.domElement;
    const unavailable = (event: Event) => {
      event.preventDefault();
      onUnavailable?.();
    };
    canvas.addEventListener("webglcontextlost", unavailable);
    gl.compile(scene, camera);
    return () => canvas.removeEventListener("webglcontextlost", unavailable);
  }, [camera, gl, scene, onReady, onUnavailable]);

  useEffect(() => {
    if (active) invalidate();
    return progress.on("change", () => {
      if (active && !reducedMotion) invalidate();
    });
  }, [active, invalidate, progress, reducedMotion]);

  useFrame((_, delta) => {
    if (!group.current || !leftWing.current || !rightWing.current) return;
    if (active && !reducedMotion) elapsed.current += Math.min(delta, 0.05);
    const p = reducedMotion ? 0.52 : Math.max(0, Math.min(1, progress.get()));
    const folded = smooth(0.04, 0.44, p);
    const flight = smooth(0.6, 1, p);
    const wingAngle = 0.5 * (1 - folded) + 0.14 * folded;
    leftWing.current.rotation.x = wingAngle;
    rightWing.current.rotation.x = -wingAngle;
    const idle = reducedMotion ? 0 : Math.sin(elapsed.current * 0.65);
    group.current.position.set(-0.12 + flight * 0.34, -0.04 + flight * 0.3 + idle * 0.035, 0);
    group.current.rotation.set(
      0.28 + folded * 0.12 + flight * 0.06,
      -0.35 - folded * 0.12 - flight * 0.1,
      0.13 + folded * 0.13 + flight * 0.12 + idle * 0.009,
    );
    group.current.scale.setScalar(0.9 + folded * 0.055 + flight * 0.025);
    if (!ready.current) {
      ready.current = true;
      readyFrame.current = requestAnimationFrame(() => onReady?.());
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#f5f6f2", "#35453b", 0.65]} />
      <directionalLight position={[-3, 7, 5]} intensity={2.6} color="#fff9e9" />
      <directionalLight position={[5, 2, -4]} intensity={0.9} color="#d3e6ff" />
      <pointLight position={[-4, -2, 3]} intensity={10} color="#758cff" distance={15} decay={2} />
      <group ref={group}>
        <Wing side={-1} hinge={leftWing} />
        <Wing side={1} hinge={rightWing} />
        <mesh geometry={keel}>
          <meshPhysicalMaterial color="#3157d6" roughness={0.58} metalness={0.04} clearcoat={0.1} />
        </mesh>
      </group>
    </>
  );
}

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable?.(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function PaperPlaneScene(props: Props) {
  const { active = true, reducedMotion = false } = props;
  return (
    <SceneBoundary onUnavailable={props.onUnavailable}>
      <Canvas
        orthographic
        camera={{ position: [0, 2.9, 9], near: 0.1, far: 50, zoom: 70 }}
        dpr={[1, 2]}
        frameloop={active ? (reducedMotion ? "demand" : "always") : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMappingExposure = 1;
        }}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        aria-hidden="true"
      >
        <FoldedPlane {...props} />
      </Canvas>
    </SceneBoundary>
  );
}
