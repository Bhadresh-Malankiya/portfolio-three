"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Project } from "@/data/projects";
import { scrollToPosition } from "@/components/SmoothScroll";

const motionQuery =
  "(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";
function subscribe(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getSnapshot = () => window.matchMedia(motionQuery).matches;
const getServerSnapshot = () => false;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

function FeaturedCard({
  project,
  index,
  count,
  width,
  progress,
  animated,
  active,
}: {
  project: Project;
  index: number;
  count: number;
  width: number;
  progress: MotionValue<number>;
  animated: boolean;
  active: boolean;
}) {
  const center = (count - 1) / 2;
  const x = useTransform(progress, (p) => {
    const stack = (index - center) * 22;
    const fan = (index - center) * width * 0.67;
    const row = index * (width + 44);
    const travel = clamp((p - 0.4) / 0.6) * (count - 1) * (width + 44);
    return (
      -width / 2 +
      (p < 0.22
        ? mix(stack, fan, clamp(p / 0.22))
        : p < 0.4
          ? mix(fan, row, (p - 0.22) / 0.18)
          : row - travel)
    );
  });
  const y = useTransform(
    progress,
    [0, 0.22, 0.4, 1],
    [index * 10, Math.abs(index - center) * 22, 0, 0],
  );
  const rotate = useTransform(
    progress,
    [0, 0.22, 0.4, 1],
    [(index - center) * 7, (index - center) * 4, 0, 0],
  );
  const rotateY = useTransform(
    progress,
    [0, 0.22, 0.4, 1],
    [-12, (center - index) * 10, 0, 0],
  );
  const scale = useTransform(progress, (p) =>
    p < 0.4
      ? mix(0.78, 0.96, clamp(p / 0.4))
      : 1 -
        Math.min(1, Math.abs(index - clamp((p - 0.4) / 0.6) * (count - 1))) *
          0.09,
  );
  return (
    <motion.article
      className="featured-card"
      aria-labelledby={`featured-${project.slug}`}
      inert={animated && !active ? true : undefined}
      style={
        animated
          ? {
              width,
              x,
              y,
              rotate,
              rotateY,
              scale,
              zIndex: active ? 30 : 10 - index,
            }
          : undefined
      }
    >
      <div className="featured-card-media">
        {project.images?.[0] && (
          <Image
            src={project.images[0]}
            alt={`${project.name} product interface`}
            fill
            sizes="(min-width: 900px) 720px, 90vw"
            className="object-contain"
          />
        )}
        <span className="featured-card-number">
          0{index + 1} / 0{count}
        </span>
      </div>
      <div className="featured-card-copy">
        <div className="featured-card-title">
          <div>
            <p>
              {project.category} / {project.kind}
            </p>
            <h3 id={`featured-${project.slug}`}>{project.name}</h3>
          </div>
          <ArrowUpRight size={25} aria-hidden="true" />
        </div>
        <p className="featured-card-description">{project.oneLiner}</p>
        <p className="featured-card-role">
          <span>my part:</span> {project.role}
        </p>
        <div className="featured-card-bottom">
          <Link href={`/projects/${project.slug}`} className="text-link">
            readCaseStudy() <ArrowUpRight size={15} />
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              liveSite() <ArrowUpRight size={15} />
            </a>
          )}
          <span className="featured-card-stack">
            {project.tech.slice(0, 3).join(" / ")}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectShowcase({ projects }: { projects: Project[] }) {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [width, setWidth] = useState(680);
  const [spread, setSpread] = useState(false);
  const animated = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [lastMode, setLastMode] = useState(animated);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  if (lastMode !== animated) {
    setLastMode(animated);
    setActive(
      animated
        ? Math.round(
            clamp((scrollYProgress.get() - 0.4) / 0.6) * (projects.length - 1),
          )
        : 0,
    );
  }
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!animated) return;
    setActive(Math.round(clamp((p - 0.4) / 0.6) * (projects.length - 1)));
    setSpread(p >= 0.4);
  });
  useEffect(() => {
    const measure = () =>
      setWidth(
        Math.min(
          720,
          (container.current?.clientWidth ?? 1000) * 0.72,
          (window.innerHeight - 360) * 1.8,
        ),
      );
    const observer = new ResizeObserver(measure);
    if (container.current) observer.observe(container.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  function select(index: number) {
    const next = Math.max(0, Math.min(projects.length - 1, index));
    if (animated && container.current) {
      const p = 0.4 + (next / Math.max(1, projects.length - 1)) * 0.6;
      const top =
        window.scrollY + container.current.getBoundingClientRect().top;
      scrollToPosition(
        top + p * (container.current.offsetHeight - window.innerHeight),
      );
    } else if (track.current) {
      const card = track.current.children[next] as HTMLElement;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      track.current.scrollTo({
        left:
          card.offsetLeft - (track.current.clientWidth - card.offsetWidth) / 2,
        behavior: reduced ? "instant" : "smooth",
      });
      setActive(next);
    }
  }
  return (
    <div className="featured-deck" ref={container} data-animated={animated}>
      <div
        className="featured-stage"
        role="region"
        aria-label="Featured project carousel"
        aria-roledescription="carousel"
      >
        <div className="featured-stage-heading">
          <p>
            <span>work.collection</span> /{" "}
            {animated && !spread ? "scroll to unfold" : "selected projects"}
          </p>
          <a href="#weekend">
            continue <ArrowDown size={13} />
          </a>
        </div>
        <div
          className="featured-track"
          ref={track}
          onScroll={() => {
            if (animated || !track.current) return;
            const first = track.current.children[0] as HTMLElement;
            const second = track.current.children[1] as HTMLElement | undefined;
            if (second)
              setActive(
                Math.round(
                  track.current.scrollLeft /
                    (second.offsetLeft - first.offsetLeft),
                ),
              );
          }}
        >
          {projects.map((project, index) => (
            <FeaturedCard
              key={project.slug}
              project={project}
              index={index}
              count={projects.length}
              width={width}
              progress={scrollYProgress}
              animated={animated}
              active={active === index}
            />
          ))}
        </div>
        <div className="featured-controls">
          <span className="featured-status" aria-live="polite">
            0{active + 1}
            <span> / 0{projects.length}</span>
          </span>
          <div
            className="featured-pagination"
            aria-label="Select featured project"
          >
            {projects.map((project, i) => (
              <button
                key={project.slug}
                onClick={() => select(i)}
                aria-label={`Show featured project ${i + 1}: ${project.name}`}
                aria-pressed={active === i}
              >
                <span />
              </button>
            ))}
          </div>
          <div className="featured-arrows">
            <button
              aria-label="Previous featured project"
              disabled={active === 0 && (!animated || spread)}
              onClick={() => select(active - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              aria-label="Next featured project"
              disabled={active === projects.length - 1}
              onClick={() => select(active + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
