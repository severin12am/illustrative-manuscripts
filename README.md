# Illustrative Manuscripts

A year-by-year timeline of early biblical manuscripts — **Greek NT papyri (1–300 CE)** and **Qurʾān Hijazi witnesses (1–100 AH)**. Scrub a year to see which paleographic date ranges overlap that moment, with real manuscript photographs where we have legal copies.

**Live site (GitHub Pages):** https://severin12am.github.io/illustrative-manuscripts/

## What this is

### Greek NT (corpus switch)
- **94 Greek NT papyri** whose INTF Liste date overlaps 1–300 CE
- CNTR diplomatic Greek + WEB English + SR GNT variant strips
- **50** Wikimedia Commons photographs in `/public/witnesses/`

### Qurʾān (corpus switch)
- **15 verified Hijazi / 1st-century AH** witnesses (hand-curated seed; expandable)
- Dual **AH + CE** date ranges on cards; timeline ~610–720 CE with AH tick labels
- Arabic rasm reference (Tanzil Uthmani, diacritics stripped) + **Pickthall 1930** (public domain)
- Catalog spine: [Corpus Coranicum](https://corpuscoranicum.org/) (CC BY 4.0 metadata); library deep links
- **3** Commons-hosted images (Birmingham, Parisino, Sanʿāʾ); others link to holding institutions

### Shared
- Honest **date ranges** — not fake point dates
- Corpus switch keeps Qurʾān witnesses out of the NT year-150 view

## What this is not

Not a replacement for NTVMR, INTF, or ECM. Not a corpus of high-res library downloads. We **link** institutional viewers; we only **host** images that are clearly PD/CC on Wikimedia Commons.

Major uncials (Vaticanus, Sinaiticus, Alexandrinus) are **not** in this dataset — the cached Liste export covers Gregory-Aland papyri (docID 10000–19999) only.

## Legal rule

- **Do not** scrape or rehost CSNTM, NTVMR tiles, Vatican, BL, Manchester, or IAA photographs.
- **Do** use Commons PD-scan files with attribution sidecars (`.attribution.json`).
- **Do** cite INTF for Liste metadata. Code: MIT. Metadata compilation: CC-BY 4.0.

## Run locally

```bash
npm install
npm run data      # NT: regenerate from cached Liste
npm run texts     # NT: CNTR Greek + WEB + SR variant strips
npm run quran     # Qurʾān: build from scripts/quran-seed.json
npm run images    # NT Commons downloads
npm run quran-images  # Qurʾān Commons downloads
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

See [DATA.md](./DATA.md) for provenance, API cache notes, and which witnesses still lack a Commons image.

See [SOURCES.md](./SOURCES.md) for intended future link-only sources.

## Deploy

Pushes to `main` run `.github/workflows/pages.yml`, which builds with `output: 'export'` and deploys to GitHub Pages.

Enable Pages in repo settings: **Source → GitHub Actions**.

## License

- Code: [MIT](./LICENSE)
- Metadata: CC-BY 4.0
- Manuscript photos: © holding institutions or Commons licensors (see sidecars)
