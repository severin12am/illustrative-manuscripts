import type { MetadataRoute } from "next";
import { teachBriefs } from "@/data/teach-briefs";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const siteOrigin = "https://severin12am.github.io";

const STATIC_ROUTES = [
  "",
  "about",
  "status",
  "methodology",
  "coverage",
  "use",
  "cite",
  "sources",
  "teach",
  "famous",
  "variants",
  "compare",
  "hebrew-lxx/evidence",
  "nag-hammadi/evidence",
  "quran/uthmani",
  "quran/archetype",
  "quran/readings",
];

function pageUrl(route: string): string {
  const path = route ? `${basePath}/${route}/` : `${basePath}/`;
  return `${siteOrigin}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: pageUrl(route),
    lastModified: now,
  }));

  for (const brief of teachBriefs.briefs) {
    entries.push({
      url: pageUrl(`teach/${brief.slug}`),
      lastModified: now,
    });
  }

  return entries;
}
