import type { IntentionalLabel, IntentionalTagMap } from "@/types/intentionalTags";
import { intentionalTags } from "@/data/intentional-tags";

export const INTENTIONAL_LABEL_ORDER: IntentionalLabel[] = [
  "error",
  "intentional",
  "uncertain",
];

export const INTENTIONAL_LABEL_DISPLAY: Record<
  IntentionalLabel,
  { short: string; title: string }
> = {
  error: {
    short: "Error",
    title: "Likely scribal error (model-assisted hypothesis)",
  },
  intentional: {
    short: "Intentional?",
    title: "Possibly intentional change (model-assisted hypothesis)",
  },
  uncertain: {
    short: "Uncertain",
    title: "Intentionality unclear (model-assisted hypothesis)",
  },
};

export function getIntentionalTag(unitId: string) {
  return intentionalTags[unitId] ?? null;
}

export function hasAnyIntentionalTags(
  tags: IntentionalTagMap = intentionalTags
): boolean {
  return Object.keys(tags).length > 0;
}

export function countTagsByLabel(
  tags: IntentionalTagMap = intentionalTags
): Record<IntentionalLabel, number> {
  const counts: Record<IntentionalLabel, number> = {
    error: 0,
    intentional: 0,
    uncertain: 0,
  };
  for (const tag of Object.values(tags)) {
    if (tag?.label && tag.label in counts) {
      counts[tag.label as IntentionalLabel]++;
    }
  }
  return counts;
}

export function intentionalBadgeTitle(
  label: IntentionalLabel,
  rationale?: string
): string {
  const base = INTENTIONAL_LABEL_DISPLAY[label].title;
  if (rationale?.trim()) return `${base}: ${rationale.trim()}`;
  return base;
}
