"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  RoundedBox,
} from "@react-three/drei";
import {
  CanvasTexture,
  Group,
  SRGBColorSpace,
  PerspectiveCamera,
  Shape,
  ShapeGeometry,
  ExtrudeGeometry,
  TextureLoader,
  Texture,
  ShaderMaterial,
  PlaneGeometry,
  WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { useReducedMotion, type MotionValue } from "framer-motion";
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

function createScreenResources(gl: WebGLRenderer, width: number, height: number) {
  const cache = new Map<string, Promise<Texture<HTMLImageElement>>>();
  const loaded = new Set<Texture<HTMLImageElement>>();
  const loader = new TextureLoader();
  let disposed = false;
  const placeholder = new CanvasTexture(Object.assign(document.createElement("canvas"), { width: 1, height: 1 }));
  const shader = new ShaderMaterial({
    uniforms: {
      fromMap: { value: placeholder },
      toMap: { value: placeholder },
      fromAspect: { value: width / height },
      toAspect: { value: width / height },
      frameAspect: { value: width / height },
      blend: { value: 1 },
    },
    vertexShader: `varying vec2 screenUV;
      void main() {
        screenUV = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `uniform sampler2D fromMap;
      uniform sampler2D toMap;
      uniform float fromAspect;
      uniform float toAspect;
      uniform float frameAspect;
      uniform float blend;
      varying vec2 screenUV;
      vec4 fitScreen(sampler2D image, float aspect) {
        vec2 point = screenUV - 0.5;
        if (aspect > frameAspect) point.y *= aspect / frameAspect;
        else point.x *= frameAspect / aspect;
        point += 0.5;
        if (point.x < 0.0 || point.x > 1.0 || point.y < 0.0 || point.y > 1.0)
          return vec4(0.006, 0.008, 0.012, 1.0);
        return texture2D(image, point);
      }
      void main() {
        float eased = blend * blend * (3.0 - 2.0 * blend);
        gl_FragColor = mix(fitScreen(fromMap, fromAspect), fitScreen(toMap, toAspect), eased);
        #include <colorspace_fragment>
      }`,
    toneMapped: false,
  });
  function load(source: string) {
    const cached = cache.get(source);
    if (cached) return cached;
    const request = new Promise<Texture<HTMLImageElement>>((resolve, reject) => {
      const prepare = (texture: Texture<HTMLImageElement>) => {
        if (disposed) {
          texture.dispose();
          reject(new Error("Screen disposed"));
          return;
        }
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
        texture.needsUpdate = true;
        gl.initTexture(texture);
        loaded.add(texture);
        resolve(texture);
      };
      const optimized = `/_next/image?url=${encodeURIComponent(source)}&w=${width < 2 ? 1080 : 1920}&q=75`;
      loader.load(optimized, prepare, undefined, () => loader.load(source, prepare, undefined, reject));
    });
    cache.set(source, request);
    return request;
  }
  return { shader, load, activate: () => { disposed = false; }, dispose: () => {
    disposed = true;
    loaded.forEach((texture) => texture.dispose());
    placeholder.dispose();
    shader.dispose();
  } };
}

function Screen({
  src,
  images,
  width,
  height,
  position,
  rounded = false,
  onReady,
  onUnavailable,
}: {
  src: string;
  images: string[];
  width: number;
  height: number;
  position: [number, number, number];
  rounded?: boolean;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const transition = useRef({
    elapsed: 1, pending: null as Texture<HTMLImageElement> | null, ready: false, readyFrame: 0,
  });
  const resources = useMemo(() => createScreenResources(gl, width, height), [gl, width, height]);
  const material = useRef<ShaderMaterial>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    resources.activate();
    const state = transition.current;
    return () => {
      cancelAnimationFrame(state.readyFrame);
      resources.dispose();
    };
  }, [resources]);
  useEffect(() => {
    let current = true;
    resources.load(src).then((texture) => {
      if (!current) return;
      if (!transition.current.ready) {
        const aspect = texture.image.width / texture.image.height;
        resources.shader.uniforms.fromMap.value = texture;
        resources.shader.uniforms.toMap.value = texture;
        resources.shader.uniforms.fromAspect.value = aspect;
        resources.shader.uniforms.toAspect.value = aspect;
        transition.current.ready = true;
        transition.current.readyFrame = requestAnimationFrame(onReady);
      } else {
        transition.current.pending = texture;
      }
      invalidate();
    }).catch(() => {
      if (current && !transition.current.ready) onUnavailable();
    });
    return () => { current = false; };
  }, [src, resources, invalidate, onReady, onUnavailable]);
  useEffect(() => {
    // Pre-upload every screen so a project change never suspends the hardware.
    images.forEach((source) => { void resources.load(source).catch(() => undefined); });
  }, [images, resources]);
  useFrame((_, delta) => {
    const state = transition.current;
    const uniforms = material.current?.uniforms;
    if (!uniforms) return;
    if (state.pending && (state.elapsed >= 1 || reducedMotion)) {
      const next = state.pending;
      state.pending = null;
      if (next !== uniforms.toMap.value) {
        uniforms.fromMap.value = uniforms.toMap.value;
        uniforms.fromAspect.value = uniforms.toAspect.value;
        uniforms.toMap.value = next;
        uniforms.toAspect.value = next.image.width / next.image.height;
        state.elapsed = reducedMotion ? 1 : 0;
      }
    }
    if (state.elapsed < 1) {
      state.elapsed = Math.min(1, state.elapsed + Math.min(delta, 0.05) / 0.48);
      invalidate();
    }
    uniforms.blend.value = state.elapsed;
    if (state.pending) invalidate();
  });
  const screenGeometry = useMemo(() => {
    const geometry = new ShapeGeometry(roundedShape(width, height, rounded ? 0.19 : 0.06), 32);
    const points = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    for (let i = 0; i < points.count; i++)
      uv.setXY(i, points.getX(i) / width + 0.5, points.getY(i) / height + 0.5);
    return geometry;
  }, [width, height, rounded]);
  useEffect(() => () => screenGeometry.dispose(), [screenGeometry]);
  return <mesh position={position} geometry={screenGeometry}>
    <primitive object={resources.shader} attach="material" ref={material} />
  </mesh>;
}

function Keyboard() {
  const parts = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;
    const rows = [
      ["esc", "☀", "☀", "▦", "⌕", "◉", "☾", "◀", "▶", "▶", "◂", "▸", "◯", "◉"],
      ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "−", "+", "delete"],
      ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
      ["caps lock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "return"],
      ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
      ["fn", "control", "option", "⌘", "", "⌘", "option", "←", "↕", "→"],
    ];
    const bodies: RoundedBoxGeometry[] = [];
    const labels: PlaneGeometry[] = [];
    let z = -0.56;
    rows.forEach((row, rowIndex) => {
      const depth = rowIndex === 0 ? 0.125 : 0.17;
      const units = row.map((_, i) => {
        if (rowIndex === 5) return i === 4 ? 5 : i === 3 || i === 5 ? 1.3 : 1;
        if (rowIndex === 4 && (i === 0 || i === row.length - 1)) return 2.05;
        if (rowIndex === 3 && (i === 0 || i === row.length - 1)) return 1.65;
        if (rowIndex === 2 && i === 0) return 1.5;
        if (rowIndex === 1 && i === row.length - 1) return 1.5;
        return 1;
      });
      const unit = 2.97 / units.reduce((sum, value) => sum + value, 0);
      let x = -1.485;
      row.forEach((label, index) => {
        const span = units[index] * unit;
        const keyWidth = span - 0.027;
        const centerX = x + span / 2;
        const centerZ = z + depth / 2;
        const key = new RoundedBoxGeometry(keyWidth, 0.018, depth, 2, 0.008);
        key.translate(centerX, 0.013, centerZ);
        bodies.push(key);
        const labelPlane = new PlaneGeometry(keyWidth - 0.006, depth - 0.006);
        const uv = labelPlane.attributes.uv;
        for (let vertex = 0; vertex < uv.count; vertex++) {
          uv.setXY(vertex, (index + uv.getX(vertex)) / 14, 1 - (rowIndex + 1 - uv.getY(vertex)) / 6);
        }
        labelPlane.rotateX(-Math.PI / 2);
        labelPlane.translate(centerX, 0.0225, centerZ);
        labels.push(labelPlane);
        ctx.fillStyle = "#f0f0f1";
        ctx.font = `${label.length > 3 ? 22 : 37}px -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, (index + 0.5) * canvas.width / 14, (rowIndex + 0.53) * canvas.height / 6);
        x += span;
      });
      z += depth + 0.026;
    });
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    const keys = mergeGeometries(bodies);
    const lettering = mergeGeometries(labels);
    bodies.forEach((geometry) => geometry.dispose());
    labels.forEach((geometry) => geometry.dispose());
    return { texture, keys, lettering };
  }, []);
  useEffect(() => () => {
    parts.texture.dispose(); parts.keys.dispose(); parts.lettering.dispose();
  }, [parts]);
  return <group position={[0, 0.077, -0.28]}>
    <Body args={[3.07, 0.012, 1.22]} radius={0.006} dark />
    <mesh geometry={parts.keys}>
      <meshPhysicalMaterial color="#18191d" roughness={0.5} metalness={0.05} clearcoat={0.3} />
    </mesh>
    <mesh geometry={parts.lettering}>
      <meshBasicMaterial map={parts.texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  </group>;
}

function SpeakerGrilles() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128; canvas.height = 768;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#363b43";
    for (let x = 10; x < 125; x += 12) for (let y = 8; y < 762; y += 12) {
      context.beginPath(); context.arc(x, y, 2.4, 0, Math.PI * 2); context.fill();
    }
    return new CanvasTexture(canvas);
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <>{[-1, 1].map((side) => <mesh key={side} position={[side * 1.69, 0.075, -0.27]} rotation={[-Math.PI / 2, 0, 0]}>
    <planeGeometry args={[0.13, 1.19]} />
    <meshBasicMaterial map={texture} transparent depthWrite={false} />
  </mesh>)}</>;
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
  images,
  hinge,
  onReady,
  onUnavailable,
}: {
  image: string;
  images: string[];
  hinge: React.RefObject<Group | null>;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  return (
    <group position={[0, -0.63, 0]}>
      <group position={[0, 0, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <PhoneShell width={3.8} height={2.5} depth={0.13} radius={0.13} color="#c3c6cb" />
      </group>
      <Body
        args={[3.68, 0.04, 2.4]}
        position={[0, -0.074, 0.15]}
        radius={0.018}
        color="#4b515b"
      />
      <Keyboard />
      <SpeakerGrilles />
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
      {[-0.55, -0.2].map((z) => <group key={z}>
        <Body args={[0.017, 0.047, 0.153]} position={[-1.902, -0.005, z]} radius={0.007} color="#787d83" />
        <Body args={[0.019, 0.031, 0.121]} position={[-1.912, -0.005, z]} radius={0.006} dark />
      </group>)}
      <Body args={[0.019, 0.033, 0.23]} position={[-1.911, -0.005, -0.88]} radius={0.008} dark />
      <Body args={[0.019, 0.034, 0.27]} position={[1.911, -0.005, -0.72]} radius={0.006} dark />
      <Body args={[0.019, 0.017, 0.25]} position={[1.911, -0.005, -0.25]} radius={0.005} dark />
      <Body args={[0.019, 0.032, 0.12]} position={[1.911, -0.005, 0.16]} radius={0.006} dark />
      <mesh position={[0, 0.085, -1.06]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, 3.25, 24]} />
        <meshStandardMaterial
          color="#343a43"
          metalness={0.85}
          roughness={0.3}
        />
      </mesh>
      <group ref={hinge} position={[0, 0.18, -1.06]}>
        <group position={[0, 1.21, 0]}>
          <PhoneShell width={3.8} height={2.42} depth={0.085} radius={0.105} color="#c3c6cb" />
          <PhoneShell width={3.71} height={2.33} depth={0.012} radius={0.08} z={0.05} color="#07090c" glass />
        </group>
          <Screen
            src={image}
            images={images}
            onUnavailable={onUnavailable}
            onReady={onReady}
            width={3.58}
            height={2.2375}
            position={[0, 1.21, 0.071]}
          />
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
        <AppleMark position={[0, 1.24, -0.052]} scale={0.28} />
      </group>
    </group>
  );
}

function Phone({ image, images, onReady, onUnavailable }: Pick<Props, "image" | "images" | "onReady" | "onUnavailable">) {
  return (
    <group>
      <PhoneShell
        width={1.64}
        height={3.4}
        depth={0.17}
        radius={0.24}
        color="#a6a29b"
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
        <Screen
          src={image}
            images={images}
            onUnavailable={onUnavailable}
          onReady={onReady}
          rounded
          width={1.47}
          height={3.16}
          position={[0, 0, 0.12]}
        />
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
        color="#88857f"
      />
      <AppleMark position={[0, -0.05, -0.13]} scale={0.2} />
      {[-1.15, 1.15].map((y) => [-1, 1].map((side) => (
        <Body key={`${side}-${y}`} args={[0.014, 0.026, 0.16]} position={[side * 0.824, y, 0]} radius={0.003} color="#54575b" dark />
      )))}
      <Body args={[0.22, 0.014, 0.06]} position={[0, -1.705, 0]} radius={0.004} dark />
      <Body args={[0.16, 0.005, 0.012]} position={[0, -1.714, 0]} radius={0.002} color="#8c8272" />
      {[-1, 1].flatMap((side) => Array.from({ length: 6 }, (_, index) => (
        <mesh key={`${side}-${index}`} position={[side * (0.29 + index * 0.052), -1.709, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.014, 12]} />
          <meshBasicMaterial color="#202123" />
        </mesh>
      )))}
      <mesh position={[-0.1, 0.84, -0.212]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.043, 32]} /><meshPhysicalMaterial color="#15191d" roughness={0.25} clearcoat={0.6} />
      </mesh>
      <Body args={[0.032, 0.12, 0.08]} position={[-0.83, 0.82, 0]} radius={0.01} />
      <mesh position={[-0.1, 1.43, -0.212]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[0.054, 24]} /><meshStandardMaterial color="#eee3c8" roughness={0.25} />
      </mesh>
      <group position={[-0.3, 1.09, -0.15]}>
        <PhoneShell width={0.8} height={0.85} depth={0.07} radius={0.13} color="#99958e" />
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
  images,
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
      <directionalLight position={[4, 1, -3]} intensity={2} color="#d0d8e2" />
      <Environment resolution={256} frames={1}>
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
          <Laptop image={image} images={images} hinge={hinge} onReady={onReady} onUnavailable={onUnavailable} />
        ) : (
          <Phone image={image} images={images} onReady={onReady} onUnavailable={onUnavailable} />
        )}
      </group>
    </>
  );
}

export default function DeviceScene(props: Props) {
  const phone = props.kind === "phone";

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
