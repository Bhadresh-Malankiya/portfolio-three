"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Component,
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, Maximize2 } from "lucide-react";
import { PROJECT_STOPS, PROJECT_BREAKS } from "@/lib/device-choreography";
import { scrollToPosition } from "@/components/SmoothScroll";

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
    slug: "vocalxi",
    name: "VocalXI",
    kind: "01 / my own product",
    caption: "Forms, with a voice.",
    role: "Founder & product engineer · AscendXI",
    features: ["Voice conversations", "Answer review", "Form workflows"],
    images: ["/images/vocalxi-home.jpg", "/images/vocalxi-review.jpg"],
    url: "https://vocalxi.com",
  },
  {
    slug: "quzo-ai",
    name: "Quzo.ai",
    kind: "02 / employer product",
    caption: "From questions to insight.",
    role: "Full-stack & AI engineering · ExpressTech",
    features: ["AI authoring", "Exam delivery", "Response reports"],
    images: [
      "/images/quzo_dashboard.png",
      "/images/quzo_form_screen.png",
      "/images/quzo_response_report.png",
    ],
    url: "https://quzo.ai",
  },
  {
    slug: "extendedforms-io",
    name: "ExtendedForms",
    kind: "03 / employer product",
    caption: "A form. A full assessment.",
    role: "Technical lead · ExpressTech",
    features: ["Timed exams", "Proctoring", "Reporting"],
    images: ["/images/extendedforms.png", "/images/extendedforms-live.jpg"],
    url: "https://extendedforms.io",
  },
  {
    slug: "hey-buddy",
    name: "Hey Buddy",
    kind: "04 / mobile · client project",
    caption: "A little closer to your pet.",
    role: "Mobile & mapping integration",
    features: ["GPS tracking", "Pet health", "NFC tags"],
    images: [
      "/images/heybuddy_2.png",
      "/images/heybuddy_3.png",
      "/images/heybuddy_1.jpeg",
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
    title: "A profile. A way home.",
    description:
      "Pet profiles and NFC tags put the right information in reach.",
    label: "Pet profiles",
  },
  {
    title: "Their health, in one place.",
    description:
      "Medical details stay with the pet’s profile, ready when needed.",
    label: "Health records",
  },
  {
    title: "From tag to app.",
    description:
      "The welcome flow connects pet owners with their tag and companion app.",
    label: "Getting started",
  },
];

class ModelBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function ProjectChapter({ mobile = false }: { mobile?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const entered = useInView(stage, { margin: "600px 0px", once: true });
  const visible = useInView(stage, { margin: "150px 0px" });
  const [modelReady, setModelReady] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const showModel = useCallback(() => setModelReady(true), []);
  const loseModel = useCallback(() => setModelFailed(true), []);
  const animated = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [screen, setScreen] = useState(0);
  const [inspect, setInspect] = useState(false);
  const [closing, setClosing] = useState(true);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70px", "end end"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.13, 0.22, 0.84, 0.92, 1],
    [0, 0, 1, 1, 0, 0],
  );
  const deviceX = useTransform(
    scrollYProgress,
    [0, 0.1, 0.94, 1],
    mobile ? ["70%", "0%", "0%", "-70%"] : ["-70%", "0%", "0%", "70%"],
  );
  const deviceOpacity = useTransform(
    scrollYProgress,
    [0, 0.055, 0.96, 1],
    [0, 1, 1, 0],
  );
  const p = mobile ? projects[3] : projects[active];
  const imageIndex = mobile ? active : screen;
  const image = p.images[imageIndex];
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!animated || inspect) return;
    const next = value < PROJECT_BREAKS[0] ? 0 : value < PROJECT_BREAKS[1] ? 1 : 2;
    if (next !== active) {
      setActive(next);
      setScreen(0);
    }
    const exiting = value < 0.16 || value > 0.9;
    if (exiting !== closing) setClosing(exiting);
  });
  function select(index: number) {
    setScreen(0);
    if (!animated || !ref.current) {
      setActive(index);
      if (ref.current)
        scrollToPosition(
          ref.current.getBoundingClientRect().top + window.scrollY - 78,
        );
      return;
    }
    const top = ref.current.getBoundingClientRect().top + window.scrollY;
    scrollToPosition(
      top - 70 +
        (ref.current.offsetHeight - window.innerHeight + 70) * PROJECT_STOPS[index],
    );
  }
  function inspectImage() {
    setInspect(true);
    dialog.current?.showModal();
  }
  const fallback = (
    <div className={`device-poster ${mobile ? "is-phone" : ""}`}>
      <Image
        src={image}
        alt={`${p.name} screenshot`}
        fill
        sizes="(min-width: 900px) 650px, 90vw"
        className="object-contain"
      />
    </div>
  );
  return (
    <section
      ref={ref}
      id={mobile ? "mobile-work" : "work"}
      className={`device-chapter ${mobile ? "phone-chapter" : "web-chapter"}`}
      data-scroll={animated}
      aria-label={mobile ? "Mobile project showcase" : "Web project showcase"}
    >
      <div className="chapter-sticky">
        <div className="chapter-topline page-shell">
          <span>
            {mobile ? "02 / MOBILE — iPhone Pro" : "01 / WEB — MacBook Pro"}
          </span>
          <span>
            {animated
              ? mobile
                ? "Scroll to turn · explore · move on"
                : "Scroll to open · explore · close"
              : "Choose a view below"}
          </span>
        </div>
        <div className="chapter-layout page-shell">
          <div className="chapter-device" ref={stage}>
            <div className="studio-halo" aria-hidden="true" />
            <div
              className="model-viewport"
              role="img"
              aria-label={`${p.name} on a ${mobile ? "titanium iPhone Pro" : "silver MacBook Pro"}`}
            >
              {(!modelReady || modelFailed) && (
                <motion.div className="model-loading-poster" style={animated ? { x: deviceX, opacity: deviceOpacity } : { x: 0, opacity: 1 }}>{fallback}</motion.div>
              )}
              {entered && !modelFailed && (
                <motion.div
                  className="device-canvas"
                  data-ready={modelReady}
                  style={
                    animated && modelReady
                      ? { x: deviceX, opacity: deviceOpacity }
                      : { x: 0, opacity: 1 }
                  }
                >
                  <ModelBoundary fallback={fallback}>
                    <DeviceScene
                      kind={mobile ? "phone" : "laptop"}
                      images={mobile ? phoneScreens : webScreens}
                      image={image}
                      progress={scrollYProgress}
                      animated={animated}
                      visible={visible}
                      onReady={showModel}
                      onUnavailable={loseModel}
                    />
                  </ModelBoundary>
                </motion.div>
              )}
            </div>
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
            {mobile && (
              <p className="chapter-product-name">
                Hey Buddy <span>Mobile · client project</span>
              </p>
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: reduced ? 0 : 0.2 }}
              >
                <p className="eyebrow">
                  {mobile
                    ? `0${active + 1} / ${mobileStories[active].label}`
                    : p.kind}
                </p>
                <h3>{mobile ? mobileStories[active].title : p.name}</h3>
                <p className="chapter-description">
                  {mobile ? mobileStories[active].description : p.caption}
                </p>
                {!mobile && (
                  <div className="feature-pills">
                    {p.features.map((feature) => (
                      <span key={feature}>{feature}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            <p className="cinema-role">{p.role}</p>
            <div className="cinema-links">
              <Link className="button-primary" href={`/projects/${p.slug}`}>
                Inside the build <ArrowUpRight size={16} />
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
        <div className="chapter-footer page-shell">
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
      <dialog
        ref={dialog}
        className="device-inspector"
        aria-label={`${p.name} screenshot viewer`}
        data-lenis-prevent
        onClose={() => setInspect(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          const next =
            (imageIndex +
              (event.key === "ArrowRight" ? 1 : p.images.length - 1)) %
            p.images.length;
          if (mobile) setActive(next);
          else setScreen(next);
        }}
      >
        <button
          className="inspector-close"
          onClick={() => dialog.current?.close()}
        >
          Close ×
        </button>
        {inspect && (
          <Image
            src={image}
            alt={`${p.name} enlarged screenshot`}
            width={1600}
            height={1000}
            className="inspector-image"
          />
        )}
      </dialog>
    </section>
  );
}

export default function DeviceGallery() {
  return (
    <>
      <div className="work-heading page-shell">
        <p className="eyebrow">Selected work / 01—02</p>
        <h2>
          Built for the way
          <br />
          <em>people use it.</em>
        </h2>
        <p>From the browser to the palm of your hand.</p>
      </div>
      <ProjectChapter />
      <div className="mobile-chapter-heading page-shell">
        <p className="eyebrow">A different screen. A different context.</p>
        <h2>
          Life happens
          <br />
          <em>away from the desk.</em>
        </h2>
        <p>One mobile project. Three everyday moments.</p>
      </div>
      <ProjectChapter mobile />
      <div className="gallery-end page-shell">
        <p>
          Also in the archive: <Link href="/projects/jewelxi">Jewelxi ↗</Link>
          <Link href="/projects/zwopr">ZWOPR ↗</Link>
        </p>
        <Link className="button-secondary" href="/projects">
          View all 15 projects <ArrowUpRight size={17} />
        </Link>
      </div>
    </>
  );
}
