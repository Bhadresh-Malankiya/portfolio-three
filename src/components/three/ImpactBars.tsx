"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Bar = { height: number; label: string; hi?: boolean };

const BARS: Bar[] = [
  { height: 1.1, label: "users" },
  { height: 1.9, label: "respondents" },
  { height: 2.6, label: "uptime", hi: true },
  { height: 1.5, label: "exams" },
  { height: 2.1, label: "growth" },
];

function Bar3D({ x, target, hi, reduced }: { x: number; target: number; hi: boolean; reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const current = useRef(reduced ? target : 0.02);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    current.current += (target - current.current) * Math.min(1, delta * (reduced ? 999 : 2.2));
    mesh.current.scale.y = current.current;
    mesh.current.position.y = (current.current * 1.4) / 2 - 0.7;
  });

  return (
    <mesh ref={mesh} position={[x, -0.7, 0]}>
      <boxGeometry args={[0.46, 1.4, 0.46]} />
      <meshStandardMaterial
        color={hi ? "#f4c572" : "#3a3a3f"}
        emissive={hi ? "#e3a857" : "#000000"}
        emissiveIntensity={hi ? 0.35 : 0}
        roughness={0.4}
        metalness={hi ? 0.3 : 0.15}
      />
    </mesh>
  );
}

function Grid() {
  return (
    <gridHelper args={[8, 16, "#2a2a2e", "#1c1c1f"]} position={[0, -0.71, 0]} />
  );
}

function Rig({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    if (!reduced) group.current.rotation.y += delta * 0.06;
    const { pointer } = state;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -0.15 + pointer.y * 0.08, 0.05);
  });
  const spacing = 0.85;
  const start = -((BARS.length - 1) * spacing) / 2;
  return (
    <group ref={group} rotation={[-0.15, 0.55, 0]}>
      <Grid />
      {BARS.map((b, i) => (
        <Bar3D key={b.label} x={start + i * spacing} target={b.height} hi={!!b.hi} reduced={reduced} />
      ))}
    </group>
  );
}

export default function ImpactBarsScene({
  reduced = false,
  active = true,
}: {
  reduced?: boolean;
  active?: boolean;
  /** Unused here — Scene3D forwards the same prop shape to every scene. */
  progress?: unknown;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 38, position: [3.6, 2.2, 5.4] }}
      frameloop={active ? "always" : "never"}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 5, 4]} intensity={50} color="#ffffff" />
      <pointLight position={[-3, 1, -3]} intensity={20} color="#e3a857" />
      <Rig reduced={reduced} />
    </Canvas>
  );
}
