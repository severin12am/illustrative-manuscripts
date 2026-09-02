#!/usr/bin/env node
/**
 * Builds witness text panels from CNTR transcriptions (CC BY-SA 4.0)
 * and World English Bible (public domain), with SR GNT variant comparison.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  CNTR_BOOKS,
  parseESN,
  formatRef,
  PHOTO_FOCUS,
  MAX_INITIAL_VERSES,
  MAX_LARGE_MSS,
} from "./lib/books.mjs";
import {
  parseMesFile,
  segmentsToDiplomatic,
  segmentsToPlain,
  normalizeGreek,
} from "./lib/mes-parser.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CACHE = join(__dirname, "cache");
const CNTR_BASE =
  "https://raw.githubusercontent.com/Center-for-New-Testament-Restoration/transcriptions/main/class%201";
const WEB_BASE =
  "https://raw.githubusercontent.com/TehShrike/world-english-bible/master/json";
const SR_URL =
  "https://raw.githubusercontent.com/Center-for-New-Testament-Restoration/SR/main/SR.tsv";

const LARGE = new Set(["P46", "P66", "P75", "P45", "P4"]);

mkdirSync(CACHE, { recursive: true });

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

function loadWitnesses() {
  const mod = readFileSync(join(ROOT, "src/data/witnesses.ts"), "utf8");
  const match = mod.match(/export const witnesses: Witness\[\] = (\[[\s\S]*\]);/);
  if (!match) throw new Error("Could not parse witnesses.ts");
  return JSON.parse(match[1]);
}

async function loadWEB(bookWeb) {
  const cachePath = join(CACHE, `web-${bookWeb}.json`);
  if (existsSync(cachePath)) {
    return JSON.parse(readFileSync(cachePath, "utf8"));
  }
  const data = JSON.parse(await fetchText(`${WEB_BASE}/${bookWeb}.json`));
  writeFileSync(cachePath, JSON.stringify(data));
  return data;
}

function getWEBVerse(webData, chapter, verse) {
  const parts = webData
    .filter(
      (x) =>
        x.type === "paragraph text" &&
        x.chapterNumber === chapter &&
        x.verseNumber === verse
    )
    .map((x) => x.value.trim());
  return parts.join("").replace(/\s+/g, " ").trim();
}

async function loadSR() {
  const cachePath = join(CACHE, "sr-gnt.tsv");
  let tsv;
  if (existsSync(cachePath)) {
    tsv = readFileSync(cachePath, "utf8");
  } else {
    tsv = await fetchText(SR_URL);
    writeFileSync(cachePath, tsv);
  }
  const byVerse = new Map();
  for (const line of tsv.split("\n")) {
    if (!line || line.startsWith("Verse")) continue;
    const [esn, , koine] = line.split("\t");
    if (!esn || !koine) continue;
    const key = esn.trim();
    if (!byVerse.has(key)) byVerse.set(key, []);
    byVerse.get(key).push(koine.trim());
  }
  return byVerse;
}

function srVerseText(srByVerse, esn) {
  const words = srByVerse.get(String(esn)) || [];
  return normalizeGreek(words.join(""));
}

function compareTexts(witnessPlain, srPlain) {
  if (!witnessPlain || !srPlain) return { differs: false, note: "" };
  if (witnessPlain === srPlain) return { differs: false, note: "" };
  const wWords = witnessPlain.split(/\s+/).filter(Boolean);
  const sWords = srPlain.split(/\s+/).filter(Boolean);
  if (wWords.join(" ") === sWords.join(" "))
    return { differs: false, note: "" };
  return {
    differs: true,
    witness_reading: witnessPlain.slice(0, 120),
    sr_reading: srPlain.slice(0, 120),
    note: "Reading differs from SR GNT (CNTR) at this verse.",
  };
}

function inFocus(focusRanges, book, chapter, verse) {
  if (!focusRanges?.length) return false;
  return focusRanges.some(
    (r) =>
      r.book === book &&
      r.chapter === chapter &&
      verse >= r.verseStart &&
      verse <= r.verseEnd
  );
}

function buildVerseEntry(esn, segments, srByVerse, webData, bookId) {
  const { book, chapter, verse } = parseESN(esn);
  const diplomatic = segmentsToDiplomatic(segments);
  const plain = segmentsToPlain(segments);
  const srPlain = srVerseText(srByVerse, esn);
  const web =
    webData && CNTR_BOOKS[bookId]
      ? getWEBVerse(webData, chapter, verse)
      : "";
  const cmp = compareTexts(plain, srPlain);

  const lines = [];
  let current = [];
  for (const seg of diplomatic) {
    if (seg.kind === "linebreak" || seg.kind === "pagebreak") {
      if (current.length) lines.push(current);
      current = [];
    } else {
      current.push(seg);
    }
  }
  if (current.length) lines.push(current);

  return {
    reference: formatRef(book, chapter, verse),
    book_id: book,
    chapter,
    verse,
    esn,
    greek: diplomatic,
    greek_lines: lines,
    greek_plain: plain,
    english_web: web,
    english_adapted: web,
    has_variant: cmp.differs,
    variant: cmp.differs
      ? {
          locus: formatRef(book, chapter, verse),
          sr_reading: cmp.sr_reading,
          witness_reading: cmp.witness_reading,
          note: cmp.note,
        }
      : null,
  };
}

async function processWitness(ga, srByVerse) {
  let cntrText;
  try {
    cntrText = await fetchText(`${CNTR_BASE}/${ga}.txt`);
  } catch {
    return {
      available: false,
      message: `CNTR transcription file not available for ${ga}. Running text omitted.`,
      attribution: null,
      initial_verses: [],
      more_verses: [],
    };
  }

  const verseMap = parseMesFile(cntrText);
  const esns = [...verseMap.keys()].sort((a, b) => a - b);
  if (!esns.length) {
    return {
      available: false,
      message: "CNTR file empty or unparseable.",
      attribution: null,
      initial_verses: [],
      more_verses: [],
    };
  }

  const booksNeeded = new Set(
    esns.map((e) => parseESN(e).book).filter((b) => CNTR_BOOKS[b])
  );
  const webCache = {};
  for (const bookId of booksNeeded) {
    const webName = CNTR_BOOKS[bookId].web;
    webCache[bookId] = await loadWEB(webName);
  }

  const allVerses = esns.map((esn) => {
    const bookId = parseESN(esn).book;
    return buildVerseEntry(
      esn,
      verseMap.get(esn),
      srByVerse,
      webCache[bookId],
      bookId
    );
  });

  const focus = PHOTO_FOCUS[ga];
  const maxInitial = LARGE.has(ga) ? MAX_LARGE_MSS : MAX_INITIAL_VERSES;

  let initial;
  let more;
  if (focus?.length) {
    initial = allVerses.filter((v) =>
      inFocus(focus, v.book_id, v.chapter, v.verse)
    );
    more = allVerses.filter((v) => !initial.includes(v));
  } else {
    initial = allVerses.slice(0, maxInitial);
    more = allVerses.slice(maxInitial);
  }

  if (!initial.length) {
    initial = allVerses.slice(0, maxInitial);
    more = allVerses.slice(maxInitial);
  }

  return {
    available: true,
    message: null,
    source: "CNTR electronic transcription (CC BY-SA 4.0)",
    translation_base: "World English Bible (public domain), adapted to this witness where variants affect wording",
    translation_label: "English of this fragment",
    cntr_url: `https://greekcntr.org/manuscripts/${ga}`,
    cntr_file: `${CNTR_BASE}/${ga}.txt`,
    total_verses: allVerses.length,
    initial_verses: initial,
    more_verses: more,
    attribution:
      "Greek: CNTR (Alan Bunning, CC BY-SA 4.0). English: WEB (PD). Collation base: SR GNT (CNTR, CC BY 4.0).",
  };
}

async function main() {
  console.log("Loading SR GNT…");
  const srByVerse = await loadSR();
  const witnesses = loadWitnesses();
  const texts = {};

  for (const w of witnesses) {
    const ga = w.ga_number;
    process.stdout.write(`${ga}… `);
    try {
      texts[ga] = await processWitness(ga, srByVerse);
      console.log(
        texts[ga].available
          ? `${texts[ga].total_verses} verses`
          : "no CNTR"
      );
    } catch (e) {
      console.log(`err: ${e.message}`);
      texts[ga] = {
        available: false,
        message: e.message,
        initial_verses: [],
        more_verses: [],
      };
    }
  }

  const out = {
    generated_at: new Date().toISOString(),
    sources: {
      cntr: "https://github.com/Center-for-New-Testament-Restoration/transcriptions",
      web: "https://github.com/TehShrike/world-english-bible",
      sr: "https://github.com/Center-for-New-Testament-Restoration/SR",
    },
    texts: {},
  };

  const moreDir = join(ROOT, "public/cntr-texts");
  mkdirSync(moreDir, { recursive: true });

  for (const [ga, full] of Object.entries(texts)) {
    const hasMore = full.more_verses?.length > 0;
    out.texts[ga] = {
      available: full.available,
      message: full.message,
      source: full.source,
      translation_base: full.translation_base,
      translation_label: full.translation_label,
      cntr_url: full.cntr_url,
      total_verses: full.total_verses,
      more_count: full.more_verses?.length ?? 0,
      initial_verses: full.initial_verses ?? [],
      attribution: full.attribution,
    };
    if (hasMore) {
      writeFileSync(
        join(moreDir, `${ga}.json`),
        JSON.stringify({ verses: full.more_verses })
      );
    }
  }

  writeFileSync(
    join(ROOT, "src/data/witness-texts.json"),
    JSON.stringify(out, null, 2)
  );
  console.log(`\nWrote witness-texts.json (${Object.keys(texts).length} witnesses)`);
  console.log(`More-verse files in public/cntr-texts/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
