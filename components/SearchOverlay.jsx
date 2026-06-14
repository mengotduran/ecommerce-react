'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCloseOnNavigate } from '../hooks/useCloseOnNavigate';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const categories = ['Supercars', 'Sports Cars', 'Muscle Cars', 'Cruisers', 'Sport Bikes', 'Adventure'];

export default function SearchOverlay() {
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [ready, setReady]       = useState(false);
  const inputRef                = useRef(null);

  // Listen for the open-search event fired by the Navbar button
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-search', handler);
    return () => window.removeEventListener('open-search', handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Fetch all products once when first opened
  useEffect(() => {
    if (!open || ready) return;
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/products/featured`).then((r) => r.json()).catch(() => []),
      fetch(`${API_URL}/products/catalogue`).then((r) => r.json()).catch(() => []),
    ]).then(([featured, catalogue]) => {
      const map = new Map();
      [...featured, ...catalogue].forEach((p) => map.set(p.id, p));
      setProducts(Array.from(map.values()));
      setReady(true);
      setLoading(false);
    });
  }, [open, ready]);

  // Auto-focus input when opened, lock page scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [open]);

  function close() {
    setOpen(false);
    setQuery('');
  }

  // Close automatically once a Link inside the overlay navigates to a
  // different route (rather than synchronously on click).
  useCloseOnNavigate(open, close);

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const results = q
    ? products.filter((p) =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    : [];

  const promoProducts = products.slice(0, 2);

  return (
    <div className="search-overlay">
      <div className="search-overlay__topbar">
        <span className="search-overlay__wordmark">
          Veloc<span style={{ color: 'var(--accent)' }}>aris</span>
        </span>
        <button type="button" onClick={close} aria-label="close" className="search-overlay__close">
          <XMarkIcon style={{ width: 20, height: 20 }} />
        </button>
      </div>

      <div className="search-overlay__content">
        <div className="search-overlay__body">
          <div className="search-overlay__search-col">
            <p className="drawer-tag" style={{ color: 'var(--foreground)', fontSize: 12 }}>Search</p>
            <div className="search-overlay__input-row">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type to search"
                className="drawer-input search-overlay__input"
              />
              {q && (
                <button type="button" onClick={() => setQuery('')} className="search-overlay__clear">
                  Clear
                </button>
              )}
            </div>

            {!q && (
              <>
                <p className="drawer-tag" style={{ color: 'var(--foreground)', fontSize: 12, marginTop: 40 }}>Suggestions</p>
                <ul className="search-overlay__suggestions">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <Link href={`/?category=${encodeURIComponent(cat)}#catalogue`} scroll={false} onClick={close}>
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {q && loading && (
              <p style={{ marginTop: 40, color: 'var(--muted)', fontSize: 13 }}>Loading…</p>
            )}

            {q && !loading && results.length === 0 && (
              <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)', margin: 0 }}>
                  This car does not exist in our catalog
                </p>
                <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                  Try a different name or browse by category
                </p>
              </div>
            )}
          </div>

          {!q && promoProducts.length > 0 && (
            <div className="search-overlay__promo">
              {promoProducts.map((product) => {
                const img = product.images?.[0] ?? product.image;
                return (
                  <Link key={product.id} href={`/product/${product.id}`} className="search-overlay__promo-item">
                    <img src={img} alt={product.name} />
                    <span className="search-overlay__promo-name">{product.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {q && !loading && results.length > 0 && (
          <div className="search-overlay__results-section">
            <p className="drawer-tag" style={{ color: 'var(--foreground)', fontSize: 12 }}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            <div className="search-overlay__grid">
              {results.map((product) => {
                const img = product.images?.[0] ?? product.image;
                return (
                  <Link key={product.id} href={`/product/${product.id}`} className="search-overlay__card">
                    <div className="search-overlay__card-thumb">
                      <img src={img} alt={product.name} />
                    </div>
                    <p className="search-overlay__card-name">{product.name}</p>
                    <p className="search-overlay__card-category">{product.category}</p>
                    <span className="search-overlay__card-price">${product.price}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
