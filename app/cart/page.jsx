'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';

// Only the cart *body* is loaded dynamically (client-only, to avoid a
// localStorage hydration mismatch). The close button and title are rendered
// statically by the page below, so they're always present and clickable —
// even while this chunk is still loading.
const CartBody = dynamic(() => import('../../components/Cart/Cart'), {
  ssr: false,
  loading: () => (
    <div className="cart-drawer__list">
      {[0, 1, 2].map((i) => (
        <div key={i} className="cart-drawer__item">
          <div className="skeleton cart-drawer__thumb" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center' }}>
            <div className="skeleton" style={{ height: 13, width: '75%', borderRadius: 4 }} />
            <div className="skeleton" style={{ height: 12, width: '40%', borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  ),
});

export default function CartPage() {
  const router = useRouter();
  const { cart, updateCartQty, removeFromCart, emptyCart } = useCart();

  const close = () => router.push('/');

  return (
    <div className="page-drawer-backdrop" onClick={close}>
      <div className="page-drawer" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={close} aria-label="close" className="page-drawer__close">
          <XMarkIcon style={{ width: 18, height: 18 }} />
        </button>

        <div className="page-drawer__content">
          <h1 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.3px', color: 'var(--foreground)', margin: '0 0 24px' }}>
            Shopping cart
          </h1>

          <CartBody
            cart={cart}
            handleUpdateCartQty={updateCartQty}
            handleRemoveFromCart={removeFromCart}
            handleEmptyCart={emptyCart}
          />
        </div>
      </div>
    </div>
  );
}
