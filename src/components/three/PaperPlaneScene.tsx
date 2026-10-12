"use client";

import { Component, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import {
  BufferGeometry,
  CatmullRomCurve3,
  Float32BufferAttribute,
  Group,
  LatheGeometry,
  LineBasicMaterial,
  Mesh,
  MeshPhysicalMaterial,
  OrthographicCamera,
  SRGBColorSpace,
  Vector2,
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
  const outline: Point[] = aircraft ? [
    [.68, .045, .22 * side], [-1.42, .025, .22 * side],
    [-2.12, .13, 2.76 * side], [-1.63, .15, 2.76 * side],
    [-.96, .09, 1.82 * side],
  ] : [
    [3.4, 0, .016 * side], [-1.42, 0, .016 * side],
    [-2.7, 0, 2.25 * side], [-1.48, 0, 1.8 * side],
    [1.12, 0, .846 * side],
  ];
  const centre: Point = aircraft ? [-.65, .082, .91 * side] : [-.78, 0, .59 * side];
  const thickness = aircraft ? .035 : .018;
  const points: number[] = [];
  const geometry = new BufferGeometry();
  const triangle = (a: Point, b: Point, c: Point, material: number) => {
    const start = points.length / 3;
    points.push(...a, ...b, ...c);
    geometry.addGroup(start, 3, material);
  };
  const surface = (p: Point, top: boolean): Point => [p[0], p[1] + (top ? thickness / 2 : -thickness / 2), p[2]];
  for (let i = 0; i < outline.length; i += 1) {
    const a = outline[i];
    const b = outline[(i + 1) % outline.length];
    const ordered = side === 1 ? [a, b] : [b, a];
    triangle(surface(centre, true), surface(ordered[0], true), surface(ordered[1], true), i === 0 ? 1 : 0);
    triangle(surface(centre, false), surface(ordered[1], false), surface(ordered[0], false), 2);
    triangle(surface(ordered[0], true), surface(ordered[0], false), surface(ordered[1], false), 3);
    triangle(surface(ordered[0], true), surface(ordered[1], false), surface(ordered[1], true), 3);
  }
  geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
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
function fuselageGeometry() {
  const geometry = lathe([
    [0, -2.91], [.085, -2.69], [.19, -2.05], [.29, -1.22],
    [.335, -.25], [.335, .7], [.3, 1.45], [.24, 2.02],
    [.15, 2.57], [.062, 2.89], [0, 3.02],
  ], 64, true);
  geometry.scale(1, .83, 1);
  geometry.clearGroups();
  for (let i = 0; i < 64; i += 1) {
    const angle = (i + .5) / 64 * Math.PI * 2;
    geometry.addGroup(i * 64 * 6, 64 * 6, Math.sin(angle) > .58 ? 1 : 0);
  }
  return geometry;
}
function cockpitGeometry(side: -1 | 1) {
  const vertices = [
    2.13, .137, .174 * side,
    1.45, .23, .193 * side,
    1.37, .104, .284 * side,
    2.055, .045, .245 * side,
  ];
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(side === 1 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]);
  geometry.computeVertexNormals();
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
    fin: closedPrism([[-1.68, .14, 0], [-2.81, .13, 0], [-2.86, 1.13, 0], [-2.56, 1.17, 0]], .06, 2),
    finTrim: closedPrism([[-2.54, 1.095, 0], [-2.859, 1.059, 0], [-2.86, 1.115, 0], [-2.558, 1.15, 0]], .062, 2),
    stabilizer: closedPrism([[-1.7, .6, 0], [-2.72, .61, 0], [-2.98, .64, 1.24], [-2.57, .64, 1.24]], .033),
    engine: lathe([[.115, -.49], [.185, -.38], [.224, -.12], [.229, .23], [.212, .45], [.17, .455], [.168, .3], [.125, -.4], [.115, -.49]], 48),
    cockpitLeft: cockpitGeometry(-1),
    cockpitRight: cockpitGeometry(1),
    winglet: closedPrism([[-2.12, .13, 2.76], [-2.3, .63, 2.91], [-2.13, .67, 2.91], [-1.63, .15, 2.76]], .025, 2),
  }), []);
  useEffect(() => () => Object.values(geometry).forEach(value => value.dispose()), [geometry]);
  return <group ref={groupRef}>
    <mesh geometry={geometry.body}>
      <meshPhysicalMaterial attach="material-0" color={AIRCRAFT_FINISH.pearl} roughness={.3} metalness={.36} clearcoat={.7} clearcoatRoughness={.2} envMapIntensity={.65} />
      <meshPhysicalMaterial attach="material-1" color={AIRCRAFT_FINISH.ink} roughness={.35} metalness={.5} clearcoat={.62} clearcoatRoughness={.24} envMapIntensity={.7} />
    </mesh>
    <mesh geometry={geometry.fin}><meshPhysicalMaterial color={AIRCRAFT_FINISH.ink} roughness={.33} metalness={.48} clearcoat={.62} clearcoatRoughness={.22} envMapIntensity={.7} side={2} /></mesh>
    <mesh geometry={geometry.finTrim}><meshPhysicalMaterial color={AIRCRAFT_FINISH.champagne} roughness={.36} metalness={.72} clearcoat={.3} envMapIntensity={.7} side={2} /></mesh>
    {([-1, 1] as const).map(side => <group key={side}>
      <mesh geometry={geometry.stabilizer} scale={[1, 1, side]}><meshPhysicalMaterial color={AIRCRAFT_FINISH.pearl} roughness={.32} metalness={.4} envMapIntensity={.65} side={2} /></mesh>
      <mesh geometry={geometry.winglet} scale={[1, 1, side]}><meshPhysicalMaterial color={AIRCRAFT_FINISH.ink} roughness={.3} metalness={.5} clearcoat={.5} envMapIntensity={.7} side={2} /></mesh>
      <mesh geometry={side === 1 ? geometry.cockpitRight : geometry.cockpitLeft}><meshPhysicalMaterial color={AIRCRAFT_FINISH.glass} roughness={.14} metalness={.2} clearcoat={1} clearcoatRoughness={.1} envMapIntensity={1.4} side={2} /></mesh>
      {[.86, .45, .04, -.37, -.78].map((x, i) => <mesh key={x} position={[x, .075, side * (.334 - i * .004)]} scale={[.083, .055, .009]}><sphereGeometry args={[1, 16, 10]} /><meshPhysicalMaterial color={AIRCRAFT_FINISH.glass} roughness={.16} metalness={.18} clearcoat={1} envMapIntensity={1.25} /></mesh>)}
      <group position={[-1.86, .22, side * .62]}>
        <mesh geometry={geometry.engine}><meshPhysicalMaterial color={AIRCRAFT_FINISH.pearl} roughness={.29} metalness={.46} clearcoat={.52} envMapIntensity={.75} /></mesh>
        <mesh position={[.447, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[.187, .013, 8, 48]} /><meshStandardMaterial color={AIRCRAFT_FINISH.titanium} roughness={.25} metalness={.88} envMapIntensity={.9} /></mesh>
        <mesh position={[.36, 0, 0]} rotation={[0, Math.PI / 2, 0]}><circleGeometry args={[.17, 32]} /><meshStandardMaterial color="#10151a" roughness={.48} side={2} /></mesh>
        {Array.from({ length: 12 }, (_, blade) => <group key={blade} position={[.37, 0, 0]} rotation={[blade * Math.PI / 6, 0, 0]}><mesh position={[0, .097, 0]} rotation={[.3, 0, 0]}><boxGeometry args={[.008, .09, .014]} /><meshStandardMaterial color="#74777a" roughness={.42} metalness={.7} /></mesh></group>)}
        <mesh position={[.374, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[.05, .072, 20]} /><meshStandardMaterial color={AIRCRAFT_FINISH.titanium} roughness={.28} metalness={.85} /></mesh>
        <mesh position={[-.06, -.025, -.15 * side]} scale={[.45, .065, .24]}><boxGeometry /><meshStandardMaterial color={AIRCRAFT_FINISH.titanium} roughness={.4} metalness={.7} /></mesh>
      </group>
    </group>)}
  </group>;
}

function fitCamera(camera: OrthographicCamera, width: number, height: number) {
  camera.zoom = Math.min(width / 8.75, height / 5.1);
  camera.lookAt(new Vector3(0, .17, 0));
  camera.updateProjectionMatrix();
}

function Flight({ progress, reducedMotion = false, active = true, onReady, onUnavailable }: Props) {
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
  const elapsed = useRef(0);
  const burstTime = useRef(2);
  const previousChapter = useRef(-1);
  const previousProgress = useRef(progress.get());
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
          positions.push(-2.22 - t * 1.66, .57 - t * .07, side * (2.885 + t * .05));
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
  useEffect(() => () => { if (readyFrame.current !== null) cancelAnimationFrame(readyFrame.current); }, []);
  useLayoutEffect(() => {
    fitCamera(camera as OrthographicCamera, size.width, size.height);
    invalidate();
  }, [camera, size.width, size.height, invalidate]);
  useEffect(() => {
    const canvas = gl.domElement;
    const unavailable = (event: Event) => { event.preventDefault(); onUnavailable?.(); };
    canvas.addEventListener("webglcontextlost", unavailable);
    gl.compile(scene, camera);
    return () => canvas.removeEventListener("webglcontextlost", unavailable);
  }, [camera, gl, scene, onUnavailable]);
  useEffect(() => {
    if (active) invalidate();
    return progress.on("change", () => { if (active) invalidate(); });
  }, [active, invalidate, progress]);

  useFrame((_, delta) => {
    if (!group.current || !leftWing.current || !rightWing.current || !aircraft.current || !keelMesh.current) return;
    const dt = Math.min(delta, .05);
    if (active && !reducedMotion) elapsed.current += dt;
    const p = clamp(progress.get());
    const velocity = active && !reducedMotion ? Math.max(-1, Math.min(1, (p - previousProgress.current) / Math.max(.001, dt))) : 0;
    turnVelocity.current = reducedMotion ? 0 : turnVelocity.current + (velocity - turnVelocity.current) * (1 - Math.exp(-dt * 5));
    previousProgress.current = p;
    const chapter = p < .32 ? 0 : p < .84 ? 1 : 2;
    if (chapter !== previousChapter.current) {
      if (chapter === 1 && !reducedMotion) burstTime.current = 0;
      previousChapter.current = chapter;
    }
    if (active) burstTime.current += dt;
    const folded = smooth(.025, .31, p);
    const morph = smooth(.55, .83, p);
    const rushing = Math.sin(smooth(.31, .7, p) * Math.PI);
    const burst = reducedMotion ? 0 : Math.sin(clamp(burstTime.current / 1.3) * Math.PI);
    const arrival = reducedMotion ? 1 : 1 - Math.pow(1 - clamp(elapsed.current / 1.5), 3);
    const idle = reducedMotion ? 0 : Math.sin(elapsed.current * .7);
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
      -.08 - (1 - arrival) * .82 + rushing * .18 + burst * .09,
      -.08 - (1 - arrival) * .28 + morph * .09 + idle * .018 + turnVelocity.current * .025,
      0,
    );
    group.current.rotation.set(
      .25 + folded * .09 + rushing * .22 + burst * .08 - morph * .17 + turnVelocity.current * .055,
      -.32 + (1 - arrival) * .8 - folded * .12 - rushing * .16 - morph * .06 - turnVelocity.current * .04,
      .13 - (1 - arrival) * .32 + folded * .07 + rushing * .1 + burst * .045 - morph * .145 + idle * .004 + turnVelocity.current * .025,
    );
    group.current.scale.setScalar((.91 + folded * .025 - rushing * .015 + morph * .065) * (.77 + arrival * .23));

    if (speedMaterial.current) {
      const launch = Math.sin(clamp((elapsed.current - .18) / 1.0) * Math.PI);
      const energy = reducedMotion ? 0 : Math.max(launch * .58, burst * .75, Math.abs(turnVelocity.current) * morph * .35);
      speedMaterial.current.opacity = energy * .18;
      if (energy > .001) {
        const attr = speedLines.getAttribute("position");
        const time = burst > .01 ? burstTime.current : elapsed.current;
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
  });

  return <>
    <ambientLight intensity={.24} />
    <hemisphereLight args={["#f4f0e6", "#222a36", .65]} />
    <directionalLight position={[-3, 7, 5]} intensity={2.45} color="#fff4df" />
    <directionalLight position={[5, 2, -4]} intensity={1.65} color="#dce4eb" />
    <pointLight position={[-4, -2, 3]} intensity={5} color="#d6ad78" distance={15} decay={2} />
    <Environment resolution={128} frames={1}>
      <Lightformer form="rect" intensity={2} color="#fff8ec" position={[-2, 5, 3]} scale={[7, 3, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.3} color="#dce4eb" position={[3, 2, -4]} scale={[5, 1, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={.75} color="#e4c59d" position={[1, -3, 4]} scale={[3, 4, 1]} target={[0, 0, 0]} />
    </Environment>
    <lineSegments geometry={speedLines} frustumCulled={false} renderOrder={1000} onAfterRender={() => {
      if (!ready.current) {
        ready.current = true;
        readyFrame.current = requestAnimationFrame(() => onReady?.());
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
