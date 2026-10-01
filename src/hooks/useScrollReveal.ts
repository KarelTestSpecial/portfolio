import { useEffect } from 'react';

const REVEAL_SELECTOR = '[data-reveal]';
const SHOWN = 'shown';

const isShown = (el: HTMLElement) => el.dataset.revealState === SHOWN;

const markShown = (el: HTMLElement) => {
  el.dataset.revealState = SHOWN;
};

/**
 * Reveals `[data-reveal]` elements as they scroll into view.
 *
 * Robustness notes (learned the hard way):
 * - The revealed state is stored in the `data-reveal-state` attribute instead of a
 *   CSS class. React rewrites the whole `class` attribute whenever an element is
 *   re-rendered, which silently erased an imperatively added class and left the
 *   content stuck at `opacity: 0`. React leaves attributes it did not render alone.
 * - The initial hidden state only applies while `html.reveal-ready` is set, so
 *   content is visible even if this hook never runs.
 * - A MutationObserver re-scans for elements mounted later (hot reload, language
 *   switch, data changes), and everything at or above the viewport is shown
 *   immediately so no content can stay hidden.
 */
export function useScrollReveal(): void {
  useEffect(() => {
    const revealEverythingVisible = (elements: HTMLElement[]) => {
      elements.forEach((element) => {
        if (isShown(element)) return;

        // Anything that already starts above the bottom edge of the viewport
        // (in view, or scrolled past) is shown right away.
        if (element.getBoundingClientRect().top < window.innerHeight) {
          markShown(element);
        }
      });
    };

    const pending = () =>
      Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)).filter(
        (element) => !isShown(element)
      );

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (typeof IntersectionObserver === 'undefined' || reducedMotion) {
      const showAll = () =>
        document
          .querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
          .forEach(markShown);

      showAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          markShown(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );

    /** Shows what is already visible, observes the rest. */
    const scan = () => {
      const elements = pending();
      revealEverythingVisible(elements);
      elements
        .filter((element) => !isShown(element))
        .forEach((element) => observer.observe(element));
    };

    scan();

    // Pick up nodes added after the first scan (Fast Refresh, new data, …).
    const domObserver = new MutationObserver(scan);
    domObserver.observe(document.body, { childList: true, subtree: true });

    // Safety net for late layout shifts (fonts/images changing the page height).
    window.addEventListener('load', scan);

    return () => {
      observer.disconnect();
      domObserver.disconnect();
      window.removeEventListener('load', scan);
    };
  }, []);
}
