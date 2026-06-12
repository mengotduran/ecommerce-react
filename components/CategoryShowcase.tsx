'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/outline';
import CategoryDrawer from './CategoryDrawer';

type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
  images: string[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// steps (tile-widths) per millisecond — one tile drifts past roughly every 30s
const SPEED = 1 / 30000;

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono), ui-monospace, monospace',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

type Category = {
  name: string;
  image: string;
  description: string;
};

const CATEGORIES: Category[] = [
  {
    name: 'Supercars',
    image: 'https://images.unsplash.com/photo-1562141960-c9a127257324?w=1600&q=80&auto=format&fit=crop',
    description: "Engineering at its most uncompromising — limited-run machines built around raw power, aerodynamic obsession, and the kind of performance that rewrites what a road car can do.",
  },
  {
    name: 'Sports Cars',
    image: 'https://images.unsplash.com/photo-1742599968125-a790a680a605?w=1600&q=80&auto=format&fit=crop',
    description: "Balanced, driver-focused machines that put feedback and agility first — built for the road that finally opens up.",
  },
  {
    name: 'Muscle Cars',
    image: 'https://images.unsplash.com/photo-1536236160504-1f8201e4a74d?w=1600&q=80&auto=format&fit=crop',
    description: "Big displacement, bigger character. Unmistakable silhouettes and a soundtrack that announces itself long before you see them.",
  },
  {
    name: 'Cruisers',
    image: 'https://images.unsplash.com/photo-1567651336571-633e3d0877d5?w=1600&q=80&auto=format&fit=crop',
    description: "Low, long and unhurried — built for relaxed miles, classic lines, and a ride that's as much about presence as it is about distance.",
  },
  {
    name: 'Sport Bikes',
    image: 'https://images.unsplash.com/photo-1763244737839-220b4cd0259e?w=1600&q=80&auto=format&fit=crop',
    description: "Aggressive ergonomics, track-bred chassis and razor-sharp throttle response — for riders who measure a road by its corners.",
  },
  {
    name: 'Adventure',
    image: 'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?w=1600&q=80&auto=format&fit=crop',
    description: "Go-anywhere capability with long-haul comfort — built to handle the highway, the gravel, and everything in between.",
  },
];

// Track holds the category list twice back-to-back so the marquee can loop
// seamlessly: shifting by exactly one full set (CATEGORIES.length steps)
// lands on an identical-looking frame.
const TRACK = [...CATEGORIES, ...CATEGORIES];
const STEP_PERCENT = 100 / TRACK.length; // width of one tile, as % of track width

function CategoryTile({ category, onOpen }: { category: Category; onOpen: (name: string) => void }) {
  return (
    <button type="button" onClick={() => onOpen(category.name)} className="category-tile">
      <Image
        src={category.image}
        alt={category.name}
        fill
        draggable={false}
        style={{ objectFit: 'cover', pointerEvents: 'none', userSelect: 'none' }}
        sizes="50vw"
      />
      <div className="category-tile__overlay" />
      <span className="category-tile__label" style={MONO}>{category.name}</span>
    </button>
  );
}

export default function CategoryShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const trackRef     = useRef<HTMLDivElement>(null);
  const offsetRef    = useRef(0);      // current scroll position, in tile-widths
  const jumpRef      = useRef<number | null>(null); // target offset for arrow nav
  const pausedRef    = useRef(false);
  const rafRef       = useRef<number | null>(null);
  const lastTsRef    = useRef<number | null>(null);
  const draggingRef  = useRef(false);
  const dragStartXRef    = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const dragMovedRef = useRef(0);
  const suppressClickRef = useRef(false);

  const applyTransform = () => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${offsetRef.current * STEP_PERCENT}%)`;
    }
  };

  const wrapOffset = () => {
    if (offsetRef.current >= CATEGORIES.length) {
      offsetRef.current -= CATEGORIES.length;
      if (jumpRef.current !== null) jumpRef.current -= CATEGORIES.length;
    } else if (offsetRef.current < 0) {
      offsetRef.current += CATEGORIES.length;
      if (jumpRef.current !== null) jumpRef.current += CATEGORIES.length;
    }
  };

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const loop = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;

      if (!pausedRef.current && !draggingRef.current) {
        if (jumpRef.current !== null) {
          const remaining = jumpRef.current - offsetRef.current;
          if (Math.abs(remaining) < 0.002) {
            offsetRef.current = jumpRef.current;
            jumpRef.current = null;
          } else {
            offsetRef.current += remaining * 0.12;
          }
        } else {
          offsetRef.current += SPEED * dt;
        }

        // wrap around once a full set has scrolled past — the duplicated
        // track makes this seamless
        wrapOffset();
        applyTransform();
      } else {
        lastTsRef.current = ts;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };

  const jump = (dir: 1 | -1) => {
    const base = jumpRef.current ?? offsetRef.current;
    jumpRef.current = base + dir;
  };

  const startDrag = (clientX: number) => {
    draggingRef.current = true;
    dragStartXRef.current = clientX;
    dragStartOffsetRef.current = offsetRef.current;
    dragMovedRef.current = 0;
    suppressClickRef.current = false;
    jumpRef.current = null;
  };

  const updateDrag = (clientX: number) => {
    if (!draggingRef.current) return;
    const tile = trackRef.current?.firstElementChild as HTMLElement | null;
    const tileWidth = tile?.getBoundingClientRect().width || 1;
    const deltaX = clientX - dragStartXRef.current;
    dragMovedRef.current = Math.max(dragMovedRef.current, Math.abs(deltaX));
    offsetRef.current = dragStartOffsetRef.current - deltaX / tileWidth;
    wrapOffset();
    applyTransform();
  };

  const endDrag = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (dragMovedRef.current > 5) {
      suppressClickRef.current = true;
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    startDrag(e.clientX);
    const onMove = (ev: MouseEvent) => updateDrag(ev.clientX);
    const onUp = () => {
      endDrag();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onTouchStart = (e: React.TouchEvent) => startDrag(e.touches[0].clientX);
  const onTouchMove  = (e: React.TouchEvent) => updateDrag(e.touches[0].clientX);
  const onTouchEnd   = () => endDrag();

  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  const activeCategory = CATEGORIES.find((c) => c.name === openCategory) ?? null;

  return (
    <section className="category-showcase">
      <div className="category-showcase__header">
        <p className="category-showcase__title" style={MONO}>Shop by category</p>
        <div className="category-showcase__controls">
          <button type="button" onClick={togglePause} className="category-showcase__control" aria-label={paused ? 'play' : 'pause'}>
            {paused ? <PlayIcon style={{ width: 14, height: 14 }} /> : <PauseIcon style={{ width: 14, height: 14 }} />}
            <span style={MONO}>{paused ? 'Play' : 'Pause'}</span>
          </button>
          <button type="button" onClick={() => jump(-1)} className="category-showcase__control" aria-label="previous category">‹</button>
          <button type="button" onClick={() => jump(1)} className="category-showcase__control" aria-label="next category">›</button>
        </div>
      </div>

      <div
        className="category-showcase__viewport"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onClickCapture={onClickCapture}
      >
        <div ref={trackRef} className="category-showcase__track">
          {TRACK.map((cat, i) => (
            <CategoryTile key={`${cat.name}-${i}`} category={cat} onOpen={setOpenCategory} />
          ))}
        </div>
      </div>

      {activeCategory && (
        <CategoryDrawer
          category={activeCategory}
          products={products.filter((p) => p.category === activeCategory.name)}
          onClose={() => setOpenCategory(null)}
        />
      )}
    </section>
  );
}
