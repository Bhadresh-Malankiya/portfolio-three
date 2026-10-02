"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, useTexture } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { Group, MathUtils, SRGBColorSpace } from "three";
import type { MotionValue } from "framer-motion";

type Props = {
  active: boolean;
  expanded: boolean;
  project: "vocalxi" | "jewelxi";
  progress: MotionValue<number>;
};

function Plate({ children }: { children: React.ReactNode }) {
  return (
    <group>
      <RoundedBox args={[4.1, 0.16, 2.7]} radius={0.08} smoothness={3}>
        <meshStandardMaterial
          color="#202024"
          metalness={0.65}
          roughness={0.3}
        />
      </RoundedBox>
      <mesh position={[0, 0, 1.355]}>
        <boxGeometry args={[3.7, 0.025, 0.012]} />
        <meshStandardMaterial
          color="#e3a857"
          emissive="#e3a857"
          emissiveIntensity={0.7}
        />
      </mesh>
      {children}
    </group>
  );
}
function Circuit({ storage = false }: { storage?: boolean }) {
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <group key={i}>
          <mesh position={[-1.45 + i * 0.48, 0.085, 0]}>
            <boxGeometry args={[0.018, 0.007, 2.1]} />
            <meshStandardMaterial
              color="#a37943"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 0.085, -0.9 + i * 0.3]}>
            <boxGeometry args={[3.6, 0.007, 0.012]} />
            <meshStandardMaterial
              color="#715636"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
      {(storage ? [-1.2, -0.4, 0.4, 1.2] : [0]).map((x, i) => (
        <group key={x} position={[x, 0.22, 0]}>
          <RoundedBox
            args={[storage ? 0.56 : 1.2, 0.24, storage ? 1.35 : 0.95]}
            radius={0.04}
            smoothness={2}
          >
            <meshStandardMaterial
              color={storage ? "#3c3934" : "#d8ad72"}
              metalness={0.75}
              roughness={0.27}
            />
          </RoundedBox>
          <mesh position={[0, 0.125, 0]}>
            <boxGeometry args={[storage ? 0.32 : 0.8, 0.015, 0.045]} />
            <meshStandardMaterial
              color="#f4c572"
              emissive="#e3a857"
              emissiveIntensity={0.7}
            />
          </mesh>
          <mesh position={[storage ? 0.18 : 0.43, 0.14, storage ? 0.48 : 0.3]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={i % 2 ? "#f2f1ee" : "#e3a857"} />
          </mesh>
        </group>
      ))}
    </>
  );
}
function Assembly({ active, expanded, project, progress }: Props) {
  const root = useRef<Group>(null);
  const top = useRef<Group>(null);
  const bottom = useRef<Group>(null);
  const textures = useTexture([
    "/images/vocalxi-home.jpg",
    "/images/jewelxi-home.jpg",
  ]);
  textures.forEach((texture) => {
    texture.colorSpace = SRGBColorSpace;
  });
  const spacing = expanded ? 1.15 : 0.3;
  const [initialSpacing] = useState(spacing);
  const screenTilt = expanded ? 0.32 : 0;
  useFrame(({ pointer, clock }, delta) => {
    if (!active || !root.current || !top.current || !bottom.current) return;
    const dt = Math.min(delta, 0.05);
    root.current.rotation.y = MathUtils.damp(
      root.current.rotation.y,
      -0.3 + pointer.x * 0.22 + progress.get() * 0.65,
      3,
      dt,
    );
    root.current.rotation.z = MathUtils.damp(
      root.current.rotation.z,
      pointer.y * 0.025,
      3,
      dt,
    );
    root.current.position.y = Math.sin(clock.elapsedTime * 0.65) * 0.045;
    top.current.rotation.x = MathUtils.damp(
      top.current.rotation.x,
      screenTilt,
      5,
      dt,
    );
    top.current.position.y = MathUtils.damp(
      top.current.position.y,
      spacing,
      5,
      dt,
    );
    bottom.current.position.y = MathUtils.damp(
      bottom.current.position.y,
      -spacing,
      5,
      dt,
    );
  });
  return (
    <group ref={root} rotation={[0, -0.3, 0]}>
      <group
        ref={top}
        position={[0, active ? initialSpacing : spacing, 0]}
        rotation={[screenTilt, 0, 0]}
      >
        <Plate>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.087, 0]}>
            <planeGeometry args={[3.83, 2.16]} />
            <meshBasicMaterial
              map={textures[project === "vocalxi" ? 0 : 1]}
              toneMapped={false}
            />
          </mesh>
        </Plate>
      </group>
      <Plate>
        <Circuit />
      </Plate>
      <group
        ref={bottom}
        position={[0, active ? -initialSpacing : -spacing, 0]}
      >
        <Plate>
          <Circuit storage />
        </Plate>
      </group>
      {[-1.75, 1.75].map((x) => (
        <mesh key={x} position={[x, 0, -1.05]}>
          <cylinderGeometry args={[0.012, 0.012, spacing * 2, 8]} />
          <meshStandardMaterial color="#e3a857" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}
export default function ProductCore(props: Props) {
  return (
    <Canvas
      camera={{ position: [4.4, 5.2, 6.4], fov: 38 }}
      dpr={[1, 1.5]}
      frameloop={props.active ? "always" : "demand"}
      gl={{ alpha: true, antialias: true }}
      fallback={
        <div className="stack-fallback">
          <span>interface</span>
          <span>services</span>
          <span>data</span>
        </div>
      }
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[1, 5, 3]} intensity={4} color="#fff1da" />
      <directionalLight position={[-3, 2, -3]} intensity={3} color="#e3a857" />
      <Suspense fallback={null}>
        <Assembly {...props} />
      </Suspense>
    </Canvas>
  );
}
