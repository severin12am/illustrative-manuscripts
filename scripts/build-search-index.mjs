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

const items = [
  ...ntWitnesses(),
  ...seedWitnesses("scripts/quran-seed.json", "quran", (m) => m.id),
  ...seedWitnesses("scripts/nag-hammadi-seed.json", "nag-hammadi", (m) => m.id),
  ...seedWitnesses("scripts/hebrew-lxx-seed.json", "hebrew-lxx", (m) => m.catalog_id || m.id),
  ...famousEntries(),
  ...claimEntries(),
  ...uthmaniEntries(),
];

const out = {
  generated_at: new Date().toISOString(),
  version: 1,
  counts: {
    witness: items.filter((i) => i.kind === "witness").length,
    famous: items.filter((i) => i.kind === "famous").length,
    claim: items.filter((i) => i.kind === "claim").length,
    uthmani: items.filter((i) => i.kind === "uthmani").length,
    total: items.length,
  },
  items,
};

const dest = join(ROOT, "public/search-index.json");
writeFileSync(dest, JSON.stringify(out));
console.log(
  `Wrote public/search-index.json (${out.counts.total} items: ` +
    `${out.counts.witness} witnesses, ${out.counts.famous} famous, ` +
    `${out.counts.claim} claims, ${out.counts.uthmani} uthmani)`
);
