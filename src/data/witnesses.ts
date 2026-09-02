import type { Witness } from "@/types/witness";

/**
 * Seed witnesses — metadata compiled from public scholarship.
 * Image links point to institutional pages; no photographs are hosted here.
 */
export const witnesses: Witness[] = [
  {
    id: "ketef-hinnom",
    traditional_name: "Ketef Hinnom Silver Amulets",
    aliases: ["Ketef Hinnom amulets", "KH1", "KH2"],
    corpus: "ot",
    language: "Hebrew",
    material: "inscription",
    contents: "Priestly blessing (Num 6:24–26) on two miniature silver scrolls",
    date_start: -700,
    date_end: -500,
    date_note:
      "Paleographic and epigraphic dating; often cited c. 600–400 BCE. Among the earliest known citations of biblical text.",
    find_place: "Tomb 25, Ketef Hinnom, Jerusalem",
    find_year_or_note: "1979 (excavation season)",
    current_institution: "Israel Museum, Jerusalem",
    current_shelfmark: "Various (two amulets)",
    image_policy: "link_only",
    source_page_url:
      "https://www.imj.org.il/en/collections/378986-0",
    translation:
      '"May the Lord bless you and keep you; may the Lord make his face shine upon you and be gracious to you; may the Lord lift up his countenance upon you and give you peace." (Num 6:24–26, representative wording)',
    modern_base_text: "BHS (Numbers 6)",
    known_variants: [
      {
        locus: "Num 6:26",
        witness_reading: "šālôm (peace) — formula close to MT",
        modern_reading: "MT/BHS agrees in substance",
        significance:
          "Early attestation of the priestly blessing formula; minor orthographic differences from later MT witnesses.",
      },
    ],
    bibliography: [
      {
        title: "Israel Museum — Ketef Hinnom",
        url: "https://www.imj.org.il/en/collections/378986-0",
        note: "Collection record",
      },
      {
        title: "Barkay et al., A Silver Scroll from Ketef Hinnom (IEJ 1986)",
        url: "https://www.jstor.org/stable/27926110",
        note: "Primary publication (paywalled on JSTOR)",
      },
    ],
    license_note:
      "Metadata compiled by this project (CC-BY 4.0). Photographs © Israel Museum — link only.",
  },
  {
    id: "1qisaa",
    traditional_name: "Great Isaiah Scroll (1QIsᵃ)",
    aliases: ["1QIsaa", "Great Isaiah Scroll"],
    corpus: "ot",
    language: "Hebrew",
    material: "parchment",
    contents: "Complete book of Isaiah (all 66 chapters)",
    date_start: -150,
    date_end: -50,
    date_note:
      "Radiocarbon and paleography; commonly dated c. 125–100 BCE (range widened here for uncertainty).",
    find_place: "Cave 1, Qumran, West Bank",
    find_year_or_note: "1947",
    current_institution: "Shrine of the Book, Israel Museum, Jerusalem",
    current_shelfmark: "1QIsᵃ",
    image_policy: "link_only",
    source_page_url:
      "https://www.deadseascrolls.org.il/explore-the-archive/manuscript/1Q1-1",
    transcription_url:
      "https://www.deadseascrolls.org.il/explore-the-archive/manuscript/1Q1-1",
    translation:
      '"The voice of one crying in the wilderness: Prepare the way of the Lord; make straight in the desert a highway for our God." (Isa 40:3, public-domain English rendering)',
    modern_base_text: "BHS (Isaiah)",
    known_variants: [
      {
        locus: "Isa 7:14",
        witness_reading: "עלמה (ʿalmâ, 'young woman')",
        modern_reading: "MT agrees; LXX reads παρθένος",
        significance:
          "Famous locus in textual debates; 1QIsᵃ supports Hebrew ʿalmâ against later Christian readings of LXX παρθένος.",
      },
      {
        locus: "Isa 53:11",
        witness_reading: "Light from suffering / by knowledge (plausible reading)",
        modern_reading: "MT: 'by his knowledge' (בדעתו)",
        significance:
          "Notable variant in the servant song; DSS sometimes preserve alternate traditions.",
      },
    ],
    bibliography: [
      {
        title: "Leon Levy Dead Sea Scrolls Digital Library — 1QIsᵃ",
        url: "https://www.deadseascrolls.org.il/explore-the-archive/manuscript/1Q1-1",
      },
      {
        title: "Ulrich, The Biblical Qumran Scrolls (2010)",
        url: "https://brill.com/display/title/18129",
        note: "Transcriptions and apparatus",
      },
    ],
    license_note:
      "Metadata compiled by this project (CC-BY 4.0). Images © Israel Antiquities Authority / Shrine of the Book — link only.",
  },
  {
    id: "nash-papyrus",
    traditional_name: "Nash Papyrus",
    aliases: ["Nash Papyrus", "Cambridge Nash Papyrus"],
    corpus: "ot",
    language: "Hebrew",
    material: "papyrus",
    contents:
      "Decalogue (Exod 20:2–17) blended with Deut 5:6–21, plus Shema (Deut 6:4–9)",
    date_start: -200,
    date_end: -50,
    date_note:
      "Dating disputed; often placed c. 150–100 BCE but range widened. May be later.",
    find_place: "Egypt (provenance uncertain)",
    find_year_or_note: "1902 (purchased by W. L. Nash)",
    current_institution: "Cambridge University Library",
    current_shelfmark: "O. Nash",
    image_policy: "link_only",
    source_page_url:
      "https://www.lib.cam.ac.uk/collections/departments/manuscripts-university-archives",
    translation:
      '"Hear, O Israel: The Lord our God, the Lord is one. You shall love the Lord your God with all your heart and with all your soul and with all your might." (Deut 6:4–5, representative)',
    modern_base_text: "BHS (Deuteronomy 5–6; Exodus 20)",
    known_variants: [
      {
        locus: "Decalogue order",
        witness_reading: "Follows Deuteronomy's ordering and phrasing",
        modern_reading: "Exodus MT has distinct wording in several commandments",
        significance:
          "Shows harmonization of Exodus and Deuteronomy traditions in Second Temple liturgical use.",
      },
    ],
    bibliography: [
      {
        title: "Cambridge University Library — Manuscripts",
        url: "https://www.lib.cam.ac.uk/collections/departments/manuscripts-university-archives",
        note: "Contact department for Nash Papyrus record",
      },
      {
        title: "Wikipedia — Nash Papyrus",
        url: "https://en.wikipedia.org/wiki/Nash_Papyrus",
        note: "Summary of scholarship and dating debate",
      },
    ],
    license_note:
      "Metadata compiled by this project (CC-BY 4.0). Images © Cambridge University Library — link only.",
  },
  {
    id: "p52",
    traditional_name: "Papyrus 52 (P⁵²)",
    aliases: ["P52", "Rylands Papyrus 457", "𝔓⁵²"],
    corpus: "nt",
    language: "Greek",
    material: "papyrus",
    contents: "John 18:31–33, 37–38 (fragmentary)",
    date_start: 100,
    date_end: 175,
    date_note:
      "Roberts dated c. 100–150 CE; later scholarship often widens to c. 125–175 CE. Range reflects uncertainty.",
    find_place: "Egypt (exact site unknown)",
    find_year_or_note: "1920 (purchased from dealer in Egypt)",
    current_institution: "John Rylands Library, University of Manchester",
    current_shelfmark: "Gr. P. 457",
    image_policy: "link_only",
    source_page_url:
      "https://www.library.manchester.ac.uk/rylands/special-collections/guide-to-special-collections/manuscript-collections/medieval-and-modern-manuscripts/greek-papyri/",
    translation:
      '"Pilate then called Jesus and said to him, Are you the King of the Jews? Jesus answered, Do you say this of your own accord, or did others say it to you about me?" (John 18:33–34, public-domain rendering)',
    modern_base_text: "NA28 (John)",
    known_variants: [
      {
        locus: "John 18:31",
        witness_reading: "Fragment preserves Johannine text without major deviation",
        modern_reading: "NA28 agrees where extant",
        significance:
          "Earliest extant fragment of the Fourth Gospel; supports early circulation of John.",
      },
    ],
    bibliography: [
      {
        title: "John Rylands Library — Greek Papyri",
        url: "https://www.library.manchester.ac.uk/rylands/special-collections/guide-to-special-collections/manuscript-collections/medieval-and-modern-manuscripts/greek-papyri/",
      },
      {
        title: "INTF Liste — P52",
        url: "https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=20052",
        note: "NTVMR workspace entry",
      },
    ],
    license_note:
      "Metadata compiled by this project (CC-BY 4.0). Images © University of Manchester — link only.",
  },
  {
    id: "p66",
    traditional_name: "Papyrus 66 (P⁶⁶)",
    aliases: ["P66", "𝔓⁶⁶", "Bodmer II"],
    corpus: "nt",
    language: "Greek",
    material: "papyrus",
    contents: "Gospel of John (substantially complete; lacunae)",
    date_start: 150,
    date_end: 225,
    date_note: "Commonly dated c. 175–200 CE; range widened.",
    find_place: "Egypt (Dishna, near Nag Hammadi)",
    find_year_or_note: "1952",
    current_institution:
      "Bibliothèque publique et universitaire, Geneva (Cologny-Genève); portions elsewhere",
    current_shelfmark: "Bodmer II",
    image_policy: "link_only",
    source_page_url:
      "https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=20066",
    transcription_url:
      "https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=20066",
    translation:
      '"In the beginning was the Word, and the Word was with God, and the Word was God." (John 1:1, public-domain rendering)',
    modern_base_text: "NA28 (John)",
    known_variants: [
      {
        locus: "John 7:53–8:11",
        witness_reading: "Pericope adulterae absent",
        modern_reading: "Omitted in NA28 apparatus; printed in brackets in some editions",
        significance:
          "Confirms the pericope's absence in early Johannine witnesses.",
      },
      {
        locus: "John 5:4",
        witness_reading: "Angel-troubling-pool verse absent",
        modern_reading: "Omitted in NA28",
        significance: "Early witness against interpolation in John 5.",
      },
    ],
    bibliography: [
      {
        title: "NTVMR — P66",
        url: "https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=20066",
      },
      {
        title: "CSNTM — P66",
        url: "https://manuscripts.csntm.org/manuscript/Group/GA_P66",
        note: "High-resolution images (link only)",
      },
    ],
    license_note:
      "Metadata compiled by this project (CC-BY 4.0). Images © holding institutions — link only.",
  },
  {
    id: "p75",
    traditional_name: "Papyrus 75 (P⁷⁵)",
    aliases: ["P75", "𝔓⁷⁵", "Bodmer XIV–XV"],
    corpus: "nt",
    language: "Greek",
    material: "papyrus",
    contents: "Luke 3:18–24:53; John 1:1–15:26 (extensive)",
    date_start: 175,
    date_end: 250,
    date_note: "Usually dated c. 175–225 CE.",
    find_place: "Egypt (Dishna)",
    find_year_or_note: "1956",
    current_institution: "Biblioteca Apostolica Vaticana",
    current_shelfmark: "Bodmer XIV–XV",
    image_policy: "link_only",
    source_page_url:
      "https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=20075",
    translation:
      '"Father, into your hands I commit my spirit." (Luke 23:46, public-domain rendering)',
    modern_base_text: "NA28 (Luke, John)",
    known_variants: [
      {
        locus: "Luke–John text-type",
        witness_reading: "Close agreement with Codex Vaticanus (B)",
        modern_reading: "Alexandrian text-type",
        significance:
          "Demonstrates early coherence of the 'B-75' textual cluster.",
      },
      {
        locus: "Luke 23:34",
        witness_reading: "Father, forgive them — present",
        modern_reading: "Present in NA28 but omitted by some witnesses",
        significance: "Important variant in the passion narrative.",
      },
    ],
    bibliography: [
      {
        title: "NTVMR — P75",
        url: "https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=20075",
      },
    ],
    license_note:
      "Metadata compiled by this project (CC-BY 4.0). Images © Biblioteca Apostolica Vaticana — link only.",
  },
  {
    id: "p46",
    traditional_name: "Papyrus 46 (P⁴⁶)",
    aliases: ["P46", "𝔓⁴⁶", "Chester Beatty II"],
    corpus: "nt",
    language: "Greek",
    material: "papyrus",
    contents:
      "Pauline epistles (Romans through Hebrews; order differs from modern canon)",
    date_start: 175,
    date_end: 225,
    date_note: "Commonly dated c. 175–225 CE.",
    find_place: "Egypt",
    find_year_or_note: "c. 1930 (Chester Beatty purchase)",
    current_institution:
      "Chester Beatty, Dublin; University of Michigan; other fragments",
    current_shelfmark: "CB II; P.Mich. inv. 6238",
    image_policy: "link_only",
    source_page_url:
      "https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=20046",
    translation:
      '"For I am convinced that neither death nor life… will be able to separate us from the love of God in Christ Jesus our Lord." (Rom 8:38–39, public-domain rendering)',
    modern_base_text: "NA28 (Pauline corpus)",
    known_variants: [
      {
        locus: "Epistle order",
        witness_reading: "Hebrews follows Romans (before Corinthians)",
        modern_reading: "Modern canon places Hebrews after Philemon",
        significance: "Shows fluidity of Pauline collection order in antiquity.",
      },
      {
        locus: "Rom 16:25–27",
        witness_reading: "Doxology at end of ch. 15 in some leaves",
        modern_reading: "NA28 prints at 16:25–27",
        significance: "Textual rearrangement in Pauline manuscripts.",
      },
    ],
    bibliography: [
      {
        title: "NTVMR — P46",
        url: "https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=20046",
      },
      {
        title: "Chester Beatty — Biblical Papyri",
        url: "https://chesterbeatty.ie/collections/biblical-papyri",
      },
    ],
    license_note:
      "Metadata compiled by this project (CC-BY 4.0). Images © Chester Beatty / University of Michigan — link only.",
  },
  {
    id: "codex-vaticanus",
    traditional_name: "Codex Vaticanus (B / 03)",
    aliases: ["Codex Vaticanus", "B", "03", "Vat. gr. 1209"],
    corpus: "nt",
    language: "Greek",
    material: "parchment",
    contents:
      "LXX (partial) + NT (complete except Revelation and some lacunae); lacks much of Genesis–Kings",
    date_start: 300,
    date_end: 350,
    date_note: "Usually dated to 4th century; narrow range c. 300–350 CE.",
    find_place: "Provenance unknown; in Vatican library by 1475",
    find_year_or_note: "Known at Vatican by 1475 catalog",
    current_institution: "Biblioteca Apostolica Vaticana",
    current_shelfmark: "Vat. gr. 1209",
    image_policy: "link_only",
    source_page_url:
      "https://digi.vatlib.it/view/MSS_Vat.gr.1209",
    translation:
      '"In the beginning was the Word, and the Word was with God, and the Word was God." (John 1:1, public-domain rendering)',
    modern_base_text: "NA28 (NT); Rahlfs-Hanhart (LXX portions)",
    known_variants: [
      {
        locus: "Mark 16:9–20",
        witness_reading: "Longer ending absent; blank space after 16:8",
        modern_reading: "Marked as secondary in NA28",
        significance:
          "Famous evidence against the longer ending of Mark.",
      },
      {
        locus: "John 7:53–8:11",
        witness_reading: "Pericope absent",
        modern_reading: "Omitted in NA28",
        significance: "Alexandrian witness against the pericope adulterae.",
      },
    ],
    bibliography: [
      {
        title: "Vatican Digital Library — Vat. gr. 1209",
        url: "https://digi.vatlib.it/view/MSS_Vat.gr.1209",
      },
      {
        title: "INTF Liste — 03",
        url: "https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=30003",
      },
    ],
    license_note:
      "Metadata compiled by this project (CC-BY 4.0). Images © Biblioteca Apostolica Vaticana — link only.",
  },
  {
    id: "codex-sinaiticus",
    traditional_name: "Codex Sinaiticus (א / 01)",
    aliases: ["Codex Sinaiticus", "א", "01", "Sinai Bible"],
    corpus: "nt",
    language: "Greek",
    material: "parchment",
    contents:
      "LXX (substantial) + NT (complete) + Epistle of Barnabas + Shepherd of Hermas (partial)",
    date_start: 330,
    date_end: 380,
    date_note: "Mid-4th century; commonly c. 330–360 CE.",
    find_place: "Saint Catherine's Monastery, Sinai",
    find_year_or_note:
      "Discovered for modern scholarship 1844–1859 (Tischendorf); dispersed leaves",
    current_institution:
      "British Library; Leipzig University Library; Saint Catherine's Monastery; Russian National Library (fragments)",
    current_shelfmark: "Add. 43725 (British Library portion)",
    image_policy: "link_only",
    source_page_url: "https://codexsinaiticus.org/en/",
    transcription_url: "https://codexsinaiticus.org/en/manuscript.aspx",
    translation:
      '"The Spirit of the Lord is upon me, because he has anointed me to proclaim good news to the poor." (Luke 4:18, public-domain rendering)',
    modern_base_text: "NA28 (NT); Rahlfs-Hanhart (LXX portions)",
    known_variants: [
      {
        locus: "Mark 16:9–20",
        witness_reading: "Longer ending absent in original hand",
        modern_reading: "Secondary in NA28",
        significance: "Key witness for the short ending of Mark.",
      },
      {
        locus: "Matt 27:49",
        witness_reading: "Another passage adds spear thrust before death",
        modern_reading: "Absent in NA28 main text",
        significance: "Unique harmonization with John 19:34.",
      },
    ],
    bibliography: [
      {
        title: "Codex Sinaiticus Project",
        url: "https://codexsinaiticus.org/en/",
      },
      {
        title: "British Library — Codex Sinaiticus",
        url: "https://www.bl.uk/collection-items/codex-sinaiticus",
      },
    ],
    license_note:
      "Metadata compiled by this project (CC-BY 4.0). Images © holding institutions — link only.",
  },
  {
    id: "codex-alexandrinus",
    traditional_name: "Codex Alexandrinus (A / 02)",
    aliases: ["Codex Alexandrinus", "A", "02", "Royal MS 1 D VIII"],
    corpus: "nt",
    language: "Greek",
    material: "parchment",
    contents:
      "LXX (mostly complete) + NT (complete) + 1–2 Clement; lacks some OT portions",
    date_start: 400,
    date_end: 450,
    date_note: "Usually dated 5th century; c. 400–440 CE.",
    find_place: "Patriarchal library, Constantinople",
    find_year_or_note:
      "Presented to Charles I of England 1627 (from Cyril Lucaris)",
    current_institution: "British Library",
    current_shelfmark: "Royal MS 1 D VIII",
    image_policy: "link_only",
    source_page_url:
      "https://www.bl.uk/collection-items/codex-alexandrinus",
    translation:
      '"For God so loved the world that he gave his only Son, that whoever believes in him should not perish but have eternal life." (John 3:16, public-domain rendering)',
    modern_base_text: "NA28 (NT); Rahlfs-Hanhart (LXX portions)",
    known_variants: [
      {
        locus: "Mark 16:9–20",
        witness_reading: "Longer ending present",
        modern_reading: "Marked secondary in NA28",
        significance:
          "Byzantine witness including the longer ending of Mark.",
      },
      {
        locus: "John 7:53–8:11",
        witness_reading: "Pericope present",
        modern_reading: "Omitted in NA28",
        significance: "Byzantine inclusion of the pericope adulterae.",
      },
    ],
    bibliography: [
      {
        title: "British Library — Codex Alexandrinus",
        url: "https://www.bl.uk/collection-items/codex-alexandrinus",
      },
      {
        title: "INTF Liste — 02",
        url: "https://ntvmr.uni-muenster.de/manuscript-workspace/?docID=30002",
      },
    ],
    license_note:
      "Metadata compiled by this project (CC-BY 4.0). Images © British Library — link only.",
  },
];

export function getWitnessById(id: string): Witness | undefined {
  return witnesses.find((w) => w.id === id);
}

export function getWitnessesForYear(year: number): Witness[] {
  return witnesses.filter(
    (w) => year >= w.date_start && year <= w.date_end
  );
}

export function getTimelineBounds(): { min: number; max: number } {
  const starts = witnesses.map((w) => w.date_start);
  const ends = witnesses.map((w) => w.date_end);
  return {
    min: Math.min(...starts),
    max: Math.max(...ends),
  };
}
