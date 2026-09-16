const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** App route path including GitHub Pages basePath (no origin). */
export function pagePath(path: string): string {
  if (!path) return basePath || "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

/** Absolute URL for sharing (clipboard, Open Graph canonical on client). */
export function absolutePageUrl(path: string, origin?: string): string {
  const o =
    origin ?? (typeof window !== "undefined" ? window.location.origin : "");
  return `${o}${pagePath(path)}`;
}
