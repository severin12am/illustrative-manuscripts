/**
 * Stable identifiers for word-level variation units.
 * Shared by export, local tagger, and UI lookup.
 */

/** @param {import("./taggable-units.mjs").TaggableUnitInput} input */
export function makeUnitId({ witness_id, esn, kind, word_start, word_end }) {
  const ws = word_start ?? 0;
  const we = word_end ?? ws;
  const range = ws === we ? `w${ws}` : `w${ws}-${we}`;
  return `${witness_id}:${esn}:${range}:${kind}`;
}
