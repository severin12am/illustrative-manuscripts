#!/usr/bin/env node
/**
 * Builds Hebrew Bible / LXX witness metadata + text panels from hand-curated seed.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "src/data");
const SEED = join(__dirname, "hebrew-lxx-seed.json");

mkdirSync(OUT, { recursive: true });

function seedToWitness(m) {
  const isHebrew = m.tradition === "hebrew";
  const imagePolicy =
    m.image?.policy === "iiif"
      ? "iiif"
      : m.commons_key
        ? "hosted"
        : m.image?.policy === "link_only"
          ? "link_only"
          : "link_only";

  const hostedImage = m.commons_key
    ? `/witnesses/${m.commons_key}.jpg`
    : null;

  const attr = m.image?.attribution || null;
  const commonsUrl = attr?.commons_url || m.image?.viewer_url;

  return {
    id: m.id,
    ga_number: m.catalog_id,
    traditional_name: m.traditional_name,
    aliases: [m.catalog_id, m.rahlfs ? `Rahlfs ${m.rahlfs}` : null].filter(
      Boolean
    ),
    corpus: isHebrew ? "ot" : "lxx",
    book_category: "other",
    language: m.language,
    material: m.material || "papyrus",
    contents: m.contents,
    date_start: m.date_ce_start,
    date_end: m.date_ce_end,
    date_label: m.date_label,
    date_note: m.date_note,
    dating_method: m.dating_method,
    dating_source: m.dating_source,
    find_place: m.find_place,
    find_year_or_note: m.find_year_note || "",
    current_institution: m.current_institution,
    current_shelfmark: m.current_shelfmark,
    image_policy: imagePolicy,
    image_source: m.commons_key ? "commons" : m.image?.policy === "iiif" ? "iiif" : undefined,
    hosted_image: hostedImage,
    iiif_manifest: m.image?.iiif_manifest || undefined,
    iiif_image_url: m.image?.iiif_image_url || undefined,
    image_attribution: attr,
    commons_url: commonsUrl?.includes("commons.wikimedia.org") ? commonsUrl : undefined,
    source_page_url: m.image?.viewer_url || m.leon_levy_url || m.library_url,
    library_url: m.leon_levy_url || m.library_url,
    ntvmr_url: m.library_url,
    docID: 0,
    translation: "Display English excerpts on each card — World English Bible (PD)",
    modern_base_text: "No BHQ/NA apparatus — diplomatic excerpts only where openly licensed",
    known_variants: [],
    bibliography: m.bibliography || [],
    license_note: isHebrew
      ? "Hebrew Bible DSS. Images © IAA/Israel Museum unless a Commons PD plate is shown. Leon Levy DSS Digital Library linked, not rehosted."
      : "Greek Septuagint papyri. PD facsimile plates from Commons where noted; otherwise link to holding library.",
  };
}

function passageToUnits(passage, m) {
  const isHebrew = m.tradition === "hebrew";
  return {
    reference: passage.reference,
    tradition: m.tradition,
    original: passage.original || null,
    original_label:
      passage.original_label ||
      (isHebrew
        ? "Hebrew diplomatic text of lines on this leaf"
        : "Greek uncial text of lines on this fragment"),
    original_source: passage.original_source || m.dating_source,
    english: passage.english || "",
    english_label: passage.english_label || "English of these lines",
    english_source: passage.english_source || "World English Bible (PD)",
    note: passage.note || undefined,
  };
}

function main() {
  const seed = JSON.parse(readFileSync(SEED, "utf8"));
  const window = seed._meta?.window_ce || [-250, 400];

  const witnesses = seed.manuscripts.map(seedToWitness);
  const texts = {};

  for (const m of seed.manuscripts) {
    const passages = m.passages || [];
    const units = passages.map((p) => passageToUnits(p, m));
    texts[m.id] = {
      available: units.length > 0 && units.some((u) => u.english || u.original),
      message: units.length ? null : "No passage data in seed.",
      source: "Hand-curated seed + PD facsimile diplomatic excerpts",
      translation_base: "World English Bible (PD)",
      translation_label: "English of these lines",
      original_base: m.tradition === "hebrew" ? "Hebrew consonantal display" : "Greek uncial display",
      library_url: m.library_url,
      leon_levy_url: m.leon_levy_url,
      rahlfs: m.rahlfs,
      total_units: units.length,
      initial_units: units,
      attribution:
        m.tradition === "hebrew"
          ? "Hebrew display consonants for the shown locus; compare Leon Levy DSS Digital Library plates. English: WEB (PD). Not a BHQ apparatus reuse."
          : "Greek diplomatic excerpts from PD editio princeps plates where noted. English: WEB (PD). Not a Rahlfs/Göttingen apparatus dump.",
    };
  }

  const withImages = witnesses.filter(
    (w) => w.hosted_image || w.iiif_image_url
  ).length;

  const windowLabel =
    window[0] < 0
      ? `${Math.abs(window[0])} BCE–${window[1]} CE`
      : `${window[0]}–${window[1]} CE`;

  const header = `/**
 * Generated ${new Date().toISOString().split("T")[0]} from scripts/hebrew-lxx-seed.json
 * Window: ${windowLabel}. ${witnesses.length} witnesses (${witnesses.filter((w) => w.corpus === "ot").length} Hebrew DSS + ${witnesses.filter((w) => w.corpus === "lxx").length} Greek LXX), ${withImages} with Commons leaf images.
 * Regenerate: node scripts/build-hebrew-lxx-data.mjs
 */
`;

  writeFileSync(
    join(OUT, "hebrew-lxx-witnesses.ts"),
    `${header}
import type { Witness } from "@/types/witness";

export const HEBREW_LXX_TIMELINE_START = ${window[0]};
export const HEBREW_LXX_TIMELINE_END = ${window[1]};

export const hebrewLxxWitnesses: Witness[] = ${JSON.stringify(witnesses, null, 2)};

export function getHebrewLxxWitnessesForYear(year: number): Witness[] {
  return hebrewLxxWitnesses.filter((w) => w.date_start <= year && w.date_end >= year);
}

export function getHebrewLxxWitnessById(id: string): Witness | undefined {
  return hebrewLxxWitnesses.find((w) => w.id === id || w.ga_number === id);
}
`
  );

  writeFileSync(
    join(OUT, "hebrew-lxx-texts.json"),
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        sources: {
          seed: "scripts/hebrew-lxx-seed.json",
          leon_levy: "https://www.deadseascrolls.org.il/ (link only)",
          web: "World English Bible (PD)",
          rahlfs: "https://septuaginta.uni-goettingen.de/",
        },
        texts,
      },
      null,
      2
    )
  );

  console.log(
    `Wrote ${witnesses.length} Hebrew/LXX witnesses (${withImages} images), ${Object.keys(texts).length} text bundles`
  );
}

main();
