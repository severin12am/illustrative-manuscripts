#!/usr/bin/env node
/**
 * Builds Nag Hammadi witness metadata + text panels from hand-curated seed.
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "src/data");
const SEED = join(__dirname, "nag-hammadi-seed.json");

mkdirSync(OUT, { recursive: true });

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
    aliases: [m.catalog_id, m.nhc_siglum].filter(Boolean),
    corpus: "nag-hammadi",
    book_category: "other",
    language: m.language || "Coptic (Sahidic)",
    material: m.material || "papyrus",
    contents: m.contents,
    date_start: m.date_ce_start,
    date_end: m.date_ce_end,
    date_label: m.date_label,
    date_note: m.date_note,
    dating_method: m.dating_method,
    dating_source: m.dating_source,
    find_place: m.find_place,
    find_year_or_note: m.find_year_note || "Discovered December 1945 near Nag Hammadi",
    current_institution: m.current_institution,
    current_shelfmark: m.current_shelfmark,
    tractate: m.tractate,
    nhc_siglum: m.nhc_siglum,
    claremont_url: m.claremont_url,
    image_policy: imagePolicy,
    image_source: m.image?.policy === "iiif" ? "iiif" : m.commons_key ? "commons" : undefined,
    hosted_image: null,
    iiif_manifest: m.image?.iiif_manifest || undefined,
    iiif_image_url: m.image?.iiif_image_url || undefined,
    image_attribution: m.image?.attribution || null,
    source_page_url: m.image?.viewer_url || m.library_url,
    library_url: m.library_url,
    ntvmr_url: m.library_url,
    csntm_url: undefined,
    cntr_url: undefined,
    docID: 0,
    translation: "Display English excerpts on each card — not a full copyrighted critical edition",
    modern_base_text: "No open critical Coptic base text bundled for all tractates in v1",
    known_variants: [],
    bibliography: m.bibliography || [],
    license_note:
      "Non-canonical Coptic Gnostic Christian texts. Images © Claremont/Coptic Museum unless Commons. Coptic Thomas diplomatic via Coptic Scriptorium (CC-BY 4.0) where shown.",
  };
}

function passageToUnits(passage, m) {
  return {
    reference: passage.reference,
    tractate: passage.tractate || m.tractate,
    logion: passage.logion ?? null,
    codex_page: passage.codex_page ?? null,
    coptic: passage.coptic || null,
    coptic_label:
      passage.coptic_label ||
      (passage.coptic ? "Diplomatic Coptic of lines on this leaf" : "Coptic diplomatic text not yet bundled for this tractate in v1"),
    coptic_source: passage.coptic_source || m.dating_source,
    english: passage.english || "",
    english_label: passage.english_label || "English of these lines",
    english_source: passage.english_source || "Display excerpt",
    note: passage.note || undefined,
  };
}

function main() {
  const seed = JSON.parse(readFileSync(SEED, "utf8"));
  const window = seed._meta?.window_ce || [300, 400];

  const witnesses = seed.manuscripts.map(seedToWitness);
  const texts = {};

  for (const m of seed.manuscripts) {
    const passages = m.passages || [];
    const units = passages.map((p) => passageToUnits(p, m));
    texts[m.id] = {
      available: units.length > 0 && units.some((u) => u.english || u.coptic),
      message: units.length ? null : "No passage data in seed.",
      source: "Hand-curated seed + Coptic Scriptorium (Thomas, CC-BY 4.0)",
      translation_base: "Display excerpts — not Robinson/Lambdin/Brill editions",
      translation_label: "English of these lines",
      coptic_base: "Coptic Scriptorium diplomatic where noted (CC-BY 4.0)",
      library_url: m.library_url,
      claremont_url: m.claremont_url,
      total_units: units.length,
      initial_units: units,
      attribution:
        "Coptic diplomatic (Gospel of Thomas): Coptic Scriptorium (CC-BY 4.0). Images: Claremont Nag Hammadi Archive (IIIF embed only). English: short display excerpts, not a dumped modern critical translation.",
    };
  }

  const withImages = witnesses.filter(
    (w) => w.hosted_image || w.iiif_image_url
  ).length;

  const header = `/**
 * Generated ${new Date().toISOString().split("T")[0]} from scripts/nag-hammadi-seed.json
 * Window: ${window[0]}–${window[1]} CE (codex paleography). ${witnesses.length} witnesses, ${withImages} with IIIF leaf images.
 * Regenerate: node scripts/build-nag-hammadi-data.mjs
 */
`;

  writeFileSync(
    join(OUT, "nag-hammadi-witnesses.ts"),
    `${header}
import type { Witness } from "@/types/witness";

export const NAG_HAMMADI_TIMELINE_START = ${window[0]};
export const NAG_HAMMADI_TIMELINE_END = ${window[1]};

export const nagHammadiWitnesses: Witness[] = ${JSON.stringify(witnesses, null, 2)};

export function getNagHammadiWitnessesForYear(year: number): Witness[] {
  return nagHammadiWitnesses.filter((w) => w.date_start <= year && w.date_end >= year);
}

export function getNagHammadiWitnessById(id: string): Witness | undefined {
  return nagHammadiWitnesses.find((w) => w.id === id || w.ga_number === id);
}
`
  );

  writeFileSync(
    join(OUT, "nag-hammadi-texts.json"),
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        sources: {
          seed: "scripts/nag-hammadi-seed.json",
          coptic_scriptorium:
            "https://data.copticscriptorium.org/texts/thomasgospel/ (CC-BY 4.0)",
          claremont: "https://ccdl.claremont.edu/digital/collection/nha/",
        },
        texts,
      },
      null,
      2
    )
  );

  console.log(
    `Wrote ${witnesses.length} Nag Hammadi witnesses (${withImages} images), ${Object.keys(texts).length} text bundles`
  );
}

main();
