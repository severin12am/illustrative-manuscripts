import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const siteOrigin = "https://severin12am.github.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: `${basePath || ""}/`,
    },
    sitemap: `${siteOrigin}${basePath}/sitemap.xml`,
  };
}
