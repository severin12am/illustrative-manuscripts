#!/usr/bin/env node
/**
 * Builds witness dataset from cached INTF Liste export + optional per-manuscript cache.
 * Live NTVMR API used when available; falls back to scripts/cache/liste.json.
 */

import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
} from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CACHE = join(__dirname, "cache");
const OUT = join(__dirname, "../src/data");
const WINDOW = [1, 300];

const LISTE_LIVE =
  "https://ntvmr.uni-muenster.de/community/vmr/api/metadata/liste/search/?docID=10000-19999&format=json&detail=document&limit=500";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "IllustrativeManuscripts/1.0" },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

function loadListe() {
  const cached = join(CACHE, "liste.json");
  if (existsSync(cached)) {
    console.log("Using cached liste.json");
    return JSON.parse(readFileSync(cached, "utf8"));
  }
  throw new Error("No liste cache; run with network to fetch.");
}

function loadManuscriptCache(docID) {
  const p = join(CACHE, `manuscript-${docID}.json`);
  if (!existsSync(p)) return null;
  try {
    const raw = JSON.parse(readFileSync(p, "utf8"));
    if (raw?.data?.manuscript) return raw.data.manuscript;
  } catch {
    return null;
  }
  return null;
}

function overlaps(early, late) {
  return early <= WINDOW[1] && late >= WINDOW[0];
}

function bookCategory(contents) {
  const c = contents.toLowerCase();
  if (/matthew|mark|luke|john|\bj\b/i.test(c)) return "gospels";
  if (
    /rom|cor|gal|eph|phil|col|thess|tim|titus|philem|heb/i.test(c)
  )
    return "paul";
  return "other";
}

function shelves(raw) {
  if (!raw?.shelfInstance) return [];
  return Array.isArray(raw.shelfInstance)
    ? raw.shelfInstance
    : [raw.shelfInstance];
}

function pages(raw) {
  const p = raw?.pages?.page;
  if (!p) return [];
  return Array.isArray(p) ? p : [p];
}

function buildContents(ps, overview) {
  const refs = ps.map((p) => p.indexContent || p.biblicalContent).filter(Boolean);
  return refs.length ? refs.join("; ") : overview || "See NTVMR workspace for indexed content";
}

function inferFind(shelf, inst) {
  const s = `${shelf || ""} ${inst || ""}`;
  if (/Oxy|P\. Oxy/i.test(s)) return "Oxyrhynchus, Egypt";
  if (/Bodmer|Dishna|Geneva|Köln/i.test(s)) return "Dishna (near Nag Hammadi), Egypt";
  if (/Chester Beatty|Beatty/i.test(s)) return "Egypt (Chester Beatty collection)";
  if (/Rylands|Gr\. P\./i.test(s)) return "Egypt (exact site unknown)";
  if (/Michigan|P\.Mich/i.test(s)) return "Egypt (University of Michigan collection)";
  return "Egypt (provenance uncertain — verify in Liste)";
}

const VARIANTS = {
  P52: [
    {
      locus: "John 18:31–33",
      witness_reading: "Extant text agrees with Alexandrian tradition where readable",
      modern_reading: "SBLGNT / SR GNT",
      significance:
        "Earliest Johannine fragment. Roberts c. 125 CE; Nongbri and others argue for a wider II–IV range.",
      base_text: "SR GNT (CNTR)",
    },
  ],
  P66: [
    {
      locus: "John 7:53–8:11",
      witness_reading: "Pericope adulterae absent",
      modern_reading: "Bracketed/omitted in SBLGNT",
      significance: "Confirms absence in early John papyri.",
      base_text: "SBLGNT",
    },
  ],
  P75: [
    {
      locus: "Text-type",
      witness_reading: "Close to Codex Vaticanus (B)",
      modern_reading: "Alexandrian (SBLGNT)",
      significance: "Early B–P75 cluster.",
      base_text: "SBLGNT",
    },
  ],
  P46: [
    {
      locus: "Pauline order",
      witness_reading: "Hebrews after Romans",
      modern_reading: "Modern canon differs",
      significance: "Fluid collection order in antiquity.",
      base_text: "SBLGNT",
    },
  ],
  P45: [
    {
      locus: "Mark 16:9–20",
      witness_reading: "Longer ending absent in extant leaves",
      modern_reading: "Secondary in SBLGNT",
      significance: "Chester Beatty witness for short Mark ending.",
      base_text: "SBLGNT",
    },
  ],
  P104: [
    {
      locus: "Matt 21:44",
      witness_reading: "Verse absent after 21:43 on verso",
      modern_reading: "Present in SBLGNT",
      significance: "Debated omission vs. fragment edge.",
      base_text: "SBLGNT",
    },
  ],
};

const TRANSLATIONS = {
  P52: '"Pilate said to him, Art thou the King of the Jews?" (John 18:33, KJV)',
  P66: '"In the beginning was the Word." (John 1:1, KJV)',
  P75: '"Father, into thy hands I commend my spirit." (Luke 23:46, KJV)',
  P46: '"Neither death, nor life… shall be able to separate us from the love of God." (Rom 8:38–39, KJV)',
  P90: '"My kingdom is not of this world." (John 18:36, KJV)',
  P104: '"The kingdom of God shall be taken from you." (Matt 21:43, KJV)',
};

function witnessFromListe(doc, detail) {
  const ga = doc.gaNum || doc.primaryName;
  const docID = doc.docID;
  const shelves_ = detail ? shelves(detail.shelfInstances) : [];
  const primary = shelves_[0] || {};
  const inst = primary.institution || {};
  const ps = detail ? pages(detail) : [];
  const contents = detail
    ? buildContents(ps, primary.contentOverview || detail.contentOverview)
    : "See NTVMR workspace for indexed content";
  const imagePage = ps.find((p) => p.images?.image?.viewURL);

  return {
    id: ga.toLowerCase(),
    ga_number: ga,
    traditional_name: `${ga} (Gregory-Aland)`,
    aliases: [ga, `𝔓${ga.replace(/^P/, "")}`],
    corpus: "nt",
    book_category: bookCategory(contents),
    language: "Greek",
    material: "papyrus",
    contents,
    date_start: detail?.originYear?.early ?? doc.origEarly,
    date_end: detail?.originYear?.late ?? doc.origLate,
    date_label: detail?.originYear?.content ?? doc.orig,
    date_note:
      ga === "P52"
        ? "Liste: II (M), 125–175 CE. Roberts proposed c. 125 CE; Nongbri and others argue the range could extend later."
        : `INTF Liste: ${detail?.originYear?.content ?? doc.orig} (${detail?.originYear?.early ?? doc.origEarly}–${detail?.originYear?.late ?? doc.origLate} CE). Paleographic range.`,
    dating_method: "paleography",
    dating_source: "INTF Kurzgefasste Liste via NTVMR",
    find_place: inferFind(primary.shelfNumber, inst.name),
    find_year_or_note: "See Liste bibliography",
    current_institution: inst.name || "See NTVMR Liste",
    current_shelfmark: primary.shelfNumber || "",
    image_policy: "link_only",
    hosted_image: null,
    image_attribution: null,
    source_page_url:
      imagePage?.images?.image?.viewURL ||
      `https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=${docID}`,
    ntvmr_url: `https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=${docID}`,
    csntm_url: `https://manuscripts.csntm.org/manuscript/Group/GA_${ga}`,
    cntr_url: `https://greekcntr.org/manuscripts/${ga}`,
    docID,
    translation:
      TRANSLATIONS[ga] ||
      `Indexed passage: ${contents.split(";")[0]}. (KJV available for NT verses.)`,
    modern_base_text: "SBLGNT / SR GNT (CNTR, CC BY 4.0)",
    known_variants: VARIANTS[ga] || [],
    bibliography: [
      {
        title: `INTF Liste — ${ga}`,
        url: `https://ntvmr.uni-muenster.de/liste/?gaNum=${ga}`,
        note: "Kurzgefasste Liste",
      },
      {
        title: `NTVMR — ${ga}`,
        url: `https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=${docID}`,
      },
    ],
    license_note:
      "Metadata from INTF Liste (cite INTF). Photos © holding institutions unless a Commons image is shown.",
  };
}

function attachCommonsImages(witnesses) {
  const mapPath = join(__dirname, "commons-images.json");
  const attrDir = join(__dirname, "../public/witnesses");
  if (!existsSync(mapPath)) return witnesses;
  const map = JSON.parse(readFileSync(mapPath, "utf8"));
  delete map._comment;

  return witnesses.map((w) => {
    const entry = map[w.ga_number];
    if (!entry) return w;
    const attrPath = join(attrDir, `${entry.file}.attribution.json`);
    const imgPath = join(attrDir, entry.file);
    if (!existsSync(imgPath)) return w;
    let attr = null;
    if (existsSync(attrPath)) {
      attr = JSON.parse(readFileSync(attrPath, "utf8"));
    }
    return {
      ...w,
      image_policy: "hosted",
      hosted_image: `/witnesses/${entry.file}`,
      image_attribution: attr,
      commons_url: entry.commons_url,
    };
  });
}

async function maybeRefreshCache() {
  mkdirSync(CACHE, { recursive: true });
  try {
    const live = await fetchJson(LISTE_LIVE);
    writeFileSync(join(CACHE, "liste.json"), JSON.stringify(live, null, 2));
    console.log("Refreshed liste cache from API");
  } catch {
    console.log("Live Liste API unavailable — using existing cache");
  }

  const liste = loadListe();
  let docs = liste.data.manuscripts.manuscript;
  if (!Array.isArray(docs)) docs = [docs];
  const inWindow = docs.filter((d) => overlaps(d.origEarly, d.origLate));

  for (const doc of inWindow) {
    const cacheFile = join(CACHE, `manuscript-${doc.docID}.json`);
    if (existsSync(cacheFile)) continue;
    try {
      await sleep(1500);
      const url = `https://ntvmr.uni-muenster.de/community/vmr/api/metadata/manuscript/get/?docID=${doc.docID}&format=json`;
      const data = await fetchJson(url);
      writeFileSync(cacheFile, JSON.stringify(data, null, 2));
      console.log(`Cached ${doc.primaryName}`);
    } catch {
      // stop hammering if blocked
      break;
    }
  }
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  await maybeRefreshCache();

  const liste = loadListe();
  let docs = liste.data.manuscripts.manuscript;
  if (!Array.isArray(docs)) docs = [docs];

  let witnesses = docs
    .filter((d) => overlaps(d.origEarly, d.origLate))
    .sort(
      (a, b) =>
        a.origEarly - b.origEarly ||
        a.primaryName.localeCompare(b.primaryName)
    )
    .map((doc) => {
      const detail = loadManuscriptCache(doc.docID);
      return witnessFromListe(doc, detail);
    });

  witnesses = attachCommonsImages(witnesses);

  const withImages = witnesses.filter((w) => w.hosted_image).length;
  const header = `/**
 * Generated ${new Date().toISOString().split("T")[0]} from INTF Liste (cached) + NTVMR manuscript cache.
 * Window: ${WINDOW[0]}–${WINDOW[1]} CE overlap. ${witnesses.length} witnesses, ${withImages} with Commons images.
 * Regenerate: node scripts/generate-data.mjs
 */
`;

  writeFileSync(
    join(OUT, "witnesses.ts"),
    `${header}
import type { Witness } from "@/types/witness";

export const TIMELINE_START = ${WINDOW[0]};
export const TIMELINE_END = ${WINDOW[1]};

export const witnesses: Witness[] = ${JSON.stringify(witnesses, null, 2)};

export function getWitnessesForYear(year: number): Witness[] {
  return witnesses.filter((w) => w.date_start <= year && w.date_end >= year);
}

export function getWitnessById(id: string): Witness | undefined {
  return witnesses.find((w) => w.id === id || w.ga_number.toLowerCase() === id.toLowerCase());
}
`
  );

  writeFileSync(
    join(OUT, "witnesses.json"),
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        window: WINDOW,
        count: witnesses.length,
        with_commons_images: withImages,
        source: "INTF NTVMR Liste (cached)",
        witnesses,
      },
      null,
      2
    )
  );

  const cached = readdirSync(CACHE).filter((f) => f.startsWith("manuscript-")).length;
  console.log(
    `Wrote ${witnesses.length} witnesses (${withImages} images, ${cached} manuscript cache files)`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
