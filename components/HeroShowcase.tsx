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
const SECTION_VH  = 50;    // viewport-heights per section
const LERP        = 0.08;  // interpolation factor — lower = smoother/slower

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

function InfoContent({ product, onAddToCart, isLiked, onToggleLike }: {
  product: Product;
  onAddToCart: () => void;
  isLiked: boolean;
  onToggleLike: () => void;
}) {
  return (
    <>
      <p style={{ ...MONO, color: s.category, margin: 0 }}>{product.category}</p>
      <h2 style={{ fontSize: 42, fontWeight: 500, letterSpacing: '-1.5px', lineHeight: 1.05, color: s.heading, margin: 0 }}>
        {product.name}
      </h2>
      <p style={{ fontSize: 18, fontWeight: 500, color: s.price, margin: 0 }}>${product.price}</p>
      <p style={{ fontSize: 18, color: s.description, lineHeight: 1.75, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
        {product.description}
      </p>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {product.features.slice(0, 4).map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: s.feature }}>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: s.featureDot, flexShrink: 0 }} />
            {f}
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" onClick={onAddToCart} style={{
          background: s.btnBg, color: s.btnText, border: 'none',
          borderRadius: 8, padding: '12px 28px', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', letterSpacing: '-0.2px',
        }}>Add to cart</button>
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

  // Scroll → update target, lerp loop handles the smooth rendering
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

  // Auto-cycle images for the dominant product
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
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
  }, [dominant, products]);

  const scrollToProduct = (i: number) => {
    const sH = window.innerHeight * SECTION_VH / 100;
    // Jump the page instantly; lerp handles the smooth panel animation
    targetFracRef.current = i;
    startLerpLoop();
    window.scrollTo({ top: NAVBAR_H + i * sH, behavior: 'instant' as ScrollBehavior });
  };

  if (products.length === 0) {
    return (
      <div style={{ background: s.bg, height: isDesktop ? `calc(100vh - ${NAVBAR_H}px)` : '60vh', display: 'flex' }}>
        {isDesktop && (
          /* Sidebar skeleton */
          <div style={{ width: 230, flexShrink: 0, background: s.sidebarBg, padding: '44px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ height: 10, width: '50%', borderRadius: 4, background: 'rgba(255,255,255,0.08)' }} />
            {[0,1,2,3,4].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 0, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ height: 10, flex: 1, borderRadius: 4, background: 'rgba(255,255,255,0.06)' }} />
              </div>
            ))}
          </div>
        )}
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
        {isDesktop && (
          <div style={{ flex: 1.6, marginLeft: 24, background: 'rgba(255,255,255,0.04)' }} />
        )}
      </div>
    );
  }

  // Panel positions derived from the smoothed displayFrac
  const floorIdx = Math.max(0, Math.min(Math.floor(displayFrac), products.length - 1));
  const ceilIdx  = Math.min(floorIdx + 1, products.length - 1);
  const frac     = displayFrac - Math.floor(displayFrac);

  const currentProduct = products[dominant];

  // ── Mobile ──────────────────────────────────────────────────────────────────
  if (!isDesktop) {
    return (
      <section style={{ background: s.bg }}>
        <div style={{ position: 'relative', height: 380, overflow: 'hidden', background: s.imageBg }}>
          {currentProduct.images.map((src, i) => (
            <div key={src} style={{ position: 'absolute', inset: 0, opacity: i === (imageIndexes[dominant] ?? 0) ? 1 : 0, transition: 'opacity 1.8s ease-in-out', zIndex: i === (imageIndexes[dominant] ?? 0) ? 1 : 0 }}>
              <Image src={src} alt={currentProduct.name} fill style={{ objectFit: 'cover' }} sizes="100vw" />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, padding: '18px 24px 0' }}>
          {products.map((_, i) => (
            <button key={i} type="button" onClick={() => scrollToProduct(i)} style={{
              width: dominant === i ? 22 : 6, height: 6, borderRadius: 3, border: 'none', padding: 0,
              background: dominant === i ? '#fff' : '#222',
              transition: 'width 300ms ease, background 300ms ease', cursor: 'pointer',
            }} />
          ))}
        </div>
        <div style={{ padding: '24px 24px 36px' }}>
          <InfoContent
            product={currentProduct}
            onAddToCart={() => addToCart(currentProduct.id, 1, { name: currentProduct.name, price: Number(currentProduct.price), image: currentProduct.images[0] })}
            isLiked={likedItems.includes(currentProduct.id)}
            onToggleLike={() => toggleLike(currentProduct.id)}
          />
        </div>
      </section>
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
            <InfoContent
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
