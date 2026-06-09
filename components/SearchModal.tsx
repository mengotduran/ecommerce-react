'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  images: string[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery]       = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const inputRef                = useRef<HTMLInputElement>(null);

  // Fetch all products once on open
  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/products/featured`).then((r) => r.json()).catch(() => []),
      fetch(`${API_URL}/products/catalogue`).then((r) => r.json()).catch(() => []),
    ]).then(([featured, catalogue]) => {
      // dedupe by id
      const map = new Map<string, Product>();
      [...featured, ...catalogue].forEach((p: Product) => map.set(p.id, p));
      setProducts(Array.from(map.values()));
      setLoading(false);
    });
  }, []);

  // Auto-focus input
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? products.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    : [];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed', top: '12%', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, width: '90%', maxWidth: 620,
          background: 'var(--background)',
          border: '1px solid var(--border-color)',
          borderRadius: 20,
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Input row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--border-color)' }}>
          <MagnifyingGlassIcon style={{ width: 18, height: 18, color: 'var(--accent)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cars, bikes, categories…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 15, color: 'var(--foreground)',
              caretColor: 'var(--accent)',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--muted)', display: 'flex', alignItems: 'center' }}
            >
              <XMarkIcon style={{ width: 16, height: 16 }} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border-color)',
              borderRadius: 6, padding: '3px 8px',
              fontSize: 11, color: 'var(--muted)', cursor: 'pointer',
              letterSpacing: '0.2px', flexShrink: 0,
            }}
          >
            ESC
          </button>
        </div>

        {/* Results area */}
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>

          {/* Empty query — hint */}
          {!q && (
            <div style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              Start typing to search our collection…
            </div>
          )}

          {/* Loading */}
          {q && loading && (
            <div style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              Loading…
            </div>
          )}

          {/* No results */}
          {q && !loading && results.length === 0 && (
            <div style={{ padding: '48px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 28 }}>🔍</span>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)', margin: 0 }}>
                This car does not exist in our catalog
              </p>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                Try a different name or browse by category
              </p>
            </div>
          )}

          {/* Results list */}
          {q && !loading && results.length > 0 && (
            <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
              {results.map((product) => {
                const img = product.images?.[0] ?? product.image;
                return (
                  <li key={product.id}>
                    <Link
                      href={`/product/${product.id}`}
                      onClick={onClose}
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', transition: 'background 150ms', cursor: 'pointer' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Thumbnail */}
                        <div style={{ width: 54, height: 44, borderRadius: 10, overflow: 'hidden', background: 'var(--surface)', flexShrink: 0 }}>
                          <img
                            src={img}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        </div>

                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {product.name}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                            {product.category}
                          </p>
                        </div>

                        {/* Price */}
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)', flexShrink: 0 }}>
                          ${product.price}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer hint when results exist */}
          {q && results.length > 0 && (
            <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{results.length} result{results.length !== 1 ? 's' : ''} found</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
