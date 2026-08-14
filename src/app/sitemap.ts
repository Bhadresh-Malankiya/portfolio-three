import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { fieldGuides } from "@/data/fieldGuides";
import { profile } from "@/data/profile";

const base = `https://${profile.site}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/journey`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/field-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const guideRoutes: MetadataRoute.Sitemap = fieldGuides.map((g) => ({
    url: `${base}/field-guide/${g.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...guideRoutes];
}
