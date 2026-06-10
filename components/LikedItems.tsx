'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { ShoppingBagIcon, CheckIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useLikedItems } from '../hooks/useLikedItems';
import { useCart } from '../hooks/useCart';

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

const BADGE: Record<string, { bg: string; color: string; label: string }> = {
  new:  { bg: '#dcfce7', color: '#166534', label: 'New' },
  hot:  { bg: '#fee2e2', color: '#991b1b', label: 'Hot' },
  sale: { bg: '#fef9c3', color: '#854d0e', label: 'Sale' },
};

export default function LikedItems() {
  const { likedItems, toggleLike } = useLikedItems();
  const { addToCart }              = useCart();
  const [products, setProducts]    = useState<Product[]>([]);
  const [loading, setLoading]      = useState(true);
  const [addedId, setAddedId]      = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/products/featured`).then((r) => r.json()).catch(() => []),
      fetch(`${API_URL}/products/catalogue`).then((r) => r.json()).catch(() => []),
    ]).then(([featured, catalogue]) => {
      setProducts([...featured, ...catalogue]);
      setLoading(false);
    });
  }, []);

  const liked = products.filter((p) => likedItems.includes(p.id));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px) 80px' }}>

        {/* Back */}
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 13, textDecoration: 'none', marginBottom: 28, transition: 'color 150ms' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          <ArrowLeftIcon style={{ width: 15, height: 15 }} />
          Back
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32 }}>
          <h1 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.3px', color: 'var(--foreground)', margin: 0 }}>
            Wishlist
          </h1>
          {!loading && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{liked.length} item{liked.length !== 1 ? 's' : ''}</span>}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {[0,1,2,3].map((i) => (
              <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: 16, overflow: 'hidden' }}>
                <div className="skeleton" style={{ width: '100%', paddingBottom: '80%' }} />
                <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="skeleton" style={{ height: 10, width: '45%', borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 14, width: '75%', borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 32, width: '100%', borderRadius: 10, marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && liked.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '80px 0', color: 'var(--muted)' }}>
            <HeartIcon style={{ width: 40, height: 40, opacity: 0.3 }} />
            <p style={{ fontSize: 15, margin: 0 }}>No liked items yet</p>
            <Link
              href="/"
              style={{ marginTop: 8, padding: '10px 24px', borderRadius: 10, background: 'var(--accent)', color: '#000', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
            >
              Browse products
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && liked.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {liked.map((product) => {
              const badge = product.badge ? BADGE[product.badge] : null;
              const img   = product.images?.[0] ?? product.image;
              return (
                <article
                  key={product.id}
                  style={{ background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 200ms, box-shadow 200ms' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--foreground)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
                >
                  {/* Image */}
                  <Link href={`/product/${product.id}`} style={{ display: 'block', position: 'relative' }}>
                    <div style={{ position: 'relative', width: '100%', paddingBottom: '80%', background: 'var(--surface)', overflow: 'hidden' }}>
                      <img src={img} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      {badge && (
                        <span style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, background: badge.bg, color: badge.color, fontSize: 10, fontWeight: 600, letterSpacing: '0.3px', padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase' }}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 16px 16px' }}>
                    <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 5px' }}>
                      {product.category}
                    </p>
                    <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.35, color: 'var(--foreground)', margin: '0 0 6px' }}>
                        {product.name}
                      </h3>
                    </Link>
                    <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px', color: 'var(--accent)' }}>
                        ${product.price}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                          type="button"
                          aria-label="remove from wishlist"
                          onClick={() => toggleLike(product.id)}
                          style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#e11d48', display: 'flex', alignItems: 'center', transition: 'opacity 150ms' }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                        >
                          <HeartSolid style={{ width: 17, height: 17 }} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(product.id, 1, { name: product.name, price: Number(product.price), image: img });
                            setAddedId(product.id);
                            setTimeout(() => setAddedId((cur) => cur === product.id ? null : cur), 2000);
                          }}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: addedId === product.id ? '#16a34a' : 'var(--accent)', color: '#000', border: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background 200ms' }}
                        >
                          {addedId === product.id
                            ? <><CheckIcon style={{ width: 13, height: 13 }} /> Added!</>
                            : <><ShoppingBagIcon style={{ width: 13, height: 13 }} /> Add</>
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
