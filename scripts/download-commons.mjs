#!/usr/bin/env node
/**
 * Downloads Wikimedia Commons images for witnesses.
 * Writes files to public/witnesses/ with .attribution.json sidecars.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAP = JSON.parse(
  readFileSync(join(__dirname, "commons-images.json"), "utf8")
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
  const pages = data.query.pages;
  const page = Object.values(pages)[0];
  if (!page.imageinfo) return null;
  const ii = page.imageinfo[0];
  const meta = ii.extmetadata || {};
  return {
    downloadUrl: ii.url,
    thumbUrl: ii.thumburl,
    width: ii.width,
    height: ii.height,
    mime: ii.mime,
    license: stripHtml(meta.LicenseShortName?.value),
    licenseUrl: stripHtml(meta.LicenseUrl?.value),
    artist: stripHtml(meta.Artist?.value).slice(0, 500),
    credit: stripHtml(meta.Credit?.value).slice(0, 500),
    attribution: stripHtml(meta.Attribution?.value).slice(0, 500),
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
  const results = { ok: [], fail: [] };
  delete MAP._comment;

  for (const [ga, entry] of Object.entries(MAP)) {
    const dest = join(OUT, entry.file);
    const attrDest = `${dest}.attribution.json`;

    if (existsSync(dest) && existsSync(attrDest)) {
      console.log(`SKIP ${ga} (exists)`);
      results.ok.push(ga);
      continue;
    }

    try {
      const info = await getCommonsInfo(entry.commons_title);
      if (!info?.downloadUrl) {
        console.log(`MISS ${ga}: ${entry.commons_title}`);
        results.fail.push({ ga, reason: "not found on Commons" });
        continue;
      }

      const ext = extname(new URL(info.downloadUrl).pathname) || ".jpg";
      const finalDest = dest.replace(/\.[^.]+$/, "") + ext;
      const size = await download(info.downloadUrl, finalDest);

      const attribution = {
        ga,
        file: finalDest.split("/").pop(),
        commons_title: entry.commons_title,
        commons_url: entry.commons_url,
        download_url: info.downloadUrl,
        license: info.license,
        license_url: info.licenseUrl,
        artist: info.artist,
        credit: info.credit,
        attribution_required: true,
        note: "Wikimedia Commons file — not the holding library's high-res scan.",
      };
      writeFileSync(attrDest, JSON.stringify(attribution, null, 2));
      // Update entry file name if extension differs
      entry.file = attribution.file;
      console.log(`OK ${ga} → ${attribution.file} (${(size / 1024).toFixed(0)} KB) [${info.license}]`);
      results.ok.push(ga);
    } catch (e) {
      console.log(`ERR ${ga}: ${e.message}`);
      results.fail.push({ ga, reason: e.message });
    }
    await sleep(1200);
  }

  writeFileSync(
    join(OUT, "download-report.json"),
    JSON.stringify(results, null, 2)
  );
  console.log(`\nDone: ${results.ok.length} ok, ${results.fail.length} failed`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
