'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, HeartIcon, TruckIcon, ArrowPathIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { CheckIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/solid';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const ProductDetail = ({ onAddToCart, likedItems, onToggleLike }) => {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]       = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_URL}/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data || !data.id) { router.replace('/'); return; }
        setProduct(data);
        setLoading(false);
      })
      .catch(() => router.replace('/'));
  }, [id, router]);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (loading || !product) return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px, 5vw, 32px) clamp(16px, 4vw, 32px) 0' }}>
        {/* Back placeholder */}
        <div className="skeleton" style={{ width: 60, height: 16, marginBottom: 32 }} />

        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Image column */}
          <div style={{ flex: '1 1 380px', minWidth: 0, display: 'flex', gap: 12 }}>
            {/* Thumbnail strip */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton" style={{ width: 64, height: 64, borderRadius: 10 }} />
              ))}
            </div>
            {/* Main image */}
            <div className="skeleton" style={{ flex: 1, height: 420, borderRadius: 16 }} />
          </div>

          {/* Info column */}
          <div style={{
            flex: '1 1 300px', minWidth: 0,
            border: '1px solid var(--border-color)',
            borderRadius: 16, padding: 28,
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div className="skeleton" style={{ height: 28, width: '70%', borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 22, width: '30%', borderRadius: 6 }} />
            <div className="skeleton" style={{ height: 16, width: '20%', borderRadius: 20 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ height: 14, width: '100%', borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 14, width: '90%', borderRadius: 6 }} />
              <div className="skeleton" style={{ height: 14, width: '80%', borderRadius: 6 }} />
            </div>
            <div className="skeleton" style={{ height: 1, width: '100%' }} />
            <div className="skeleton" style={{ height: 38, width: 120, borderRadius: 10 }} />
            <div className="skeleton" style={{ height: 46, width: '100%', borderRadius: 10 }} />
          </div>
        </div>
      </div>
    </div>
  );

  const images  = product.images ?? [];
  const isLiked = likedItems?.includes(id);

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity, {
      name:  product.name,
      price: Number(product.price),
      image: images[0] ?? '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px, 5vw, 32px) clamp(16px, 4vw, 32px) 0' }}>

        {/* Back */}
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--muted)', fontSize: 13, padding: 0, marginBottom: 32,
            transition: 'color 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          <ArrowLeftIcon style={{ width: 15, height: 15 }} />
          Back
        </button>

        {/* Two-column layout */}
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* ── Left: images ── */}
          <div style={{ flex: '1 1 380px', minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  {images.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImg(i)}
                      style={{
                        width: 64, height: 64, padding: 0,
                        border: `2px solid ${i === activeImg ? 'var(--accent)' : 'var(--border-color)'}`,
                        borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                        background: 'var(--surface)', flexShrink: 0,
                        opacity: i === activeImg ? 1 : 0.55,
                        transform: i === activeImg ? 'scale(1)' : 'scale(0.96)',
                        transition: 'border-color 300ms ease, opacity 300ms ease, transform 300ms ease',
                      }}
                    >
                      <img src={src} alt={`view ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div style={{
                flex: 1, borderRadius: 16, overflow: 'hidden',
                background: 'var(--surface)',
                border: '1px solid var(--border-color)',
                position: 'relative', height: 420,
              }}>
                {images.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${product.name} view ${i + 1}`}
                    style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      opacity: i === activeImg ? 1 : 0,
                      transform: i === activeImg ? 'scale(1)' : 'scale(1.06)',
                      transition: 'opacity 500ms cubic-bezier(0.4,0,0.2,1), transform 600ms cubic-bezier(0.4,0,0.2,1)',
                      willChange: 'opacity, transform',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: info ── */}
          <div style={{
            flex: '1 1 300px', minWidth: 0,
            background: 'var(--background)',
            border: '1px solid var(--border-color)',
            borderRadius: 16, padding: 28,
          }}>
            {/* Title row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px', color: 'var(--foreground)', margin: 0, lineHeight: 1.2, flex: 1 }}>
                {product.name}
              </h1>
              <button
                type="button"
                aria-label="wishlist"
                onClick={() => onToggleLike?.(product.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginLeft: 8, color: isLiked ? '#e11d48' : 'var(--muted)', transition: 'color 150ms' }}
              >
                {isLiked
                  ? <HeartSolid style={{ width: 20, height: 20 }} />
                  : <HeartIcon style={{ width: 20, height: 20 }} />
                }
              </button>
            </div>

            {/* Price */}
            <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--accent)', margin: '0 0 12px' }}>
              ${product.price}
            </p>

            {/* In stock badge */}
            <span style={{
              display: 'inline-block', marginBottom: 16,
              padding: '3px 10px', borderRadius: 20,
              background: '#dcfce7', color: '#166534',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.3px',
            }}>
              In stock
            </span>

            {/* Description */}
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, margin: '0 0 24px' }}>
              {product.description}
            </p>

            {/* Divider */}
            <div style={{ borderTop: '1px solid var(--border-color)', marginBottom: 20 }} />

            {/* Quantity */}
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Quantity
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden', width: 'fit-content', marginBottom: 20 }}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{ width: 38, height: 38, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                −
              </button>
              <span style={{ width: 36, textAlign: 'center', fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                style={{ width: 38, height: 38, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                +
              </button>
            </div>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              style={{
                width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
                background: added ? '#16a34a' : 'var(--accent)',
                color: '#000000',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 24,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 200ms',
              }}
            >
              {added
                ? <><CheckIcon style={{ width: 16, height: 16 }} /> Added!</>
                : <><ShoppingBagIcon style={{ width: 16, height: 16 }} /> Add to cart</>
              }
            </button>

            {/* Features */}
            {(product.features ?? []).length > 0 && (
              <>
                <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted)', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Highlights
                </p>
                <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {product.features.map((f) => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--foreground)' }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--muted)', flexShrink: 0, marginTop: 6 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Trust badges */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { icon: TruckIcon,       label: 'Free shipping' },
                { icon: ArrowPathIcon,   label: '30-day returns' },
                { icon: ShieldCheckIcon, label: '2-year warranty' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 12 }}>
                  <Icon style={{ width: 15, height: 15 }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
