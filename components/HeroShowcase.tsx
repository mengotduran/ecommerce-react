'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useCart } from '../hooks/useCart';
import { useLikedItems } from '../hooks/useLikedItems';

type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  features: string[];
  images: string[];
};

const API_URL     = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const NAVBAR_H    = 52;    // matches h-[52px] in Navbar
const SECTION_VH  = 50;    // viewport-heights per section (desktop)
const LERP        = 0.08;  // interpolation factor — lower = smoother/slower
const M_SECTION_VH = 36;   // mobile: shorter runway per product = faster swaps
const M_LERP       = 0.3;  // mobile: strong follow — smooths the gaps between
                           // touch scroll events without feeling laggy

const s = {
  bg:            '#0d0d0d',
  imageBg:       '#080808',
  sidebarBg:     '#0a0a0a',
  labelInactive: 'rgba(255,255,255,0.28)',
  labelActive:   '#ffffff',
  category:      'color(display-p3 1 .3333 0)',
  heading:       '#ffffff',
  price:         '#ffffff',
  description:   '#ffffff',
  feature:       'rgba(255,255,255,0.75)',
  featureDot:    'rgba(255,255,255,0.35)',
  btnBg:         'color(display-p3 1 .3333 0)',
  btnText:       '#000000',
  wishBorder:    'rgba(255,255,255,0.18)',
  wishIcon:      'rgba(255,255,255,0.6)',
};

const MONO: React.CSSProperties = {
  fontFamily:    'var(--font-mono), ui-monospace, monospace',
  fontSize:      '0.8125rem',
  fontWeight:    400,
  letterSpacing: 0,
  textTransform: 'uppercase' as const,
  lineHeight:    1.3,
};

function InfoContent({ product, onAddToCart, isLiked, onToggleLike, compact = false }: {
  product: Product;
  onAddToCart: () => void;
  isLiked: boolean;
  onToggleLike: () => void;
  compact?: boolean;
}) {
  const [added, setAdded] = useState(false);

  return (
    <>
      <p style={{ ...MONO, color: s.category, margin: 0 }}>{product.category}</p>
      <h2 style={{ fontSize: compact ? 26 : 42, fontWeight: 500, letterSpacing: compact ? '-0.8px' : '-1.5px', lineHeight: 1.05, color: s.heading, margin: 0 }}>
        {product.name}
      </h2>
      <p style={{ fontSize: 18, fontWeight: 500, color: s.price, margin: 0 }}>${product.price}</p>
      <p style={{ fontSize: compact ? 15 : 18, color: s.description, lineHeight: compact ? 1.55 : 1.75, margin: 0, display: '-webkit-box', WebkitLineClamp: compact ? 2 : 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
        {product.description}
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: compact ? 8 : 10 }}>
        {product.features.slice(0, compact ? 3 : 4).map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: compact ? 14 : 15, color: s.feature }}>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: s.featureDot, flexShrink: 0 }} />
            {f}
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={() => {
            onAddToCart();
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          style={{
            background: added ? '#16a34a' : s.btnBg, color: s.btnText, border: 'none',
            borderRadius: 8, padding: '12px 28px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '-0.2px',
            transition: 'background 200ms',
          }}
        >
          {added ? '✓ Added!' : 'Add to cart'}
        </button>
        <button
          type="button"
          aria-label={isLiked ? 'remove from wishlist' : 'add to wishlist'}
          onClick={onToggleLike}
          style={{
            background: 'transparent', border: `0.5px solid ${s.wishBorder}`,
            borderRadius: 8, padding: 10, cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            color: isLiked ? '#e11d48' : s.wishIcon,
            transition: 'color 150ms',
          }}
        >
          {isLiked
            ? <HeartSolid style={{ width: 18, height: 18 }} />
            : <HeartIcon  style={{ width: 18, height: 18 }} />
          }
        </button>
      </div>
    </>
  );
}

const PANEL: React.CSSProperties = {
  position: 'absolute', inset: 0,
  display: 'flex', flexDirection: 'column',
  justifyContent: 'flex-start', gap: 22,
  padding: '44px 60px 40px',
  overflow: 'hidden',
};

export default function HeroShowcase() {
  const [products, setProducts]       = useState<Product[]>([]);
  // displayFrac is the lerp-smoothed value used for rendering
  const [displayFrac, setDisplayFrac]   = useState(0);
  // per-product image indexes so each product's carousel cycles independently
  const [imageIndexes, setImageIndexes] = useState<number[]>([]);
  const [hoveredIdx, setHoveredIdx]     = useState<number | null>(null);
  const [isDesktop, setIsDesktop]       = useState(true);

  const { addToCart } = useCart();
  const { likedItems, toggleLike } = useLikedItems();
  const containerRef   = useRef<HTMLDivElement>(null);
  const stickyRef      = useRef<HTMLDivElement>(null);
  const tabRowRef      = useRef<HTMLDivElement>(null);
  // Mobile scroll updates these directly — re-rendering React every scroll
  // frame can't hold 60fps on phones and made the motion stutter
  const imageLayerRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const panelRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const lastDominantRef = useRef(0);
  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRafRef   = useRef<number | null>(null);
  const animLoopRef    = useRef<number | null>(null);
  const targetFracRef  = useRef(0);
  const displayFracRef = useRef(0);

  // dominant = section that's more than 50% visible
  const dominant = products.length > 0
    ? Math.min(Math.round(displayFrac), products.length - 1)
    : 0;

  // Start/continue the lerp animation loop
  const startLerpLoop = () => {
    if (animLoopRef.current !== null) return;
    const loop = () => {
      const target  = targetFracRef.current;
      const current = displayFracRef.current;
      const diff    = target - current;
      if (Math.abs(diff) < 0.0008) {
        displayFracRef.current = target;
        setDisplayFrac(target);
        animLoopRef.current = null;
        return;
      }
      displayFracRef.current = current + diff * LERP;
      setDisplayFrac(displayFracRef.current);
      animLoopRef.current = requestAnimationFrame(loop);
    };
    animLoopRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    fetch(`${API_URL}/products/featured`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        setProducts(data);
        setImageIndexes(new Array(data.length).fill(0));
      })
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  // Desktop: scroll → update target, lerp loop handles the smooth rendering
  useEffect(() => {
    if (!isDesktop || products.length === 0) return;
    const onScroll = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        const sH  = window.innerHeight * SECTION_VH / 100;
        const raw = (window.scrollY - NAVBAR_H) / sH;
        targetFracRef.current = Math.max(0, Math.min(raw, products.length - 1));
        startLerpLoop();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [isDesktop, products.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mobile: 1:1 scroll tracking, anchored to the runway's own geometry.
  // Never reads window.innerHeight — on iOS it changes mid-scroll when the
  // address bar collapses, which made the content visibly jump.
  useEffect(() => {
    if (isDesktop || products.length === 0) return;

    // Write styles straight to the DOM — no React work per frame
    const applyStyles = (frac: number) => {
      for (let i = 0; i < products.length; i++) {
        const layer = imageLayerRefs.current[i];
        if (layer) {
          const vis = Math.max(0, 1 - Math.abs(frac - i));
          layer.style.opacity = String(vis);
          layer.style.zIndex  = vis > 0 ? '1' : '0';
        }
        const panel = panelRefs.current[i];
        if (panel) {
          const off = i - frac;
          panel.style.transform  = `translateY(${off * 100}%)`;
          panel.style.visibility = Math.abs(off) >= 1 ? 'hidden' : 'visible';
        }
      }
      // Render only when the active product flips (tab strip highlight)
      const d = Math.min(Math.round(frac), products.length - 1);
      if (d !== lastDominantRef.current) {
        lastDominantRef.current = d;
        setDisplayFrac(frac);
      }
    };

    // rAF loop glides displayFrac toward the scroll target every frame —
    // touch scroll events arrive less often than the display refreshes, so
    // rendering them raw looks steppy
    const startLoop = () => {
      if (animLoopRef.current !== null) return;
      const loop = () => {
        const target = targetFracRef.current;
        const cur    = displayFracRef.current;
        const diff   = target - cur;
        const next   = Math.abs(diff) < 0.001 ? target : cur + diff * M_LERP;
        displayFracRef.current = next;
        applyStyles(next);
        if (next === target) { animLoopRef.current = null; return; }
        animLoopRef.current = requestAnimationFrame(loop);
      };
      animLoopRef.current = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      const cont = containerRef.current;
      const stick = stickyRef.current;
      if (!cont || !stick) return;
      const total = cont.offsetHeight - stick.offsetHeight; // scroll distance while pinned
      if (total <= 0) return;
      const progressed = NAVBAR_H - cont.getBoundingClientRect().top;
      const raw = (progressed / total) * (products.length - 1);
      targetFracRef.current = Math.max(0, Math.min(raw, products.length - 1));
      startLoop();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (animLoopRef.current !== null) {
        cancelAnimationFrame(animLoopRef.current);
        animLoopRef.current = null;
      }
    };
  }, [isDesktop, products.length]);

  // Auto-cycle images: dominant product on desktop, every block on mobile
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (products.length === 0) return;

    if (!isDesktop) {
      intervalRef.current = setInterval(() => {
        setImageIndexes((prev) => prev.map((idx, pi) => {
          const len = products[pi]?.images.length ?? 1;
          return len <= 1 ? idx : (idx + 1) % len;
        }));
      }, 3500);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }

    const images = products[dominant]?.images ?? [];
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setImageIndexes((prev) => {
        const next = [...prev];
        next[dominant] = (next[dominant] + 1) % images.length;
        return next;
      });
    }, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [dominant, products, isDesktop]);

  // Mobile: keep the active tab centered in the strip. Scrolls only the strip
  // itself — scrollIntoView would also scroll the page out from under the user.
  useEffect(() => {
    if (isDesktop) return;
    const row = tabRowRef.current;
    const tab = document.getElementById(`hero-tab-${dominant}`);
    if (!row || !tab) return;
    row.scrollTo({ left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' });
  }, [dominant, isDesktop]);

  const scrollToProduct = (i: number) => {
    const sH = window.innerHeight * SECTION_VH / 100;
    // Jump the page instantly; lerp handles the smooth panel animation
    targetFracRef.current = i;
    startLerpLoop();
    window.scrollTo({ top: NAVBAR_H + i * sH, behavior: 'instant' as ScrollBehavior });
  };

  // Mobile: jump the page so product i is the pinned one (instant, like desktop)
  const scrollToMobileProduct = (i: number) => {
    const cont = containerRef.current;
    const stick = stickyRef.current;
    if (!cont || !stick) return;
    const total = cont.offsetHeight - stick.offsetHeight;
    const step  = products.length > 1 ? total / (products.length - 1) : 0;
    const top   = window.scrollY + cont.getBoundingClientRect().top - NAVBAR_H + i * step;
    window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
  };

  if (products.length === 0) {
    if (!isDesktop) {
      // Mirrors the mobile pinned window: tab strip → image (38%) → info panel
      return (
        <div style={{ background: s.bg, height: `calc(100svh - ${NAVBAR_H}px)`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Tab strip skeleton */}
          <div style={{ display: 'flex', gap: 22, padding: '12px 16px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            {[0,1,2,3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{ width: 26, height: 26, background: i === 0 ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)' }} />
                <div style={{ height: 10, width: 64, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
              </div>
            ))}
          </div>
          {/* Image skeleton */}
          <div style={{ flexShrink: 0, height: '38%', background: 'rgba(255,255,255,0.04)' }} />
          {/* Info skeleton */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, padding: '18px 24px 24px' }}>
            <div style={{ height: 11, width: '30%', borderRadius: 4, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ height: 26, width: '80%', borderRadius: 6, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ height: 18, width: '25%', borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ height: 14, width: '90%', borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ height: 14, width: '70%', borderRadius: 4, background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
              <div style={{ height: 44, flex: 1, borderRadius: 8, background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ height: 44, width: 44, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={{ background: s.bg, height: `calc(100vh - ${NAVBAR_H}px)`, display: 'flex' }}>
        {/* Sidebar skeleton */}
        <div style={{ width: 230, flexShrink: 0, background: s.sidebarBg, padding: '44px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ height: 10, width: '50%', borderRadius: 4, background: 'rgba(255,255,255,0.08)' }} />
          {[0,1,2,3,4].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 0, background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ height: 10, flex: 1, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
            </div>
          ))}
        </div>
        {/* Info skeleton */}
        <div style={{ flex: 1.4, padding: '44px 60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 20 }}>
          <div style={{ height: 12, width: '30%', borderRadius: 4, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ height: 44, width: '80%', borderRadius: 6, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ height: 44, width: '60%', borderRadius: 6, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ height: 16, width: '90%', borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ height: 16, width: '75%', borderRadius: 4, background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <div style={{ height: 44, width: 130, borderRadius: 8, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ height: 44, width: 44,  borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </div>
        {/* Image skeleton */}
        <div style={{ flex: 1.6, marginLeft: 24, background: 'rgba(255,255,255,0.04)' }} />
      </div>
    );
  }

  // Panel positions derived from the smoothed displayFrac
  const floorIdx = Math.max(0, Math.min(Math.floor(displayFrac), products.length - 1));
  const ceilIdx  = Math.min(floorIdx + 1, products.length - 1);
  const frac     = displayFrac - Math.floor(displayFrac);

  const currentProduct = products[dominant];

  // ── Mobile: pinned window — the section holds still while scroll swaps the
  // products (01 → 02 → 03…), then releases into the rest of the page ──
  if (!isDesktop) {
    const MOBILE_PANEL: React.CSSProperties = {
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', gap: 14,
      padding: '18px 24px 24px',
      overflow: 'hidden',
    };
    return (
      <div ref={containerRef} style={{ position: 'relative', height: `${(products.length - 1) * M_SECTION_VH + 100}vh`, background: s.bg }}>
        <div ref={stickyRef} style={{
          position: 'sticky', top: NAVBAR_H,
          height: `calc(100svh - ${NAVBAR_H}px)`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>

          {/* Tab strip — number in a white square (active) + label beside */}
          <div ref={tabRowRef} style={{
            display: 'flex', gap: 22, padding: '12px 16px', overflowX: 'auto',
            position: 'relative', flexShrink: 0, background: s.bg,
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            WebkitOverflowScrolling: 'touch',
          }}>
            {products.map((p, i) => {
              const active = dominant === i;
              return (
                <button
                  key={p.id}
                  id={`hero-tab-${i}`}
                  type="button"
                  onClick={() => scrollToMobileProduct(i)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
                    background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                  }}
                >
                  <span style={{
                    width: 26, height: 26, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? '#ffffff' : 'transparent',
                    borderRadius: 0,
                    transition: 'background 260ms ease, color 260ms ease',
                    ...MONO, fontSize: '0.75rem', color: active ? '#000000' : s.labelInactive,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    ...MONO, fontSize: '0.75rem', whiteSpace: 'nowrap',
                    color: active ? s.labelActive : s.labelInactive,
                    fontWeight: active ? 600 : 400,
                    transition: 'color 260ms ease',
                  }}>
                    {p.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Image — scroll-linked crossfade. All products stay mounted so
              every car's image downloads on page load, not mid-swipe. */}
          <Link href={`/product/${currentProduct.id}`} style={{ position: 'relative', flexShrink: 0, height: '38%', overflow: 'hidden', background: s.imageBg, display: 'block' }}>
            {products.map((p, pi) => {
              const vis = Math.max(0, 1 - Math.abs(displayFracRef.current - pi));
              return (
                <div key={p.id} ref={(el) => { imageLayerRefs.current[pi] = el; }} style={{ position: 'absolute', inset: 0, opacity: vis, zIndex: vis > 0 ? 1 : 0, willChange: 'opacity' }}>
                  {p.images.map((src, i) => {
                    const activeI = imageIndexes[pi] ?? 0;
                    return (
                      <div key={src} style={{ position: 'absolute', inset: 0, opacity: i === activeI ? 1 : 0, transition: 'opacity 1.8s ease-in-out', zIndex: i === activeI ? 1 : 0 }}>
                        <Image src={src} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="100vw" priority={pi === 0 && i === 0} />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Link>

          {/* Info — each product's panel slides vertically with scroll */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {products.map((p, pi) => {
              const offset = pi - displayFracRef.current;
              return (
                <div key={p.id} ref={(el) => { panelRefs.current[pi] = el; }} style={{
                  ...MOBILE_PANEL,
                  transform: `translateY(${offset * 100}%)`,
                  visibility: Math.abs(offset) >= 1 ? 'hidden' : 'visible',
                  willChange: 'transform',
                }}>
                  <InfoContent
                    compact
                    product={p}
                    onAddToCart={() => addToCart(p.id, 1, { name: p.name, price: Number(p.price), image: p.images[0] })}
                    isLiked={likedItems.includes(p.id)}
                    onToggleLike={() => toggleLike(p.id)}
                  />
                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  }

  // ── Desktop ──────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} style={{ position: 'relative', height: `${(products.length - 1) * SECTION_VH + 100}vh` }}>
      <div style={{ position: 'sticky', top: NAVBAR_H, display: 'flex', height: `calc(100vh - ${NAVBAR_H}px)`, width: '100%' }}>

        {/* ── Sidebar ── */}
        <div style={{ width: 230, flexShrink: 0, background: s.sidebarBg, display: 'flex', flexDirection: 'column', paddingTop: 44 }}>
          <p style={{ ...MONO, color: 'rgba(255,255,255,0.45)', paddingLeft: 28, margin: '0 0 28px' }}>
            Featured
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {products.map((p, i) => {
              const isActive  = i === dominant;
              const isHovered = hoveredIdx === i;
              const showBox   = isActive || isHovered;
              const boxBg     = isHovered ? 'color(display-p3 1 .3333 0)' : '#ffffff';
              const numColor  = isActive  ? '#000000'
                              : isHovered ? '#000000'
                              : 'rgba(255,255,255,0.28)';
              return (
                <li
                  key={p.id}
                  onClick={() => scrollToProduct(i)}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 28px', cursor: 'pointer', userSelect: 'none' }}
                >
                  <span style={{
                    width: 36, height: 36, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: showBox ? boxBg : 'transparent',
                    transition: 'background 260ms ease',
                    borderRadius: 0,
                    ...MONO, color: numColor,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{
                    ...MONO,
                    color: isActive ? s.labelActive : s.labelInactive,
                    fontWeight: isActive ? 600 : 400,
                    transition: 'color 260ms ease',
                  }}>
                    {p.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Info — lerp-smoothed scroll-linked ── */}
        <div style={{ flex: 1.4, position: 'relative', overflow: 'hidden', background: s.bg }}>
          {/* Floor panel: slides up as displayFrac increases */}
          <div style={{ ...PANEL, transform: `translateY(${-frac * 100}%)`, willChange: 'transform' }}>
            {/* key ties button state (e.g. "Added!") to the product, not the panel slot */}
            <InfoContent
              key={products[floorIdx].id}
              product={products[floorIdx]}
              onAddToCart={() => addToCart(products[floorIdx].id, 1, { name: products[floorIdx].name, price: Number(products[floorIdx].price), image: products[floorIdx].images[0] })}
              isLiked={likedItems.includes(products[floorIdx].id)}
              onToggleLike={() => toggleLike(products[floorIdx].id)}
            />
          </div>
          {/* Ceil panel: rises from below */}
          {ceilIdx > floorIdx && frac > 0.001 && (
            <div style={{ ...PANEL, transform: `translateY(${(1 - frac) * 100}%)`, willChange: 'transform' }}>
              <InfoContent
                key={products[ceilIdx].id}
                product={products[ceilIdx]}
                onAddToCart={() => addToCart(products[ceilIdx].id, 1, { name: products[ceilIdx].name, price: Number(products[ceilIdx].price), image: products[ceilIdx].images[0] })}
                isLiked={likedItems.includes(products[ceilIdx].id)}
                onToggleLike={() => toggleLike(products[ceilIdx].id)}
              />
            </div>
          )}
        </div>

        {/* ── Image — scroll-linked crossfade between products ── */}
        <Link href={`/product/${currentProduct.id}`} style={{ flex: 1.6, position: 'relative', overflow: 'hidden', background: s.imageBg, marginLeft: 24, display: 'block', cursor: 'pointer' }}>
          {/* Floor product: fades out as frac increases */}
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - frac, willChange: 'opacity' }}>
            {products[floorIdx].images.map((src, i) => {
              const activeI = imageIndexes[floorIdx] ?? 0;
              return (
                <div key={src} style={{ position: 'absolute', inset: 0, opacity: i === activeI ? 1 : 0, transition: 'opacity 1.8s ease-in-out', zIndex: i === activeI ? 1 : 0, mixBlendMode: 'lighten' }}>
                  <Image src={src} alt={products[floorIdx].name} fill style={{ objectFit: 'contain' }} sizes="50vw" priority={floorIdx === 0 && i === 0} />
                </div>
              );
            })}
          </div>
          {/* Ceil product: fades in as frac increases */}
          {ceilIdx > floorIdx && frac > 0.001 && (
            <div style={{ position: 'absolute', inset: 0, opacity: frac, willChange: 'opacity' }}>
              {products[ceilIdx].images.map((src, i) => {
                const activeI = imageIndexes[ceilIdx] ?? 0;
                return (
                  <div key={src} style={{ position: 'absolute', inset: 0, opacity: i === activeI ? 1 : 0, transition: 'opacity 1.8s ease-in-out', zIndex: i === activeI ? 1 : 0, mixBlendMode: 'lighten' }}>
                    <Image src={src} alt={products[ceilIdx].name} fill style={{ objectFit: 'contain' }} sizes="50vw" />
                  </div>
                );
              })}
            </div>
          )}
        </Link>

      </div>
    </div>
  );
}
