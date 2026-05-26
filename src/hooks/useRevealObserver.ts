import { useEffect } from "react";

/**
 * Observe .reveal elements in the document and add .in-view when 15% visible.
 * Call once per page-level component. Idempotent — re-runs when `dep` changes.
 */
export function useRevealObserver(dep?: unknown) {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".reveal");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => {
      targets.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [dep]);
}
