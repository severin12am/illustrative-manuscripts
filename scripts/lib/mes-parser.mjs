/**
 * CNTR Manuscript Encoding Specification (MES) → diplomatic display segments
 * https://github.com/Center-for-New-Testament-Restoration/transcriptions
 */

const NS_EXPANSIONS = {
  ιηυ: "Ἰησοῦ",
  ιην: "Ἰησοῦν",
  ιησ: "Ἰησοῦς",
  χυ: "Χριστοῦ",
  χν: "Χριστόν",
  χς: "Χριστός",
  θυ: "Θεοῦ",
  θν: "Θεόν",
  θς: "Θεός",
  πνι: "Πνεῦμα",
  πνα: "Πνεῦμα",
  κυ: "Κυρίου",
  κν: "Κύριον",
  κς: "Κύριος",
};

export function parseMesLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const space = trimmed.indexOf(" ");
  if (space === -1) return null;
  const esn = parseInt(trimmed.slice(0, space), 10);
  const body = trimmed.slice(space + 1);
  return { esn, segments: tokenizeMes(body) };
}

function tokenizeMes(body) {
  const segments = [];
  let i = 0;
  while (i < body.length) {
    const ch = body[i];
    if (ch === "\\" || ch === "|") {
      segments.push({ type: "pagebreak" });
      i++;
      continue;
    }
    if (ch === "/") {
      segments.push({ type: "linebreak" });
      i++;
      continue;
    }
    if (ch === "&" || ch === "*") {
      segments.push({ type: "lacuna", remnant: ch === "*" });
      i++;
      continue;
    }
    if (ch === "^") {
      segments.push({ type: "missing" });
      i++;
      continue;
    }
    if (ch === "%") {
      segments.push({ type: "damaged" });
      i++;
      continue;
    }
    if (ch === "~" || ch === "+") {
      segments.push({ type: "supplied", vid: ch === "+" });
      i++;
      continue;
    }
    if (ch === "=") {
      let j = i + 1;
      while (j < body.length && /[α-ωΑ-Ωa-zA-Z]/.test(body[j])) j++;
      const key = body.slice(i + 1, j).toLowerCase();
      segments.push({
        type: "nomina",
        text: NS_EXPANSIONS[key] || body.slice(i + 1, j),
        raw: body.slice(i + 1, j),
      });
      i = j;
      continue;
    }
    if (ch === "{" || ch === "}" || ch === "[" || ch === "]") {
      i++;
      continue;
    }
    let j = i;
    while (
      j < body.length &&
      !"\\|/&*^%~+={}[]%".includes(body[j])
    ) {
      j++;
    }
    if (j > i) {
      segments.push({ type: "text", text: body.slice(i, j) });
    }
    i = j;
  }
  return segments;
}

export function segmentsToDiplomatic(segments) {
  return segments.map((seg) => {
    switch (seg.type) {
      case "text":
        return { kind: "text", value: seg.text };
      case "nomina":
        return { kind: "text", value: seg.text, nomina: true };
      case "missing":
        return { kind: "missing", value: "·" };
      case "damaged":
        return { kind: "damaged", value: "" };
      case "lacuna":
        return { kind: "lacuna", value: "[...]" };
      case "supplied":
        return { kind: "supplied", value: "", vid: seg.vid };
      case "linebreak":
        return { kind: "linebreak" };
      case "pagebreak":
        return { kind: "pagebreak" };
      default:
        return { kind: "text", value: "" };
    }
  });
}

export function segmentsToPlain(segments) {
  let plain = "";
  let inSupplied = false;
  for (const seg of segments) {
    switch (seg.type) {
      case "text":
        plain += seg.text;
        inSupplied = false;
        break;
      case "nomina":
        plain += seg.text;
        inSupplied = false;
        break;
      case "missing":
        break;
      case "damaged":
        break;
      case "lacuna":
        plain += " ";
        break;
      case "supplied":
        inSupplied = true;
        break;
      case "linebreak":
      case "pagebreak":
        plain += " ";
        break;
      default:
        break;
    }
  }
  return normalizeGreek(plain);
}

export function normalizeGreek(s) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/ς/g, "σ")
    .replace(/[·\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseMesFile(content) {
  const verses = new Map();
  for (const line of content.split("\n")) {
    const parsed = parseMesLine(line);
    if (!parsed) continue;
    const key = parsed.esn;
    if (!verses.has(key)) {
      verses.set(key, []);
    }
    verses.get(key).push(...parsed.segments);
  }
  return verses;
}
