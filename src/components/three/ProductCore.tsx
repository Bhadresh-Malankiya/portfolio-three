"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  MathUtils,
} from "three";
import type { MotionValue } from "framer-motion";

type Props = { active: boolean; progress: MotionValue<number> };

// An original three-half-twist ribbon. Shared vertices keep the surface smooth;
// the open boundary catches the lights as the object turns.
function makeRibbon() {
  const length = 240;
  const across = 18;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= length; i++) {
    const t = (i / length) * Math.PI * 2;
    for (let j = 0; j <= across; j++) {
      const width = (j / across - 0.5) * 1.08;
      const radius = 1.62 + 0.18 * Math.cos(3 * t) + width * Math.cos(t * 1.5);
      positions.push(
        radius * Math.cos(t),
        0.26 * Math.sin(3 * t) + width * Math.sin(t * 1.5),
        radius * Math.sin(t),
      );
      if (i < length && j < across) {
        const a = i * (across + 1) + j;
        const b = a + across + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
function Ribbon({ active, progress }: Props) {
  const group = useRef<Group>(null);
  const geometry = useMemo(() => makeRibbon(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(({ pointer, clock }, delta) => {
    if (!active || !group.current) return;
    const dt = Math.min(delta, 0.04);
    group.current.rotation.x = MathUtils.damp(
      group.current.rotation.x,
      0.58 + pointer.y * 0.15 + progress.get() * 0.85,
      3,
      dt,
    );
    group.current.rotation.y = MathUtils.damp(
      group.current.rotation.y,
      -0.45 +
        pointer.x * 0.25 +
        progress.get() * 1.3 +
        Math.sin(clock.elapsedTime * 0.18) * 0.25,
      3,
      dt,
    );
    group.current.rotation.z = MathUtils.damp(
      group.current.rotation.z,
      -0.24 + progress.get() * 0.3,
      3,
      dt,
    );
    group.current.position.y = Math.sin(clock.elapsedTime * 0.6) * 0.045;
  });
  return (
    <group ref={group} rotation={[0.58, -0.45, -0.24]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#dba761"
          metalness={0.82}
          roughness={0.26}
          side={DoubleSide}
        />
      </mesh>
      <mesh scale={0.998} geometry={geometry}>
        <meshBasicMaterial
          color="#f4c572"
          wireframe
          transparent
          opacity={0.035}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}
export default function ProductCore(props: Props) {
  return (
    <Canvas
      camera={{ position: [0, 2.2, 6.4], fov: 39 }}
      dpr={[1, 1.5]}
      frameloop={props.active ? "always" : "demand"}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 5, 4]} intensity={5} color="#fff1d8" />
      <directionalLight position={[-3, 2, -2]} intensity={4} color="#e3a857" />
      <directionalLight position={[0, -3, 4]} intensity={1.5} color="#fffaf1" />
      <Ribbon {...props} />
    </Canvas>
  );
}
