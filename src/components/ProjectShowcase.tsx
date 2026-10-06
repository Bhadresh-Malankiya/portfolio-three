"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "@/data/portfolio";

const stories: Record<
  string,
  { title: string; text: string; role: string; labels: string[] }
> = {
  "extendedforms-io": {
    title: "More than a form.",
    text: "Timed exams, proctoring and reporting. I led the engineering that connects it all.",
    role: "Technical lead · ExpressTech",
    labels: ["Overview", "Live website"],
  },
  "quzo-ai": {
    title: "From questions to answers.",
    text: "AI-assisted assessments, from creation to results. My work spans the interface, AI integrations and backend.",
    role: "Full-stack & AI · ExpressTech",
    labels: ["Workspace", "Assessment", "Exam"],
  },
  zwopr: {
    title: "Content, under control.",
    text: "A clearer workspace for a content team. I built the admin interface and the services behind it.",
    role: "Full-stack engineer · Client project",
    labels: ["Dashboard", "Workspace", "Content"],
  },
};
function ProjectScene({
  project,
  index,
}: {
  project: PortfolioProject;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [screen, setScreen] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [index % 2 ? 2 : -2, 0, 0],
  );
  const story = stories[project.slug];
  const images = project.images?.slice(0, 3) ?? [];
  return (
    <article
      ref={ref}
      className="project-scene"
      aria-labelledby={`project-${project.slug}`}
    >
      <div className="scene-copy">
        <p className="eyebrow">
          0{index + 1} / {project.name}
        </p>
        <h3 id={`project-${project.slug}`}>{story.title}</h3>
        <p>{story.text}</p>
        <span className="scene-role">{story.role}</span>
        <div className="scene-links">
          <Link href={`/projects/${project.slug}`} className="text-link">
            Inside the project <ArrowUpRight size={16} />
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="scene-live"
              aria-label={`Visit ${project.name}`}
            >
              Live site ↗
            </a>
          )}
        </div>
      </div>
      <motion.div
        className="scene-visual"
        style={reduced ? undefined : { y, rotate }}
      >
        <div className="scene-image-wrap">
          <span className="scene-watermark" aria-hidden="true">
            0{index + 1}
          </span>
          <div className="scene-browser">
            <div className="browser-chrome" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>{project.name}</span>
            </div>
            <div className="scene-image">
              <Image
                src={images[screen]}
                alt={`${project.name} — ${story.labels[screen] ?? `screen ${screen + 1}`}`}
                fill
                sizes="(min-width: 900px) 700px, 90vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
        <div
          className="scene-controls"
          role="group"
          aria-label={`${project.name} screenshots`}
        >
          <span>Explore the screens</span>
          {images.map((image, i) => (
            <button
              key={image}
              aria-pressed={screen === i}
              onClick={() => setScreen(i)}
            >
              {story.labels[i] ?? `Screen ${i + 1}`}
            </button>
          ))}
        </div>
      </motion.div>
    </article>
  );
}
export default function ProjectShowcase({
  projects,
}: {
  projects: PortfolioProject[];
}) {
  return (
    <div className="project-stories">
      {projects.map((project, index) => (
        <ProjectScene key={project.slug} project={project} index={index} />
      ))}
    </div>
  );
}
