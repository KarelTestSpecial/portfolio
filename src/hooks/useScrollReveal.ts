import { useEffect } from 'react';

/**
 * Adds a reveal-on-scroll animation to every element carrying `data-reveal`.
 * Falls back to showing everything when IntersectionObserver is unavailable
 * (older browsers, jsdom/test environments).
 */
export function useScrollReveal(): void {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]')
    );

    if (elements.length === 0) return;

    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const fine = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (fine) {
      elements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
