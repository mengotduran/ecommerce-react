'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import CartItem from './CartItem/CartItem';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

// Renders only the cart *body* (empty state or items + summary). The page
// shell — close button and title — lives in app/cart/page.jsx so it stays
// interactive immediately, instead of being part of this client-only,
// dynamically-loaded chunk.
const Cart = ({ cart, handleRemoveFromCart, handleUpdateCartQty, handleEmptyCart }) => {
  const user = useAuthStore((s) => s.user);
  const openAuth = useUIStore((s) => s.openAuth);

  if (!cart.line_items) return null;

  // Empty state
  if (!cart.line_items.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '60px 0', color: 'var(--muted)' }}>
        <ShoppingBagIcon style={{ width: 40, height: 40, opacity: 0.3 }} />
        <p style={{ fontSize: 15, margin: 0 }}>Your cart is empty</p>
        <Link
          href="/"
          style={{
            marginTop: 8, padding: '10px 24px', borderRadius: 10,
            background: 'var(--accent)', color: '#000',
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-drawer__body">
      <div className="cart-drawer__list">
        {cart.line_items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
          />
        ))}
      </div>

      {!user && (
        <div className="cart-drawer__guest-box">
          <p className="cart-drawer__guest-title">Continue as a registered user</p>
          <p className="cart-drawer__guest-text">
            Log in or create an account to enjoy a personalized shopping experience and track your orders.
          </p>
          <button type="button" className="cart-drawer__guest-link" onClick={() => openAuth('login')}>
            Log in or register
          </button>
        </div>
      )}

      {/* Summary */}
      <div className="cart-drawer__footer">
        <div className="cart-drawer__subtotal">
          <span>Subtotal</span>
          <span>{cart.subtotal.formatted_with_symbol}</span>
        </div>

        <Link href="/checkout" className="cart-drawer__checkout" prefetch={false}>
          Checkout
        </Link>

        <button type="button" onClick={handleEmptyCart} className="cart-drawer__empty-link">
          Empty cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
