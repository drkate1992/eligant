"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Global top loading bar (NProgress-style) shown on every client-side
 * navigation. App Router's loading.tsx fallbacks flash too briefly for fast
 * client pages, so this gives reliable, visible loading feedback like the
 * reference site. Starts on internal link clicks / back-forward, completes
 * when the pathname commits.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setActive(true);
    setProgress(8);
    if (trickle.current) clearInterval(trickle.current);
    trickle.current = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.random() * 8 : p));
    }, 220);
  }, []);

  const done = useCallback(() => {
    if (trickle.current) clearInterval(trickle.current);
    setProgress(100);
    hideTimer.current = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 350);
  }, []);

  // Navigation committed (pathname changed) → finish.
  useEffect(() => {
    if (active) done();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Begin the bar when an internal link is clicked or on back/forward.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const anchor = (e.target as HTMLElement)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      if (
        !href ||
        target === "_blank" ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      )
        return;
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.pathname === window.location.pathname) return; // same page
      } catch {
        return;
      }
      start();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", start);
    };
  }, [start]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[300] h-[3px]">
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-brand to-brand-light shadow-[0_0_12px_rgba(28,166,95,0.7)] transition-[width,opacity] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: progress >= 100 ? 0 : 1 }}
      />
    </div>
  );
}
