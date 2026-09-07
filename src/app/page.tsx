import { Suspense } from "react";
import HomeTimeline from "@/components/HomeTimeline";

export default function Home() {
  return (
    <Suspense fallback={<main style={{ padding: "2rem" }}>Loading timeline…</main>}>
      <HomeTimeline />
    </Suspense>
  );
}
