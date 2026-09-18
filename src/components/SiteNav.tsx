"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import SiteNavSearch from "@/components/SiteNavSearch";
import styles from "./SiteNav.module.css";

const primaryLinks = [
  { href: "/", label: "Timeline", match: (path: string) => path === "/" || path === "" },
  { href: "/variants/", label: "Variants", match: (path: string) => path.startsWith("/variants") },
  { href: "/famous/", label: "Famous passages", match: (path: string) => path.startsWith("/famous") },
  { href: "/coverage/", label: "Coverage", match: (path: string) => path.startsWith("/coverage") },
  { href: "/compare/", label: "Compare", match: (path: string) => path.startsWith("/compare") },
  { href: "/use/", label: "Use / Claims", match: (path: string) => path.startsWith("/use") },
  { href: "/cite/", label: "Cite & learn", match: (path: string) => path.startsWith("/cite") },
  { href: "/about/", label: "About", match: (path: string) => path.startsWith("/about") },
  { href: "/status/", label: "Status", match: (path: string) => path.startsWith("/status") },
];

const quranLinks = [
  { href: "/quran/uthmani/", label: "Uthmanic rasm", match: (path: string) => path.startsWith("/quran/uthmani") },
  { href: "/quran/readings/", label: "Readings", match: (path: string) => path.startsWith("/quran/readings") },
  { href: "/quran/archetype/", label: "Archetype matrix", match: (path: string) => path.startsWith("/quran/archetype") },
];

function linkClass(pathname: string, match: (path: string) => boolean) {
  return match(pathname) ? styles.linkActive : undefined;
}

export default function SiteNav() {
  const pathname = usePathname() ?? "/";
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const renderNavLink = (href: string, label: string, match: (path: string) => boolean) => (
    <Link
      key={href}
      href={href}
      className={linkClass(pathname, match)}
      aria-current={match(pathname) ? "page" : undefined}
      onClick={closeMenu}
    >
      {label}
    </Link>
  );

  return (
    <header id="site-nav-header" className={styles.header}>
      <nav className={styles.nav} aria-label="Site">
        <div className={styles.inner}>
          <div className={styles.topRow}>
            <Link href="/" className={styles.brand} onClick={closeMenu}>
              Illustrative Manuscripts
            </Link>
            <button
              type="button"
              className={styles.menuButton}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={styles.menuIcon} aria-hidden="true">
                {menuOpen ? "✕" : "☰"}
              </span>
            </button>
          </div>
          <div className={styles.right}>
            <SiteNavSearch />
            <div className={styles.links}>
              {primaryLinks.map(({ href, label, match }) => renderNavLink(href, label, match))}
              <Link
                href="/quran/uthmani/"
                className={linkClass(pathname, (p) => p.startsWith("/quran"))}
                aria-current={pathname.startsWith("/quran") ? "page" : undefined}
              >
                Uthmanic rasm
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <>
          <button
            type="button"
            className={styles.backdrop}
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div id={menuId} className={styles.drawer} role="dialog" aria-modal="true" aria-label="Main navigation">
            <div className={styles.drawerInner}>
              <p className={styles.drawerHeading}>Explore</p>
              <div className={styles.drawerLinks}>
                {primaryLinks.map(({ href, label, match }) => renderNavLink(href, label, match))}
              </div>
              <p className={styles.drawerHeading}>Qurʾān</p>
              <div className={styles.drawerLinks}>
                {quranLinks.map(({ href, label, match }) => renderNavLink(href, label, match))}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
