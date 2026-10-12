"use client";

import { Component, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  LatheGeometry,
  LineBasicMaterial,
  Mesh,
  MeshPhysicalMaterial,
  OrthographicCamera,
  SRGBColorSpace,
  Shape,
  Vector2,
  Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { advanceFlightClock, createFlightClock } from "@/lib/hero-flight";

type Props = {
  progress: MotionValue<number>;
  reducedMotion?: boolean;
  active?: boolean;
  presented?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
};
type Point = [number, number, number];
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const AIRCRAFT_FINISH = {
  paper: "#f4f0e6",
  paperFold: "#e5dfd3",
  pearl: "#e7e4dd",
  titanium: "#a9a7a2",
  ink: "#202832",
  glass: "#101a24",
  champagne: "#d6ad78",
};
function smooth(from: number, to: number, value: number) {
  const t = clamp((value - from) / (to - from));
  return t * t * (3 - 2 * t);
}

// The same closed wing becomes a swept aircraft wing. Both surfaces and the
// narrow paper edge have matching topology, so there is no object swap or fade.
function wingSurface(side: -1 | 1, aircraft: boolean) {
  const spans = 24;
  const chords = 36;
  const stride = chords + 1;
  const layer = (spans + 1) * stride;
  const points: number[] = [];
  const indices: number[] = [];
  const geometry = new BufferGeometry();
  for (const surface of [1, -1]) {
    for (let span = 0; span <= spans; span += 1) {
      const t = span / spans;
      const leading = aircraft ? .38 - 1.58 * t : 3.4 - 6 * t;
      const chord = aircraft ? 1.28 - 1.02 * t : 4.82 * (1 - t) + .006;
      const z = aircraft ? .27 + 2.45 * t : .012 + 2.238 * t;
      for (let along = 0; along <= chords; along += 1) {
        const u = (1 - Math.cos(along / chords * Math.PI)) / 2;
        const airfoil = 5 * (.085 - t * .025) * chord * (.2969 * Math.sqrt(u) - .126 * u - .3516 * u ** 2 + .2843 * u ** 3 - .1036 * u ** 4);
        const y = aircraft
          ? -.16 + t * .135 + Math.sin(Math.PI * u) * .011 * (1 - t) + airfoil * surface
          : .008 * surface;
        points.push(leading - chord * u, y, z * side);
      }
    }
  }
  const quad = (a: number, b: number, c: number, d: number, reverse: boolean) => {
    if (reverse) indices.push(a, c, b, a, d, c);
    else indices.push(a, b, c, a, c, d);
  };
  for (let surface = 0; surface < 2; surface += 1) {
    const start = indices.length;
    for (let span = 0; span < spans; span += 1) {
      for (let along = 0; along < chords; along += 1) {
        const a = surface * layer + span * stride + along;
        quad(a, a + stride, a + stride + 1, a + 1, (side === 1) === (surface === 0));
      }
    }
    geometry.addGroup(start, indices.length - start, surface === 0 ? 0 : 2);
  }
  const edges = indices.length;
  for (let along = 0; along < chords; along += 1) {
    quad(along, along + 1, layer + along + 1, layer + along, side === 1);
    const tip = spans * stride + along;
    quad(tip, layer + tip, layer + tip + 1, tip + 1, side === 1);
  }
  for (let span = 0; span < spans; span += 1) {
    const lead = span * stride;
    quad(lead, layer + lead, layer + lead + stride, lead + stride, side === 1);
    const trail = lead + chords;
    quad(trail, trail + stride, layer + trail + stride, layer + trail, side === 1);
  }
  geometry.addGroup(edges, indices.length - edges, 3);
  geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
function createWing(side: -1 | 1) {
  const paper = wingSurface(side, false);
  const aircraft = wingSurface(side, true);
  paper.morphAttributes.position = [aircraft.getAttribute("position")];
  paper.morphAttributes.normal = [aircraft.getAttribute("normal")];
  paper.computeBoundingSphere();
  aircraft.dispose();
  return paper;
}
function closedPrism(outline: Point[], thickness: number, axis: 1 | 2 = 1) {
  const points: number[] = [];
  const surface = (p: Point, direction: number): Point => {
    const copy: Point = [...p];
    copy[axis] += thickness * direction / 2;
    return copy;
  };
  const triangle = (a: Point, b: Point, c: Point) => points.push(...a, ...b, ...c);
  for (let i = 1; i < outline.length - 1; i += 1) {
    triangle(surface(outline[0], 1), surface(outline[i], 1), surface(outline[i + 1], 1));
    triangle(surface(outline[0], -1), surface(outline[i + 1], -1), surface(outline[i], -1));
  }
  for (let i = 0; i < outline.length; i += 1) {
    const a = outline[i];
    const b = outline[(i + 1) % outline.length];
    triangle(surface(a, 1), surface(a, -1), surface(b, -1));
    triangle(surface(a, 1), surface(b, -1), surface(b, 1));
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
  geometry.computeVertexNormals();
  return geometry;
}
function lathe(points: number[][], segments = 48, smoothProfile = false) {
  const profile = smoothProfile
    ? new CatmullRomCurve3(points.map(([radius, length]) => new Vector3(radius, length, 0))).getPoints(64).map(p => new Vector2(Math.max(0, p.x), p.y))
    : points.map(([radius, length]) => new Vector2(radius, length));
  const geometry = new LatheGeometry(profile, segments);
  geometry.rotateZ(-Math.PI / 2);
  return geometry;
}
const BODY_PROFILE = [
  [-3.11, .013], [-2.95, .06], [-2.61, .13], [-2.06, .245],
  [-1.55, .343], [-1.05, .362], [.95, .362], [1.48, .348],
  [1.89, .312], [2.18, .247], [2.43, .181], [2.73, .124],
  [2.96, .061], [3.08, .018], [3.105, 0],
];
function bodyRadius(x: number) {
  if (x <= BODY_PROFILE[0][0]) return BODY_PROFILE[0][1];
  if (x >= BODY_PROFILE[BODY_PROFILE.length - 1][0]) return 0;
  const index = Math.min(BODY_PROFILE.length - 2, Math.max(0, BODY_PROFILE.findIndex(point => point[0] >= x) - 1));
  const [x0, radius0] = BODY_PROFILE[index];
  const [x1, radius1] = BODY_PROFILE[index + 1];
  const t = clamp((x - x0) / (x1 - x0));
  const before = BODY_PROFILE[Math.max(0, index - 1)];
  const after = BODY_PROFILE[Math.min(BODY_PROFILE.length - 1, index + 2)];
  const m0 = (radius1 - before[1]) / (x1 - before[0]);
  const m1 = (after[1] - radius0) / (after[0] - x0);
  return Math.max(0, (2 * t ** 3 - 3 * t ** 2 + 1) * radius0 + (t ** 3 - 2 * t ** 2 + t) * (x1 - x0) * m0 + (-2 * t ** 3 + 3 * t ** 2) * radius1 + (t ** 3 - t ** 2) * (x1 - x0) * m1);
}
function bodyPoint(x: number, angle: number, side: -1 | 1, offset = .006): Point {
  const radius = bodyRadius(x) + offset;
  return [x, Math.sin(angle) * radius * .97, Math.cos(angle) * radius * side];
}
function fuselageGeometry() {
  const geometry = lathe(Array.from({ length: 145 }, (_, i) => {
    const x = -3.11 + i / 144 * 6.215;
    return [bodyRadius(x), x];
  }), 96);
  geometry.scale(1, .97, 1);
  return geometry;
}
function bodySurface(side: -1 | 1, corners: [number, number][], offset = .007) {
  const vertices: number[] = [];
  const indices: number[] = [];
  const subdivisions = 12;
  for (let row = 0; row <= subdivisions; row += 1) {
    const v = row / subdivisions;
    for (let column = 0; column <= subdivisions; column += 1) {
      const u = column / subdivisions;
      const x = corners[0][0] * (1 - u) * (1 - v) + corners[1][0] * u * (1 - v) + corners[2][0] * u * v + corners[3][0] * (1 - u) * v;
      const angle = corners[0][1] * (1 - u) * (1 - v) + corners[1][1] * u * (1 - v) + corners[2][1] * u * v + corners[3][1] * (1 - u) * v;
      vertices.push(...bodyPoint(x, angle, side, offset));
      if (row < subdivisions && column < subdivisions) {
        const a = row * (subdivisions + 1) + column;
        indices.push(a, a + 1, a + subdivisions + 2, a, a + subdivisions + 2, a + subdivisions + 1);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
function cabinWindow(side: -1 | 1, x: number, trim: boolean) {
  const vertices = [...bodyPoint(x, .34, side, trim ? .006 : .009)];
  const indices: number[] = [];
  for (let i = 0; i <= 40; i += 1) {
    const angle = i / 40 * Math.PI * 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    vertices.push(...bodyPoint(x + Math.sign(cos) * Math.abs(cos) ** .65 * (trim ? .081 : .068), .34 + Math.sign(sin) * Math.abs(sin) ** .65 * (trim ? .258 : .222), side, trim ? .006 : .009));
    if (i < 40) indices.push(0, i + 1, i + 2);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
function verticalTail() {
  const shape = new Shape();
  shape.moveTo(-1.98, .18);
  shape.lineTo(-2.55, 1.35);
  shape.quadraticCurveTo(-2.575, 1.4, -2.64, 1.4);
  shape.lineTo(-3.025, 1.4);
  shape.lineTo(-3.09, .13);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, { depth: .045, bevelEnabled: true, bevelThickness: .012, bevelSize: .014, bevelSegments: 3, curveSegments: 16 });
  geometry.translate(0, 0, -.0225);
  return geometry;
}
function windowRow(side: -1 | 1, trim: boolean) {
  const windows = [1.1, .74, .38, .02, -.34, -.7, -1.06].map(x => cabinWindow(side, x, trim));
  const geometry = mergeGeometries(windows)!;
  windows.forEach(window => window.dispose());
  return geometry;
}
function turbineFan() {
  const blades = Array.from({ length: 18 }, (_, index) => {
    const blade = new BoxGeometry(.01, .11, .022);
    blade.rotateX(.4);
    blade.translate(0, .112, 0);
    blade.rotateX(index / 18 * Math.PI * 2);
    return blade;
  });
  const geometry = mergeGeometries(blades)!;
  blades.forEach(blade => blade.dispose());
  return geometry;
}

function Wing({ side, hinge, meshRef }: { side: -1 | 1; hinge: RefObject<Group | null>; meshRef: RefObject<Mesh | null> }) {
  const geometry = useMemo(() => createWing(side), [side]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group ref={hinge}><mesh ref={meshRef} args={[geometry]} frustumCulled={false}>
    <meshPhysicalMaterial attach="material-0" color={AIRCRAFT_FINISH.paper} roughness={.7} metalness={.02} clearcoat={.02} envMapIntensity={.6} />
    <meshPhysicalMaterial attach="material-1" color={AIRCRAFT_FINISH.paperFold} roughness={.74} metalness={.02} envMapIntensity={.5} />
    <meshPhysicalMaterial attach="material-2" color="#c9c5bc" roughness={.72} metalness={.02} envMapIntensity={.55} />
    <meshPhysicalMaterial attach="material-3" color="#fcf7ec" roughness={.64} metalness={.02} envMapIntensity={.6} />
  </mesh></group>;
}

function AircraftDetails({ groupRef }: { groupRef: RefObject<Group | null> }) {
  const geometry = useMemo(() => ({
    body: fuselageGeometry(),
    fin: verticalTail(),
    finTrim: closedPrism([[-2.588, 1.314, 0], [-3.03, 1.314, 0], [-3.027, 1.338, 0], [-2.599, 1.338, 0]], .072, 2),
    stabilizer: closedPrism([[-2.55, 1.36, 0], [-3.05, 1.36, 0], [-3.27, 1.39, 1.06], [-3.06, 1.405, 1.06]], .034),
    engine: lathe([[.11, -.55], [.155, -.48], [.212, -.3], [.247, .17], [.245, .41], [.225, .535], [.208, .545], [.196, .495], [.185, .3], [.148, -.39], [.11, -.55]], 72, true),
    cockpitLeft: bodySurface(-1, [[2.38, .42], [2.055, 1.17], [1.9, 1.04], [2.1, .24]]),
    cockpitRight: bodySurface(1, [[2.38, .42], [2.055, 1.17], [1.9, 1.04], [2.1, .24]]),
    cockpitSideLeft: bodySurface(-1, [[2.055, .23], [1.863, 1.015], [1.48, .865], [1.575, .215]]),
    cockpitSideRight: bodySurface(1, [[2.055, .23], [1.863, 1.015], [1.48, .865], [1.575, .215]]),
    stripeLeft: bodySurface(-1, [[1.51, -.19], [-1.61, -.11], [-1.61, -.174], [1.51, -.215]]),
    stripeRight: bodySurface(1, [[1.51, -.19], [-1.61, -.11], [-1.61, -.174], [1.51, -.215]]),
    windowsLeft: windowRow(-1, false),
    windowsRight: windowRow(1, false),
    windowTrimLeft: windowRow(-1, true),
    windowTrimRight: windowRow(1, true),
    fan: turbineFan(),
    winglet: closedPrism([[-1.2, -.025, 2.72], [-1.35, .29, 2.805], [-1.49, .29, 2.805], [-1.46, -.025, 2.72]], .02, 2),
  }), []);
  useEffect(() => () => Object.values(geometry).forEach(value => value.dispose()), [geometry]);
  return <group ref={groupRef}>
    <mesh geometry={geometry.body}>
      <meshPhysicalMaterial color={AIRCRAFT_FINISH.pearl} roughness={.26} metalness={.26} clearcoat={.82} clearcoatRoughness={.17} envMapIntensity={.75} />
    </mesh>
    <mesh geometry={geometry.fin}><meshPhysicalMaterial color={AIRCRAFT_FINISH.ink} roughness={.33} metalness={.48} clearcoat={.62} clearcoatRoughness={.22} envMapIntensity={.7} side={2} /></mesh>
    <mesh geometry={geometry.finTrim}><meshPhysicalMaterial color={AIRCRAFT_FINISH.champagne} roughness={.36} metalness={.72} clearcoat={.3} envMapIntensity={.7} side={2} /></mesh>
    {([-1, 1] as const).map(side => <group key={side}>
      <mesh geometry={geometry.stabilizer} scale={[1, 1, side]}><meshPhysicalMaterial color={AIRCRAFT_FINISH.pearl} roughness={.32} metalness={.4} envMapIntensity={.65} side={2} /></mesh>
      <mesh geometry={geometry.winglet} scale={[1, 1, side]}><meshPhysicalMaterial color={AIRCRAFT_FINISH.ink} roughness={.3} metalness={.5} clearcoat={.5} envMapIntensity={.7} side={2} /></mesh>
      <mesh geometry={side === 1 ? geometry.cockpitRight : geometry.cockpitLeft}><meshPhysicalMaterial color={AIRCRAFT_FINISH.glass} roughness={.14} metalness={.2} clearcoat={1} clearcoatRoughness={.1} envMapIntensity={1.4} side={2} /></mesh>
      <mesh geometry={side === 1 ? geometry.cockpitSideRight : geometry.cockpitSideLeft}><meshPhysicalMaterial color={AIRCRAFT_FINISH.glass} roughness={.14} metalness={.2} clearcoat={1} clearcoatRoughness={.1} envMapIntensity={1.4} side={2} /></mesh>
      <mesh geometry={side === 1 ? geometry.windowTrimRight : geometry.windowTrimLeft}><meshStandardMaterial color={AIRCRAFT_FINISH.titanium} roughness={.32} metalness={.8} side={2} /></mesh>
      <mesh geometry={side === 1 ? geometry.windowsRight : geometry.windowsLeft}><meshPhysicalMaterial color={AIRCRAFT_FINISH.glass} roughness={.14} metalness={.12} clearcoat={1} envMapIntensity={1.2} side={2} /></mesh>
      <mesh geometry={side === 1 ? geometry.stripeRight : geometry.stripeLeft}><meshPhysicalMaterial color={AIRCRAFT_FINISH.champagne} roughness={.36} metalness={.65} side={2} /></mesh>
      <group position={[-1.98, .16, side * .675]}>
        <mesh geometry={geometry.engine}><meshPhysicalMaterial color={AIRCRAFT_FINISH.pearl} roughness={.29} metalness={.46} clearcoat={.52} envMapIntensity={.75} /></mesh>
        <mesh position={[.527, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[.218, .012, 12, 64]} /><meshStandardMaterial color={AIRCRAFT_FINISH.titanium} roughness={.25} metalness={.88} envMapIntensity={.9} /></mesh>
        <mesh position={[.37, 0, 0]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[.188, 48]} /><meshStandardMaterial color="#10151a" roughness={.48} side={2} /></mesh>
        <mesh position={[.39, 0, 0]} geometry={geometry.fan}><meshStandardMaterial color="#74777a" roughness={.42} metalness={.7} /></mesh>
        <mesh position={[.404, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[.052, .11, 32]} /><meshStandardMaterial color={AIRCRAFT_FINISH.titanium} roughness={.28} metalness={.85} /></mesh>
        <mesh position={[-.545, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[.108, .01, 8, 48]} /><meshStandardMaterial color="#5a5853" roughness={.45} metalness={.8} /></mesh>
        <mesh position={[-.06, -.025, -.15 * side]} scale={[.45, .065, .24]}><boxGeometry /><meshStandardMaterial color={AIRCRAFT_FINISH.titanium} roughness={.4} metalness={.7} /></mesh>
      </group>
    </group>)}
  </group>;
}

function fitCamera(camera: OrthographicCamera, width: number, height: number, aircraft = 0) {
  // The paper turn needs more vertical clearance than the settled cruise pose.
  // These reserves include both wing tips, the T-tail and the arrival bank.
  camera.zoom = Math.min(width / 7.55, height / (4.35 - aircraft * .6));
  camera.lookAt(new Vector3(0, .17, 0));
  camera.updateProjectionMatrix();
}

function Flight({ progress, reducedMotion = false, active = true, presented = false, onReady, onUnavailable }: Props) {
  const group = useRef<Group>(null);
  const leftWing = useRef<Group>(null);
  const rightWing = useRef<Group>(null);
  const leftMesh = useRef<Mesh>(null);
  const rightMesh = useRef<Mesh>(null);
  const aircraft = useRef<Group>(null);
  const keelMesh = useRef<Mesh>(null);
  const speedMaterial = useRef<LineBasicMaterial>(null);
  const wakeMaterial = useRef<LineBasicMaterial>(null);
  const ready = useRef(false);
  const readyFrame = useRef<number | null>(null);
  const prepared = useRef(false);
  const clock = useRef(createFlightClock());
  const burstTime = useRef(2);
  const turnVelocity = useRef(0);
  const { camera, size, invalidate, gl, scene } = useThree();
  const keel = useMemo(() => closedPrism([[3.38, -.006, 0], [-1.41, -.006, 0], [-1.64, -.78, 0]], .035, 2), []);
  const speedLines = useMemo(() => {
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(new Float32Array(8 * 6), 3));
    return geometry;
  }, []);
  const wingtipWake = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    // Short wake segments taper into the dark background without a glowing trail.
    for (const side of [-1, 1]) {
      for (let segment = 0; segment < 16; segment += 1) {
        for (const offset of [0, 1]) {
          const t = (segment + offset) / 16;
          positions.push(-1.48 - t * 1.66, .255 - t * .07, side * (2.8 + t * .05));
          const fade = Math.pow(1 - t, 2);
          colors.push(fade, fade * .98, fade * .93);
        }
      }
    }
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    return geometry;
  }, []);
  useEffect(() => () => { keel.dispose(); speedLines.dispose(); wingtipWake.dispose(); }, [keel, speedLines, wingtipWake]);
  useEffect(() => () => {
    if (readyFrame.current !== null) {
      cancelAnimationFrame(readyFrame.current);
      readyFrame.current = null;
    }
  }, []);
  useLayoutEffect(() => {
    const currentProgress = clamp(progress.get());
    fitCamera(camera as OrthographicCamera, size.width, size.height, smooth(.55, .83, currentProgress));
    clock.current = { ...clock.current, previousProgress: currentProgress, wasPlaying: false };
    turnVelocity.current = 0;
    invalidate();
  }, [camera, size.width, size.height, invalidate, progress]);
  useEffect(() => {
    const canvas = gl.domElement;
    const unavailable = (event: Event) => { event.preventDefault(); onUnavailable?.(); };
    canvas.addEventListener("webglcontextlost", unavailable);
    gl.compile(scene, camera);
    return () => canvas.removeEventListener("webglcontextlost", unavailable);
  }, [camera, gl, scene, onUnavailable]);
  useEffect(() => {
    const syncVisibility = () => {
      const visible = active && document.visibilityState !== "hidden";
      if (!visible || !presented || reducedMotion) {
        clock.current = advanceFlightClock(clock.current, { delta: 0, progress: clamp(progress.get()), active: visible, presented, reducedMotion }).clock;
        turnVelocity.current = 0;
      }
      if (visible) invalidate();
    };
    syncVisibility();
    document.addEventListener("visibilitychange", syncVisibility);
    const unsubscribe = progress.on("change", () => { if (active && document.visibilityState !== "hidden") invalidate(); });
    return () => {
      document.removeEventListener("visibilitychange", syncVisibility);
      unsubscribe();
    };
  }, [active, presented, reducedMotion, invalidate, progress]);

  useFrame((_, delta) => {
    if (!group.current || !leftWing.current || !rightWing.current || !aircraft.current || !keelMesh.current) return;
    const p = clamp(progress.get());
    const timing = advanceFlightClock(clock.current, { delta, progress: p, active: active && document.visibilityState !== "hidden", presented, reducedMotion });
    clock.current = timing.clock;
    const { delta: dt, elapsed, arrival } = timing;
    turnVelocity.current = timing.playing ? turnVelocity.current + (timing.velocity - turnVelocity.current) * (1 - Math.exp(-dt * 5)) : 0;
    if (timing.enteredBuild) burstTime.current = 0;
    if (timing.playing) burstTime.current += dt;
    const folded = smooth(.025, .31, p);
    const morph = smooth(.55, .83, p);
    const cruise = smooth(.84, 1, p);
    const rushing = Math.sin(smooth(.31, .7, p) * Math.PI);
    const burst = reducedMotion ? 0 : Math.sin(clamp(burstTime.current / 1.3) * Math.PI);
    const idle = reducedMotion ? 0 : Math.sin(elapsed * .7);
    const wingAngle = (.46 * (1 - folded) + .075 * folded) * (1 - morph);
    leftWing.current.rotation.x = wingAngle;
    rightWing.current.rotation.x = -wingAngle;
    for (const mesh of [leftMesh.current, rightMesh.current]) {
      if (!mesh?.morphTargetInfluences) continue;
      mesh.morphTargetInfluences[0] = morph;
      const materials = mesh.material as MeshPhysicalMaterial[];
      materials[0].metalness = .02 + .4 * morph;
      materials[0].roughness = .7 - .38 * morph;
      materials[0].clearcoat = .02 + .55 * morph;
      materials[1].metalness = .02 + .45 * morph;
      materials[1].roughness = .74 - .39 * morph;
      materials[2].metalness = .02 + .56 * morph;
      materials[2].roughness = .72 - .34 * morph;
      materials[3].metalness = .02 + .68 * morph;
      materials[3].roughness = .64 - .37 * morph;
    }
    aircraft.current.visible = morph > .001;
    aircraft.current.scale.set(1, Math.max(.001, morph), Math.max(.001, morph));
    keelMesh.current.scale.y = Math.max(.001, 1 - morph);
    keelMesh.current.visible = morph < .999;
    group.current.position.set(
      -.08 - (1 - arrival) * .82 + rushing * .18 + burst * .09 + cruise * .2,
      -.08 - (1 - arrival) * .28 + morph * .09 + idle * .018 + turnVelocity.current * .025 + cruise * .065,
      0,
    );
    group.current.rotation.set(
      .25 + folded * .09 + rushing * .22 + burst * .08 - morph * .27 + turnVelocity.current * .055 - cruise * .018,
      -.32 + (1 - arrival) * .8 - folded * .12 - rushing * .16 + morph * .55 - turnVelocity.current * .04 + cruise * .025,
      .13 - (1 - arrival) * .32 + folded * .07 + rushing * .1 + burst * .045 - morph * .145 + idle * .004 + turnVelocity.current * .025 + cruise * .018,
    );
    group.current.scale.setScalar((.91 + folded * .025 - rushing * .015 + morph * .065) * (.77 + arrival * .23));
    fitCamera(camera as OrthographicCamera, size.width, size.height, morph);

    if (speedMaterial.current) {
      const launch = Math.sin(clamp((elapsed - .18) / 1.0) * Math.PI);
      const energy = reducedMotion ? 0 : Math.max(launch * .58, burst * .75, Math.abs(turnVelocity.current) * morph * .35);
      speedMaterial.current.opacity = energy * .18;
      if (energy > .001) {
        const attr = speedLines.getAttribute("position");
        const time = burst > .01 ? burstTime.current : elapsed;
        for (let i = 0; i < 8; i += 1) {
          const x = 4.1 - ((time * 6.7 + i * .97) % 8.2);
          const y = -.76 + (i % 5) * .38;
          const z = -1.9 - (i % 3) * .15;
          const length = .2 + (i % 4) * .13;
          attr.setXYZ(i * 2, x, y, z);
          attr.setXYZ(i * 2 + 1, x - length, y - .035, z);
        }
        attr.needsUpdate = true;
      }
    }
    if (wakeMaterial.current) {
      wakeMaterial.current.opacity = reducedMotion ? 0 : smooth(.71, .88, p) * (.08 + Math.abs(turnVelocity.current) * .13);
    }
    prepared.current = true;
  });

  return <>
    <ambientLight intensity={.24} />
    <hemisphereLight args={["#f4f0e6", "#222a36", .65]} />
    <directionalLight position={[-3, 7, 5]} intensity={2.45} color="#fff4df" />
    <directionalLight position={[5, 2, -4]} intensity={1.65} color="#dce4eb" />
    <pointLight position={[-4, -2, 3]} intensity={5} color="#d6ad78" distance={15} decay={2} />
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2} color="#fff8ec" position={[-2, 5, 3]} scale={[7, 3, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.3} color="#dce4eb" position={[3, 2, -4]} scale={[5, 1, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={.75} color="#e4c59d" position={[1, -3, 4]} scale={[3, 4, 1]} target={[0, 0, 0]} />
    </Environment>
    <lineSegments geometry={speedLines} frustumCulled={false} renderOrder={1000} onAfterRender={() => {
      if (prepared.current && !ready.current && readyFrame.current === null) {
        readyFrame.current = requestAnimationFrame(() => {
          readyFrame.current = null;
          ready.current = true;
          onReady?.();
        });
      }
    }}><lineBasicMaterial ref={speedMaterial} color="#dedbd3" transparent opacity={0} depthWrite={false} /></lineSegments>
    <group ref={group}>
      <Wing side={-1} hinge={leftWing} meshRef={leftMesh} />
      <Wing side={1} hinge={rightWing} meshRef={rightMesh} />
      <mesh ref={keelMesh} geometry={keel}><meshPhysicalMaterial color={AIRCRAFT_FINISH.paperFold} roughness={.78} metalness={.02} side={2} envMapIntensity={.5} /></mesh>
      <AircraftDetails groupRef={aircraft} />
      <lineSegments geometry={wingtipWake} frustumCulled={false}><lineBasicMaterial ref={wakeMaterial} vertexColors transparent opacity={0} depthWrite={false} /></lineSegments>
    </group>
  </>;
}

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable?.(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function PaperPlaneScene(props: Props) {
  const { active = true, reducedMotion = false } = props;
  return <SceneBoundary onUnavailable={props.onUnavailable}><Canvas
    orthographic
    camera={{ position: [0, 2.9, 9], near: .1, far: 50, zoom: 70 }}
    dpr={[1, 2]}
    frameloop={active ? (reducedMotion ? "demand" : "always") : "never"}
    gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); gl.outputColorSpace = SRGBColorSpace; gl.toneMappingExposure = 1; }}
    style={{ width: "100%", height: "100%", pointerEvents: "none" }}
    aria-hidden="true"
  ><Flight {...props} /></Canvas></SceneBoundary>;
}
