'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PlayIcon, PauseIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  images: string[];
};

const API_URL  = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SLIDE_MS = 6000;

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono), ui-monospace, monospace',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const iconBtn: React.CSSProperties = {
  background: 'transparent', border: 'none', padding: 4, cursor: 'pointer',
  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};

const pad = (n: number) => String(n).padStart(3, '0');

export default function HeroSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive]     = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [paused, setPaused]     = useState(false);
  const [outgoing, setOutgoing] = useState<{ index: number; direction: 'next' | 'prev' } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outgoingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/products/featured`)
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (paused || products.length <= 1) return;
    timerRef.current = setTimeout(() => {
      goTo(active + 1, 'next');
    }, SLIDE_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, paused, products.length]);

  if (products.length === 0) {
    return <div className="hero-slider" />;
  }

  const goTo = (i: number, dir?: 'next' | 'prev') => {
    const newIndex = ((i % products.length) + products.length) % products.length;
    if (newIndex === active) return;
    const dirToUse = dir ?? (newIndex > active ? 'next' : 'prev');
    setDirection(dirToUse);
    setOutgoing({ index: active, direction: dirToUse });
    setActive(newIndex);
    if (outgoingTimerRef.current) clearTimeout(outgoingTimerRef.current);
    outgoingTimerRef.current = setTimeout(() => setOutgoing(null), 650);
  };
  const product = products[active];

  const renderContent = (p: Product, index: number) => (
    <>
      <span style={{ ...MONO, fontSize: 13, color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
        {pad(index + 1)}
      </span>

      <div className="hero-slider__text-group">
        <p style={{ ...MONO, fontSize: 13, color: 'color(display-p3 1 .3333 0)', margin: 0 }}>{p.category}</p>

        <div className="hero-slider__top-row">
          <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.75rem)', fontWeight: 500, letterSpacing: '-1px', lineHeight: 1.1, margin: 0, color: 'var(--hero-fg)', minWidth: 0 }}>
            {p.name}
          </h2>
          <Link href={`/product/${p.id}`} style={{ ...MONO, fontSize: 13, color: 'var(--hero-fg)', textDecoration: 'underline', flexShrink: 0 }}>
            Shop now
          </Link>
          <span className="hero-slider__total-count" style={{ ...MONO, color: 'rgba(255,255,255,0.4)', fontSize: 13, flexShrink: 0 }}>
            {pad(products.length)}
          </span>
        </div>

        <div className="hero-slider__description">
          {(() => {
            const sentences = p.description.split(/(?<=[.!?])\s+/).filter(Boolean);
            const firstPart = sentences[0] || '';
            const restPart = sentences.slice(1).join(' ');
            const lineClamp = { fontFamily: "'MonumentGroteskMono', var(--font-mono), monospace", fontSize: 17, lineHeight: 1.7, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', color: 'var(--hero-fg-muted)' };
            return (
              <>
                <p style={lineClamp}>{firstPart}</p>
                {restPart && <p style={lineClamp}>{restPart}</p>}
              </>
            );
          })()}
        </div>
      </div>
    </>
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const SWIPE_THRESHOLD = 40;
    if (delta <= -SWIPE_THRESHOLD) goTo(active + 1, 'next');
    else if (delta >= SWIPE_THRESHOLD) goTo(active - 1, 'prev');
  };

  return (
    <section className="hero-slider" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Image + overlays */}
      <div className="hero-slider__image">
        {products.map((p, i) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: i === active ? 1 : 0,
              transition: 'opacity 1500ms cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: i === active ? 1 : 0,
            }}
          >
            <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="(min-width: 1024px) 65vw, 100vw" priority={i === 0} loading={i === 0 ? undefined : 'eager'} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
          </div>
        ))}

      </div>

      {/* Centered wordmark */}
      <p className="hero-slider__wordmark">
        Veloc<span style={{ color: 'var(--accent)' }}>aris</span>
      </p>

      {/* Total slide count — top-right on mobile, hidden on desktop where it
          already appears next to "Shop now" */}
      <span className="hero-slider__total-count-badge" style={{ ...MONO, color: 'rgba(255,255,255,0.4)' }}>
        {pad(products.length)}
      </span>

      {/* Text content */}
      <div className="hero-slider__content">
        {outgoing && (
          <div
            key={`out-${outgoing.index}`}
            className={`hero-slider__content-inner hero-slider__content-inner--out-${outgoing.direction}`}
          >
            {renderContent(products[outgoing.index], outgoing.index)}
          </div>
        )}
        <div
          key={`in-${active}`}
          className={`hero-slider__content-inner ${outgoing ? `hero-slider__content-inner--in-${direction}` : ''}`}
        >
          {renderContent(product, active)}
        </div>
      </div>

      {/* Controls */}
      <div className="hero-slider__controls">
        <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'play' : 'pause'} style={iconBtn}>
          {paused ? <PlayIcon style={{ width: 16, height: 16 }} /> : <PauseIcon style={{ width: 16, height: 16 }} />}
        </button>
        <div style={{ flex: 1, display: 'flex', gap: 6 }}>
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`go to slide ${i + 1}`}
              style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.25)', border: 'none', padding: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
              {i < active && <span style={{ position: 'absolute', inset: 0, background: '#fff' }} />}
              {i === active && (
                <span
                  key={active}
                  style={{
                    position: 'absolute', inset: 0, background: '#fff',
                    transformOrigin: 'left', animation: `hero-progress ${SLIDE_MS}ms linear forwards`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              )}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => goTo(active - 1, 'prev')} aria-label="previous slide" style={iconBtn}>
          <ChevronLeftIcon style={{ width: 16, height: 16 }} />
        </button>
        <button type="button" onClick={() => goTo(active + 1, 'next')} aria-label="next slide" style={iconBtn}>
          <ChevronRightIcon style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </section>
  );
}
