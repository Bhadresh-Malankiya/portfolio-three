"use client";

import { Component, useEffect, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { sampleAvatarStride } from "@/lib/avatar-locomotion";
import {
  BufferGeometry,
  CatmullRomCurve3,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  OrthographicCamera,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three";

export type AvatarMood = "welcome" | "thinking" | "proud" | "curious" | "grateful" | "wave";
export type CompanionTravel = {
  journeyVelocity: number;
  flight: number;
  pointDirection: number;
  pointing?: boolean;
  /** Positive elevation points upward; negative elevation points downward. */
  pointElevation?: number;
  speaking?: boolean;
};

type Props = {
  mood: AvatarMood;
  reducedMotion?: boolean;
  active?: boolean;
  travel?: RefObject<CompanionTravel>;
  interacting?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
};

const SKIN = "#cf9067";
const HAIR = "#171d26";
const JACKET = "#344e69";
type Point = [number, number, number];

function surfacePoint(theta: number, phi: number, offset = 0): Vector3 {
  const lower = Math.max(0, -Math.cos(theta));
  const jaw = 1 - lower * 0.15;
  return new Vector3(
    (0.555 + offset) * Math.sin(theta) * Math.sin(phi) * jaw,
    (0.625 + offset) * Math.cos(theta),
    (0.48 + offset) * Math.sin(theta) * Math.cos(phi),
  );
}

/** A continuous sculpted surface follows the head, including its narrower jaw. */
function headSurface(kind: "hair" | "beard") {
  const points: number[] = [];
  const indices: number[] = [];
  const columns = 48;
  const rows = 24;
  for (let row = 0; row <= rows; row++) {
    for (let column = 0; column <= columns; column++) {
      const phi = kind === "hair"
        ? (column / columns) * Math.PI * 2 - Math.PI
        : (column / columns) * Math.PI * 1.05 - Math.PI * 0.525;
      const front = Math.max(0, Math.cos(phi));
      const start = kind === "hair" ? 0 : 1.68 + 0.35 * front;
      const end = kind === "hair"
        ? 1.7 - 0.57 * front + Math.sin(phi * 2) * 0.045
        : 2.91;
      const point = surfacePoint(MathUtils.lerp(start, end, row / rows), phi, kind === "hair" ? 0.029 : 0.014);
      points.push(point.x, point.y, point.z);
      if (row < rows && column < columns) {
        const a = row * (columns + 1) + column;
        const b = a + columns + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(points, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

/** Tapered, swept locks create one deliberate hairstyle instead of a ball cluster. */
function sweptLock(points: Point[], width: number, thickness: number) {
  const curve = new CatmullRomCurve3(points.map((point) => new Vector3(...point)));
  const frames = curve.computeFrenetFrames(26, false);
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let section = 0; section <= 26; section++) {
    const t = section / 26;
    const center = curve.getPoint(t);
    const taper = Math.max(0.025, Math.pow(Math.sin(Math.PI * t), 0.6));
    for (let side = 0; side <= 10; side++) {
      const angle = (side / 10) * Math.PI * 2;
      const point = center.clone()
        .addScaledVector(frames.normals[section], Math.cos(angle) * width * taper)
        .addScaledVector(frames.binormals[section], Math.sin(angle) * thickness * taper);
      vertices.push(point.x, point.y, point.z);
      if (section < 26 && side < 10) {
        const a = section * 11 + side;
        const b = a + 11;
        indices.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function Stroke({ points, radius, color }: { points: Point[]; radius: number; color: string }) {
  const coordinates = points.flat().join(",");
  const geometry = useMemo(() => {
    const values = coordinates.split(",").map(Number);
    const vertices: Vector3[] = [];
    for (let index = 0; index < values.length; index += 3) vertices.push(new Vector3(...values.slice(index, index + 3) as Point));
    return new TubeGeometry(new CatmullRomCurve3(vertices), 18, radius, 7, false);
  }, [coordinates, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry}><meshStandardMaterial color={color} roughness={0.68} /></mesh>;
}

function Pebble({ position, scale, color, glossy = false }: {
  position: Point;
  scale: Point;
  color: string;
  glossy?: boolean;
}) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 24, 18]} />
      <meshPhysicalMaterial color={color} roughness={glossy ? 0.24 : 0.68} clearcoat={glossy ? 0.45 : 0.08} />
    </mesh>
  );
}

function Hand() {
  return (
    <group position={[0, -0.215, 0.025]}>
      <Pebble position={[0, -0.035, 0]} scale={[0.098, 0.119, 0.073]} color={SKIN} />
      <Pebble position={[0.082, -0.013, 0.027]} scale={[0.043, 0.074, 0.047]} color={SKIN} />
      <Stroke points={[[-0.033, -0.054, 0.066], [-0.028, -0.088, 0.059]]} radius={0.006} color="#b57450" />
      <Stroke points={[[0.014, -0.06, 0.071], [0.016, -0.095, 0.054]]} radius={0.006} color="#b57450" />
    </group>
  );
}

function Arm({ elbow }: { elbow: RefObject<Group | null> }) {
  return (
    <>
      <mesh position={[0, -0.105, 0]}>
        <capsuleGeometry args={[0.102, 0.12, 6, 12]} />
        <meshStandardMaterial color={JACKET} roughness={0.73} />
      </mesh>
      <group ref={elbow} position={[0, -0.225, 0]}>
        <mesh position={[0, -0.055, 0]}>
          <capsuleGeometry args={[0.091, 0.105, 6, 12]} />
          <meshStandardMaterial color={JACKET} roughness={0.73} />
        </mesh>
        <mesh position={[0, -0.142, 0.01]}>
          <cylinderGeometry args={[0.091, 0.086, 0.065, 16]} />
          <meshStandardMaterial color="#24394e" roughness={0.7} />
        </mesh>
        <Hand />
      </group>
    </>
  );
}

/** The saddle touches the crown; the rider's forward-folded legs clear its sides. */
function BalloonRide() {
  const seams = useMemo(() => Array.from({ length: 6 }, (_, index) => {
    const phi = (index / 6) * Math.PI * 2;
    return Array.from({ length: 17 }, (_, segment): Point => {
      const theta = .14 + (segment / 16) * (Math.PI - .3);
      const taper = 1 - Math.max(0, -Math.cos(theta)) ** 2 * .12;
      return [
        Math.sin(theta) * Math.sin(phi) * .543 * taper,
        -.805 + Math.cos(theta) * .763,
        -.16 + Math.sin(theta) * Math.cos(phi) * .513 * taper,
      ];
    });
  }), []);
  const shell = useMemo(() => {
    const geometry = new SphereGeometry(1, 40, 28);
    const vertices = geometry.attributes.position;
    for (let index = 0; index < vertices.count; index++) {
      const x = vertices.getX(index), y = vertices.getY(index), z = vertices.getZ(index);
      const taper = 1 - Math.max(0, -y) ** 2 * .12;
      vertices.setXYZ(index, x * .54 * taper, y * .76, z * .51 * taper);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  useEffect(() => () => shell.dispose(), [shell]);
  return (
    <>
      <mesh geometry={shell} position={[0, -.805, -.16]}>
        <meshPhysicalMaterial color="#b8c99d" roughness={.34} metalness={.08} clearcoat={.42} clearcoatRoughness={.25} />
      </mesh>
      {seams.map((points, index) => <Stroke key={index} points={points} radius={.0045} color="#91a67a" />)}
      <RoundedBox args={[.65, .075, .60]} radius={.035} smoothness={3}>
        <meshStandardMaterial color="#283a48" roughness={.72} />
      </RoundedBox>
      <RoundedBox args={[.60, .035, .56]} radius={.016} smoothness={2} position={[0, .038, 0]}>
        <meshStandardMaterial color="#d7d9c5" roughness={.8} />
      </RoundedBox>
      <Stroke points={[[-.29, -.06, -.19], [-.34, -.18, -.20], [-.41, -.32, -.19]]} radius={.014} color="#344e69" />
      <Stroke points={[[.29, -.06, -.19], [.34, -.18, -.20], [.41, -.32, -.19]]} radius={.014} color="#344e69" />
      <mesh position={[0, -1.615, -.16]}>
        <coneGeometry args={[.051, .11, 16]} />
        <meshStandardMaterial color="#8fa775" roughness={.52} />
      </mesh>
      <Stroke points={[[0, -1.655, -.16], [-.042, -1.755, -.14], [.046, -1.90, -.12], [.006, -2.01, -.10]]} radius={.010} color="#d8ddc6" />
    </>
  );
}

const expressions = {
  welcome: { tilt: -0.045, turn: -0.08, brow: 0, smile: 0.8, rightArm: -0.28, armX: 0, leftArm: 0.17 },
  thinking: { tilt: 0.10, turn: 0.16, brow: -0.12, smile: 0.25, rightArm: 2.58, armX: -0.72, leftArm: 0.15 },
  proud: { tilt: -0.035, turn: -0.1, brow: 0.04, smile: 1.25, rightArm: -0.48, armX: 0, leftArm: 0.48 },
  curious: { tilt: -0.16, turn: -0.06, brow: 0.17, smile: 0.45, rightArm: -0.60, armX: -0.12, leftArm: 0.22 },
  grateful: { tilt: 0.09, turn: 0.06, brow: 0.045, smile: 1.18, rightArm: 0.63, armX: -0.72, leftArm: -0.63 },
  wave: { tilt: -0.09, turn: -0.04, brow: 0.075, smile: 1.12, rightArm: -2.12, armX: -0.05, leftArm: 0.22 },
} as const;

function Character({ mood, reducedMotion = false, active = true, travel, interacting = false, onReady }: Props) {
  const rideRig = useRef<Group>(null);
  const balloon = useRef<Group>(null);
  const groundShadow = useRef<Mesh>(null);
  const figure = useRef<Group>(null);
  const torso = useRef<Group>(null);
  const pelvis = useRef<Group>(null);
  const head = useRef<Group>(null);
  const eyes = useRef<Group>(null);
  const pupils = useRef<Group>(null);
  const brows = useRef<Group>(null);
  const mouth = useRef<Group>(null);
  const rightArm = useRef<Group>(null);
  const leftArm = useRef<Group>(null);
  const rightElbow = useRef<Group>(null);
  const leftElbow = useRef<Group>(null);
  const rightAnkle = useRef<Group>(null);
  const leftAnkle = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const leftLeg = useRef<Group>(null);
  const rightKnee = useRef<Group>(null);
  const leftKnee = useRef<Group>(null);
  const gait = useRef({ phase: 0, amount: 0, direction: 1, flight: 0, flightPhase: 0, flightMotion: 0 });
  const ready = useRef(false);
  const invalidate = useThree((state) => state.invalidate);
  const geometries = useMemo(() => {
    const face = new SphereGeometry(1, 48, 32);
    const positions = face.attributes.position;
    for (let index = 0; index < positions.count; index++) {
      const x = positions.getX(index), y = positions.getY(index), z = positions.getZ(index);
      positions.setXYZ(index, x * 0.555 * (1 - Math.max(0, -y) * 0.15), y * 0.625, z * 0.48);
    }
    face.computeVertexNormals();
    return {
      face,
      cap: headSurface("hair"),
      beard: headSurface("beard"),
      locks: Array.from({ length: 5 }, (_, index) => {
        const shift = index * 0.08;
        return sweptLock([
          [-0.49 + shift * 0.16, 0.16 + shift * 0.85, 0.22 - shift * 0.9],
          [-0.35 + shift * 0.4, 0.58 + shift * 0.4, 0.35 - shift * 0.9],
          [0.11 + shift * 0.3, 0.69 - shift * 0.12, 0.28 - shift],
          [0.47 - shift * 0.2, 0.46 - shift * 0.18, 0.10 - shift],
        ], 0.105, 0.078);
      }),
    };
  }, []);
  useEffect(() => () => {
    geometries.face.dispose();
    geometries.cap.dispose();
    geometries.beard.dispose();
    geometries.locks.forEach((geometry) => geometry.dispose());
  }, [geometries]);
  useEffect(() => { invalidate(); }, [mood, reducedMotion, active, invalidate]);

  useFrame(({ clock }, delta) => {
    if (!rideRig.current || !balloon.current || !groundShadow.current || !figure.current || !torso.current || !pelvis.current || !rightElbow.current || !leftElbow.current || !rightAnkle.current || !leftAnkle.current || !head.current || !eyes.current || !pupils.current || !brows.current || !mouth.current || !rightArm.current || !leftArm.current || !rightLeg.current || !leftLeg.current || !rightKnee.current || !leftKnee.current) return;
    const time = clock.elapsedTime;
    const still = reducedMotion || !active;
    const pose = expressions[mood];
    const step = Math.min(delta, 0.05);
    const ease = (current: number, target: number) => still ? target : MathUtils.damp(current, target, 9, step);
    const motion = travel?.current;
    // Screen-space travel drives the joints. Scrolling alone must never make the
    // character run in place when its route is waiting at a storytelling cue.
    const velocity = still || interacting || !motion || !Number.isFinite(motion.journeyVelocity) ? 0 : motion.journeyVelocity;
    const speed = Math.abs(velocity);
    const pointing = !still && !interacting && Boolean(motion?.pointing);
    const pointDirection = (motion?.pointDirection ?? -1) < 0 ? -1 : 1;
    const pointElevation = MathUtils.clamp(motion?.pointElevation ?? 0, -1, 1);
    gait.current.flight = ease(gait.current.flight, still ? 0 : MathUtils.clamp(motion?.flight ?? 0, 0, 1));
    const flying = gait.current.flight;
    const ride = MathUtils.smoothstep(flying, 0, .55);
    const seated = MathUtils.smoothstep(ride, 0, .65);
    const inflation = MathUtils.smoothstep(ride, .18, 1);
    gait.current.flightMotion = ease(gait.current.flightMotion, pointing ? 0 : MathUtils.clamp((speed - 6) / 75, 0, 1));
    const cruising = flying * gait.current.flightMotion;
    const hovering = flying - cruising;
    const airPose = (rest: number, moving: number) => MathUtils.lerp(rest, moving, gait.current.flightMotion);
    const targetAmount = speed < 6 || pointing ? 0 : Math.min(1, speed / 200);
    gait.current.amount = still ? 0 : MathUtils.damp(gait.current.amount, targetAmount, targetAmount > gait.current.amount ? 12 : 18, step);
    if (speed > 6) gait.current.direction = ease(gait.current.direction, Math.sign(velocity));
    const walk = gait.current.amount * (1 - seated) * (pointing ? 0 : 1);
    if (speed > 6 && !pointing) {
      gait.current.phase += step * (7 + 7 * gait.current.amount) * Math.min(1, speed / 35);
      gait.current.flightPhase += step * 3.2;
    }
    const stride = Math.sin(gait.current.phase);
    const locomotion = sampleAvatarStride(gait.current.phase, gait.current.amount);
    const direction = gait.current.direction;
    const breath = still ? 0 : Math.sin(time * 1.8) * .012;
    const flightFlutter = still ? 0 : Math.sin(gait.current.flightPhase) * .018 * cruising;
    const hoverFloat = still ? 0 : Math.sin(time * 1.7) * .020 * ride;
    balloon.current.visible = inflation > .002;
    balloon.current.scale.setScalar(Math.max(.001, inflation));
    groundShadow.current.visible = ride < .05;
    rideRig.current.position.y = hoverFloat;
    rideRig.current.rotation.y = ease(rideRig.current.rotation.y, (pointDirection * .17 * (1 - gait.current.flightMotion) + direction * .24 * gait.current.flightMotion) * ride);
    rideRig.current.rotation.z = ease(rideRig.current.rotation.z, (still ? 0 : Math.sin(time * 1.35) * .022 - direction * .035 * gait.current.flightMotion) * ride);
    figure.current.position.y = breath * (1 - walk) * (1 - seated) + locomotion.bodyY * walk + .036 * seated;
    figure.current.position.z = .30 * seated;
    figure.current.position.x = ease(figure.current.position.x, stride * .014 * walk);
    figure.current.rotation.y = ease(figure.current.rotation.y, -.11 * (1 - seated) + direction * 1.02 * walk);
    figure.current.rotation.x = ease(figure.current.rotation.x, 0);
    figure.current.rotation.z = ease(figure.current.rotation.z, stride * .026 * walk);
    pelvis.current.rotation.y = ease(pelvis.current.rotation.y, stride * .13 * walk);
    pelvis.current.rotation.z = ease(pelvis.current.rotation.z, -stride * .025 * walk);
    torso.current.rotation.y = ease(torso.current.rotation.y, -stride * .105 * walk);
    torso.current.rotation.x = ease(torso.current.rotation.x, (.07 + locomotion.running * .09) * walk + .06 * gait.current.flightMotion * seated);
    torso.current.rotation.z = ease(torso.current.rotation.z, stride * .016 * walk);
    rightLeg.current.position.x = -.155 - .155 * seated;
    leftLeg.current.position.x = .155 + .155 * seated;
    rightLeg.current.rotation.x = locomotion.right.hip * walk - 1.38 * seated;
    leftLeg.current.rotation.x = locomotion.left.hip * walk - 1.38 * seated;
    rightKnee.current.rotation.x = locomotion.right.knee * walk + (1.42 + flightFlutter) * seated;
    leftKnee.current.rotation.x = locomotion.left.knee * walk + (1.42 - flightFlutter) * seated;
    rightAnkle.current.rotation.x = locomotion.right.ankle * walk - .04 * seated;
    leftAnkle.current.rotation.x = locomotion.left.ankle * walk - .04 * seated;
    head.current.rotation.z = ease(head.current.rotation.z, pose.tilt * (1 - flying) - stride * .012 * walk);
    head.current.rotation.y = ease(head.current.rotation.y, pointing ? pointDirection * .28 : MathUtils.lerp(pose.turn - direction * .24 * walk, pointDirection * .28, hovering));
    head.current.rotation.x = ease(head.current.rotation.x, pointing ? -.04 - pointElevation * .24 : MathUtils.lerp((mood === "grateful" ? .08 : -.025) - .2 * cruising - .06 * walk, -.04 - pointElevation * .24, hovering));
    const blinkCycle = time % 5.2;
    const blink = !still && blinkCycle > 4.94 ? Math.max(0.09, Math.abs(blinkCycle - 5.07) / 0.13) : 1;
    eyes.current.scale.y = blink * (mood === "proud" || mood === "grateful" ? 0.85 : 1);
    pupils.current.position.x = ease(pupils.current.position.x, pointing ? pointDirection * .024 : MathUtils.lerp(mood === "thinking" ? .022 : mood === "curious" ? -.014 : 0, pointDirection * .024, hovering));
    pupils.current.position.y = ease(pupils.current.position.y, pointing ? pointElevation * .028 : MathUtils.lerp(mood === "thinking" ? .015 : 0, pointElevation * .028, hovering));
    brows.current.rotation.z = ease(brows.current.rotation.z, pose.brow);
    brows.current.position.y = ease(brows.current.position.y, mood === "curious" ? 0.055 : mood === "wave" ? 0.026 : 0);
    const speaking = !still && Boolean(motion?.speaking);
    const syllable = speaking ? Math.pow(Math.max(0, Math.sin(time * 11.5)), 1.4) * (.65 + .35 * Math.sin(time * 3.1) ** 2) : 0;
    mouth.current.scale.y = ease(mouth.current.scale.y, pose.smile + syllable * .52);
    mouth.current.scale.x = ease(mouth.current.scale.x, (mood === "proud" ? 1.12 : 1) - syllable * .075);
    mouth.current.position.y = ease(mouth.current.position.y, -.276 - syllable * .012);
    const wave = !still && mood === "wave" ? Math.sin(time * 7) * .16 : 0;
    const armSwing = .38 + .22 * locomotion.running;
    const armPhase = Math.cos(gait.current.phase);
    const elbowBend = .38 + .55 * locomotion.running;
    const pointingAngle = Math.PI / 2 + pointElevation * .85;
    const pointRight = pointing && pointDirection < 0;
    const pointLeft = pointing && pointDirection > 0;
    rightArm.current.rotation.z = ease(rightArm.current.rotation.z, pointRight ? -pointingAngle : MathUtils.lerp(MathUtils.lerp(pose.rightArm + wave, -.12, walk), airPose(-.24, -.12), mood === "wave" ? 0 : seated));
    rightArm.current.rotation.x = ease(rightArm.current.rotation.x, pointRight ? -.12 : MathUtils.lerp(MathUtils.lerp(pose.armX, armPhase * armSwing, walk), airPose(-.32, -.48), seated && mood !== "wave" ? seated : 0));
    leftArm.current.rotation.z = ease(leftArm.current.rotation.z, pointLeft ? pointingAngle : MathUtils.lerp(MathUtils.lerp(pose.leftArm, .12, walk), airPose(.24, .19), flying));
    leftArm.current.rotation.x = ease(leftArm.current.rotation.x, pointLeft ? -.12 : MathUtils.lerp(MathUtils.lerp(mood === "grateful" ? -.72 : 0, -armPhase * armSwing, walk), airPose(-.28, -.4), seated));
    rightElbow.current.rotation.x = ease(rightElbow.current.rotation.x, pointRight ? -.08 : MathUtils.lerp(-elbowBend * walk - Math.max(0, -armPhase) * .14 * walk, airPose(-.6, -.4), mood === "wave" ? 0 : seated));
    leftElbow.current.rotation.x = ease(leftElbow.current.rotation.x, pointLeft ? -.08 : MathUtils.lerp(-elbowBend * walk - Math.max(0, armPhase) * .14 * walk, airPose(-.55, -.3), flying));
    if (!ready.current) {
      ready.current = true;
      onReady?.();
    }
  });

  return (
    <group>
      <mesh ref={groundShadow} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.185, 0]} scale={[0.7, 0.4, 1]}>
        <circleGeometry args={[1, 40]} />
        <meshBasicMaterial color="#101927" transparent opacity={0.13} depthWrite={false} />
      </mesh>
      <group ref={rideRig}>
      <group ref={balloon} position={[0, -.775, .10]} visible={false}><BalloonRide /></group>
      <group ref={figure}>
      <group ref={pelvis}>
      {[-1, 1].map((side) => (
        <group key={side} ref={side < 0 ? rightLeg : leftLeg} position={[side * 0.155, -0.68, 0]}>
          <mesh position={[0, -0.05, 0]}><capsuleGeometry args={[0.103, 0.105, 6, 14]} /><meshStandardMaterial color="#1a273c" roughness={0.83} /></mesh>
          <group ref={side < 0 ? rightKnee : leftKnee} position={[0, -0.205, 0]}>
          <mesh position={[0, -0.078, 0]}><capsuleGeometry args={[0.096, 0.085, 6, 14]} /><meshStandardMaterial color="#1a273c" roughness={0.83} /></mesh>
          <group ref={side < 0 ? rightAnkle : leftAnkle} position={[0, -0.205, 0]}>
          <RoundedBox args={[0.25, 0.14, 0.37]} radius={0.065} smoothness={3} position={[0, -0.01, 0.07]}>
            <meshStandardMaterial color="#eee9df" roughness={0.56} />
          </RoundedBox>
          <RoundedBox args={[0.255, 0.041, 0.374]} radius={0.016} smoothness={2} position={[0, -0.066, 0.07]}>
            <meshStandardMaterial color="#b7c2ce" roughness={0.65} />
          </RoundedBox>
          </group>
          </group>
        </group>
      ))}
      </group>
      <group ref={torso}>
      <Pebble position={[0, -0.34, 0]} scale={[0.365, 0.415, 0.23]} color={JACKET} />
      <RoundedBox args={[0.145, 0.49, 0.027]} radius={0.025} smoothness={3} position={[0, -0.32, 0.221]}>
        <meshStandardMaterial color="#e5e2d6" roughness={0.88} />
      </RoundedBox>
      <Stroke points={[[-0.13, 0.01, 0.16], [-0.17, -0.12, 0.23], [-0.085, -0.27, 0.24], [-0.079, -0.60, 0.19]]} radius={0.018} color="#122c61" />
      <Stroke points={[[0.13, 0.01, 0.16], [0.17, -0.12, 0.23], [0.085, -0.27, 0.24], [0.079, -0.60, 0.19]]} radius={0.018} color="#122c61" />
      <RoundedBox args={[0.088, 0.064, 0.022]} radius={0.012} smoothness={2} position={[0.235, -0.20, 0.187]} rotation={[0, 0.3, 0]}>
        <meshStandardMaterial color="#d8f085" roughness={0.44} metalness={0.12} />
      </RoundedBox>
      <Stroke points={[[0.212, -0.198, 0.211], [0.224, -0.210, 0.211], [0.245, -0.185, 0.205]]} radius={0.006} color="#163d2c" />
      <Pebble position={[0, 0.08, 0]} scale={[0.15, 0.19, 0.14]} color={SKIN} />
      <group ref={rightArm} position={[-0.31, -0.085, 0]}><Arm elbow={rightElbow} /></group>
      <group ref={leftArm} position={[0.31, -0.085, 0]}><Arm elbow={leftElbow} /></group>
      <group ref={head} position={[0, 0.65, 0]}>
        <mesh geometry={geometries.face}><meshPhysicalMaterial color={SKIN} roughness={0.66} clearcoat={0.07} /></mesh>
        <mesh geometry={geometries.cap}><meshStandardMaterial color={HAIR} roughness={0.56} /></mesh>
        {geometries.locks.map((geometry, index) => <mesh key={index} geometry={geometry}><meshStandardMaterial color={index % 2 ? "#202a35" : "#1b232e"} roughness={0.52} /></mesh>)}
        <mesh geometry={geometries.beard}><meshStandardMaterial color="#252934" roughness={0.88} /></mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <Pebble position={[side * 0.542, -0.023, -0.014]} scale={[0.112, 0.169, 0.10]} color={SKIN} />
            <Pebble position={[side * 0.579, -0.02, 0.064]} scale={[0.054, 0.096, 0.023]} color="#b67455" />
            <Pebble position={[side * 0.343, -0.12, 0.369]} scale={[0.069, 0.033, 0.022]} color="#ca7d66" />
          </group>
        ))}
        <group position={[0, 0.055, 0]}>
          <group ref={eyes}>
            {[-1, 1].map((side) => <Pebble key={side} position={[side * 0.211, 0, 0.431]} scale={[0.114, 0.136, 0.063]} color="#fff7e6" glossy />)}
            <group ref={pupils}>
              {[-1, 1].map((side) => (
                <group key={side}>
                  <Pebble position={[side * 0.203, -0.006, 0.486]} scale={[0.068, 0.086, 0.035]} color="#292522" glossy />
                  <Pebble position={[side * 0.203 - 0.021, 0.022, 0.515]} scale={[0.020, 0.023, 0.010]} color="#ffffff" />
                </group>
              ))}
            </group>
          </group>
        </group>
        <group ref={brows}>
          <Stroke points={[[-0.32, 0.246, 0.392], [-0.23, 0.274, 0.433], [-0.12, 0.252, 0.461]]} radius={0.029} color={HAIR} />
          <Stroke points={[[0.12, 0.252, 0.461], [0.23, 0.274, 0.433], [0.32, 0.246, 0.392]]} radius={0.029} color={HAIR} />
        </group>
        <Pebble position={[0, -0.057, 0.473]} scale={[0.074, 0.124, 0.081]} color={SKIN} />
        <Pebble position={[0, -0.121, 0.513]} scale={[0.099, 0.068, 0.085]} color="#d79a74" />
        <Pebble position={[0, -0.263, 0.414]} scale={[0.203, 0.127, 0.071]} color={SKIN} />
        <Stroke points={[[-0.155, -0.225, 0.458], [-0.077, -0.191, 0.491], [0, -0.219, 0.500]]} radius={0.032} color="#252934" />
        <Stroke points={[[0, -0.219, 0.500], [0.077, -0.191, 0.491], [0.155, -0.225, 0.458]]} radius={0.032} color="#252934" />
        <group ref={mouth} position={[0, -0.276, 0.483]}>
          <Stroke points={[[-0.103, 0.006, -0.004], [0, -0.034, 0.012], [0.103, 0.006, -0.004]]} radius={0.021} color="#652f27" />
          <Stroke points={[[-0.076, 0, 0.014], [0, -0.019, 0.029], [0.076, 0, 0.014]]} radius={0.009} color="#fff2db" />
        </group>
        <Pebble position={[0, -0.398, 0.398]} scale={[0.053, 0.055, 0.024]} color="#252934" />
      </group>
      </group>
      </group>
      </group>
    </group>
  );
}

function fitAvatarCamera(camera: OrthographicCamera, width: number, height: number, ride: number) {
  camera.zoom = Math.min(width / 2.7, height / 4.6);
  const bottom = MathUtils.lerp(-1.30, -2.94, ride);
  const center = bottom + height / camera.zoom / 2;
  camera.position.set(.55, center + .24, 6);
  camera.lookAt(0, center, 0);
  camera.updateProjectionMatrix();
}

function CameraAndContext({ onUnavailable, travel, reducedMotion, active }: Pick<Props, "onUnavailable" | "travel" | "reducedMotion" | "active">) {
  const { camera, size, gl, invalidate } = useThree();
  const flight = useRef(0);
  useEffect(() => {
    fitAvatarCamera(camera as OrthographicCamera, size.width, size.height, MathUtils.smoothstep(flight.current, 0, .55));
    invalidate();
  }, [camera, size.width, size.height, invalidate]);
  useFrame((_, delta) => {
    const target = reducedMotion || !active ? 0 : MathUtils.clamp(travel?.current.flight ?? 0, 0, 1);
    flight.current = reducedMotion || !active ? target : MathUtils.damp(flight.current, target, 9, Math.min(delta, .05));
    fitAvatarCamera(camera as OrthographicCamera, size.width, size.height, MathUtils.smoothstep(flight.current, 0, .55));
  });
  useEffect(() => {
    const canvas = gl.domElement;
    const contextLost = (event: Event) => {
      event.preventDefault();
      onUnavailable?.();
    };
    canvas.addEventListener("webglcontextlost", contextLost);
    return () => canvas.removeEventListener("webglcontextlost", contextLost);
  }, [gl, onUnavailable]);
  return null;
}

class AvatarBoundary extends Component<{ children: ReactNode; onUnavailable?: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable?.(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** A small, asset-free 3D host. The containing button supplies accessible meaning. */
export default function BuilderAvatar({ mood, reducedMotion = false, active = true, travel, interacting = false, onReady, onUnavailable }: Props) {
  return (
    <AvatarBoundary onUnavailable={onUnavailable}>
      <Canvas
        orthographic
        camera={{ position: [0.55, 0.33, 6], zoom: 48, near: 0.1, far: 20 }}
        dpr={[1, 1.5]}
        frameloop={active && !reducedMotion ? "always" : "demand"}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        fallback={null}
        onCreated={({ gl }) => { gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production"; }}
      >
        <hemisphereLight args={["#e4eeff", "#bc9b7c", 2.0]} />
        <directionalLight position={[-3, 5, 6]} color="#fff0db" intensity={3.4} />
        <directionalLight position={[4, 2, -3]} color="#b7d7ff" intensity={3} />
        <directionalLight position={[2, 0, 4]} color="#d4e1ff" intensity={0.6} />
        <CameraAndContext onUnavailable={onUnavailable} travel={travel} reducedMotion={reducedMotion} active={active} />
        <Character mood={mood} reducedMotion={reducedMotion} active={active} travel={travel} interacting={interacting} onReady={onReady} />
      </Canvas>
    </AvatarBoundary>
  );
}
