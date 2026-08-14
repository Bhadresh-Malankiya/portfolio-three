"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 13; // one per project

function useNetwork() {
  return useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODE_COUNT; i++) {
      const y = 1 - (i / (NODE_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = golden * i;
      nodes.push(new THREE.Vector3(Math.cos(theta) * radiusAtY * 2.4, y * 2.2, Math.sin(theta) * radiusAtY * 2.4));
    }

    // connect each node to its two nearest neighbours
    const segments: number[] = [];
    nodes.forEach((n, i) => {
      const distances = nodes
        .map((o, j) => ({ j, d: i === j ? Infinity : n.distanceTo(o) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      distances.forEach(({ j }) => {
        segments.push(n.x, n.y, n.z, nodes[j].x, nodes[j].y, nodes[j].z);
      });
    });

    return { nodes, lineArray: new Float32Array(segments) };
  }, []);
}

function Network({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { nodes, lineArray } = useNetwork();

  useFrame((state, delta) => {
    if (!group.current) return;
    if (!reduced) group.current.rotation.y += delta * 0.09;
    const { pointer } = state;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.15, 0.04);
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lineArray, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#4a4a50" transparent opacity={0.55} />
      </lineSegments>
      {nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <sphereGeometry args={[i === 0 || i === 4 || i === 9 ? 0.09 : 0.055, 16, 16]} />
          <meshStandardMaterial
            color={i === 0 || i === 4 || i === 9 ? "#f4c572" : "#d8d8dc"}
            emissive={i === 0 || i === 4 || i === 9 ? "#e3a857" : "#000000"}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ProjectNetworkScene({
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
      camera={{ fov: 40, position: [0, 0, 6.4] }}
      frameloop={active ? "always" : "never"}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 4]} intensity={40} color="#ffffff" />
      <pointLight position={[-3, -2, -3]} intensity={16} color="#e3a857" />
      <Network reduced={reduced} />
    </Canvas>
  );
}
