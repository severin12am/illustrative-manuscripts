#!/usr/bin/env node
/**
 * Builds Quran witness metadata + text panels from hand-curated seed.
 * Pickthall (PD 1930) + Uthmani reference (Tanzil via fawazahmed0/quran-api).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CACHE = join(__dirname, "cache");
const OUT = join(ROOT, "src/data");
const SEED = join(__dirname, "quran-seed.json");

const PICKTHALL_URL =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-mohammedmarmadu.json";
const ARABIC_URL =
  "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmanihaf.json";

const STANDARD_RASM_LABEL = "Uthmani rasm (Tanzil / King Fahd complex, diacritics stripped for comparison)";

mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT, { recursive: true });

async function fetchJson(url, cacheName) {
  const cachePath = join(CACHE, cacheName);
  if (existsSync(cachePath)) {
    return JSON.parse(readFileSync(cachePath, "utf8"));
  }
  const res = await fetch(url, {
    headers: { "User-Agent": "IllustrativeManuscripts/1.0" },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const data = await res.json();
  writeFileSync(cachePath, JSON.stringify(data));
  return data;
}

function stripArabicDiacritics(s) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[\u0640\u0670]/g, "")
    .replace(/ٱ/g, "ا")
    .replace(/أ|إ|آ/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .trim();
}

function buildVerseIndex(quranArray) {
  const map = new Map();
  for (const row of quranArray) {
    map.set(`${row.chapter}:${row.verse}`, row.text);
  }
  return map;
}

function getAyahText(index, surah, ayah) {
  return index.get(`${surah}:${ayah}`) || "";
}

function compareRasm(witnessNote, standardPlain) {
  if (!witnessNote || !standardPlain) return [];
  const variants = [];
  if (witnessNote.includes("lower") || witnessNote.includes("Lower")) {
    variants.push({
      kind: "substitution",
      witness_reading: "(lower-text layer)",
      base_reading: standardPlain.slice(0, 80),
      base_text: STANDARD_RASM_LABEL,
      note: "Lower palimpsest text diverges from standard Uthmani rasm — see Sadeghi & Goudarzi 2012.",
      source: "manual",
    });
  }
  return variants;
}

function passageToAyahs(passage, pickthall, arabic, m) {
  const ayahs = [];
  for (let a = passage.ayah_start; a <= passage.ayah_end; a++) {
    const arabicFull = getAyahText(arabic, passage.surah, a);
    const standardRasm = stripArabicDiacritics(arabicFull);
    const pick = getAyahText(pickthall, passage.surah, a);
    const layerLabel = passage.layer
      ? passage.layer === "lower"
        ? "Lower text"
        : "Upper text"
      : null;

    ayahs.push({
      reference: `Q ${passage.surah}:${a}${layerLabel ? ` (${layerLabel})` : ""}`,
      surah: passage.surah,
      ayah: a,
      layer: passage.layer || null,
      arabic_witness: null,
      arabic_witness_label:
        passage.witness_label ||
        "Standard rasm for verses on this leaf (not a traced facsimile of the scribe)",
      arabic_witness_source: passage.witness_source || m.dating_source,
      arabic_standard: standardRasm,
      arabic_standard_label: STANDARD_RASM_LABEL,
      english_pickthall: pick,
      english_label: "Pickthall 1930 (public domain)",
      has_variant: Boolean(passage.variant_note || passage.layer === "lower"),
      variants: passage.layer === "lower"
        ? compareRasm(passage.variant_note || "lower", standardRasm)
        : [],
      note: passage.variant_note || undefined,
    });
  }
  return ayahs;
}

function attachCommons(witnesses, seedById) {
  const mapPath = join(__dirname, "quran-commons-images.json");
  const map = existsSync(mapPath)
    ? JSON.parse(readFileSync(mapPath, "utf8"))
    : {};
  delete map._comment;
  const attrDir = join(ROOT, "public/witnesses");

  return witnesses.map((w) => {
    const seed = seedById.get(w.id);
    const image = seed?.image;
    let next = { ...w };

    const key = w.id;
    const entry = map[key];
    if (entry) {
      const imgPath = join(attrDir, entry.file);
      const attrPath = `${imgPath}.attribution.json`;
      if (existsSync(imgPath)) {
        let attr = null;
        if (existsSync(attrPath)) {
          attr = JSON.parse(readFileSync(attrPath, "utf8"));
        }
        next = {
          ...next,
          image_policy: "hosted",
          image_source: "commons",
          hosted_image: `/witnesses/${entry.file}`,
          image_attribution: attr,
          commons_url: entry.commons_url,
        };
      }
    }

    if (image?.policy === "iiif" && image.iiif_image_url) {
      next = {
        ...next,
        image_policy: "iiif",
        image_source: "iiif",
        hosted_image: null,
        iiif_manifest: image.iiif_manifest || undefined,
        iiif_image_url: image.iiif_image_url,
        image_attribution: image.attribution || null,
        source_page_url: image.viewer_url || seed.library_url,
      };
    }

    return next;
  });
}

function seedToWitness(m) {
  const imagePolicy =
    m.image?.policy === "iiif"
      ? "iiif"
      : m.commons_key
        ? "hosted"
        : "link_only";

  return {
    id: m.id,
    ga_number: m.catalog_id,
    traditional_name: m.traditional_name,
    aliases: [m.catalog_id],
    corpus: "quran",
    book_category: "other",
    language: "Arabic",
    material: m.material || "parchment",
    contents: m.contents,
    date_start: m.date_ce_start,
    date_end: m.date_ce_end,
    ah_start: m.date_ah_start,
    ah_end: m.date_ah_end,
    date_label: m.date_label,
    date_note: m.date_note,
    dating_method: m.dating_method,
    dating_source: m.dating_source,
    find_place: m.find_place,
    find_year_or_note: "See bibliography",
    current_institution: m.current_institution,
    current_shelfmark: m.current_shelfmark,
    script: m.script,
    palimpsest: m.palimpsest || false,
    layers: m.layers || null,
    image_policy: imagePolicy,
    image_source: m.commons_key ? "commons" : m.image?.policy === "iiif" ? "iiif" : undefined,
    hosted_image: null,
    iiif_manifest: m.image?.iiif_manifest || undefined,
    iiif_image_url: m.image?.iiif_image_url || undefined,
    image_attribution: m.image?.attribution || null,
    source_page_url: m.library_url,
    library_url: m.library_url,
    corpus_coranicum_url: m.corpus_coranicum_url,
    ntvmr_url: m.library_url,
    csntm_url: undefined,
    cntr_url: undefined,
    docID: 0,
    translation: "Marmaduke Pickthall, The Meaning of the Glorious Koran (1930, public domain)",
    modern_base_text: STANDARD_RASM_LABEL,
    known_variants: [],
    bibliography: m.bibliography || [],
    license_note:
      "Catalog metadata via Corpus Coranicum (CC BY 4.0) and holding libraries. Images © institutions unless a Commons file is shown.",
  };
}

async function main() {
  const seed = JSON.parse(readFileSync(SEED, "utf8"));
  const pickthallData = await fetchJson(PICKTHALL_URL, "pickthall.json");
  const arabicData = await fetchJson(ARABIC_URL, "quran-uthmani.json");

  const pickthall = buildVerseIndex(pickthallData.quran);
  const arabic = buildVerseIndex(arabicData.quran);

  let witnesses = seed.manuscripts.map(seedToWitness);
  const seedById = new Map(seed.manuscripts.map((m) => [m.id, m]));
  witnesses = attachCommons(witnesses, seedById);

  const texts = {};
  for (const m of seed.manuscripts) {
    const passages = m.passages || [];
    const ayahs = passages.flatMap((p) =>
      passageToAyahs(p, pickthall, arabic, m)
    );
    const difference_count = ayahs.reduce(
      (n, a) => n + (a.variants?.length || 0),
      0
    );
    texts[m.id] = {
      available: ayahs.length > 0,
      message: ayahs.length ? null : "No passage data in seed.",
      source: "Hand-curated seed + open Quran text (Pickthall PD; Uthmani reference via Tanzil)",
      translation_base: "Marmaduke Pickthall (1930, public domain)",
      translation_label: "English of these verses",
      arabic_base: STANDARD_RASM_LABEL,
      corpus_coranicum_url: m.corpus_coranicum_url,
      library_url: m.library_url,
      total_ayahs: ayahs.length,
      difference_count,
      initial_ayahs: ayahs,
      attribution:
        "Arabic reference: Tanzil.net / King Fahd complex (see tanzil.net license). English: Pickthall 1930 (PD). Catalog: Corpus Coranicum (CC BY 4.0).",
    };
  }

  const withImages = witnesses.filter(
    (w) => w.hosted_image || w.iiif_image_url
  ).length;
  const header = `/**
 * Generated ${new Date().toISOString().split("T")[0]} from scripts/quran-seed.json
 * Window: 1–100 AH (≈622–719 CE overlap). ${witnesses.length} witnesses, ${withImages} with Commons or IIIF leaf images.
 * Regenerate: node scripts/build-quran-data.mjs
 */
`;

  writeFileSync(
    join(OUT, "quran-witnesses.ts"),
    `${header}
import type { Witness } from "@/types/witness";

export const QURAN_TIMELINE_START = 610;
export const QURAN_TIMELINE_END = 720;
export const QURAN_AH_START = 1;
export const QURAN_AH_END = 100;

export const quranWitnesses: Witness[] = ${JSON.stringify(witnesses, null, 2)};

export function getQuranWitnessesForYear(year: number): Witness[] {
  return quranWitnesses.filter((w) => w.date_start <= year && w.date_end >= year);
}

export function getQuranWitnessById(id: string): Witness | undefined {
  return quranWitnesses.find((w) => w.id === id || w.ga_number === id);
}
`
  );

  writeFileSync(
    join(OUT, "quran-texts.json"),
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        sources: {
          pickthall: PICKTHALL_URL,
          arabic_reference: ARABIC_URL,
          seed: "scripts/quran-seed.json",
          corpus_coranicum: "https://corpuscoranicum.org/ (CC BY 4.0 metadata)",
        },
        texts,
      },
      null,
      2
    )
  );

  console.log(
    `Wrote ${witnesses.length} Quran witnesses (${withImages} images), ${Object.keys(texts).length} text bundles`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
