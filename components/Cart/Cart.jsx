'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import CartItem from './CartItem/CartItem';

// Renders only the cart *body* (empty state or items + summary). The page
// shell — back button and title — lives in app/cart/page.jsx so it stays
// interactive immediately, instead of being part of this client-only,
// dynamically-loaded chunk.
const Cart = ({ cart, handleRemoveFromCart, handleUpdateCartQty, handleEmptyCart }) => {
  if (!cart.line_items) return null;

  // Empty state
  if (!cart.line_items.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '80px 0', color: 'var(--muted)' }}>
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
    <div className="cart-layout">

      {/* Cards grid */}
      <div className="cart-grid">
        {cart.line_items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateCartQty={handleUpdateCartQty}
            onRemoveFromCart={handleRemoveFromCart}
          />
        ))}
      </div>

      {/* Summary sidebar */}
      <div className="cart-summary">
        <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', margin: '0 0 16px' }}>
          Order summary
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {cart.line_items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 170 }}>
                {item.name} × {item.quantity}
              </span>
              <span style={{ flexShrink: 0 }}>${(item.price.raw * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Subtotal</span>
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--accent)' }}>
              {cart.subtotal.formatted_with_symbol}
            </span>
          </div>
        </div>

        <Link
          href="/checkout"
          style={{
            display: 'block', textAlign: 'center', width: '100%',
            padding: '13px 0', borderRadius: 10, boxSizing: 'border-box',
            background: 'var(--accent)', color: '#000',
            fontSize: 13, fontWeight: 700, textDecoration: 'none',
            letterSpacing: '-0.1px',
          }}
        >
          Checkout →
        </Link>

        <button
          type="button"
          onClick={handleEmptyCart}
          style={{
            display: 'block', width: '100%', marginTop: 10,
            padding: '10px 0', borderRadius: 10,
            background: 'none', border: '1px solid var(--border-color)',
            color: 'var(--muted)', fontSize: 13, cursor: 'pointer',
            transition: 'border-color 150ms, color 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--foreground)'; e.currentTarget.style.color = 'var(--foreground)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--muted)'; }}
        >
          Empty cart
        </button>
      </div>

    </div>
  );
};

export default Cart;
