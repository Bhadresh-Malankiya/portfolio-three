"use client";

import { Suspense, useEffect, useMemo, useRef, useDeferredValue } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import {
  CanvasTexture,
  Group,
  SRGBColorSpace,
  PerspectiveCamera,
  Shape,
  ShapeGeometry,
  ExtrudeGeometry,
} from "three";
import type { MotionValue } from "framer-motion";
import { devicePose } from "@/lib/device-choreography";
import { fitDeviceCamera } from "@/lib/device-framing";

type Props = {
  kind: "laptop" | "phone";
  image: string;
  images: string[];
  progress: MotionValue<number>;
  animated: boolean;
  visible: boolean;
  onReady: () => void;
  onUnavailable: () => void;
};
const metal = {
  color: "#c3c6cb",
  metalness: 0.85,
  roughness: 0.36,
  envMapIntensity: 1.15,
};

function Body({
  args,
  position,
  radius = 0.05,
  color,
  dark = false,
}: {
  args: [number, number, number];
  position?: [number, number, number];
  radius?: number;
  color?: string;
  dark?: boolean;
}) {
  return (
    <RoundedBox
      args={args}
      position={position}
      radius={radius}
      smoothness={5}
      bevelSegments={5}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        {...metal}
        color={color ?? (dark ? "#11151b" : metal.color)}
        metalness={dark ? 0.08 : 0.85}
        roughness={dark ? 0.68 : 0.36}
        clearcoat={dark ? 0.3 : 0.12}
      />
    </RoundedBox>
  );
}

function roundedShape(width: number, height: number, radius: number) {
  const x = -width / 2,
    y = -height / 2,
    r = radius;
  const s = new Shape();
  s.moveTo(x + r, y);
  s.lineTo(x + width - r, y);
  s.quadraticCurveTo(x + width, y, x + width, y + r);
  s.lineTo(x + width, y + height - r);
  s.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  s.lineTo(x + r, y + height);
  s.quadraticCurveTo(x, y + height, x, y + height - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function PhoneShell({
  width,
  height,
  depth,
  radius,
  z = 0,
  color,
  glass = false,
}: {
  width: number;
  height: number;
  depth: number;
  radius: number;
  z?: number;
  color: string;
  glass?: boolean;
}) {
  const geometry = useMemo(() => {
    const g = new ExtrudeGeometry(roundedShape(width, height, radius), {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 5,
      steps: 1,
      curveSegments: 32,
    });
    g.translate(0, 0, -depth / 2);
    return g;
  }, [width, height, depth, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} position={[0, 0, z]}>
      <meshPhysicalMaterial
        {...metal}
        color={color}
        metalness={glass ? 0.15 : 0.85}
        roughness={glass ? 0.12 : 0.36}
        clearcoat={glass ? 1 : 0.1}
      />
    </mesh>
  );
}

function Screen({
  src,
  width,
  height,
  position,
  rounded = false,
  onReady,
}: {
  src: string;
  width: number;
  height: number;
  position: [number, number, number];
  rounded?: boolean;
  onReady: () => void;
}) {
  const deferredSrc = useDeferredValue(src);
  const original = useTexture(
    `/_next/image?url=${encodeURIComponent(deferredSrc)}&w=${width < 2 ? 1080 : 1920}&q=75`,
  );
  const texture = useMemo(() => {
    const t = original.clone();
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  }, [original]);
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => {
    const frame = requestAnimationFrame(onReady);
    return () => cancelAnimationFrame(frame);
  }, [original, onReady]);
  const source = original.image as HTMLImageElement;
  const ratio = source.width / source.height;
  const frameRatio = width / height;
  const w = ratio > frameRatio ? width : height * ratio;
  const h = ratio > frameRatio ? width / ratio : height;
  const screenGeometry = useMemo(() => {
    const g = new ShapeGeometry(roundedShape(w, h, rounded ? 0.17 : 0.01), 16);
    const points = g.attributes.position;
    const uv = g.attributes.uv;
    for (let i = 0; i < points.count; i++)
      uv.setXY(i, points.getX(i) / w + 0.5, points.getY(i) / h + 0.5);
    return g;
  }, [w, h, rounded]);
  useEffect(() => () => screenGeometry.dispose(), [screenGeometry]);
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.002]} geometry={screenGeometry}>
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Keyboard() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1536;
    canvas.height = 640;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#101217";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const rows = [
      ["esc", "☀", "☀", "▦", "⌕", "◉", "☾", "◀", "▶", "▶", "◂", "▸", "◯", "●"],
      ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "−", "+", "delete"],
      ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
      ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "return"],
      ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
      ["fn", "ctrl", "option", "⌘", "", "⌘", "option", "←", "↑", "→"],
    ];
    rows.forEach((row, r) => {
      const units = row.map((_, i) => r === 5 && i === 4 ? 5 : r === 4 && (i === 0 || i === row.length - 1) ? 2 : 1);
      const unitWidth = 1504 / units.reduce((a, b) => a + b, 0);
      let x = 16;
      row.forEach((label, i) => {
        const width = units[i] * unitWidth - 10;
        const y = 12 + r * 104;
        ctx.fillStyle = "#08090c";
        ctx.beginPath(); ctx.roundRect(x, y + 4, width, 90, 10); ctx.fill();
        const gradient = ctx.createLinearGradient(0, y, 0, y + 88);
        gradient.addColorStop(0, "#30343a"); gradient.addColorStop(1, "#202328");
        ctx.fillStyle = gradient;
        ctx.beginPath(); ctx.roundRect(x + 1, y, width - 2, 86, 9); ctx.fill();
        ctx.strokeStyle = "#4c5058"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = "#ced1d6"; ctx.font = `${label.length > 2 ? 15 : 23}px sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(label, x + width / 2, y + 44);
        x += units[i] * unitWidth;
      });
    });
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    result.anisotropy = 8;
    return result;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <group position={[0, 0.079, -0.26]}>
    <Body args={[3.02, 0.014, 1.21]} radius={0.006} dark />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0]}>
      <planeGeometry args={[2.97, 1.17]} />
      <meshStandardMaterial map={texture} roughness={0.64} metalness={0.12} />
    </mesh>
  </group>;
}

function AppleMark({ position, scale }: { position: [number, number, number]; scale: number }) {
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0, 0.46);
    shape.bezierCurveTo(-0.8, 0.85, -1.05, -0.15, -0.52, -0.82);
    shape.bezierCurveTo(-0.22, -1.1, -0.2, -0.76, 0, -0.83);
    shape.bezierCurveTo(0.3, -1.05, 0.58, -0.72, 0.77, -0.31);
    shape.bezierCurveTo(0.3, -0.14, 0.33, 0.3, 0.69, 0.46);
    shape.bezierCurveTo(0.4, 0.78, 0.2, 0.54, 0, 0.46);
    const leaf = new Shape();
    leaf.moveTo(0.02, 0.64);
    leaf.bezierCurveTo(-0.02, 0.93, 0.23, 1.09, 0.46, 1.08);
    leaf.bezierCurveTo(0.45, 0.8, 0.22, 0.61, 0.02, 0.64);
    return new ShapeGeometry([shape, leaf], 24);
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} position={position} rotation={[0, Math.PI, 0]} scale={scale}>
    <meshStandardMaterial color="#3d4248" metalness={0.95} roughness={0.2} />
  </mesh>;
}

function Laptop({
  image,
  hinge,
  onReady,
}: {
  image: string;
  hinge: React.RefObject<Group | null>;
  onReady: () => void;
}) {
  return (
    <group position={[0, -0.63, 0]}>
      <Body args={[3.8, 0.13, 2.5]} position={[0, 0, 0.15]} radius={0.064} />
      <Body
        args={[3.68, 0.04, 2.4]}
        position={[0, -0.074, 0.15]}
        radius={0.018}
        color="#4b515b"
      />
      <Keyboard />
      <Body
        args={[1.29, 0.01, 0.64]}
        position={[0, 0.069, 0.82]}
        radius={0.005}
        color="#6f7781"
      />
      <Body
        args={[1.27, 0.009, 0.62]}
        position={[0, 0.075, 0.82]}
        radius={0.004}
        color="#b3b9c1"
      />
      <Body
        args={[0.42, 0.02, 0.055]}
        position={[0, 0.06, 1.389]}
        radius={0.008}
        dark
      />
      {[-1, 1].map((side) => (
        <group key={side}>
          {[-0.7, -0.35].map((z) => (
            <Body
              key={z}
              args={[0.015, 0.045, 0.15]}
              position={[side * 1.9, -0.005, z]}
              radius={0.006}
              dark
            />
          ))}
          {Array.from({ length: 26 }, (_, i) => (
            <mesh
              key={i}
              position={[side * 1.67, 0.068, -0.72 + i * 0.036]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[0.13, 0.009]} />
              <meshBasicMaterial color="#404752" />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 0.085, -1.06]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 3.25, 24]} />
        <meshStandardMaterial
          color="#343a43"
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>
      <group ref={hinge} position={[0, 0.11, -1.06]}>
        <Body
          args={[3.8, 2.42, 0.085]}
          position={[0, 1.21, 0]}
          radius={0.04}
        />
        <Body
          args={[3.71, 2.33, 0.018]}
          position={[0, 1.21, 0.051]}
          radius={0.008}
          color="#080b10"
          dark
        />
        <Suspense fallback={null}>
          <Screen
            src={image}
            onReady={onReady}
            width={3.58}
            height={2.2375}
            position={[0, 1.21, 0.063]}
          />
        </Suspense>
        <Body args={[0.38, 0.105, 0.014]} position={[0, 2.305, 0.078]} radius={0.008} dark />
        <mesh position={[0, 2.32, 0.09]}>
          <circleGeometry args={[0.013, 20]} />
          <meshPhysicalMaterial
            color="#163448"
            metalness={0.7}
            roughness={0.07}
            clearcoat={1}
          />
        </mesh>
        <AppleMark position={[0, 1.24, -0.047]} scale={0.28} />
      </group>
    </group>
  );
}

function Phone({ image, onReady }: { image: string; onReady: () => void }) {
  return (
    <group>
      <PhoneShell
        width={1.64}
        height={3.4}
        depth={0.17}
        radius={0.24}
        color="#8b939e"
      />
      <PhoneShell
        width={1.57}
        height={3.33}
        depth={0.018}
        z={0.098}
        radius={0.21}
        color="#080b10"
        glass
      />
      <Suspense fallback={null}>
        <Screen
          src={image}
          onReady={onReady}
          rounded
          width={1.47}
          height={3.16}
          position={[0, 0, 0.12]}
        />
      </Suspense>
      <group position={[0, 1.48, 0.14]}>
        <PhoneShell
          width={0.43}
          height={0.105}
          depth={0.015}
          radius={0.05}
          color="#030407"
          glass
        />
      </group>
      <mesh position={[0.135, 1.48, 0.155]}>
        <circleGeometry args={[0.025, 24]} />
        <meshPhysicalMaterial
          color="#13314a"
          metalness={0.9}
          roughness={0.05}
          clearcoat={1}
        />
      </mesh>
      <Body
        args={[0.42, 0.015, 0.008]}
        position={[0, -1.5, 0.134]}
        radius={0.003}
        color="#b4b7bc"
      />
      <Body
        args={[0.035, 0.36, 0.085]}
        position={[0.83, 0.6, 0]}
        radius={0.012}
      />
      {[-0.05, 0.38].map((y) => (
        <Body
          key={y}
          args={[0.035, 0.26, 0.085]}
          position={[-0.83, y, 0]}
          radius={0.012}
        />
      ))}
      <PhoneShell
        width={1.5}
        height={3.25}
        depth={0.022}
        radius={0.2}
        z={-0.11}
        color="#656e7a"
        glass
      />
      <AppleMark position={[0, -0.05, -0.13]} scale={0.2} />
      {[-1.15, 1.15].map((y) => [-1, 1].map((side) => (
        <Body key={`${side}-${y}`} args={[0.014, 0.026, 0.16]} position={[side * 0.824, y, 0]} radius={0.003} color="#54575b" dark />
      )))}
      <Body args={[0.22, 0.014, 0.06]} position={[0, -1.705, 0]} radius={0.004} dark />
      <Body args={[0.032, 0.12, 0.08]} position={[-0.83, 0.82, 0]} radius={0.01} />
      <mesh position={[-0.1, 1.43, -0.198]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.054, 24]} /><meshStandardMaterial color="#eee3c8" roughness={0.25} />
      </mesh>
      <group position={[-0.3, 1.09, -0.15]}>
        <PhoneShell width={0.8} height={0.85} depth={0.07} radius={0.13} color="#737c88" />
      </group>
      {[
        [-0.48, 1.31],
        [-0.48, 0.88],
        [-0.1, 1.1],
      ].map(([x, y]) => (
        <group key={y} position={[x, y, -0.21]} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.167, 0.167, 0.055, 40]} />
            <meshStandardMaterial
              color="#252e39"
              metalness={1}
              roughness={0.16}
            />
          </mesh>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.008, 64]} />
            <meshPhysicalMaterial
              color="#254359"
              metalness={0.35}
              roughness={0.04}
              clearcoat={1}
            />
          </mesh>
          <mesh position={[0, 0.036, 0]}>
            <cylinderGeometry args={[0.083, 0.083, 0.004, 48]} />
            <meshPhysicalMaterial color="#08131e" roughness={0.12} metalness={0.3} clearcoat={1} />
          </mesh>
          <mesh position={[-0.038, 0.04, -0.035]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.02, 24]} />
            <meshBasicMaterial color="#86b2d5" transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Scene({
  kind,
  image,
  progress,
  animated,
  visible,
  onReady,
  onUnavailable,
}: Props) {
  const group = useRef<Group>(null);
  const hinge = useRef<Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    fitDeviceCamera(camera, kind, size.width, size.height);
    invalidate();
  }, [camera, size.width, size.height, kind, invalidate]);
  useEffect(() => {
    if (!visible) return;
    invalidate();
    return progress.on("change", () => invalidate());
  }, [progress, invalidate, visible, animated]);
  useEffect(() => {
    const lost = (event: Event) => {
      event.preventDefault();
      onUnavailable();
    };
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", lost);
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onUnavailable]);
  useFrame(() => {
    if (!group.current) return;
    const pose = devicePose(progress.get(), kind === "phone", animated);
    group.current.position.y = pose.lift;
    group.current.rotation.y = pose.rotationY;
    group.current.rotation.z = pose.rotationZ;
    group.current.scale.setScalar(pose.scale);
    if (hinge.current) hinge.current.rotation.x = pose.hinge;
  });
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[-3, 6, 4]} intensity={2.2} color="#f4f5fa" />
      <directionalLight position={[4, 1, -3]} intensity={2} color="#a1bddb" />
      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[0, 6, 0]}
          scale={[8, 8, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          position={[-3, 4, 3]}
          scale={[5, 3, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          position={[4, 1, 1]}
          scale={[1, 6, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={4}
          position={[0, 3, -4]}
          scale={[5, 1, 1]}
          target={[0, 0, 0]}
        />
      </Environment>
      <group ref={group}>
        {kind === "laptop" ? (
          <Laptop image={image} hinge={hinge} onReady={onReady} />
        ) : (
          <Phone image={image} onReady={onReady} />
        )}
      </group>
    </>
  );
}

export default function DeviceScene(props: Props) {
  const phone = props.kind === "phone";
  useEffect(() => {
    props.images.forEach((src) =>
      useTexture.preload(
        `/_next/image?url=${encodeURIComponent(src)}&w=${phone ? 1080 : 1920}&q=75`,
      ),
    );
  }, [props.images, phone]);
  return (
    <Canvas
      frameloop={props.visible ? "demand" : "never"}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{
        position: phone ? [0, 0.2, 6.4] : [0, 2.45, 5.8],
        fov: phone ? 35 : 12,
      }}
      onCreated={({ camera }) => camera.lookAt(0, phone ? 0 : 0.35, 0)}
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  );
}
