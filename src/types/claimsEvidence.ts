export type ClaimVerdict =
  | "supported"
  | "partial"
  | "unsupported"
  | "out_of_scope";

export interface ClaimsPathwayLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface ClaimsPathway {
  id: string;
  title: string;
  description: string;
  links: ClaimsPathwayLink[];
}

export interface ClaimsEvidenceLink {
  href: string;
  label: string;
}

export interface ClaimsScholarshipLink {
  label: string;
  url: string;
}

export interface ClaimCard {
  id: string;
  claim: string;
  verdict: ClaimVerdict;
  why: string;
  links: ClaimsEvidenceLink[];
  scholarship?: ClaimsScholarshipLink[];
}

export interface ClaimsEvidenceBundle {
  intro: string;
  pathways: ClaimsPathway[];
  claims: ClaimCard[];
}
