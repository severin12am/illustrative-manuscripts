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
    return listeUrlForGa(witness.ga_number);
  }
  return undefined;
}

export function listeUrlForGa(ga: string): string {
  return `https://ntvmr.uni-muenster.de/liste/?gaNum=${encodeURIComponent(
    ga
  )}`;
}

export function witnessNtvmrUrl(witness: Witness): string | undefined {
  if (witness.ntvmr_url) return witness.ntvmr_url;
  if (witness.corpus === "nt" && witness.docID != null) {
    return `https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=${witness.docID}`;
  }
  return undefined;
}

export function witnessCntrUrl(witness: Witness): string | undefined {
  if (witness.cntr_url) return witness.cntr_url;
  if (witness.corpus === "nt" && witness.ga_number) {
    return cntrManuscriptUrl(witness.ga_number);
  }
  return undefined;
}

export function cntrManuscriptUrl(ga: string): string {
  return `https://greekcntr.org/manuscripts/${ga}`;
}

export function witnessCsntmUrl(witness: Witness): string | undefined {
  if (witness.csntm_url) return witness.csntm_url;
  if (witness.corpus === "nt" && witness.ga_number) {
    return `https://manuscripts.csntm.org/manuscript/Group/GA_${witness.ga_number}`;
  }
  return undefined;
}

export function cntrGapDocUrl(): string {
  return DATA_CNTR_GAPS;
}

/** Outbound catalogs for Greek NT pages (explorer, coverage) — no invented deep links. */
export const greekNtScholarshipLinks: { href: string; label: string }[] = [
  { href: "https://ntvmr.uni-muenster.de/liste", label: "INTF Liste ↗" },
  { href: "https://ntvmr.uni-muenster.de/", label: "NTVMR ↗" },
  { href: "https://greekcntr.org/", label: "Full CNTR ↗" },
  { href: "https://igntp.org/", label: "IGNTP ↗" },
];
