"use client";

import { memo, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  LinearFilter,
  LinearMipmapLinearFilter,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { useReducedMotion, type MotionValue } from "framer-motion";
import { devicePose } from "@/lib/device-choreography";
import { fitDeviceCamera, DEVICE_DIMENSIONS } from "@/lib/device-framing";

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
  bevel = 0.004,
  matte = false,
}: {
  width: number;
  height: number;
  depth: number;
  radius: number;
  z?: number;
  color: string;
  glass?: boolean;
  bevel?: number;
  matte?: boolean;
}) {
  const geometry = useMemo(() => {
    const g = new ExtrudeGeometry(roundedShape(width - bevel * 2, height - bevel * 2, radius - bevel), {
      depth: Math.max(0.001, depth - bevel * 2),
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 5,
      steps: 1,
      curveSegments: 32,
    });
    g.translate(0, 0, -Math.max(0.001, depth - bevel * 2) / 2);
    return g;
  }, [width, height, depth, radius, bevel]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} position={[0, 0, z]}>
      <meshPhysicalMaterial
        {...metal}
        color={color}
        metalness={glass || matte ? 0.12 : 0.85}
        roughness={matte ? 0.52 : glass ? 0.11 : 0.3}
        clearcoat={glass ? 1 : matte ? 0.28 : 0.1}
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
    // A small depth bias keeps the display above its close-fitting cover glass.
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
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
        texture.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy());
        texture.minFilter = LinearMipmapLinearFilter;
        texture.magFilter = LinearFilter;
        texture.generateMipmaps = true;
        texture.needsUpdate = true;
        gl.initTexture(texture);
        loaded.add(texture);
        resolve(texture);
      };
      // Preserve the native screenshot pixels; WebGL caps oversized sources to the GPU limit.
      loader.load(source, prepare, undefined, reject);
    });
    cache.set(source, request);
    // A failed background request must remain retryable when selected later.
    void request.catch(() => {
      if (cache.get(source) === request) cache.delete(source);
    });
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
      // Never leave the previous product on the display beneath a new caption.
      if (current) onUnavailable();
    });
    return () => { current = false; };
  }, [src, resources, invalidate, onReady, onUnavailable]);
  useEffect(() => {
    // Native screenshots can be large. Two workers warm the library without
    // a burst of image decoding and GPU uploads competing with the hero.
    let mounted = true;
    let index = 0;
    async function warmScreens() {
      while (mounted && index < images.length) {
        const source = images[index++];
        await resources.load(source).catch(() => undefined);
      }
    }
    void warmScreens();
    void warmScreens();
    return () => { mounted = false; };
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
    const geometry = new ShapeGeometry(roundedShape(width, height, rounded ? DEVICE_DIMENSIONS.phone.screenRadius : 0.047), 32);
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
    let z = -0.585;
    rows.forEach((row, rowIndex) => {
      const depth = 0.17;
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
        const key = new RoundedBoxGeometry(keyWidth, 0.014, depth, 2, 0.006);
        key.translate(centerX, 0.011, centerZ);
        bodies.push(key);
        const labelPlane = new PlaneGeometry(keyWidth - 0.006, depth - 0.006);
        const uv = labelPlane.attributes.uv;
        for (let vertex = 0; vertex < uv.count; vertex++) {
          uv.setXY(vertex, (index + uv.getX(vertex)) / 14, 1 - (rowIndex + 1 - uv.getY(vertex)) / 6);
        }
        labelPlane.rotateX(-Math.PI / 2);
        labelPlane.translate(centerX, 0.0185, centerZ);
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
  image, images, hinge, onReady, onUnavailable,
}: {
  image: string;
  images: string[];
  hinge: React.RefObject<Group | null>;
  onReady: () => void;
  onUnavailable: () => void;
}) {
  const laptop = DEVICE_DIMENSIONS.laptop;
  return <group position={[0, -0.63, 0]}>
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <PhoneShell width={laptop.width} height={laptop.depth} depth={0.106} radius={0.132} bevel={0.014} color="#bdc1c5" />
      <PhoneShell width={3.755} height={laptop.depth - 0.045} depth={0.008} radius={0.119} bevel={0.002} z={-0.052} color="#a7abb0" />
    </group>
    {[-1, 1].flatMap((x) => [-1, 1].map((z) => <mesh key={`${x}-${z}`} position={[x * 1.55, -0.06, z * 1.045]}>
      <cylinderGeometry args={[0.108, 0.104, 0.014, 40]} /><meshStandardMaterial color="#27282b" roughness={0.8} />
    </mesh>))}
    <group position={[0, -0.022, -0.085]}><Keyboard /><SpeakerGrilles /></group>
    <group position={[0, 0.054, 0.755]} rotation={[-Math.PI / 2, 0, 0]}>
      <PhoneShell width={1.515} height={0.917} depth={0.002} radius={0.064} bevel={0.0005} color="#82878c" />
      <PhoneShell width={1.5} height={0.902} depth={0.002} radius={0.057} bevel={0.0005} z={0.0015} color="#b8bdc2" />
    </group>
    <Body args={[0.59, 0.012, 0.041]} position={[0, 0.052, laptop.depth / 2 - 0.012]} radius={0.005} color="#91969b" />
    <Body args={[0.46, 0.008, 0.027]} position={[0, 0.051, laptop.depth / 2 + 0.002]} radius={0.003} color="#b4b8bd" />
    {/* Left: MagSafe, two Thunderbolt sockets, headphone jack. */}
    <Body args={[0.005, 0.035, 0.205]} position={[-1.901, -0.006, -1.008]} radius={0.002} color="#73777b" />
    <Body args={[0.006, 0.023, 0.172]} position={[-1.904, -0.006, -1.008]} radius={0.002} dark />
    {[-0.066, -0.033, 0, 0.033, 0.066].map((offset) => <Body key={offset} args={[0.006, 0.009, 0.014]} position={[-1.908, -0.006, -1.008 + offset]} radius={0.001} color="#c5bba7" />)}
    {[-0.771, -0.585].map((z) => <group key={z}>
      <Body args={[0.005, 0.041, 0.106]} position={[-1.901, -0.006, z]} radius={0.002} color="#73787e" />
      <Body args={[0.006, 0.027, 0.09]} position={[-1.904, -0.006, z]} radius={0.002} dark />
      <Body args={[0.006, 0.005, 0.061]} position={[-1.908, -0.006, z]} radius={0.002} color="#777b80" />
    </group>)}
    <mesh position={[-1.904, -0.006, -0.424]} rotation={[0, -Math.PI / 2, 0]}><circleGeometry args={[0.022, 32]} /><meshStandardMaterial color="#111214" roughness={0.5} /></mesh>
    {/* Right: HDMI, one Thunderbolt socket, SDXC, from rear to front. */}
    <Body args={[0.006, 0.044, 0.178]} position={[1.902, -0.006, -1.008]} radius={0.002} color="#757a7f" />
    <Body args={[0.007, 0.029, 0.15]} position={[1.905, -0.006, -1.008]} radius={0.003} dark />
    <Body args={[0.006, 0.012, 0.112]} position={[1.909, -0.008, -1.008]} radius={0.002} color="#767b80" />
    <Body args={[0.006, 0.038, 0.106]} position={[1.902, -0.006, -0.779]} radius={0.002} color="#73787e" />
    <Body args={[0.007, 0.027, 0.09]} position={[1.905, -0.006, -0.779]} radius={0.002} dark />
    <Body args={[0.007, 0.005, 0.061]} position={[1.909, -0.006, -0.779]} radius={0.002} color="#777b80" />
    <Body args={[0.006, 0.018, 0.312]} position={[1.904, -0.006, -0.476]} radius={0.002} dark />
    {[-1, 1].map((side) => <Body key={side} args={[0.006, 0.009, 1.27]} position={[side * 1.862, -0.052, 0.427]} radius={0.002} dark />)}
    <mesh position={[0, 0.043, laptop.hingeZ]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.049, 0.049, 3.23, 40]} /><meshStandardMaterial color="#252a30" metalness={0.75} roughness={0.35} />
    </mesh>
    <group ref={hinge} position={[0, laptop.hingeY, laptop.hingeZ]}>
      <group position={[0, laptop.lidHeight / 2, 0]}>
        <PhoneShell width={laptop.width} height={laptop.lidHeight} depth={0.041} radius={0.123} bevel={0.006} color="#bfc3c7" />
        <PhoneShell width={3.764} height={laptop.lidHeight - 0.036} depth={0.004} radius={0.102} bevel={0.001} z={0.023} color="#06080a" glass />
      </group>
      <Screen src={image} images={images} onUnavailable={onUnavailable} onReady={onReady}
        width={laptop.screenWidth} height={laptop.screenHeight} position={[0, laptop.screenY, 0.0255]} />
      <group position={[0, laptop.lidHeight - 0.083, 0.026]}>
        <PhoneShell width={0.45} height={0.106} depth={0.006} radius={0.02} bevel={0.001} color="#040507" />
        <mesh position={[0, 0.002, 0.005]}><circleGeometry args={[0.011, 32]} /><meshPhysicalMaterial color="#1b2a39" metalness={0.5} roughness={0.12} clearcoat={1} /></mesh>
      </group>
      <AppleMark position={[0, laptop.lidHeight / 2, -0.0215]} scale={0.25} />
    </group>
  </group>;
}

function Phone({ image, images, onReady, onUnavailable }: Pick<Props, "image" | "images" | "onReady" | "onUnavailable">) {
  const phone = DEVICE_DIMENSIONS.phone;
  const unit = phone.height / 149.61;
  const halfWidth = phone.width / 2;
  const back = -phone.thickness / 2;
  const lens = (mmX: number, mmY: number) => [halfWidth - mmX * unit, phone.height / 2 - mmY * unit] as const;
  return <group>
    <PhoneShell width={phone.width} height={phone.height} depth={phone.thickness - 0.011} radius={phone.radius} bevel={0.011} color="#9c9991" />
    <PhoneShell width={69.45 * unit} height={147.61 * unit} depth={0.01} z={phone.thickness / 2 - 0.005} radius={phone.radius - 0.023} bevel={0.002} color="#08090b" glass />
    <PhoneShell width={69.45 * unit} height={147.61 * unit} depth={0.01} z={back + 0.005} radius={phone.radius - 0.023} bevel={0.002} color="#aaa79e" matte />
    <Screen src={image} images={images} onUnavailable={onUnavailable} onReady={onReady} rounded
      width={phone.screenWidth} height={phone.screenHeight} position={[0, 0, phone.thickness / 2 + 0.001]} />
    <group position={[0, phone.height / 2 - 7.9 * unit, phone.thickness / 2 + 0.003]}>
      <PhoneShell width={20.73 * unit} height={6.07 * unit} depth={0.004} radius={3.035 * unit} bevel={0.001} color="#030405" glass />
      <mesh position={[0.165, 0, 0.003]}><circleGeometry args={[0.019, 32]} /><meshPhysicalMaterial color="#152333" metalness={0.55} roughness={0.06} clearcoat={1} /></mesh>
    </group>
    <Body args={[0.13, 0.007, 0.008]} position={[0, phone.height / 2 - 0.024, phone.thickness / 2 - 0.002]} radius={0.002} dark />
    <Body args={[0.48, 0.014, 0.002]} position={[0, -phone.height / 2 + 0.11, phone.thickness / 2 + 0.003]} radius={0.0008} color="#b4b7bc" />
    <Body args={[0.012, 17.1 * unit, 0.055]} position={[halfWidth + 0.002, phone.height / 2 - 48.23 * unit, 0]} radius={0.004} color="#a6a39b" />
    {/* Camera Control is the recessed sapphire strip on the lower right side. */}
    <Body args={[0.005, 17.5 * unit, 0.071]} position={[halfWidth + 0.001, phone.height / 2 - 98.19 * unit, 0]} radius={0.002} color="#5c5e5c" />
    <Body args={[0.006, 15.3 * unit, 0.054]} position={[halfWidth + 0.004, phone.height / 2 - 98.19 * unit, 0]} radius={0.002} color="#777972" />
    <Body args={[0.012, 6.5 * unit, 0.052]} position={[-halfWidth - 0.002, phone.height / 2 - 34.08 * unit, 0]} radius={0.004} color="#a6a39b" />
    {[48.23, 62.43].map((offset) => <Body key={offset} args={[0.012, 8.17 * unit, 0.052]} position={[-halfWidth - 0.002, phone.height / 2 - offset * unit, 0]} radius={0.004} color="#a6a39b" />)}
    <AppleMark position={[0, -0.05, back - 0.001]} scale={0.19} />
    {[-1.25, 1.25].map((y) => [-1, 1].map((side) => <Body key={`${side}-${y}`} args={[0.004, 0.024, phone.thickness - 0.025]} position={[side * (halfWidth - 0.001), y, 0]} radius={0.001} color="#6a6a63" />))}
    <group position={[0, -phone.height / 2, 0]}>
      <Body args={[8.85 * unit, 0.003, 2.66 * unit]} position={[0, -0.001, 0]} radius={0.001} color="#62645f" />
      <Body args={[8.2 * unit, 0.004, 2.2 * unit]} position={[0, -0.003, 0]} radius={0.001} dark />
      <Body args={[6.5 * unit, 0.004, 0.012]} position={[0, -0.006, 0]} radius={0.001} color="#918d81" />
      {[-1, 1].flatMap((side) => Array.from({ length: side < 0 ? 3 : 5 }, (_, i) => <mesh key={`${side}-${i}`} position={[side * (0.285 + i * 0.055), -0.002, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.35 * unit / 2, 20]} /><meshBasicMaterial color="#242521" />
      </mesh>))}
      {[-1, 1].map((side) => <mesh key={side} position={[side * 0.155, -0.002, 0]} rotation={[Math.PI / 2, 0, 0]}><circleGeometry args={[0.016, 24]} /><meshStandardMaterial color="#5c5e58" metalness={0.85} roughness={0.25} /></mesh>)}
    </group>
    <group position={[halfWidth - 23.1 * unit, phone.height / 2 - 23.1 * unit, back - 2.05 * unit / 2]}>
      <PhoneShell width={38.2 * unit} height={40.5 * unit} depth={2.05 * unit} radius={0.19} bevel={0.008} color="#a5a198" matte />
    </group>
    {[[14.17, 14.17], [14.17, 33.41], [32.16, 23.79]].map(([mmX, mmY]) => {
      const [x, y] = lens(mmX, mmY);
      return <group key={mmY} position={[x, y, back - 3.04 * unit]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh><cylinderGeometry args={[8.1 * unit, 8.1 * unit, 2.48 * unit, 64]} /><meshStandardMaterial color="#777870" metalness={0.95} roughness={0.24} /></mesh>
        <mesh position={[0, 1.12 * unit, 0]}><cylinderGeometry args={[7.33 * unit, 7.33 * unit, 0.15 * unit, 64]} /><meshStandardMaterial color="#111615" metalness={0.45} roughness={0.2} /></mesh>
        <mesh position={[0, 1.18 * unit, 0]}><cylinderGeometry args={[6.52 * unit, 6.52 * unit, 0.06 * unit, 64]} /><meshPhysicalMaterial color="#11212c" metalness={0.32} roughness={0.09} clearcoat={1} /></mesh>
        <mesh position={[0, 1.218 * unit, 0]}><cylinderGeometry args={[3.7 * unit, 3.7 * unit, 0.004 * unit, 48]} /><meshPhysicalMaterial color="#050c12" roughness={0.12} metalness={0.2} clearcoat={1} /></mesh>
        <mesh position={[-0.035, 1.225 * unit, -0.035]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.013, 24]} /><meshBasicMaterial color="#698499" transparent opacity={0.45} /></mesh>
      </group>;
    })}
    {([{ x:32.16, y:10.22, radius:3.0, color:'#e4ddce' }, { x:32.16, y:38.14, radius:3.2, color:'#111915' }] as const).map((part) => {
      const [x, y] = lens(part.x, part.y);
      return <mesh key={part.y} position={[x, y, back - 2.08 * unit]} rotation={[0, Math.PI, 0]}><circleGeometry args={[part.radius * unit, 40]} /><meshPhysicalMaterial color={part.color} roughness={0.25} clearcoat={0.5} /></mesh>;
    })}
    <mesh position={[halfWidth - 41.56 * unit, phone.height / 2 - 34.14 * unit, back - 0.001]} rotation={[0, Math.PI, 0]}><circleGeometry args={[0.009, 20]} /><meshBasicMaterial color="#31342d" /></mesh>
  </group>;
}

// Keep the one-shot environment capture stable when captions/screens change.
const StudioLighting = memo(function StudioLighting() {
  return <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[-3, 6, 4]} intensity={2.2} color="#f4f5fa" />
      <directionalLight position={[4, 1, -3]} intensity={2} color="#d0d8e2" />
      <Environment resolution={512} frames={1}>
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
  </>;
});

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
  const [screenReady, setScreenReady] = useState(false);
  const screenAvailable = useCallback(() => setScreenReady(true), []);
  const compiled = useRef(false);
  const scene = useThree((state) => state.scene);
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
    if (!screenReady || compiled.current || size.width <= 1 || size.height <= 1) return;
    let mounted = true;
    let readyFrame = 0;
    // Compile every material while the scene is still covered by its preview.
    // A real paint also uploads geometry and builds the environment's PMREM map.
    void gl.compileAsync(scene, camera).then(() => {
      if (!mounted) return;
      gl.render(scene, camera);
      readyFrame = requestAnimationFrame(() => {
        if (!mounted) return;
        compiled.current = true;
        onReady();
      });
    }).catch(() => { if (mounted) onUnavailable(); });
    return () => { mounted = false; cancelAnimationFrame(readyFrame); };
  }, [screenReady, gl, scene, camera, size.width, size.height, onReady, onUnavailable]);
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
      <StudioLighting />
      <group ref={group}>
        {kind === "laptop" ? (
          <Laptop image={image} images={images} hinge={hinge} onReady={screenAvailable} onUnavailable={onUnavailable} />
        ) : (
          <Phone image={image} images={images} onReady={screenAvailable} onUnavailable={onUnavailable} />
        )}
      </group>
    </>
  );
}

export default function DeviceScene(props: Props) {
  const phone = props.kind === "phone";
  const [prepared, setPrepared] = useState(false);
  const { onReady } = props;
  const completePreparation = useCallback(() => {
    setPrepared(true);
    onReady();
  }, [onReady]);

  return (
    <Canvas
      frameloop={props.visible || !prepared ? "demand" : "never"}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{
        position: phone ? [0, 0.2, 6.4] : [0, 2.45, 5.8],
        fov: phone ? 35 : 12,
      }}
      onCreated={({ camera }) => camera.lookAt(0, phone ? 0 : 0.35, 0)}
    >
      <Suspense fallback={null}>
        <Scene {...props} onReady={completePreparation} />
      </Suspense>
    </Canvas>
  );
}
