import type { Witness } from "@/types/witness";

const DATA_CNTR_GAPS =
  "https://github.com/severin12am/illustrative-manuscripts/blob/main/DATA.md#cntr-gaps-among-witnesses";

/** INTF Kurzgefasste Liste entry when present in seed bibliography. */
export function witnessListeUrl(witness: Witness): string | undefined {
  const fromBib = witness.bibliography?.find((b) =>
    /liste/i.test(b.title)
  )?.url;
  if (fromBib) return fromBib;
  if (witness.corpus === "nt" && witness.ga_number) {
    return `https://ntvmr.uni-muenster.de/liste/?gaNum=${encodeURIComponent(
      witness.ga_number
    )}`;
  }
  return undefined;
}

export function cntrGapDocUrl(): string {
  return DATA_CNTR_GAPS;
}
