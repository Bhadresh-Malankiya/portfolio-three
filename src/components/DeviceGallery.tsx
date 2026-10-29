"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useEffect,
  startTransition,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, Maximize2 } from "lucide-react";
import { DEVICE_TIMELINE, PROJECT_STOPS, PROJECT_BREAKS } from "@/lib/device-choreography";
import DevicePreview from "@/components/DevicePreview";
import { scheduleDevicePreparation } from "@/lib/device-preparation";
import ProductScenery from "@/components/ProductScenery";
import WorkArchive from "@/components/WorkArchive";
import { ScreenshotViewer } from "@/components/ProjectGallery";
import { scrollToPosition } from "@/components/SmoothScroll";
import "@/app/device-gallery.css";

const DeviceScene = dynamic(() => import("@/components/three/DeviceScene"), {
  ssr: false,
});

type GalleryProject = {
  slug: string;
  name: string;
  kind: string;
  caption: string;
  role: string;
  features: string[];
  images: string[];
  phone?: boolean;
  url?: string;
};
const projects: GalleryProject[] = [
  {
    slug: "extendedforms-io",
    name: "ExtendedForms",
    kind: "01 / scale & leadership",
    caption: "A form. A full assessment.",
    role: "Technical lead · ExpressTech",
    features: ["400K+ users", "10M+ exams", "Team of 5"],
    images: ["/images/extendedforms.png", "/images/extendedforms-live.jpg"],
    url: "https://extendedforms.io",
  },
  {
    slug: "quzo-ai",
    name: "Quzo.ai",
    kind: "02 / systems & AI",
    caption: "AI on the surface. Architecture underneath.",
    role: "Full-stack & AI engineering · ExpressTech",
    features: ["AI authoring", "Modular architecture", "Exam delivery"],
    images: [
      "/images/quzo_dashboard.png",
      "/images/quzo_form_screen.png",
      "/images/quzo_response_report.png",
    ],
    url: "https://quzo.ai",
  },
  {
    slug: "vocalxi",
    name: "VocalXI",
    kind: "03 / voice AI build",
    caption: "Forms, with a voice.",
    role: "Product engineer · voice AI",
    features: ["Voice conversations", "Answer review", "Form workflows"],
    images: ["/images/vocalxi-home.jpg", "/images/vocalxi-review.jpg"],
    url: "https://vocalxi.com",
  },
  {
    slug: "hey-buddy",
    name: "Hey Buddy",
    kind: "04 / mobile · client project",
    caption: "A little closer to your pet.",
    role: "Mobile & mapping integration",
    features: ["GPS tracking", "Pet health", "NFC tags"],
    images: [
      "/images/heybuddy_4.png",
      "/images/heybuddy_1.jpeg",
      "/images/heybuddy_5.jpeg",
    ],
    phone: true,
    url: "https://heybuddy.io",
  },
];

const webScreens = projects.slice(0, 3).flatMap((p) => p.images);
const phoneScreens = projects[3].images;

const query =
  "(min-width: 900px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const snapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => false;
const mobileStories = [
  {
    title: "A small companion. A big connection.",
    description:
      "The mobile companion for pets, their people, and their connected tags.",
    label: "The companion app",
  },
  {
    title: "One tag. A way to connect.",
    description:
      "A welcome experience that connects the physical product with the app.",
    label: "Meet Hey Buddy",
  },
  {
    title: "From tag to app.",
    description:
      "The welcome flow connects pet owners with their tag and companion app.",
    label: "Getting started",
  },
];

class ModelBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function ProjectChapter({ mobile = false }: { mobile?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const inspectTrigger = useRef<HTMLButtonElement>(null);
  const entered = useInView(stage, { margin: "1200px 0px", once: true });
  const visible = useInView(stage, { margin: "150px 0px" });
  const [prepared, setPrepared] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const showModel = useCallback(() => setModelReady(true), []);
  const loseModel = useCallback(() => setModelFailed(true), []);
  useEffect(() => {
    let mounted = true;
    const cancel = scheduleDevicePreparation(() => {
      void import("@/components/three/DeviceScene").then(() => {
        if (mounted) startTransition(() => setPrepared(true));
      }).catch(() => { if (mounted) loseModel(); });
    }, mobile ? 220 : 0);
    return () => { mounted = false; cancel(); };
  }, [mobile, loseModel]);
  const animated = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [screen, setScreen] = useState(0);
  const [inspect, setInspect] = useState(false);
  const [closing, setClosing] = useState(true);
  const [phase, setPhase] = useState("arriving");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const sceneProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, mass: 0.7 });
  const opacity = useTransform(sceneProgress, [0.16, 0.25, 0.76, 0.83], [0, 1, 1, 0]);
  const deviceOpacity = useTransform(sceneProgress, [0, 0.04, 0.12, 0.94, 1], [0, 0.15, 1, 1, 0]);
  const entryHintOpacity = useTransform(sceneProgress, [0, 0.08, 0.16], [1, 1, 0]);
  const deviceX = useTransform(sceneProgress,
    [0, DEVICE_TIMELINE.arriveEnd, DEVICE_TIMELINE.exitStart, 1],
    [mobile ? "65%" : "-65%", "0%", "0%", mobile ? "-75%" : "75%"],
    { ease: (value) => value * value * (3 - 2 * value) });
  const p = mobile ? projects[3] : projects[active];
  const imageIndex = mobile ? active : screen;
  const image = p.images[imageIndex];
  useMotionValueEvent(sceneProgress, "change", (value) => {
    if (!animated || inspect) return;
    const next = value < PROJECT_BREAKS[0] ? 0 : value < PROJECT_BREAKS[1] ? 1 : 2;
    if (next !== active) {
      setActive(next);
      setScreen(0);
    }
    const exiting = value < 0.2 || value > 0.79;
    if (exiting !== closing) setClosing(exiting);
    const nextPhase = value < DEVICE_TIMELINE.arriveEnd ? "arriving"
      : value < DEVICE_TIMELINE.openEnd ? "opening"
      : value < DEVICE_TIMELINE.closeStart ? "reading"
      : value < DEVICE_TIMELINE.exitStart ? "closing" : "leaving";
    if (nextPhase !== phase) setPhase(nextPhase);
  });
  function select(index: number) {
    setScreen(0);
    if (!animated || !ref.current) {
      setActive(index);
      return;
    }
    const top = ref.current.getBoundingClientRect().top + window.scrollY;
    scrollToPosition(
      top + (ref.current.offsetHeight - window.innerHeight) * PROJECT_STOPS[index],
    );
  }
  function inspectImage() {
    setInspect(true);
  }

  return (
    <section
      ref={ref}
      id={mobile ? "mobile-work" : "work"}
      className={`device-chapter center-stage product-world ${mobile ? "phone-chapter" : "web-chapter"}`}
      data-scroll={animated}
      data-project={p.slug}
      data-phase={animated ? phase : "reading"}
      aria-label={mobile ? "Mobile project showcase" : "Web project showcase"}
    >
      <div className="chapter-sticky">
        <ProductScenery project={p.slug} name={mobile ? "A little closer." : p.name} />
        <div className="chapter-topline">
          <span>
            {mobile ? "02 / A COMPANION, IN YOUR POCKET" : "01 / PRODUCTS IN THE BROWSER"}
          </span>
          <span>
            {animated ? phase === "arriving" ? "Scroll to bring the work into view"
              : phase === "opening" ? mobile ? "A closer look" : "Opening the workspace"
              : phase === "closing" || phase === "leaving" ? "On to the next story"
              : "Scroll to explore · or choose a chapter"
              : "Choose a chapter below"}
          </span>
        </div>
        <div className="chapter-layout">
          <div className="chapter-device" ref={stage} data-ready={modelReady} data-scene-ready={modelReady} data-scene-mounted={prepared || entered}>
            <div className="studio-halo" aria-hidden="true" />
            {animated && <motion.p className="chapter-entry-cue" aria-hidden="true" style={{ opacity: entryHintOpacity }}>
              <ArrowDown size={15} /> {mobile ? "Scroll to meet Hey Buddy" : "Scroll to open the workspace"}
            </motion.p>}
            <div
              className="model-viewport"
              role="img"
              aria-label={`${p.name} on ${mobile ? "an iPhone 16 Pro" : "a 14-inch MacBook Pro"}`}
            >
              <motion.div
                className="device-render-stage"
                style={animated ? { opacity: deviceOpacity, x: deviceX } : { opacity: 1, x: 0 }}
              >
                <div className="device-preview-layer" data-covered={modelReady && !modelFailed}>
                  <DevicePreview kind={mobile ? "phone" : "laptop"} image={image} progress={sceneProgress} animated={animated} />
                </div>
                {(prepared || entered) && !modelFailed && (
                  <div className="device-canvas" data-ready={modelReady}>
                    <ModelBoundary fallback={null} onError={loseModel}>
                      <DeviceScene
                        kind={mobile ? "phone" : "laptop"}
                        images={mobile ? phoneScreens : webScreens}
                        image={image}
                        progress={sceneProgress}
                        animated={animated}
                        visible={visible}
                        onReady={showModel}
                        onUnavailable={loseModel}
                      />
                    </ModelBoundary>
                  </div>
                )}
              </motion.div>
            </div>
            {modelFailed && <p className="device-preview-note" role="status">Interactive view unavailable. Open the project to explore its screenshots.</p>}
            <motion.div
              className="chapter-screen-controls"
              style={{ opacity: animated ? opacity : 1 }}
              inert={animated && closing}
            >
              {!mobile && (
                <div role="group" aria-label={`${p.name} screenshots`}>
                  {p.images.map((src, i) => (
                    <button
                      key={src}
                      aria-label={`Screen ${i + 1}`}
                      aria-pressed={screen === i}
                      onClick={() => setScreen(i)}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              )}
              <button
                ref={inspectTrigger}
                onClick={inspectImage}
                aria-label={`Enlarge ${p.name} screenshot`}
              >
                <Maximize2 size={13} /> Inspect screen
              </button>
            </motion.div>
          </div>
          <motion.div
            className="chapter-copy"
            style={{ opacity: animated ? opacity : 1 }}
            inert={animated && closing}
          >
              <motion.div className="chapter-caption" key={active}
                initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduced ? 0 : 0.48, ease: [0.22, 0.7, 0.2, 1] }}>
                <p className="eyebrow">{mobile ? `Hey Buddy / 0${active + 1}` : p.kind}</p>
                <h3>{mobile ? mobileStories[active].title : p.name}</h3>
                <p className="chapter-description">{mobile ? mobileStories[active].description : p.caption}</p>
              </motion.div>
            <div className="chapter-evidence">
              <div className="feature-pills">
                {(mobile ? [mobileStories[active].label, "React Native"] : p.features).map((feature) => <span key={feature}>{feature}</span>)}
              </div>
              <p className="cinema-role">{p.role}</p>
            </div>
            <div className="cinema-links">
              <Link className="button-primary" href={`/projects/${p.slug}${p.slug === "quzo-ai" ? "#quzo-architecture" : ""}`}>
                {p.slug === "quzo-ai" ? "Explore the architecture" : "Inside the build"} <ArrowUpRight size={16} />
              </Link>
              <a
                className="text-link"
                href={p.url}
                target="_blank"
                rel="noreferrer"
              >
                Live site ↗
              </a>
            </div>
          </motion.div>
        </div>
        <div className="chapter-footer">
          {animated && <div className="chapter-progress" aria-hidden="true"><motion.i style={{ scaleX: sceneProgress }} /></div>}
          <div
            className="chapter-selector"
            role="group"
            aria-label={
              mobile ? "Explore Hey Buddy" : "Select featured web project"
            }
          >
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                aria-pressed={active === i}
                onClick={() => select(i)}
              >
                <span>0{i + 1}</span>
                {mobile ? mobileStories[i].label : projects[i].name}
                <i />
              </button>
            ))}
          </div>
          <Link
            href={mobile ? "/projects" : "#mobile-work"}
            className="chapter-next"
          >
            {mobile ? "All projects" : "Next: mobile"}
            <ArrowDown size={14} />
          </Link>
        </div>
      </div>
      {inspect && <ScreenshotViewer
        images={p.images}
        name={p.name}
        index={imageIndex}
        go={(step) => {
          const next = (imageIndex + step + p.images.length) % p.images.length;
          if (mobile) setActive(next);
          else setScreen(next);
        }}
        onDismiss={() => {
          setInspect(false);
          inspectTrigger.current?.focus({ preventScroll: true });
        }}
      />}
    </section>
  );
}

export default function DeviceGallery() {
  return (
    <>
      <div className="work-prologue">
        <p className="eyebrow">Selected work / Three products. Three different challenges.</p>
        <span className="work-prologue-stamp" aria-hidden="true">DESIGNED TO<strong>work.</strong>BUILT TO BE USED</span>
        <h2>Different problems.<br /><em>All the way to live.</em></h2>
        <div className="work-prologue-bottom"><span>01 — WEB PRODUCTS<br />02 — MOBILE EXPERIENCES</span><p>Scale at ExtendedForms. Systems at Quzo. Voice AI at VocalXI.</p></div>
      </div>
      <ProjectChapter />
      <div className="mobile-interlude">
        <div><p className="eyebrow">Different screen. Real lives.</p><h2>Some things belong<br /><em>closer to you.</em></h2><p>Hey Buddy connects pets, their people, and the information that matters.</p></div>
        <div className="mobile-orbit" aria-hidden="true"><span>✳</span></div>
      </div>
      <ProjectChapter mobile />
      <WorkArchive />
    </>
  );
}
