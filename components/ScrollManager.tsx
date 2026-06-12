'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Restores the scroll position a page was at when the user navigated away
// from it (e.g. to a product detail page). Positions are saved at
// interaction time, not on scroll. Lives at the layout level so it works
// across every page, regardless of how each route's components mount.
export default function ScrollManager() {
  const pathname = usePathname();
  const hasNavigatedRef = useRef(false);
  const pathRef = useRef(pathname);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  // The browser's own scroll restoration (on back/forward) races with ours
  // and can win, snapping back to (0,0) after we've already restored.
  // Take full manual control.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Save the scroll position only at interaction time (the moment the user
  // taps/clicks/presses a key — i.e. right before any navigation they could
  // trigger), never from a 'scroll' listener. Next's navigation scrolls the
  // page to 0 and that scroll event still hits a listener keyed to the page
  // being left, stomping its saved position with 0 — which is exactly the
  // bug a continuous persist re-introduces.
  useEffect(() => {
    const snapshot = () => {
      sessionStorage.setItem(`scroll:${pathRef.current}`, String(window.scrollY));
    };
    document.addEventListener('pointerdown', snapshot, true);
    document.addEventListener('touchstart', snapshot, true);
    document.addEventListener('keydown', snapshot, true);
    window.addEventListener('pagehide', snapshot);
    return () => {
      document.removeEventListener('pointerdown', snapshot, true);
      document.removeEventListener('touchstart', snapshot, true);
      document.removeEventListener('keydown', snapshot, true);
      window.removeEventListener('pagehide', snapshot);
    };
  }, []);

  // On every route change: restore this path's saved position (back/forward
  // navigation), or scroll to top for a fresh visit. Layout effect so the
  // first apply happens before the browser paints the new page.
  useLayoutEffect(() => {
    const key = `scroll:${pathname}`;
    const saved = sessionStorage.getItem(key);
    let rafId: number | null = null;
    let cancelled = false;

    const isFirstLoad = !hasNavigatedRef.current;
    hasNavigatedRef.current = true;

    if (saved && !window.location.hash && Number(saved) > 0) {
      const target = Number(saved);
      const apply = () => {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo(0, Math.min(target, maxScroll));
        return maxScroll;
      };

      // Right after back-navigation the page is mostly skeletons and much
      // shorter than the saved position, so restoring immediately would show
      // the page pinned to the wrong spot until the async sections load and
      // it can jump to the real one. Hide the page for that window (dark
      // backdrop matching the theme) and reveal it only once the target is
      // reachable — the user only ever sees the final position.
      const root = document.documentElement;
      root.style.background = '#0a0a0a';
      document.body.style.opacity = '0';
      let revealed = false;
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        document.body.style.opacity = '';
        root.style.background = '';
      };
      const revealTimer = setTimeout(reveal, 1500);

      // Keep re-applying the target until the page has grown tall enough to
      // reach it AND its height has stopped changing for a bit (cold dev
      // compiles can take seconds), with a generous hard cap. The user
      // taking over (wheel/touch/keys) must immediately stop the loop,
      // otherwise it would pin the page while they try to scroll away.
      const stop = () => { cancelled = true; reveal(); };
      window.addEventListener('wheel', stop, { passive: true });
      window.addEventListener('touchstart', stop, { passive: true });
      window.addEventListener('keydown', stop);

      const start = performance.now();
      let lastHeight = -1;
      let stableFrames = 0;
      const tick = () => {
        if (cancelled) return;
        const maxScroll = apply();
        if (maxScroll >= target) reveal();
        const height = document.documentElement.scrollHeight;
        stableFrames = height === lastHeight ? stableFrames + 1 : 0;
        lastHeight = height;
        const reached = maxScroll >= target;
        const elapsed = performance.now() - start;
        if (elapsed < 8000 && !(reached && stableFrames > 20)) {
          rafId = requestAnimationFrame(tick);
        }
      };
      tick();
      return () => {
        cancelled = true;
        reveal();
        clearTimeout(revealTimer);
        if (rafId !== null) cancelAnimationFrame(rafId);
        window.removeEventListener('wheel', stop);
        window.removeEventListener('touchstart', stop);
        window.removeEventListener('keydown', stop);
      };
    } else if (!isFirstLoad && !window.location.hash) {
      window.scrollTo(0, 0);
    }

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return null;
}
