import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTeachBriefBySlug, teachBriefs } from "@/data/teach-briefs";
import type { TeachBriefLink } from "@/types/teachBriefs";
import styles from "../teach.module.css";

function BriefLink({ link }: { link: TeachBriefLink }) {
  if (link.external || link.href.startsWith("http")) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label} ↗
      </a>
    );
  }
  return <Link href={link.href}>{link.label}</Link>;
}

export function generateStaticParams() {
  return teachBriefs.briefs.map((b) => ({ slug: b.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brief = getTeachBriefBySlug(slug);
  if (!brief) return { title: "Teaching brief" };
  return {
    title: `${brief.title} — Teaching briefs`,
    description: brief.learning_goal,
  };
}

export default async function TeachBriefPage({ params }: PageProps) {
  const { slug } = await params;
  const brief = getTeachBriefBySlug(slug);
  if (!brief) notFound();

  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>{brief.audience}</p>
        <h1 className={styles.title}>{brief.title}</h1>
        {brief.subtitle && <p className={styles.subtitle}>{brief.subtitle}</p>}
        <p className={styles.lead}>
          <Link href="/teach/">← All teaching briefs</Link>
        </p>
      </header>

      <div className={styles.goalBox}>
        <h2>Learning goal</h2>
        <p>{brief.learning_goal}</p>
      </div>

      <section aria-labelledby="steps-title">
        <h2 id="steps-title" className={styles.briefMeta}>
          Steps
        </h2>
        <ol className={styles.steps}>
          {brief.steps.map((step, i) => (
            <li key={i}>
              {step.text}
              {step.links && step.links.length > 0 && (
                <ul className={styles.stepLinks}>
                  {step.links.map((link) => (
                    <li key={link.href + link.label}>
                      <BriefLink link={link} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      <aside className={styles.overclaim}>
        <h2>Don&apos;t overclaim</h2>
        <p>{brief.dont_overclaim}</p>
      </aside>

      {brief.related_links && brief.related_links.length > 0 && (
        <div className={styles.related}>
          <strong>Related on this site</strong>
          <ul>
            {brief.related_links.map((link) => (
              <li key={link.href + link.label}>
                <BriefLink link={link} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer className={styles.footer}>
        <Link href="/teach/">All briefs →</Link>
        {" · "}
        <Link href="/use/">Use &amp; claims →</Link>
        {" · "}
        <Link href="/cite/">Cite →</Link>
        {" · "}
        <Link href="/">← Timeline</Link>
      </footer>
    </main>
  );
}
