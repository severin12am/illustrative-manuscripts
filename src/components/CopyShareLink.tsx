"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { absolutePageUrl } from "@/lib/pageUrl";
import styles from "./CopyShareLink.module.css";

type CopyShareLinkProps = {
  /** Path with optional hash, e.g. `/famous/#pericope-adulterae` */
  href: string;
  className?: string;
};

export default function CopyShareLink({ href, className }: CopyShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const onCopy = useCallback(async () => {
    const url = absolutePageUrl(href);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  }, [href]);

  return (
    <button
      type="button"
      className={className ? `${styles.button} ${className}` : styles.button}
      onClick={onCopy}
      aria-live="polite"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
