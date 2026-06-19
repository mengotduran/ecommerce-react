'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';
import { useUIStore } from '../../store/uiStore';
import { useCloseOnNavigate } from '../../hooks/useCloseOnNavigate';

// Only the cart *body* is loaded dynamically (client-only, to avoid a
// localStorage hydration mismatch). The close button and title are
// rendered statically so they're always present and clickable — even
// while this chunk is still loading.
const CartBody = dynamic(() => import('./Cart'), {
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

export default function CartDrawer() {
  const open = useUIStore((s) => s.cartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const { cart, updateCartQty, removeFromCart, emptyCart } = useCart();

  // Close automatically once a Link inside the drawer navigates to a
  // different route (rather than synchronously on click).
  useCloseOnNavigate(open, closeCart);

  // Lock page scroll while the drawer is open, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, closeCart]);

  return (
    <>
      <div className={`page-drawer-backdrop ${open ? 'open' : ''}`} onClick={closeCart} aria-hidden={!open} />
      <div className={`page-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Shopping cart" aria-hidden={!open}>
        <button type="button" onClick={closeCart} aria-label="close" className="page-drawer__close">
          <XMarkIcon style={{ width: 18, height: 18 }} />
        </button>

        <div className="page-drawer__content cart-drawer__content">
          <div className="cart-drawer__header">
            <h1 className="cart-drawer__title">Bag</h1>
          </div>
          {cart.total_items > 0 && (
            <p className="cart-drawer__count">
              {cart.total_items} {cart.total_items === 1 ? 'item' : 'items'}
            </p>
          )}

          <CartBody
            cart={cart}
            handleUpdateCartQty={updateCartQty}
            handleRemoveFromCart={removeFromCart}
            handleEmptyCart={emptyCart}
          />
        </div>
      </div>
    </>
  );
}
