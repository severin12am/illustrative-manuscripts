import data from "@/data/teach-briefs.json";
import type { TeachBriefsBundle } from "@/types/teachBriefs";

export const teachBriefs = data as TeachBriefsBundle;

export function getTeachBriefBySlug(slug: string) {
  return teachBriefs.briefs.find((b) => b.slug === slug);
}
