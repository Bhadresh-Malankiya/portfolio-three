import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { portfolioProjects as projects } from "@/data/portfolio";

export default function WeekendBuilds() {
  return (
    <div className="weekend-builds">
      {["vocalxi", "jewelxi"].map((slug, i) => {
        const project = projects.find((item) => item.slug === slug)!;
        return (
          <Reveal key={slug} delay={i * 0.08}>
            <article className="weekend-card">
              <div className="weekend-card-top">
                <span>{`0${i + 1} / ${slug}`}</span>
                <span>
                  {slug === "vocalxi"
                    ? "personal product"
                    : "e-commerce preview"}
                </span>
              </div>
              <Link href={`/projects/${slug}`} className="weekend-image">
                <Image
                  src={project.images![0]}
                  alt={`${project.name} public website`}
                  fill
                  sizes="(min-width: 768px) 550px, 90vw"
                  className="object-contain"
                />
              </Link>
              <div className="weekend-card-copy">
                <h3>
                  {project.name}
                  <span>↗</span>
                </h3>
                <p>
                  {slug === "vocalxi"
                    ? "What if answering a form felt like a conversation? I’m building that with VocalXI."
                    : "A jewellery storefront built around browsing, filtering and a closer look at the details."}
                </p>
                <p className="weekend-status">{project.status}</p>
                <div className="flex flex-wrap gap-6">
                  <Link href={`/projects/${slug}`} className="text-link">
                    Explore the build <ArrowUpRight size={15} />
                  </Link>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-link"
                  >
                    Visit the site <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
