'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useT } from './locale-provider';

/**
 * Reveals every element carrying `data-reveal` (optionally "left" | "right" | "zoom") whenever it scrolls into view, in
 * both directions: when it leaves the screen it goes back to its hidden state, so it plays again on the way back. Items
 * that were scrolled past upwards wait just above their spot (`from-top`) and slide down into it when you scroll up.
 * The hidden start state only applies when the `js` class is on <html> (set by an inline script), so the page
 * is fully visible without JavaScript and for visitors who prefer reduced motion.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const all = () => Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      all().forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) {
            // enough of it is on screen (a tall block counts once ~80px of it shows)
            if (e.intersectionRatio >= 0.1 || e.intersectionRect.height >= 80) {
              el.classList.remove('from-top'); // its rule outranks .is-in, so drop it before revealing
              el.classList.add('is-in');
            }
          } else {
            // fully off screen: reset it, remembering which side it left through
            el.classList.toggle('from-top', e.boundingClientRect.top < 0);
            el.classList.remove('is-in');
          }
        }
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20), rootMargin: '0px 0px -6% 0px' },
    );
    const seen = new WeakSet<Element>();
    const watch = () =>
      all().forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      });
    watch();
    // nodes that mount later (client components, filtered lists…)
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}

/** Floating "back to top" button that appears after scrolling, plus a thin reading-progress line under the header. */
export function ScrollTop() {
  const { t } = useT();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t.common.backToTop}
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-[8.5rem] right-4 z-30 grid h-11 w-11 place-items-center rounded-full border border-choc/40 bg-cream/95 text-choc shadow-md backdrop-blur transition duration-300 hover:bg-choc hover:text-cream sm:right-6 ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
