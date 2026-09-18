#!/usr/bin/env node
/**
 * Build public/search-index.json for SiteNav global find.
 * Sources: witnesses (NT JSON + corpus seeds), famous-passages, claims, uthmani variants.
 *
 * Regenerate: npm run search-index
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function readJson(rel) {
  const p = join(ROOT, rel);
  if (!existsSync(p)) {
    console.error(`Missing ${rel}`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(p, "utf8"));
}

function hay(...parts) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function witnessItem({ id, label, subtitle, href, parts }) {
  return { kind: "witness", id, label, subtitle, href, haystack: hay(...parts) };
}

function ntWitnesses() {
  const { witnesses } = readJson("src/data/witnesses.json");
  return witnesses.map((w) =>
    witnessItem({
      id: w.id,
      label: w.traditional_name || w.ga_number,
      subtitle: w.ga_number,
      href: `/?q=${encodeURIComponent(w.ga_number || w.id)}`,
      parts: [
        w.id,
        w.ga_number,
        w.traditional_name,
        w.contents,
        w.current_shelfmark,
        w.current_institution,
        w.find_place,
        ...(w.aliases ?? []),
      ],
    })
  );
}

function seedWitnesses(seedRel, corpus, hrefQ) {
  const { manuscripts } = readJson(seedRel);
  return manuscripts.map((m) =>
    witnessItem({
      id: m.id,
      label: m.traditional_name || m.catalog_id,
      subtitle: m.catalog_id,
      href: `/?corpus=${corpus}&q=${encodeURIComponent(hrefQ(m))}`,
      parts: [
        m.id,
        m.catalog_id,
        m.traditional_name,
        m.contents,
        m.current_shelfmark,
        m.current_institution,
        m.find_place,
        m.tractate,
        m.nhc_siglum,
      ],
    })
  );
}

function famousEntries() {
  const { entries } = readJson("src/data/famous-passages.json");
  return entries.map((e) => ({
    kind: "famous",
    id: e.slug,
    label: e.title,
    subtitle: e.passage_ref,
    href: `/famous/#${e.slug}`,
    haystack: hay(e.title, e.passage_ref, e.slug, e.book, e.passage_ref?.replace(/–/g, "-")),
  }));
}

function claimEntries() {
  const { claims } = readJson("src/data/claims-evidence.json");
  return claims.map((c) => ({
    kind: "claim",
    id: c.id,
    label:
      c.claim.length > 96 ? `${c.claim.slice(0, 93)}…` : c.claim,
    subtitle: c.verdict.replace(/_/g, " "),
    href: `/use/#${c.id}`,
    haystack: hay(c.claim, c.why, c.id, c.verdict),
  }));
}

function variantBookEntries() {
  const index = readJson("src/data/variant-index.json");
  const books = index.books ?? index.by_book?.map((b) => b.book) ?? [];
  return books.map((book) => ({
    kind: "variant",
    id: `book-${book.replace(/\s+/g, "-").toLowerCase()}`,
    label: book,
    subtitle: "Variant census — filter by book",
    href: `/variants/?book=${encodeURIComponent(book)}`,
    haystack: hay(book, "variants variant census greek nt word-level"),
  }));
}

/** Deep links from famous-passage variants_link — not full census rows. */
function variantFamousDeepLinks() {
  const { entries } = readJson("src/data/famous-passages.json");
  const seen = new Set();
  const out = [];
  for (const e of entries) {
    const link = e.variants_link;
    if (!link?.book) continue;
    const params = new URLSearchParams();
    params.set("book", link.book);
    if (link.q) params.set("q", link.q);
    if (link.kind) params.set("kind", link.kind);
    const key = params.toString();
    if (seen.has(key)) continue;
    seen.add(key);
    const label = link.q ? `${link.book} ${link.q}` : link.book;
    out.push({
      kind: "variant",
      id: `near-${e.slug}`,
      label,
      subtitle: `Near ${e.title}`,
      href: `/variants/?${key}`,
      haystack: hay(
        link.book,
        link.q,
        e.title,
        e.passage_ref,
        e.slug,
        "variants"
      ),
    });
  }
  return out;
}

function uthmaniEntries() {
  const { variants } = readJson("src/data/uthmani-regional-variants.json");
  return variants.map((v) => ({
    kind: "uthmani",
    id: v.id,
    label: v.ref,
    subtitle: v.context?.length > 72 ? `${v.context.slice(0, 69)}…` : v.context,
    href: `/quran/uthmani/#${v.id}`,
    haystack: hay(
      v.ref,
      v.context,
      v.id,
      v.surah != null && v.ayah != null ? `${v.surah}:${v.ayah}` : "",
      v.nature,
      v.pattern
    ),
  }));
}

function quranArchetypeEntries() {
  const data = readJson("src/data/quran-shared-orthography.json");
  const page = {
    kind: "quran_archetype",
    id: "quran-archetype-page",
    label: "Shared orthography & written archetype",
    subtitle: "niʿmat allāh matrix (van Putten 2019)",
    href: "/quran/archetype/",
    haystack: hay(
      "niʿmat",
      "ni'mat",
      "nimat",
      "archetype",
      "orthography",
      "shared orthography",
      "grace of god",
      "van putten",
      "uthmanic",
      "written exemplar",
      "written archetype",
      "table 2",
      "quran evidence map",
      "three layers"
    ),
  };
  const rows = (data.rows ?? []).map((r) => ({
    kind: "quran_archetype",
    id: r.id,
    label: r.ref,
    subtitle: "niʿmat spelling row",
    href: `/quran/archetype/#${r.id}`,
    haystack: hay(r.ref, r.id, "niʿmat", "archetype", "orthography", `${r.surah}:${r.ayah}`),
  }));
  return [page, ...rows];
}

function quranReadingsEntry() {
  return {
    kind: "quran_archetype",
    id: "quran-readings-page",
    label: "Rasm vs qirāʾāt vs Ṣanʿāʾ",
    subtitle: "Don't conflate orthography, readings, and palimpsest lower text",
    href: "/quran/readings/",
    haystack: hay(
      "rasm",
      "qiraat",
      "qirāʾāt",
      "qiraat",
      "reading traditions",
      "seven readings",
      "ten readings",
      "sanaa",
      "ṣanʿāʾ",
      "lower text",
      "companion",
      "uthmanic",
      "conflation",
      "claim discipline"
    ),
  };
}

function hebrewLxxEvidenceEntries() {
  const { hebrew_lxx: hl } = readJson("src/data/coverage.json");
  const page = {
    kind: "hebrew_lxx_evidence",
    id: "hebrew-lxx-evidence-page",
    label: "Hebrew Bible & Septuagint evidence map",
    subtitle: "DSS Hebrew · Masoretic Text · LXX",
    href: "/hebrew-lxx/evidence/",
    haystack: hay(
      "hebrew lxx evidence map",
      "three traditions",
      "dead sea scrolls",
      "masoretic text",
      "septuagint",
      "dss",
      "mt",
      "lxx",
      "1qisa",
      "p.ryl",
      "qumran",
      hl.window_label
    ),
  };
  const sections = [
    {
      id: "dss-hebrew",
      label: "Dead Sea Scrolls Hebrew",
      subtitle: "Tradition 1 — Qumran evidence",
      href: "/hebrew-lxx/evidence/#dss",
      haystack: hay("dss qumran 1qisa early hebrew scrolls", "dss hebrew"),
    },
    {
      id: "masoretic-text",
      label: "Masoretic Text (medieval standard)",
      subtitle: "Tradition 2 — MT context",
      href: "/hebrew-lxx/evidence/#mt",
      haystack: hay("masoretic text mt bhs medieval hebrew standard", "mt masoretic"),
    },
    {
      id: "septuagint",
      label: "Septuagint (early Jewish Greek)",
      subtitle: "Tradition 3 — LXX papyri",
      href: "/hebrew-lxx/evidence/#lxx",
      haystack: hay("septuagint lxx p.ryl pryl 458 greek old testament", "lxx septuagint"),
    },
    {
      id: "teach-hebrew-lxx-three",
      label: "Teaching brief: three Hebrew Bible traditions",
      subtitle: "Classroom / debate outline",
      href: "/teach/hebrew-lxx-three-traditions/",
      haystack: hay("teach brief hebrew lxx three traditions debate classroom", "teaching"),
    },
  ].map((s) => ({
    kind: "hebrew_lxx_evidence",
    id: s.id,
    label: s.label,
    subtitle: s.subtitle,
    href: s.href,
    haystack: s.haystack,
  }));
  return [page, ...sections];
}

function siteStatusEntry() {
  return {
    kind: "claim",
    id: "site-status-hub",
    label: "Site status — finish readiness",
    subtitle: "What we can answer, honest limits, per-corpus counts",
    href: "/status/",
    haystack: hay(
      "site status",
      "finish readiness",
      "coverage honesty",
      "what we can answer",
      "cannot claim",
      "liste",
      "variant census",
      "quran uthmani",
      "nag hammadi",
      "hebrew lxx",
      "claim discipline",
      "before outreach"
    ),
  };
}

function nagHammadiEvidenceEntries() {
  const { nag_hammadi: nh } = readJson("src/data/coverage.json");
  const page = {
    kind: "nag_hammadi_evidence",
    id: "nag-hammadi-evidence-page",
    label: "Nag Hammadi evidence map",
    subtitle: "Library · tractates · vs Greek NT",
    href: "/nag-hammadi/evidence/",
    haystack: hay(
      "nag hammadi evidence map",
      "jabal al-tarif",
      "1945",
      "coptic codices",
      "gnostic",
      "gospel of thomas",
      "lost nt books",
      "not new testament",
      nh.tractate_witness_count
    ),
  };
  const sections = [
    {
      id: "nh-library",
      label: "What the Nag Hammadi library is",
      subtitle: "Discovery & codex dating",
      href: "/nag-hammadi/evidence/#library",
      haystack: hay("nag hammadi library 1945 codices fourth century", "library find"),
    },
    {
      id: "nh-not-lost-nt",
      label: "Not lost books of the New Testament",
      subtitle: "Claim discipline",
      href: "/nag-hammadi/evidence/#not-lost-nt",
      haystack: hay("lost books new testament canon gnostic coptic", "not lost nt"),
    },
    {
      id: "nh-vs-greek-nt",
      label: "Nag Hammadi vs Greek NT timeline",
      subtitle: "Genre notes, not collation",
      href: "/nag-hammadi/evidence/#vs-greek-nt",
      haystack: hay("compare greek nt thomas cntr variant census", "vs greek nt"),
    },
    {
      id: "teach-nag-hammadi",
      label: "Teaching brief: Nag Hammadi vs canon",
      subtitle: "Classroom / debate outline",
      href: "/teach/nag-hammadi-vs-canon/",
      haystack: hay("teach brief nag hammadi canon thomas", "teaching"),
    },
  ].map((s) => ({
    kind: "nag_hammadi_evidence",
    id: s.id,
    label: s.label,
    subtitle: s.subtitle,
    href: s.href,
    haystack: s.haystack,
  }));
  return [page, ...sections];
}

const items = [
  ...ntWitnesses(),
  ...seedWitnesses("scripts/quran-seed.json", "quran", (m) => m.id),
  ...seedWitnesses("scripts/nag-hammadi-seed.json", "nag-hammadi", (m) => m.id),
  ...seedWitnesses("scripts/hebrew-lxx-seed.json", "hebrew-lxx", (m) => m.catalog_id || m.id),
  ...famousEntries(),
  ...variantBookEntries(),
  ...variantFamousDeepLinks(),
  ...claimEntries(),
  siteStatusEntry(),
  ...uthmaniEntries(),
  ...quranArchetypeEntries(),
  quranReadingsEntry(),
  ...hebrewLxxEvidenceEntries(),
  ...nagHammadiEvidenceEntries(),
];

const out = {
  generated_at: new Date().toISOString(),
  version: 1,
  counts: {
    witness: items.filter((i) => i.kind === "witness").length,
    famous: items.filter((i) => i.kind === "famous").length,
    variant: items.filter((i) => i.kind === "variant").length,
    claim: items.filter((i) => i.kind === "claim").length,
    uthmani: items.filter((i) => i.kind === "uthmani").length,
    quran_archetype: items.filter((i) => i.kind === "quran_archetype").length,
    hebrew_lxx_evidence: items.filter((i) => i.kind === "hebrew_lxx_evidence").length,
    nag_hammadi_evidence: items.filter((i) => i.kind === "nag_hammadi_evidence").length,
    total: items.length,
  },
  items,
};

const dest = join(ROOT, "public/search-index.json");
writeFileSync(dest, JSON.stringify(out));
console.log(
  `Wrote public/search-index.json (${out.counts.total} items: ` +
    `${out.counts.witness} witnesses, ${out.counts.famous} famous, ` +
    `${out.counts.variant} variants, ${out.counts.claim} claims, ` +
    `${out.counts.uthmani} uthmani, ${out.counts.quran_archetype} quran archetype, ` +
    `${out.counts.hebrew_lxx_evidence} hebrew lxx evidence, ` +
    `${out.counts.nag_hammadi_evidence} nag hammadi evidence)`
);
