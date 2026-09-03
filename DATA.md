# Data provenance and gaps

## Corpus switch

| Mode | Window | Catalog spine |
|------|--------|---------------|
| Greek NT | 1–300 CE overlap | [INTF Liste](https://ntvmr.uni-muenster.de/liste/) |
| Qurʾān | 1–100 AH (~622–719 CE overlap) | [Corpus Coranicum](https://corpuscoranicum.org/) (hand-curated seed) |

## Qurʾān window: 1–100 AH

Witnesses are included when a published **C14 or paleographic CE range** overlaps `[622, 719]` CE (approx. 1–100 AH), or when an AH range overlaps `[1, 100]`:

- `date_start ≤ 719` AND `date_end ≥ 622` (CE)
- Later **Kufic display mushafs** (8th–9th c. starting after 100 AH) are **out** unless a published range genuinely overlaps.
- **15 witnesses** in `scripts/quran-seed.json` (verify each against Corpus Coranicum before expanding).
- **3/15** Commons images (Birmingham Mingana 1572a, Parisino 328a, Sanʿāʾ DAM 01-27.1).
- Arabic reference text: Tanzil Uthmani via [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api) (diacritics stripped for rasm comparison — see [tanzil.net](https://tanzil.net) license).
- English: **Pickthall 1930** (public domain) via same API.
- **Not** traced facsimiles: cards show standard rasm for verses on each leaf unless a CC transliteration is added to the seed.
- Sanʿāʾ DAM 01-27.1: **one physical manuscript**, upper + lower palimpsest layers — not two fake witnesses.

Regenerate: `node scripts/build-quran-data.mjs`

## Greek NT window: 1–300 CE

Witnesses are included when their **INTF Kurzgefasste Liste** paleographic range overlaps `[1, 300]`:

- `date_start ≤ 300` AND `date_end ≥ 1`
- A papyrus dated III CE (200–299) is fully in-window.
- A papyrus dated IV CE (300–399) appears because year **300** is in both ranges.
- A range starting at 325 CE (e.g. IV (A) 325–399) does **not** overlap `[1, 300]` and is excluded.

**Uncials** (Vaticanus, Sinaiticus, Alexandrinus, etc.) are **not** in this build. The cached Liste export queries Gregory-Aland **papyri** only (`docID` 10000–19999). Sinaiticus (~330 CE) and Alexandrinus (~400 CE) would not qualify on date even if added; Vaticanus (IV, 300–399) overlaps only at year 300 but is not in the papyri cache.

## Sources used

| Layer | Source | License / terms |
|-------|--------|-----------------|
| Dates, GA numbers, docIDs | [INTF Liste](https://ntvmr.uni-muenster.de/liste/) via cached API export | Cite INTF; metadata compilation CC-BY |
| Shelfmarks, contents (partial) | NTVMR `manuscript/get` API when reachable; otherwise Liste + NTVMR workspace links | Cite INTF |
| Variants (subset) | [CNTR](https://greekcntr.org/) transcriptions vs [SBLGNT](https://github.com/LogosBible/SBLGNT) / SR GNT | CC BY-SA / CC BY 4.0 |
| Photographs (hosted) | [Wikimedia Commons](https://commons.wikimedia.org/) PD / CC files only | Per-file `.attribution.json` sidecar |
| Photographs (linked) | NTVMR, CSNTM, holding libraries | © institutions — link only |

We do **not** host NA28/UBS5/BHQ apparatus (Deutsche Bibelgesellschaft copyright).

## Regenerating data

```bash
# Requires network access to ntvmr.uni-muenster.de (falls back to cache)
node scripts/generate-data.mjs

# CNTR transcriptions + WEB + SR GNT collation (NT)
node scripts/build-texts.mjs

# Qurʾān witness + text bundles
node scripts/build-quran-data.mjs

# Download/update Commons images (rate-limited; be patient)
node scripts/download-commons.mjs
node scripts/download-quran-commons.mjs
```

## Running text (CNTR + WEB)

- **Greek:** [CNTR transcriptions](https://github.com/Center-for-New-Testament-Restoration/transcriptions) (CC BY-SA 4.0), parsed from MES format with lacunae (`[...]`), missing letters (`·`), and line breaks preserved.
- **English:** [World English Bible](https://github.com/TehShrike/world-english-bible) (public domain), labeled *English of this fragment* — verse text for the surviving passage, with variant strips vs **SR GNT** (CNTR, CC BY 4.0).
- Large manuscripts (P46, P66, P75, …) ship the **photo-matched passage** first; full CNTR text loads from `public/cntr-texts/{GA}.json` on expand.

### Variant taxonomy (v1 schema)

Each verse may carry zero or more `variants[]` units, ready for later counting and categorization:

| Field | Values / notes |
|-------|----------------|
| `locus` | `book`, `book_id`, `chapter`, `verse`, `reference`; optional `word_start` / `word_end` |
| `witness_reading`, `base_reading` | Token or phrase; base is named via `base_text` (SR GNT) |
| `kind` | `orthography` \| `omission` \| `addition` \| `substitution` \| `transposition` \| `nonsense` \| `harmonization` \| `uncertain` |
| `intention` | `error` \| `likely_intentional` \| `uncertain` — left `uncertain` in automated CNTR collation |
| `source` | `cntr` \| `igntp` \| `manual` |

`scripts/lib/variant-classify.mjs` applies conservative alignment rules only (no LLM batch classification):

- Uses SR GNT **word tokens** (not a concatenated verse blob).
- Compares **extant runs** only (`segmentsToExtantRuns` — supplied `~` text excluded).
- Anchors each run in SR by longest matching substring, then extends with lacuna tolerance.
- Missing context before/after extant letters is **not** scored as omission/substitution.

Fragment verses whose extant letters match the corresponding SR span (allowing lacunae) produce zero variants. UI shows a count line plus per-variant strips with `kind` badge.

Do **not** use NA28, UBS, NIV, ESV, or BHQ text.

Cached Liste export: `scripts/cache/liste.json` (2026-09-02 snapshot; papyri docID 10000–19999).

## NTVMR API access (2026-09-03)

Live Liste refresh was **unavailable** during this build; witness set derived from cached export with overlap filter `[1, 300]`.

**94 witnesses** in-window (was 61 for 1–200). **33 newly added** by expanding to year 300 (mostly IV-band papyri with `origEarly = 300`, plus late-III witnesses P12, P37, P49, P77).

### Commons images (2026-09-03)

**50/94** witnesses have a downloaded Commons image + attribution sidecar. Entries verified in `scripts/commons-images.json`; run `npm run images` to fetch.

Commons files **mapped but not yet downloaded** (Wikimedia rate limit during build): **P77, P81, P86, P110, P120, P126**. Re-run `node scripts/download-commons.mjs` after a cooldown.

### Witnesses without Commons image (45)

All in-window witnesses lacking a hosted image link to NTVMR/CSNTM. Includes P1, P7, P10, P12 (image downloaded but verify), P18, P20, P23, P29, P32, P40, P47, P50, P57, P62, P64, P65, P69, P72, P77, P81, P86, P87, P100, P101, P110, P115, P117, P119, P120, P121, P122, P125, P126, P129, P130, P131, P132, P133, P134, P137, P138, P139, P141, and others — see `witnesses.ts` (`hosted_image: null`).

### CNTR gaps among new witnesses

No CNTR class-1 file (honest unavailable state): **P7, P10, P12, P50, P62** (and pre-existing P16, P65, P78, P80, P103).

### What is still missing for completeness

- [ ] Live Liste API refresh when NTVMR is reachable
- [ ] Per-manuscript `manuscript/get` cache for all 94 docIDs
- [ ] LXX / DSS witnesses overlapping 1–300 CE (P12 Morgan Amherst codex has LXX on verso; not modeled separately)
- [ ] Uncial band from Liste (separate docID query)
- [ ] Remaining Commons downloads (P77, P81, P86, P110, P120, P126)

## Attribution

- **INTF:** Institut für Neutestamentliche Textforschung, Münster — Kurzgefasste Liste
- **CNTR:** Center for New Testament Restoration — transcriptions (CC BY-SA 4.0)
- **SBLGNT:** Society of Biblical Literature — comparison text (CC BY 4.0)
