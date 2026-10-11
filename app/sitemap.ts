import { MetadataRoute } from "next";
import { projects } from "@/content/data";

const BASE_URL = "https://www.snehinadepu.me";

export default function sitemap(): MetadataRoute.Sitemap {
  // Work case study pages (category === "work")
  const workPages: MetadataRoute.Sitemap = projects
    .filter((p) => p.category === "work")
    .map((p) => ({
      url: `${BASE_URL}/work/${p.slug}`,
      lastModified: new Date("2026-09-01"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date("2026-10-11"),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/work`,
      lastModified: new Date("2026-10-11"),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/lab`,
      lastModified: new Date("2026-09-01"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...workPages,
  ];
}
