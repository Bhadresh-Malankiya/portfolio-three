import type { MetadataRoute } from "next";
import { portfolioProjects, identity } from "@/data/portfolio";
import { fieldGuides } from "@/data/fieldGuides";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${identity.site}`;
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/projects`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/journey`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/field-guide`, changeFrequency: "yearly", priority: 0.5 },
    ...portfolioProjects.map((p) => ({ url: `${base}/projects/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...fieldGuides.map((g) => ({ url: `${base}/field-guide/${g.slug}`, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
