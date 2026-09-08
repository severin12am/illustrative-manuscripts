import data from "@/data/uthmani-regional-variants.json";
import type { UthmaniRegionalVariantsBundle } from "@/types/uthmaniRegionalVariants";

export const uthmaniRegionalVariants =
  data as UthmaniRegionalVariantsBundle;

export function getUthmaniVariantCount(): number {
  return uthmaniRegionalVariants.variants.length;
}
