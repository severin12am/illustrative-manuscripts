# Illustrative Manuscripts

A year-by-year timeline of early biblical manuscripts — **Greek NT witnesses (1–400 CE)**, **Qurʾān Hijazi witnesses (1–100 AH)**, and **Nag Hammadi Coptic codices (~300–400 CE)**. Scrub a year to see which paleographic date ranges overlap that moment, with real manuscript photographs where we have legal copies.

**Live site (GitHub Pages):** https://severin12am.github.io/illustrative-manuscripts/

## What this is

### Greek NT (corpus switch)
- **108 Greek NT witnesses** whose INTF Liste date (papyri) or hand-curated uncial seed overlaps **1–400 CE**
- Includes **Codex Sinaiticus (ℵ / 01)** and **Codex Vaticanus (B / 03)** with Commons PD plates
- CNTR diplomatic Greek + WEB English + SR GNT variant strips
- **55** Wikimedia Commons photographs in `/public/witnesses/`

### Qurʾān (corpus switch)
- **15 verified Hijazi / 1st-century AH** witnesses (hand-curated seed; expandable)
- Dual **AH + CE** date ranges on cards; timeline ~610–720 CE with AH tick labels
- Arabic rasm reference (Tanzil Uthmani, diacritics stripped) + **Pickthall 1930** (public domain)
- Catalog spine: [Corpus Coranicum](https://corpuscoranicum.org/) (CC BY 4.0 metadata); library deep links
- **3** Commons-hosted images (Birmingham, Parisino, Sanʿāʾ); others link to holding institutions

### Nag Hammadi (corpus switch)
- **10 tractate witnesses** from Codices I (Jung), II, and III (hand-curated seed)
- Timeline **300–400 CE** — dates the physical codices, not 1945 discovery
- Gospel of Thomas with Coptic Scriptorium diplomatic (CC-BY 4.0) + English excerpts
- **10** Claremont IIIF leaf embeds (no rehosted facsimile scans)
- Non-canonical Gnostic/apocryphal Christian texts — **not** New Testament manuscripts

### Shared
- Honest **date ranges** — not fake point dates
- Corpus switch keeps Qurʾān witnesses out of the NT year-150 view
- **[Variant explorer](https://severin12am.github.io/illustrative-manuscripts/variants/)** — browse counted word-level disagreements vs SR GNT (filter by kind, witness, book)
- **[Witness compare](https://severin12am.github.io/illustrative-manuscripts/compare/)** — side-by-side alignment on shared verses (e.g. P75 vs Vaticanus)
- **[Coverage page](https://severin12am.github.io/illustrative-manuscripts/coverage/)** — Ehrman/Gurry framing, computed totals, and plain-language limits
- **[Cite & learn](https://severin12am.github.io/illustrative-manuscripts/cite/)** — how to cite the site and census, glossary of counts, card layout, Compare/Variants walkthrough, sources, and further reading

## The Ehrman question (one paragraph)

Bart Ehrman’s talking point is that nobody has counted *all* variants across the entire Greek NT tradition (~5,700+ manuscripts). Peter Gurry ([*NTS* 2016](https://doi.org/10.1017/S0028688516000216)) extrapolated ~500,000 distinct readings from ~3% of the text — an estimate, not a census. **This site does not solve that global problem.** It offers a **defined census** of extant-letter disagreements in our CNTR witness slice (1–400 CE papyri + select uncials) vs open SR GNT — countable, browsable, and illustrative. See `/variants` and `/coverage`.

## What this is not

Not a replacement for NTVMR, INTF, or ECM. Not a corpus of high-res library downloads. We **link** institutional viewers; we only **host** images that are clearly PD/CC on Wikimedia Commons.

**Not a census of NT variants.** Our published disagreement total covers witnesses with CNTR transcriptions in this dataset — not ~5,700 Greek manuscripts and not Gurry’s ~500k extrapolation. See [DATA.md](./DATA.md) and `/coverage` for definitions.

Byzantine minuscules and most later uncials are **out of scope** — v1 stops at the 1–400 CE window with two flagship majuscules (01, 03) hand-seeded.

## Legal rule

- **Do not** scrape or rehost CSNTM, NTVMR tiles, Vatican, BL, Manchester, or IAA photographs.
- **Do** use Commons PD-scan files with attribution sidecars (`.attribution.json`).
- **Do** cite INTF for Liste metadata. Code: MIT. Metadata compilation: CC-BY 4.0.

## Run locally

```bash
npm install
npm run data      # NT: regenerate from cached Liste + uncial seed
npm run texts     # NT: CNTR Greek + WEB + SR variant strips
npm run quran     # Qurʾān: build from scripts/quran-seed.json
npm run nag-hammadi  # Nag Hammadi: build from scripts/nag-hammadi-seed.json
npm run images    # NT Commons downloads
npm run quran-images  # Qurʾān Commons downloads
npm run coverage   # recompute src/data/coverage.json (stats for /coverage + home strip)
npm run variant-index  # flat index for /variants explorer (src/data/variant-index.json)
npm run dev       # http://localhost:3000
```

Production static export:

```bash
npm run build     # outputs to out/
npx serve out     # or any static file server
```

For GitHub Pages locally with the correct base path:

```bash
NEXT_PUBLIC_BASE_PATH=/illustrative-manuscripts npm run build
```

## Data

See [DATA.md](./DATA.md) for provenance, API cache notes, variant/disagreement definitions, and which witnesses still lack a Commons image.

See [SOURCES.md](./SOURCES.md) for intended future link-only sources.

## Deploy

Pushes to `main` run `.github/workflows/pages.yml`, which builds with `output: 'export'` and deploys to GitHub Pages.

Enable Pages in repo settings: **Source → GitHub Actions**.

## License

- Code: [MIT](./LICENSE)
- Metadata: CC-BY 4.0
- Manuscript photos: © holding institutions or Commons licensors (see sidecars)
