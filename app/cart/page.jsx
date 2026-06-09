'use client';

import dynamic from 'next/dynamic';
import { useCart } from '../../hooks/useCart';

const Cart = dynamic(() => import('../../components/Cart/Cart'), {
  ssr: false,
  loading: () => (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 32px 80px' }}>
      <div className="skeleton" style={{ width: 60, height: 16, borderRadius: 4, marginBottom: 28 }} />
      <div className="skeleton" style={{ width: 160, height: 20, borderRadius: 4, marginBottom: 28 }} />
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[0,1,2].map((i) => (
            <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: 16, overflow: 'hidden' }}>
              <div className="skeleton" style={{ width: '100%', paddingBottom: '75%' }} />
              <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="skeleton" style={{ height: 14, width: '75%', borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 32, width: '100%', borderRadius: 8, marginTop: 8 }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ width: 300, flexShrink: 0, border: '1px solid var(--border-color)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="skeleton" style={{ height: 14, width: '50%', borderRadius: 4 }} />
          {[0,1,2].map((i) => <div key={i} className="skeleton" style={{ height: 12, width: '100%', borderRadius: 4 }} />)}
          <div className="skeleton" style={{ height: 1, width: '100%' }} />
          <div className="skeleton" style={{ height: 46, width: '100%', borderRadius: 10 }} />
        </div>
      </div>
    </div>
  ),
});

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, emptyCart } = useCart();

  return (
    <Cart
      cart={cart}
      handleUpdateCartQty={updateCartQty}
      handleRemoveFromCart={removeFromCart}
      handleEmptyCart={emptyCart}
    />
  );
}
