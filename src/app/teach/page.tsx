import type { Metadata } from "next";
import Link from "next/link";
import { teachBriefs } from "@/data/teach-briefs";
import styles from "./teach.module.css";

export const metadata: Metadata = {
  title: "Teaching briefs — Illustrative Manuscripts",
  description:
    "Short classroom and debate-prep outlines linking into Coverage, Famous passages, Uthmanic rasm, Hebrew/LXX, Nag Hammadi, and Cite — with don't-overclaim boxes.",
};

export default function TeachIndexPage() {
  return (
    <main className={styles.main} data-handout="true">
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Classroom &amp; debate prep</p>
        <h1 className={styles.title}>Teaching briefs</h1>
        <p className={styles.lead}>{teachBriefs.intro}</p>
        <p className={styles.printHint}>
          Tip: use your browser&apos;s <strong>Print</strong> (Ctrl+P / ⌘P) on an
          open brief or this index for a classroom handout — navigation is hidden
          in print view.
        </p>
      </header>

      <div className={styles.briefGrid}>
        {teachBriefs.briefs.map((brief) => (
          <article key={brief.id} className={styles.briefCard}>
            <p className={styles.briefMeta}>{brief.audience}</p>
            <h2>
              <Link href={`/teach/${brief.slug}/`}>{brief.title}</Link>
            </h2>
            {brief.subtitle && (
              <p className={styles.briefGoal}>{brief.subtitle}</p>
            )}
            <p className={styles.briefGoal}>{brief.learning_goal}</p>
            <p className={styles.briefCta}>
              <Link href={`/teach/${brief.slug}/`}>Open brief →</Link>
            </p>
          </article>
        ))}
      </div>

      <footer className={styles.footer}>
        <Link href="/use/">Use &amp; claims →</Link>
        {" · "}
        <Link href="/cite/">Cite &amp; learn →</Link>
        {" · "}
        <Link href="/coverage/">Coverage →</Link>
        {" · "}
        <Link href="/">← Timeline</Link>
      </footer>
    </main>
  );
}
