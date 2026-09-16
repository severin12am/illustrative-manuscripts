export interface TeachBriefLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface TeachBriefStep {
  text: string;
  links?: TeachBriefLink[];
}

export interface TeachBrief {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  audience: string;
  learning_goal: string;
  steps: TeachBriefStep[];
  dont_overclaim: string;
  related_links?: TeachBriefLink[];
}

export interface TeachBriefsBundle {
  version: number;
  intro: string;
  briefs: TeachBrief[];
}
