import type { Metadata } from "next";
import { Suspense } from "react";
import VariantsExplorer from "./VariantsExplorer";

export const metadata: Metadata = {
  title: "Variant explorer — Illustrative Manuscripts",
  description:
    "Browse counted word-level disagreements between Greek NT witnesses (1–400 CE) and SR GNT — filterable by kind, witness, and book.",
};

export default function VariantsPage() {
  return (
    <Suspense fallback={<main style={{ padding: "2rem" }}>Loading variants…</main>}>
      <VariantsExplorer />
    </Suspense>
  );
}
