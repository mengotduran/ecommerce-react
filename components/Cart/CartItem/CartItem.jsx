'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {
  const lineTotal = `$${(item.price.raw * item.quantity).toFixed(2)}`;

  return (
    <article className="cart-drawer__item">
      <div className="cart-drawer__thumb">
        <img
          src={item.image.url}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', margin: 0, lineHeight: 1.35, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {item.name}
          </p>
          <button
            type="button"
            onClick={() => onRemoveFromCart(item.product_id)}
            aria-label="Remove"
            style={{ flexShrink: 0, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted)', display: 'flex', transition: 'color 150ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            <XMarkIcon style={{ width: 15, height: 15 }} />
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
          ${item.price.raw.toFixed(2)} each
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <div style={{
            display: 'flex', alignItems: 'center', flexShrink: 0,
            border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden',
          }}>
            <button
              type="button"
              onClick={() => onUpdateCartQty(item.product_id, item.quantity - 1)}
              style={{ width: 24, height: 26, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              −
            </button>
            <span style={{ width: 20, textAlign: 'center', fontSize: 12, fontWeight: 500, color: 'var(--foreground)' }}>
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateCartQty(item.product_id, item.quantity + 1)}
              style={{ width: 24, height: 26, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              +
            </button>
          </div>

          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.3px', color: 'var(--foreground)' }}>
            {lineTotal}
          </span>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
