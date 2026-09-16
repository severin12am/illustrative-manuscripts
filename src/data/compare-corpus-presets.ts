/** Curated deep-links for non–Greek-NT “compare” teaching — not verse alignment. */

export interface ComparePresetLink {
  href: string;
  label: string;
}

export interface CompareCorpusPreset {
  id: string;
  corpus: string;
  note: string;
  presets: {
    title: string;
    description: string;
    links: ComparePresetLink[];
  }[];
}

export const compareCorpusPresets: CompareCorpusPreset[] = [
  {
    id: "quran",
    corpus: "Qurʾān (Hijazi catalog)",
    note:
      "No parallel-verse compare in v1. Open two timeline cards and read each card’s rasm excerpt and bibliography.",
    presets: [
      {
        title: "Two dispersed Hijazi codex witnesses",
        description:
          "Parisino 328a and British Library Or. 2165 — both in the 1–100 AH window with leaf images and catalog metadata.",
        links: [
          { href: "/?corpus=quran#parisino-328a", label: "Parisino 328a" },
          { href: "/?corpus=quran#bl-or-2165", label: "BL Or. 2165" },
        ],
      },
      {
        title: "Ṣanʿāʾ palimpsest — upper vs lower layer",
        description:
          "One physical manuscript; the card documents two textual layers (standard rasm vs earlier washed text).",
        links: [
          {
            href: "/?corpus=quran#sanaa-dam-01-27-1",
            label: "DAM 01-27.1 card",
          },
        ],
      },
    ],
  },
  {
    id: "hebrew-lxx",
    corpus: "Hebrew Bible & Septuagint",
    note:
      "DSS and LXX cards carry diplomatic excerpts and student notes — not automated DSS↔MT alignment.",
    presets: [
      {
        title: "1QIsaᵃ vs Masoretic framing",
        description:
          "Use the Great Isaiah Scroll card and its excerpt notes; pair with Murabbaʿat Isaiah for a closer-to-MT Hebrew profile.",
        links: [
          { href: "/?corpus=hebrew-lxx#1qisaa", label: "1QIsaᵃ" },
          { href: "/?corpus=hebrew-lxx#mur-88", label: "Mur 88 (Isaiah)" },
        ],
      },
    ],
  },
  {
    id: "nag-hammadi",
    corpus: "Nag Hammadi",
    note: "Coptic tractate cards — no Thomas↔Gospel collation engine.",
    presets: [
      {
        title: "Gospel of Thomas vs an early Greek John fragment",
        description:
          "Read Thomas on the Nag Hammadi timeline and P52 on the Greek NT timeline; Greek sayings overlap is a scholarly topic, not a site compare row.",
        links: [
          {
            href: "/?corpus=nag-hammadi#nhc-ii-gospel-thomas",
            label: "Gospel of Thomas (NHC II)",
          },
          { href: "/?corpus=nt#p52", label: "P52 (John)" },
        ],
      },
    ],
  },
];
