# Data provenance and gaps

## Corpus switch

| Mode | Window | Catalog spine |
|------|--------|---------------|
| Greek NT | 1–400 CE overlap | [INTF Liste](https://ntvmr.uni-muenster.de/liste/) (papyri) + `scripts/uncial-seed.json` (majuscules) |
| Hebrew / LXX | **250 BCE – 400 CE** (this corpus only; BCE allowed) | `scripts/hebrew-lxx-seed.json` (hand-curated DSS + LXX papyri) |
| Qurʾān | 1–100 AH (~622–719 CE overlap) | [Corpus Coranicum](https://corpuscoranicum.org/) (hand-curated seed) |
| Nag Hammadi | ~300–400 CE overlap (codex paleography) | [Claremont NHA](https://ccdl.claremont.edu/digital/collection/nha/) (hand-curated seed) |

**Greek NT stays 1–400 CE.** The Hebrew/LXX switch uses a wider window (250 BCE – 400 CE) so pre-Christian biblical witnesses (1QIsaᵃ, P.Ryl. 458, P.Fouad 266) appear on the timeline. Many famous DSS are BCE; they are included when their published range overlaps the window or when they are essential to the early written Bible story.

## Hebrew / LXX window: 250 BCE – 400 CE

Witnesses are included when a published **paleographic or C14 CE range** overlaps `[-250, 400]`, or when they are hand-curated as essential early Hebrew Bible / Septuagint witnesses in the seed:

- `date_start ≤ 400` AND `date_end ≥ -250`
- **BCE dates** are shown on this corpus timeline only (negative CE years → “250 BCE” labels).
- **12 witnesses** in `scripts/hebrew-lxx-seed.json` (4 Hebrew DSS + 8 Greek LXX papyri).
- **8/12** witnesses show a leaf photo (Commons PD/CC plates); IAA/Leon Levy restricted photos are **linked**, not rehosted.
- Hebrew diplomatic: display consonants for the shown locus (compare Leon Levy / PD editio princeps plates).
- Greek LXX diplomatic: uncial excerpts from PD facsimile publications (Grenfell & Hunt, Roberts 1936, etc.).
- English: **World English Bible** (public domain) — labeled *English of these lines* for the surviving passage.
- **Not** BHQ apparatus, Rahlfs/Göttingen critical text dumps, or invented transcriptions.

Regenerate: `node scripts/build-hebrew-lxx-data.mjs`

### Hebrew / LXX image coverage (12 witnesses)

| Witness | Tradition | Image source | Notes |
|---------|-----------|--------------|-------|
| 1QIsaᵃ | Hebrew DSS | **Commons** (hosted) | Google Art Project / Israel Museum plate |
| 11QPsᵃ | Hebrew DSS | **Commons** (hosted) | LOC/IAA Psalms Scroll (PDMC) |
| 4QSamᵃ | Hebrew DSS | **None** | Leon Levy DSS Digital Library link only |
| 2Q18 | Hebrew DSS | **None** | Leon Levy link only |
| P.Ryl. 458 | Greek LXX | **Commons** (hosted) | Rahlfs 957; Roberts 1936 plate |
| P.Fouad 266 | Greek LXX | **Commons** (hosted) | Rahlfs 847–848; tetragrammaton plate |
| P.Oxy. 656 | Greek LXX | **Commons** (hosted) | Rahlfs 905; Grenfell & Hunt 1904 plate |
| P.Oxy. 1007 | Greek LXX | **Commons** (hosted) | Rahlfs 907; Hunt 1910 plate |
| CBL BP IV | Greek LXX | **Commons** (hosted) | Rahlfs 961 Genesis |
| CBL BP V | Greek LXX | **Commons** (hosted) | Rahlfs 962 Genesis |
| CBL BP VI | Greek LXX | **None** | Chester Beatty / Michigan — link only |
| P.Vindob. G 39777 | Greek LXX | **None** | ONB Vienna — link only |

Commons files live in `public/witnesses/` with `.attribution.json` sidecars. Run `npm run hebrew-lxx-images` to fetch.

## Qurʾān window: 1–100 AH

Witnesses are included when a published **C14 or paleographic CE range** overlaps `[622, 719]` CE (approx. 1–100 AH), or when an AH range overlaps `[1, 100]`:

- `date_start ≤ 719` AND `date_end ≥ 622` (CE)
- Later **Kufic display mushafs** (8th–9th c. starting after 100 AH) are **out** unless a published range genuinely overlaps.
- **15 witnesses** in `scripts/quran-seed.json` (verify each against Corpus Coranicum before expanding).
- **10/15** witnesses show a leaf photo (3 Wikimedia Commons + 7 official IIIF); remaining gaps documented below.
- Arabic reference text: Tanzil Uthmani via [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api) (diacritics stripped for rasm comparison — see [tanzil.net](https://tanzil.net) license).
- English: **Pickthall 1930** (public domain) via same API.
- **Not** traced facsimiles: cards show standard rasm for verses on each leaf unless a CC transliteration is added to the seed.
- Sanʿāʾ DAM 01-27.1: **one physical manuscript**, upper + lower palimpsest layers — not two fake witnesses.

Regenerate: `node scripts/build-quran-data.mjs`

### Qurʾān image coverage (15 witnesses)

| Witness | Image source | Notes |
|---------|--------------|-------|
| mingana-1572a | **Commons** (hosted) | Birmingham Cadbury press photo |
| parisino-328a | **Commons** (hosted) | BnF Parisino first leaf |
| sanaa-dam-01-27-1 | **Commons** (hosted) | Stanford/Yemen palimpsest plate |
| bl-or-2165 | **IIIF** | BL Digirati `vdc_100104060212` fol. 1r |
| tubingen-ma-vi-165 | **IIIF** | Tübingen OpenDigi Ma VI 165 p01r |
| bnf-arabe-330g | **IIIF** | BnF Gallica `btv1b8415208w` fol. 1 |
| bnf-arabe-331 | **IIIF** | BnF Gallica `btv1b84152099` fol. 1r |
| berlin-wetzstein-1913 | **IIIF** | SBB `PPN618539204` opening leaf |
| vatican-arabo-1605 | **IIIF** | DigiVatLib Vat.ar.1605 fol. 1r |
| leiden-or-14-545b | **IIIF** | Dispersed folio of BnF Arabe 331 codex — Paris fol. 1r shown |
| marcel-17 | **None** | St Petersburg (Marcel 17) — no public IIIF or verified Commons leaf |
| mingana-1572b | **None** | Birmingham 1572b — no separate open image yet |
| gotha-orient-a-409 | **None** | Gotha — no public IIIF/Commons match |
| doha-ms-2007 | **None** | MIA Doha — no public IIIF/Commons match |
| cairo-dar-al-kutub-792 | **None** | Cairo Dar al-Kutub — no public IIIF/Commons match |

IIIF images load via `<img src>` to each library's Image API (no Mirador). Commons files live in `public/witnesses/` with `.attribution.json` sidecars.

## Nag Hammadi window: ~300–400 CE

Witnesses are included when a published **paleographic CE range** for the physical codex overlaps `[300, 400]`:

- `date_start ≤ 400` AND `date_end ≥ 300`
- Cards date the **codex witnesses** (mid 4th c. CE), not speculative composition dates of individual tractates.
- **Discovery** at Jabal al-Tarif was **December 1945** — that is not a writing date.
- **10 tractate witnesses** in `scripts/nag-hammadi-seed.json` (seed, not all 52 Nag Hammadi texts).
- **10/10** show a leaf photo via **Claremont IIIF embed** (no rehosted Brill/Claremont JPGs).
- Coptic diplomatic (Gospel of Thomas logia 1–3): [Coptic Scriptorium](https://data.copticscriptorium.org/texts/thomasgospel/gospel-of-thomas/) (CC-BY 4.0).
- English: short **display excerpts** of the lines shown — not Robinson/Lambdin/Brill critical editions.
- **No variant collation** against modern Thomas critical text in v1 (different corpus from Greek NT SR GNT workflow).

Regenerate: `node scripts/build-nag-hammadi-data.mjs`

### Nag Hammadi image coverage (10 witnesses)

| Witness | Tractate | Image source | Notes |
|---------|----------|--------------|-------|
| nhc-ii-gospel-thomas | Gospel of Thomas | **IIIF** | Codex II p. 40 (Claremont `nha:2877`) |
| nhc-ii-gospel-philip | Gospel of Philip | **IIIF** | Codex II p. 51 (`nha:2842`) |
| nhc-ii-hypostasis-archons | Hypostasis of the Archons | **IIIF** | Codex II p. 86 (`nha:2856`) |
| nhc-ii-origin-world | On the Origin of the World | **IIIF** | Codex II p. 97 (`nha:2911`) |
| nhc-ii-exegesis-soul | Exegesis on the Soul | **IIIF** | Codex II p. 127 (`nha:2901`) |
| nhc-ii-thomas-contender | Book of Thomas the Contender | **IIIF** | Codex II p. 138 (`nha:2862`) |
| nhc-ii-apocryphon-john | Apocryphon of John (short) | **IIIF** | Codex II p. 2 (`nha:2796`) |
| nhc-i-gospel-truth | Gospel of Truth | **IIIF** | Codex I p. 33 (`nha:2723`) |
| nhc-i-apocryphon-james | Apocryphon of James | **IIIF** | Codex I p. 19 (`nha:2761`) |
| nhc-iii-apocryphon-john | Apocryphon of John (long) | **IIIF** | Codex III p. 10 (`nha:2858`) |

Claremont rights: "Physical rights are retained by the institution. Copyright is retained in accordance with U. S. Copyright laws." → **IIIF embed only**, same policy as BnF/BL Qurʾān cards.

### Nag Hammadi text gaps (v1)

- [ ] Full diplomatic Coptic for tractates beyond Gospel of Thomas (open editions needed)
- [ ] PD or CC English aligned line-by-line to diplomatic Coptic for all tractates
- [ ] Codex IV/V witnesses and remaining ~40 tractates
- [ ] Variant notes vs open critical base (if one becomes available under compatible license)
- [ ] Commons-hosted color photos where PD scans exist (Thomas page 32 Coptic Museum plate)

## Greek NT window: 1–400 CE

Witnesses are included when their **INTF Kurzgefasste Liste** paleographic range overlaps `[1, 400]`:

- `date_start ≤ 400` AND `date_end ≥ 1`
- A papyrus dated III CE (200–299) is fully in-window.
- A papyrus dated IV CE (300–399) is fully in-window (not only at year 300).
- A range starting at 401 CE (e.g. V CE) does **not** overlap `[1, 400]` and is excluded.

**Papyri** come from the cached Liste export (Gregory-Aland papyri, `docID` 10000–19999).

**Select uncials** are hand-curated in `scripts/uncial-seed.json` when they overlap the window but are outside the papyri Liste query:

| GA | Name | Date range (CE) | Image |
|----|------|-----------------|-------|
| 01 | Codex Sinaiticus (ℵ) | 325–375 | Commons PD (Lord's Prayer leaf) |
| 03 | Codex Vaticanus (B) | 300–399 | Commons PD (Heb / 2 Thess plate) |

Alexandrinus (02, ~400 CE) and later Byzantine minuscules remain **out of scope** for v1.

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

# Nag Hammadi witness + text bundles
node scripts/build-nag-hammadi-data.mjs

# Hebrew Bible / LXX witness + text bundles
node scripts/build-hebrew-lxx-data.mjs

# Download/update Commons images (rate-limited; be patient)
node scripts/download-commons.mjs
node scripts/download-quran-commons.mjs
node scripts/download-hebrew-lxx-commons.mjs
```

## Running text (CNTR + WEB)

- **Greek:** [CNTR transcriptions](https://github.com/Center-for-New-Testament-Restoration/transcriptions) (CC BY-SA 4.0), parsed from MES format with lacunae (`[...]`), missing letters (`·`), and line breaks preserved.
- **English:** [World English Bible](https://github.com/TehShrike/world-english-bible) (public domain), labeled *English of this fragment* — verse text for the surviving passage, with variant strips vs **SR GNT** (CNTR, CC BY 4.0).
- Large manuscripts (P46, P66, P75, …) ship the **photo-matched passage** first; full CNTR text loads from `public/cntr-texts/{GA}.json` on expand.

### Variant taxonomy (v1 — mechanical, word-aligned)

Each verse may carry zero or more `variants[]` **variation units**, ready for later counting and categorization (Ehrman-style “how many and what kind” at coarse granularity):

| Field | Values / notes |
|-------|----------------|
| `locus` | `book`, `book_id`, `chapter`, `verse`, `reference`; optional `word_start` / `word_end` |
| `witness_reading`, `base_reading` | Word or short phrase in normalized CNTR spelling; base is named via `base_text` (SR GNT) |
| `kind` | `orthography` \| `omission` \| `addition` \| `substitution` \| `transposition` \| `uncertain` |
| `intention` | `error` \| `likely_intentional` \| `uncertain` — left `uncertain` in automated CNTR collation; see **Intentional tagging** below for the optional LLM pass |
| `source` | `cntr` \| `igntp` \| `manual` |

**Kind definitions (v1, no LLM):**

| Kind | Rule |
|------|------|
| `orthography` | Itacism, movable nu, ει/ι, αι/ε, ω/ο, nomina-sacra abbreviation vs plene where letters otherwise match, diacritic/breathing-insensitive spelling |
| `omission` | SR has word(s) the witness lacks in the aligned extant span (witness shorter) |
| `addition` | Witness has word(s) SR lacks (witness longer) |
| `substitution` | Same aligned slot, different lexical content (not explainable as orthography alone) |
| `transposition` | Same multiset of words/letters in different order when detectable cheaply (2–3 word window); otherwise folded into substitution/omission/addition |
| `uncertain` | Alignment too messy to decide |

`scripts/lib/variant-classify.mjs` applies conservative alignment only:

- Uses SR GNT **word tokens** (not a concatenated verse blob).
- Compares **extant runs** only (`segmentsToExtantRuns` — supplied `~` text excluded).
- Anchors each run by exact word matches, then extends with lacuna tolerance inside the span.
- **Missing context** before/after an extant run (fragment edges, lacuna) is **not** scored as omission/substitution.
- Line-break fragments (`πα` + `ριστανετε`) are coalesced when the merge matches an SR word.

Fragment verses whose extant words match the corresponding SR span (allowing lacunae) produce zero variants. UI shows a count line, per-kind breakdown, and per-variant strips with `kind` badge.

### Published disagreement count (site aggregate)

The home stats strip, `/coverage`, and `/variants` show **computed** totals from our data — never hand-typed:

| Metric | Definition |
|--------|------------|
| **Variation units** | Count of `variants[]` units across all stored CNTR verses (`witness-texts.json` + `public/cntr-texts/*.json`), classified by `scripts/lib/variant-classify.mjs` vs **SR GNT**. One unit per word-aligned disagreement in extant runs (spelling-only differences count as `orthography` units). |
| **Extant word tokens** | Greek word tokens in extant (non-supplied) runs across the same verse set. Lacunae and `~` supplied reconstruction excluded. |

Regenerate after changing witness text, classifier, or Liste cache:

```bash
npm run reclassify   # fast: reuse committed CNTR JSON
npm run coverage     # writes src/data/coverage.json
npm run variant-index  # writes src/data/variant-index.json (flat browse index for /variants)
npm run test:classify
```

### Variant explorer index (`/variants`)

`scripts/export-variant-index.mjs` flattens all variation units into `src/data/variant-index.json` for client-side filtering on the static site. Same classifier definitions as coverage; includes orthography. Each entry carries `unit_id`, witness GA, verse ref, book, kind, witness vs SR readings, and CNTR link.

Featured examples (one per major kind) are auto-picked for the home and coverage pages.

### Ehrman / Gurry framing

| Question | Answer on this site |
|----------|---------------------|
| **Ehrman** — has anyone counted all NT variants? | No — not globally. Our `/variants` page counts a **defined slice**: CNTR witnesses 1–400 CE vs SR GNT. |
| **Gurry** — ~500,000 readings? | Cited on `/coverage` with DOI; we do **not** publish that as our number. |
| **This site** | Variation units in `coverage.json` (`greek_nt.disagreements.total`), browsable by kind/witness/book at `/variants`. |
| **Not claimed** | Full tradition census, ECM/NA judgments, intentional tags as settled scholarship. |

Intentional tagging is **experimental / provisional** — demoted on `/coverage` below the taxonomy census.

### Intentional vs error tagging (local LLM — optional, experimental)

**Status: provisional hypotheses only.** This layer is secondary to the mechanical taxonomy census on `/variants` and `/coverage`. Do not present tag counts as scholarship.

After the mechanical taxonomy (substitution / omission / addition / transposition / orthography), a **second pass** tags non-orthography units as likely **scribal error**, **likely intentional** (harmonization, doctrinal/stylistic preference, clarifying expansion — always a *hypothesis*), or **uncertain**.

**Ethics / scope:**

- These labels are **model-assisted teaching hypotheses**, not ECM, NA28, or IGNTP judgments.
- The cloud build and GitHub Pages deploy **never** call LM Studio; CI passes with an empty `src/data/intentional-tags.json`.
- **Orthography is skipped by default** — spelling-only differences rarely need an intentionality label.
- Qwen (or any OpenAI-compatible model) in **LM Studio on your machine** is the intended runner for ongoing tagging.
- **Committed tags (2026-09):** the first 1,000 non-orthography units were tagged in Cursor Cloud Agent passes. **27** early units were model-judged via local LM Studio (`model: uncategorized`). The bulk batch (~973 units) used `scripts/classify-composer-batch.mjs` rule-based heuristics (`model: heuristic-v1`) — **not** per-unit LLM judgment. Only entries with `model: composer-2.5`, `qwen`, or `uncategorized` were model-judged; `heuristic-v1` entries are scholarly hypotheses from mechanical rules. Resume model-judged tagging with `npm run tag-intentional -- --resume` (local Qwen) or cloud-agent `scripts/tag-composer-cloud.mjs`.

**On your machine (SAIP):**

```bash
# 1. Export taggable units (orthography skipped; writes full JSONL + 100-line sample)
npm run export-taggable

# 2. Start LM Studio with Qwen; default API http://127.0.0.1:1234
export LM_MODEL=qwen2.5-7b-instruct   # optional; auto-detects first non-embedding model
export LM_DISABLE_THINKING=1          # optional; Qwen/LM Studio — skip chain-of-thought (harmless on other servers)
export LM_JSON_MODE=1                 # optional; request response_format json_object (LM Studio may honor)
npm run tag-intentional               # all units — use --limit 50 while testing

# Options
npm run tag-intentional -- --limit 100 --resume    # skip already-tagged unit_ids
npm run tag-intentional -- --dry-run --limit 5     # print prompts, no API calls
npm run tag-intentional -- --limit 0             # CLI validation only

# 3. Regenerate coverage stats and commit intentional-tags.json when satisfied
npm run coverage
```

**Files:**

| File | Role |
|------|------|
| `scripts/cache/taggable-units.jsonl` | Full export (~5.4k non-orthography units; gitignored) |
| `scripts/cache/taggable-units.sample.jsonl` | First 100 lines for quick SAIP start (committed) |
| `scripts/tag-intentional.mjs` | POSTs to `LM_BASE_URL` (default `http://127.0.0.1:1234/v1/chat/completions`); reads `message.content` or falls back to `reasoning_content` (Qwen thinking models); `max_tokens` 1024 |
| `scripts/classify-composer-batch.mjs` | Optional rule-based batch tagger for cloud-agent runs (`--limit N --resume`); writes `model: heuristic-v1` |
| `scripts/tag-composer-cloud.mjs` | Cloud-agent per-unit Composer judgment (`--limit N --resume`); writes `model: composer-2.5` |
| `src/data/intentional-tags.json` | Map `unit_id` → `{ label, rationale, confidence, tagged_at, model }` |
| `scripts/fixtures/intentional-gold.json` | ~20 hand-labeled smoke cases (`npm run test:intentional`) |

**Label meanings (tagger output):**

| Label | Meaning |
|-------|---------|
| `error` | Haplography, dittography, leap, nonsense, clear slip |
| `intentional` | Harmonization to parallel, doctrinal/stylistic preference, clarifying expansion (hypothesis) |
| `uncertain` | Cannot tell from the evidence given |

The tagger **never invents tags without a model response** — failed API calls are logged and skipped.

**Do not** cite tagged counts as a census of intentional variants in the NT tradition. Peter J. Gurry ([*NTS* 2016](https://doi.org/10.1017/S0028688516000216); [open accepted manuscript](https://www.repository.cam.ac.uk/bitstreams/fbac7937-110b-48a0-81f5-656677f85d8e/download)) estimates ~500,000 distinct readings in the full Greek NT tradition (excluding spelling and nomina-sacra abbreviation differences) — an extrapolation from ~3% of the text, not a census. No one has counted every reading in every witness. Reuse CNTR, NTVMR, and IGNTP for full critical work.

Do **not** use NA28, UBS, NIV, ESV, or BHQ text.

Cached Liste export: `scripts/cache/liste.json` (2026-09-02 snapshot; papyri docID 10000–19999).

## NTVMR API access (2026-09-03)

Live Liste refresh succeeded during the latest build; witness set derived from cached export with overlap filter `[1, 400]`.

**108 witnesses** in-window (94 at 1–300 CE + **14** additional IV-band papyri + **2** hand-curated uncials 01 and 03).

### Commons images (2026-09-07)

**66/108** witnesses have a downloaded Commons image + attribution sidecar. Majuscule plates: **01** (Sinaiticus Lord's Prayer), **03** (Vaticanus Heb/2 Thess). New papyrus plates this pass: **P1, P18, P20, P23, P29, P32, P40, P47, P86, P110, P120** (all PD/CC from Wikimedia Commons — old print facsimiles or Oxyrhynchus press photos, not CSNTM/NTVMR/Vatican/BL copyrighted scans). Entries verified in `scripts/commons-images.json`; run `npm run images` to fetch.

### Witnesses without Commons image (42)

All in-window witnesses lacking a hosted image link to NTVMR/CSNTM/Vatican/BL viewers. No verified PD/CC Commons plate found yet for: **P7, P21, P50, P51, P54, P56, P57, P62, P64, P65, P69, P72, P82, P85, P87, P88, P93, P94, P99, P100, P101, P105, P112, P115, P117, P119, P121, P122, P125, P127, P129, P130, P131, P132, P133, P134, P135, P137, P138, P139, P140, P141** — see `witnesses.ts` (`hosted_image: null`).

### CNTR gaps among witnesses

No CNTR class-1 file (honest unavailable state): **P7, P10, P12, P16, P50, P54, P56, P62, P65, P78, P80, P99, P103, P105, P112, P127, P140, P93, P94** (and pre-existing gaps). **01** and **03** have full CNTR transcriptions (lazy-loaded overflow in `public/cntr-texts/`).

### What is still missing for completeness

- [ ] Live Liste API refresh when NTVMR is reachable (cache refreshed on last `npm run data`)
- [ ] Per-manuscript `manuscript/get` cache for all docIDs
- [x] LXX / DSS witnesses overlapping 1–400 CE — see Hebrew/LXX corpus (`scripts/hebrew-lxx-seed.json`, 250 BCE – 400 CE timeline)
- [ ] Additional uncials (02 Alexandrinus, 04, etc.) if window expands further
- [ ] Remaining Commons plates for 42 witnesses listed above (no PD/CC match verified yet)

## Attribution

- **INTF:** Institut für Neutestamentliche Textforschung, Münster — Kurzgefasste Liste
- **CNTR:** Center for New Testament Restoration — transcriptions (CC BY-SA 4.0)
- **SBLGNT:** Society of Biblical Literature — comparison text (CC BY 4.0)
