import { useEffect, useState } from "react";

/**
 * In hosted (micro-frontend) mode the WebUI lives inside a host container
 * (e.g. the leads AI drawer) whose width is far smaller than the browser
 * viewport. Viewport media queries like `(max-width: 767px)` would not fire,
 * so the compact/"phone" layout never appears. For width queries, resolve
 * against the mount container width in that mode; other queries (hover,
 * prefers-reduced-motion, ...) still use matchMedia.
 */
function hostedWidthQuery(query: string): number | null {
  const max = query.match(/\(\s*max-width\s*:\s*(\d+(?:\.\d+)?)px\s*\)/i);
  if (max) return Number(max[1]);
  const min = query.match(/\(\s*min-width\s*:\s*(\d+(?:\.\d+)?)px\s*\)/i);
  if (min) return -Number(min[1]);
  return null;
}

function containerWidth(): number | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector<HTMLElement>(".nanobot-hosted");
  return el ? el.getBoundingClientRect().width : null;
}

function matchesWidthQuery(width: number, threshold: number): boolean {
  return threshold >= 0 ? width <= threshold : width >= -threshold;
}

export function useMediaQuery(query: string, fallback = false): boolean {
  const hostedThreshold = hostedWidthQuery(query);

  const readMatch = () => {
    if (hostedThreshold !== null) {
      const width = containerWidth();
      if (width !== null && width > 0) return matchesWidthQuery(width, hostedThreshold);
    }
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return fallback;
    }
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(readMatch);

  useEffect(() => {
    if (hostedThreshold !== null) {
      const el = typeof document !== "undefined"
        ? document.querySelector<HTMLElement>(".nanobot-hosted")
        : null;
      if (el) {
        const update = () => setMatches(matchesWidthQuery(el.getBoundingClientRect().width, hostedThreshold));
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
      }
    }
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    )
      return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query, hostedThreshold]);

  return matches;
}
