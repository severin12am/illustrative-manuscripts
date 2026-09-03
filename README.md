# Illustrative Manuscripts

A year-by-year timeline of **Greek New Testament papyri** for the first three centuries CE (**1–300**). Scrub a year to see which witnesses' paleographic date ranges overlap that moment — with real manuscript photographs where we have legal copies.

**Live site (GitHub Pages):** https://severin12am.github.io/illustrative-manuscripts/

## What this is

- **94 Greek NT papyri** whose INTF Liste date overlaps 1–300 CE
- **Original + translation** on every card: CNTR diplomatic Greek beside WEB English of the fragment, with SR GNT variant strips
- **Wikimedia Commons photographs** (PD / CC) for **50** witnesses, shipped in `/public/witnesses/`
- Honest **date ranges** from the [Kurzgefasste Liste](https://ntvmr.uni-muenster.de/liste/) — not fake exact years
- Variant highlights vs open texts ([SBLGNT](https://github.com/LogosBible/SBLGNT), [SR GNT / CNTR](https://greekcntr.org/)) where verified
- Deep links to [NTVMR](https://ntvmr.uni-muenster.de/) and [CSNTM](https://manuscripts.csntm.org/) for institutional scans

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
npm run data      # regenerate from cached Liste (+ live API if reachable)
npm run texts     # CNTR Greek + WEB English + SR variant strips
npm run images    # refresh Commons downloads (slow; rate-limited)
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
