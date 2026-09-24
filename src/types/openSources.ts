export type OpenSourceLicenseKind =
  | "open_reuse"
  | "link_only"
  | "copyrighted_cite_only";

export interface OpenSourceLink {
  label: string;
  href: string;
}

export interface OpenSourceCard {
  id: string;
  title: string;
  summary: string;
  links: OpenSourceLink[];
  license: OpenSourceLicenseKind;
  license_note: string;
}

export interface OpenSourceSection {
  id: string;
  title: string;
  intro?: string;
  cards: OpenSourceCard[];
}

export interface OpenSourcesBundle {
  version: number;
  intro: string;
  license_legend: Record<OpenSourceLicenseKind, string>;
  sections: OpenSourceSection[];
}

export const OPEN_SOURCE_LICENSE_LABEL: Record<OpenSourceLicenseKind, string> = {
  open_reuse: "Open reuse",
  link_only: "Link only",
  copyrighted_cite_only: "Copyrighted — cite, don't host",
};
