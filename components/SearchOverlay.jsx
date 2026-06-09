'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  function close() {
    setOpen(false);
    setQuery('');
  }

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const results = q
    ? products.filter((p) =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    : [];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        onClick={close}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      />

      {/* Modal box */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '90%', maxWidth: 620,
        background: 'var(--background)',
        border: '1px solid var(--border-color)',
        borderRadius: 20,
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        overflow: 'hidden',
      }}>

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
            <button type="button" onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', display: 'flex', padding: 2 }}>
              <XMarkIcon style={{ width: 16, height: 16 }} />
            </button>
          )}
          <button type="button" onClick={close}
            style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'var(--muted)', cursor: 'pointer', flexShrink: 0 }}>
            ESC
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 420, overflowY: 'auto' }}>

          {!q && (
            <p style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--muted)', fontSize: 13, margin: 0 }}>
              Start typing to search our collection…
            </p>
          )}

          {q && loading && (
            <p style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--muted)', fontSize: 13, margin: 0 }}>
              Loading…
            </p>
          )}

          {q && !loading && results.length === 0 && (
            <div style={{ padding: '48px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)', margin: 0 }}>
                This car does not exist in our catalog
              </p>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                Try a different name or browse by category
              </p>
            </div>
          )}

          {q && !loading && results.length > 0 && (
            <ul style={{ listStyle: 'none', margin: 0, padding: '8px 0' }}>
              {results.map((product) => {
                const img = product.images?.[0] ?? product.image;
                return (
                  <li key={product.id}>
                    <Link href={`/product/${product.id}`} onClick={close} style={{ textDecoration: 'none' }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 18px', transition: 'background 150ms', cursor: 'pointer' }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <div style={{ width: 54, height: 44, borderRadius: 10, overflow: 'hidden', background: 'var(--surface)', flexShrink: 0 }}>
                          <img src={img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {product.name}
                          </p>
                          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                            {product.category}
                          </p>
                        </div>
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

          {q && results.length > 0 && (
            <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>{results.length} result{results.length !== 1 ? 's' : ''} found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
