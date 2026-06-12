'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
  image: string;
  images: string[];
  badge: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const categories = ['Supercars', 'Sports Cars', 'Muscle Cars', 'Cruisers', 'Sport Bikes', 'Adventure'];

const BADGE: Record<string, { bg: string; color: string; label: string }> = {
  new:  { bg: '#dcfce7', color: '#166534', label: 'New' },
  hot:  { bg: '#fee2e2', color: '#991b1b', label: 'Hot' },
  sale: { bg: '#fef9c3', color: '#854d0e', label: 'Sale' },
};

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono), ui-monospace, monospace',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

function ProductCard({ product, liked, onLike, onAddToCart }: {
  product: Product;
  liked: boolean;
  onLike: () => void;
  onAddToCart: () => void;
}) {
  const badge = product.badge ? BADGE[product.badge] : null;
  const images = product.images?.length ? product.images : [product.image];
  const [activeImg, setActiveImg] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const idxRef      = useRef(0);
  // On touch devices the hover-cycling hijacks the first tap (tap = hover),
  // so the carousel only auto-cycles where a real pointer exists; touch swipes instead.
  const [canHover] = useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches);
  const touchStart  = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || images.length < 2) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    // horizontal swipe → change image; a plain tap falls through to the Link
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      setActiveImg((i) => dx < 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length);
    }
  };

  // Preload all carousel images on mount so they're cached before hover
  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On hover: switch to next image immediately, then keep cycling every 1.8s
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (hovered && images.length > 1) {
      idxRef.current = 1;
      setActiveImg(1);                             // instant first switch
      intervalRef.current = setInterval(() => {
        idxRef.current = (idxRef.current + 1) % images.length;
        setActiveImg(idxRef.current);
      }, 1800);
    } else {
      idxRef.current = 0;
      setActiveImg(0);                             // reset when mouse leaves
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hovered, images.length]);

  const prev = (e: React.MouseEvent) => { e.preventDefault(); setActiveImg((i) => (i - 1 + images.length) % images.length); };
  const next = (e: React.MouseEvent) => { e.preventDefault(); setActiveImg((i) => (i + 1) % images.length); };

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => canHover && setHovered(true)}
      onMouseLeave={() => canHover && setHovered(false)}
    >
      {/* Image carousel */}
      <Link
        href={`/product/${product.id}`}
        style={{ display: 'block', position: 'relative' }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div style={{ position: 'relative', width: '100%', paddingBottom: '80%', background: '#141414', overflow: 'hidden' }}>
          {images.map((src, i) => (
            <div key={src} style={{
              position: 'absolute', inset: 0,
              opacity: i === activeImg ? 1 : 0,
              transition: 'opacity 400ms ease',
            }}>
              {/* plain img bypasses Next.js lazy-load so all images are fetched on mount */}
              <img
                src={src}
                alt={`${product.name} view ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}

          {/* Badge */}
          {badge && (
            <span style={{
              ...MONO,
              position: 'absolute', top: 12, left: 12, zIndex: 2,
              background: 'rgba(10,10,10,0.8)', color: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: 10, fontWeight: 600,
              padding: '4px 9px',
            }}>
              {badge.label}
            </span>
          )}

          {/* Prev / Next arrows — shown on hover when multiple images */}
          {images.length > 1 && hovered && (
            <>
              <button onClick={prev} style={{
                position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%',
                width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 14, lineHeight: 1,
              }}>‹</button>
              <button onClick={next} style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
                background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%',
                width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 14, lineHeight: 1,
              }}>›</button>
            </>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div style={{
              position: 'absolute', bottom: 10, left: 0, right: 0, zIndex: 2,
              display: 'flex', justifyContent: 'center', gap: 5,
            }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setActiveImg(i); }}
                  style={{
                    width: i === activeImg ? 16 : 5, height: 5,
                    borderRadius: 3, border: 'none', padding: 0, cursor: 'pointer',
                    background: i === activeImg ? '#fff' : 'rgba(255,255,255,0.45)',
                    transition: 'width 250ms ease, background 250ms ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="catalogue-card__info" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 0 0' }}>
        <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="catalogue-card__name" style={{
            ...MONO, fontSize: 13, fontWeight: 700, lineHeight: 1.5, color: 'rgba(255,255,255,0.9)', margin: '0 0 8px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          }}>
            {product.name}
          </h3>
        </Link>
        <p className="catalogue-card__desc" style={{
          fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, margin: '0 0 auto',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          paddingBottom: 14,
        }}>
          {product.description}
        </p>

        {/* Price + Actions */}
        <div className="catalogue-card__footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, paddingBottom: 20 }}>
          <span className="catalogue-card__price" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.2px', color: 'rgba(255,255,255,0.9)' }}>
            ${product.price}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              type="button"
              aria-label={liked ? 'remove from wishlist' : 'add to wishlist'}
              onClick={onLike}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: liked ? 'var(--accent)' : 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
            >
              {liked
                ? <HeartSolid style={{ width: 16, height: 16 }} />
                : <HeartIcon style={{ width: 16, height: 16 }} />
              }
            </button>
            <button
              type="button"
              aria-label="add to cart"
              onClick={() => {
                onAddToCart();
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}
              className="catalogue-card__add"
              style={{
                ...MONO,
                background: 'none', border: 'none', padding: 0,
                color: 'rgba(255,255,255,0.9)',
                fontSize: 11, fontWeight: 600,
                textDecoration: 'underline', textUnderlineOffset: '3px',
                cursor: 'pointer',
              }}
            >
              {added ? 'Added' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

const ROWS_PER_PAGE = 2;
const CARD_MIN = 280;  // keep in sync with the grid's minmax()
const GRID_GAP = 16;

export default function ProductCatalogue() {
  const [products, setProducts]         = useState<Product[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const { addToCart }                   = useCart();
  const { likedItems, toggleLike }      = useLikedItems();
  const searchParams                    = useSearchParams();

  // Paged rendering: show ROWS_PER_PAGE rows at a time, load more as the
  // sentinel below the grid scrolls into view
  const [pages, setPages]             = useState(() => {
    if (typeof window === 'undefined') return 1;
    const saved = Number(sessionStorage.getItem('catalogue-pages'));
    return saved > 1 ? saved : 1;
  });
  const skipPageResetRef              = useRef(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cols, setCols]               = useState(4);
  const gridRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calcCols = () => {
      // mirrors the .catalogue-grid CSS: 2 columns below 640px, otherwise
      // repeat(auto-fill, minmax(CARD_MIN, 1fr))
      if (window.innerWidth <= 640) { setCols(2); return; }
      const w = gridRef.current?.clientWidth ?? 1200;
      setCols(Math.max(1, Math.floor((w + GRID_GAP) / (CARD_MIN + GRID_GAP))));
    };
    calcCols();
    window.addEventListener('resize', calcCols);
    return () => window.removeEventListener('resize', calcCols);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/products/catalogue`)
      .then((res) => res.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch(() => { setProducts([]); setLoading(false); });
  }, []);

  // Sync filter with URL params set by navbar links
  useEffect(() => {
    const badge    = searchParams.get('badge');
    const category = searchParams.get('category');
    if (badge)         setActiveFilter(`badge:${badge}`);
    else if (category) setActiveFilter(category);
    else               setActiveFilter('All');

    // Consume one-shot deep-link params (?category=/?badge=#catalogue) so the
    // filter + jump only apply once — without this, navigating to a product
    // and back lands on this same URL and re-applies the filter and re-jumps
    // to #catalogue every time.
    if (badge || category) {
      window.history.replaceState(window.history.state, '', window.location.pathname);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return products;
    if (activeFilter.startsWith('badge:')) {
      const badge = activeFilter.slice(6);
      return products.filter((p) => p.badge === badge);
    }
    return products.filter((p) => p.category === activeFilter);
  }, [products, activeFilter]);

  // Restart at the first page whenever the filter changes — but not on the
  // initial mount, where `pages` may have been restored from sessionStorage
  // to match the scroll position the user left off at
  useEffect(() => {
    if (skipPageResetRef.current) { skipPageResetRef.current = false; return; }
    setPages(1);
  }, [activeFilter]);

  useEffect(() => {
    sessionStorage.setItem('catalogue-pages', String(pages));
  }, [pages]);

  const visible = filtered.slice(0, pages * cols * ROWS_PER_PAGE);
  const hasMore = visible.length < filtered.length;


  return (
    <section style={{ background: '#0a0a0a', padding: '48px 32px 72px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ ...MONO, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          {activeFilter === 'All'         ? 'Browse all'
           : activeFilter === 'badge:new' ? 'New arrivals'
           : activeFilter === 'badge:sale'? 'Sale'
           : activeFilter}
        </h2>
        <span style={{ ...MONO, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{filtered.length} products</span>
      </div>


      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
        {[
          { label: 'All',          value: 'All' },
          { label: 'New arrivals', value: 'badge:new' },
          { label: 'Sale',         value: 'badge:sale' },
          ...categories.map((c) => ({ label: c, value: c })),
        ].map(({ label, value }) => {
          const active = value === activeFilter;
          return (
            <button
              key={value}
              type="button"
              onClick={() => setActiveFilter(value)}
              className={`catalogue-filter${active ? ' active' : ''}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div ref={gridRef} className="catalogue-grid">
        {loading
          ? Array(8).fill(0).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ width: '100%', paddingBottom: '80%', borderRadius: 0 }} />
                <div style={{ padding: '16px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="skeleton" style={{ height: 14, width: '75%', borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 12, width: '90%', borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 12, width: '70%', borderRadius: 4 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, paddingBottom: 20 }}>
                    <div className="skeleton" style={{ height: 16, width: '28%', borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 16, width: '24%', borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            ))
          : visible.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                liked={likedItems.includes(product.id)}
                onLike={() => toggleLike(product.id)}
                onAddToCart={() => addToCart(product.id, 1, { name: product.name, price: Number(product.price), image: product.image })}
              />
            ))
        }
      </div>

      {/* See more — loads the next set of rows, on both mobile and desktop */}
      {!loading && hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 0 8px' }}>
          <button
            type="button"
            className="catalogue-seemore"
            onClick={() => {
              setLoadingMore(true);
              setTimeout(() => {
                setPages((p) => p + 1);
                setLoadingMore(false);
              }, 350);
            }}
          >
            {loadingMore ? <span className="page-spinner" style={{ width: 14, height: 14 }} /> : 'See more'}
          </button>
        </div>
      )}

      </div>
    </section>
  );
}
