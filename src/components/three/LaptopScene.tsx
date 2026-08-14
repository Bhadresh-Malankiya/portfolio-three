"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

// Deterministic PRNG — keeps the generated screen texture a pure function of
// its inputs instead of reseeding (and re-triggering the purity lint rule)
// on every render.
function mulberry32(seed: number) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function useScreenTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#0b0f14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // title bar
    ctx.fillStyle = "#141418";
    ctx.fillRect(0, 0, canvas.width, 54);
    const dots = ["#e3a857", "#3a3a3f", "#3a3a3f"];
    dots.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(34 + i * 34, 27, 9, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "#5a5a60";
    ctx.font = "24px monospace";
    ctx.fillText("weekend-builder — main.tsx", 140, 35);

    // gutter + code lines
    const rand = mulberry32(11);
    const palette = ["#8f8f95", "#e3a857", "#8f8f95", "#f2f1ee", "#5a6270", "#8f8f95", "#c98f4a"];
    let y = 100;
    for (let i = 0; i < 14; i++) {
      ctx.fillStyle = "#3a3a3f";
      ctx.font = "20px monospace";
      ctx.fillText(String(i + 1).padStart(2, "0"), 24, y + 14);

      const indent = 70 + Math.floor(rand() * 3) * 36;
      const width = 80 + rand() * 460;
      ctx.fillStyle = palette[i % palette.length];
      ctx.globalAlpha = 0.88;
      ctx.fillRect(indent, y, width, 16);
      ctx.globalAlpha = 1;
      y += 34;
    }

    // blinking cursor line
    ctx.fillStyle = "#f4c572";
    ctx.fillRect(70, y, 3, 18);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);
}

const OPEN_ANGLE = -0.16;
const CLOSED_ANGLE = Math.PI / 2 + 0.02;

function Laptop({ reduced, progress }: { reduced: boolean; progress?: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const screenLight = useRef<THREE.PointLight>(null);
  const current = useRef(OPEN_ANGLE);
  const texture = useScreenTexture();

  useFrame((state, delta) => {
    const target = OPEN_ANGLE + (CLOSED_ANGLE - OPEN_ANGLE) * (progress?.get() ?? 0);
    current.current += (target - current.current) * Math.min(1, delta * 3.4);
    if (lid.current) lid.current.rotation.x = current.current;

    const openness = 1 - (current.current - OPEN_ANGLE) / (CLOSED_ANGLE - OPEN_ANGLE);
    if (screenLight.current) screenLight.current.intensity = Math.max(0, openness) * 5.5;

    if (group.current) {
      const idle = reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.35) * 0.05;
      group.current.rotation.y = -0.4 + idle;
    }
  });

  return (
    <group ref={group} rotation={[0.1, -0.4, 0]} position={[0, -0.49, 0]}>
      {/* base / keyboard deck */}
      <RoundedBox args={[3.2, 0.16, 2.2]} radius={0.07} smoothness={6} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#1b1b1e" metalness={0.75} roughness={0.28} />
      </RoundedBox>
      <mesh position={[0, -0.415, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.82, 1.55]} />
        <meshStandardMaterial color="#0d0d0f" metalness={0.4} roughness={0.75} />
      </mesh>
      <mesh position={[0, -0.414, 0.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.15, 0.68]} />
        <meshStandardMaterial color="#252528" metalness={0.25} roughness={0.5} />
      </mesh>

      {/* lid, hinged at the back edge of the base */}
      <group ref={lid} position={[0, -0.42, -1.02]} rotation={[OPEN_ANGLE, 0, 0]}>
        <RoundedBox args={[3.2, 2.0, 0.1]} radius={0.07} smoothness={6} position={[0, 1.0, 0]}>
          <meshStandardMaterial color="#1b1b1e" metalness={0.75} roughness={0.28} />
        </RoundedBox>
        {texture && (
          <mesh position={[0, 1.0, 0.056]}>
            <planeGeometry args={[2.86, 1.79]} />
            <meshBasicMaterial map={texture} toneMapped={false} />
          </mesh>
        )}
        <mesh position={[0, 1.72, -0.052]}>
          <circleGeometry args={[0.045, 24]} />
          <meshStandardMaterial color="#e3a857" emissive="#e3a857" emissiveIntensity={1.3} />
        </mesh>
        <pointLight ref={screenLight} position={[0, 1.0, 0.35]} color="#e6ecff" distance={2.6} intensity={0} />
      </group>
    </group>
  );
}

export default function LaptopScene({
  reduced = false,
  active = true,
  progress,
}: {
  reduced?: boolean;
  active?: boolean;
  progress?: MotionValue<number>;
}) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 35, position: [2.9, 1.10, 6.0] }}
      frameloop={active ? "always" : "never"}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 4, 2]} intensity={2.4} color="#ffffff" />
      <pointLight position={[-3.5, 1, -2]} intensity={14} color="#e3a857" />
      <pointLight position={[2, -1, 3]} intensity={6} color="#f2f1ee" />
      <Laptop reduced={reduced} progress={progress} />
      <ContactShadows position={[0, -1.09, 0]} opacity={0.55} scale={7} blur={2.6} far={2.2} color="#000000" />
    </Canvas>
  );
}
