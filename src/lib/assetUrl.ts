const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix static asset paths for GitHub Pages basePath. */
export function assetUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
