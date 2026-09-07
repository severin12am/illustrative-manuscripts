import type { Metadata } from "next";
import { Suspense } from "react";
import CompareExplorer from "./CompareExplorer";

export const metadata: Metadata = {
  title: "Witness compare — Illustrative Manuscripts",
  description:
    "Side-by-side comparison of two Greek NT papyrus witnesses where both preserve extant text, with optional SR GNT column.",
};

export default function ComparePage() {
  return (
    <Suspense fallback={<main style={{ padding: "2rem" }}>Loading compare…</main>}>
      <CompareExplorer />
    </Suspense>
  );
}
