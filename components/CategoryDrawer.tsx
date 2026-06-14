'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
  images: string[];
};

type Category = {
  name: string;
  image: string;
  description: string;
};

const MONO: React.CSSProperties = {
  fontFamily: 'var(--font-mono), ui-monospace, monospace',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export default function CategoryDrawer({ category, products, onClose }: {
  category: Category;
  products: Product[];
  onClose: () => void;
}) {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="category-drawer-backdrop" onClick={onClose}>
      <div className="category-drawer" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="close" className="category-drawer__close">
          <XMarkIcon style={{ width: 20, height: 20 }} />
        </button>

        <div className="category-drawer__intro">
          <p style={{ ...MONO, fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 500, letterSpacing: '-1px', lineHeight: 1.15, margin: 0, color: 'rgba(255,255,255,0.85)' }}>
            {category.name}
          </p>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', margin: '12px auto 0', maxWidth: 460 }}>
            {category.description}
          </p>
        </div>

        <div className="category-drawer__products">
          {products.slice(0, 4).map((p) => {
            const image = p.images?.[0] || p.image;
            return (
              <div key={p.id} className="category-drawer__product">
                <Link href={`/product/${p.id}`} className="category-drawer__image-link">
                  <Image src={image} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="320px" />
                </Link>
                <div className="category-drawer__product-info">
                  <p style={{ ...MONO, fontSize: 13, fontWeight: 700, margin: 0, color: 'rgba(255,255,255,0.85)' }}>{p.name}</p>
                  <p style={{ ...MONO, fontSize: 11, fontWeight: 500, lineHeight: 1.7, margin: '16px 0 0', color: 'rgba(255,255,255,0.85)' }}>{p.description}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: '20px 0 0', color: 'rgba(255,255,255,0.85)' }}>${p.price}</p>
                </div>
              </div>
            );
          })}
          {products.length === 0 && (
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', padding: '0 24px 24px' }}>No products available in this category yet.</p>
          )}
        </div>

        <Link
          href={`/?category=${encodeURIComponent(category.name)}#catalogue`}
          scroll={false}
          onClick={onClose}
          className="category-drawer__shop-bar"
          style={MONO}
        >
          Shop {category.name}
        </Link>
      </div>
    </div>
  );
}
