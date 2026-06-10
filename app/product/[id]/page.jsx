'use client';

import dynamic from 'next/dynamic';
import { useCart } from '../../../hooks/useCart';
import { useLikedItems } from '../../../hooks/useLikedItems';

const ProductDetail = dynamic(() => import('../../../components/ProductDetail/ProductDetail'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: 'clamp(24px, 5vw, 32px) clamp(16px, 4vw, 32px) 0', maxWidth: 1200, margin: '0 auto' }}>
      <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 4, marginBottom: 32 }} />
      <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
        <div className="product-gallery" style={{ flex: '1 1 380px', minWidth: 0 }}>
          <div className="product-thumbnails">
            {[0,1,2].map((i) => <div key={i} className="skeleton" style={{ width: 64, height: 64, borderRadius: 10, flexShrink: 0 }} />)}
          </div>
          <div className="skeleton product-main-image" style={{ borderRadius: 16 }} />
        </div>
        <div style={{ flex: '1 1 300px', minWidth: 0, border: '1px solid var(--border-color)', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="skeleton" style={{ height: 28, width: '70%', borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 22, width: '30%', borderRadius: 6 }} />
          <div className="skeleton" style={{ height: 16, width: '20%', borderRadius: 20 }} />
          {[0,1,2].map((i) => <div key={i} className="skeleton" style={{ height: 14, width: `${90 - i * 10}%`, borderRadius: 6 }} />)}
          <div className="skeleton" style={{ height: 38, width: 120, borderRadius: 10 }} />
          <div className="skeleton" style={{ height: 46, width: '100%', borderRadius: 10 }} />
        </div>
      </div>
    </div>
  ),
});

export default function ProductDetailPage() {
  const { addToCart } = useCart();
  const { likedItems, toggleLike } = useLikedItems();

  return (
    <ProductDetail
      onAddToCart={addToCart}
      likedItems={likedItems}
      onToggleLike={toggleLike}
    />
  );
}
