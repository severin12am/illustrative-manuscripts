#!/usr/bin/env node
/** Downloads Wikimedia Commons images for Quran witnesses. */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAP = JSON.parse(
  readFileSync(join(__dirname, "quran-commons-images.json"), "utf8")
);
const OUT = join(__dirname, "../public/witnesses");
mkdirSync(OUT, { recursive: true });

const UA =
  "IllustrativeManuscripts/1.0 (educational; github.com/severin12am/illustrative-manuscripts)";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function stripHtml(s) {
  return (s || "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
}

async function getCommonsInfo(title) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    titles: title,
    prop: "imageinfo",
    iiprop: "url|extmetadata|size|mime",
    iiurlwidth: "1400",
  });
  const res = await fetch(
    `https://commons.wikimedia.org/w/api.php?${params}`,
    { headers: { "User-Agent": UA } }
  );
  const data = await res.json();
  const page = Object.values(data.query.pages)[0];
  if (!page.imageinfo) return null;
  const ii = page.imageinfo[0];
  const meta = ii.extmetadata || {};
  return {
    downloadUrl: ii.url,
    license: stripHtml(meta.LicenseShortName?.value),
    licenseUrl: stripHtml(meta.LicenseUrl?.value),
    artist: stripHtml(meta.Artist?.value).slice(0, 500),
    credit: stripHtml(meta.Credit?.value).slice(0, 500),
  };
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  delete MAP._comment;
  for (const [id, entry] of Object.entries(MAP)) {
    const dest = join(OUT, entry.file);
    const attrDest = `${dest}.attribution.json`;
    if (existsSync(dest) && existsSync(attrDest)) {
      console.log(`SKIP ${id}`);
      continue;
    }
    try {
      const info = await getCommonsInfo(entry.commons_title);
      if (!info?.downloadUrl) {
        console.log(`MISS ${id}`);
        continue;
      }
      const size = await download(info.downloadUrl, dest);
      writeFileSync(
        attrDest,
        JSON.stringify(
          {
            ga: id,
            file: entry.file,
            commons_title: entry.commons_title,
            commons_url: entry.commons_url,
            license: info.license,
            license_url: info.licenseUrl,
            artist: info.artist,
            credit: info.credit,
            attribution_required: true,
          },
          null,
          2
        )
      );
      console.log(`OK ${id} (${(size / 1024).toFixed(0)} KB)`);
    } catch (e) {
      console.log(`ERR ${id}: ${e.message}`);
    }
    await sleep(1500);
  }
}

main();
