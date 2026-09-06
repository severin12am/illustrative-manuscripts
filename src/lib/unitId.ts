import type { VariantUnit } from "@/types/text";

/** Mirror of scripts/lib/unit-id.mjs — keep in sync. */
export function makeUnitId(
  witnessId: string,
  esn: number,
  variant: Pick<VariantUnit, "kind" | "locus">
): string {
  const wordStart = variant.locus.word_start ?? 0;
  const wordEnd = variant.locus.word_end ?? wordStart;
  const range =
    wordStart === wordEnd ? `w${wordStart}` : `w${wordStart}-${wordEnd}`;
  return `${witnessId}:${esn}:${range}:${variant.kind}`;
}

export function unitIdForVariant(
  witnessId: string,
  esn: number,
  variant: VariantUnit
): string {
  return makeUnitId(witnessId, esn, variant);
}
