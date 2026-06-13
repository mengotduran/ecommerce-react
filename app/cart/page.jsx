'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';

// Only the cart *body* is loaded dynamically (client-only, to avoid a
// localStorage hydration mismatch). The back button and title are rendered
// statically by the page below, so they're always present and clickable —
// even while this chunk is still loading.
const CartBody = dynamic(() => import('../../components/Cart/Cart'), {
  ssr: false,
  loading: () => (
    <div className="cart-layout">
      <div className="cart-grid">
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ border: '1px solid var(--border-color)', borderRadius: 16, overflow: 'hidden' }}>
            <div className="skeleton" style={{ width: '100%', paddingBottom: '60%' }} />
            <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="skeleton" style={{ height: 14, width: '75%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 32, width: '100%', borderRadius: 8, marginTop: 8 }} />
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="skeleton" style={{ height: 14, width: '50%', borderRadius: 4 }} />
        {[0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 12, width: '100%', borderRadius: 4 }} />)}
        <div className="skeleton" style={{ height: 1, width: '100%' }} />
        <div className="skeleton" style={{ height: 46, width: '100%', borderRadius: 10 }} />
      </div>
    </div>
  ),
});

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, emptyCart } = useCart();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px, 5vw, 32px) clamp(16px, 4vw, 32px) 80px' }}>

        {/* Back — always goes home, always interactive */}
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--muted)', fontSize: 13, textDecoration: 'none',
            marginBottom: 28, transition: 'color 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          <ArrowLeftIcon style={{ width: 15, height: 15 }} />
          Continue shopping
        </Link>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
          <h1 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.3px', color: 'var(--foreground)', margin: 0 }}>
            Shopping cart
          </h1>
        </div>

        <CartBody
          cart={cart}
          handleUpdateCartQty={updateCartQty}
          handleRemoveFromCart={removeFromCart}
          handleEmptyCart={emptyCart}
        />
      </div>
    </div>
  );
}
