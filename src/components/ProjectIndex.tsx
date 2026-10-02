"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

const filters = [
  "All work",
  "Product ownership",
  "Client work",
  "Founder ventures",
  "Personal builds",
] as const;
export default function ProjectIndex() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All work");
  const visible = projects.filter(
    (project) =>
      filter === "All work" ||
      (filter === "Product ownership"
        ? project.kind === "Sole ownership"
        : filter === "Personal builds"
          ? project.kind === "Personal build"
          : filter === "Founder ventures"
            ? project.kind === "Founder venture"
            : ["Client project", "Employer product", "Freelance"].includes(
                project.kind,
              )),
  );
  return (
    <>
      <div
        className="project-filters"
        role="group"
        aria-label="Filter projects by contribution"
      >
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
          >
            {item}
          </button>
        ))}
        <span role="status">{visible.length} projects</span>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {visible.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </>
  );
}
