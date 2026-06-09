'use client';

import React from 'react';

const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {
  const lineTotal = `$${(item.price.raw * item.quantity).toFixed(2)}`;

  return (
    <article style={{
      background: 'var(--background)',
      border: '1px solid var(--border-color)',
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', background: 'var(--surface)', overflow: 'hidden' }}>
        <img
          src={item.image.url}
          alt={item.name}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 16px 16px' }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)', margin: '0 0 3px', lineHeight: 1.35 }}>
          {item.name}
        </p>
        <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 14px' }}>
          ${item.price.raw.toFixed(2)} each
        </p>

        {/* Row 1: qty controls + line total */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            border: '1px solid var(--border-color)', borderRadius: 8, overflow: 'hidden',
          }}>
            <button
              type="button"
              onClick={() => onUpdateCartQty(item.product_id, item.quantity - 1)}
              style={{ width: 30, height: 30, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              −
            </button>
            <span style={{ width: 26, textAlign: 'center', fontSize: 13, fontWeight: 500, color: 'var(--foreground)' }}>
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateCartQty(item.product_id, item.quantity + 1)}
              style={{ width: 30, height: 30, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              +
            </button>
          </div>

          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px', color: 'var(--foreground)' }}>
            {lineTotal}
          </span>
        </div>

        {/* Row 2: remove — full width, below */}
        <button
          type="button"
          onClick={() => onRemoveFromCart(item.product_id)}
          style={{
            width: '100%', padding: '7px 0', borderRadius: 8,
            background: 'none', border: '1px solid var(--border-color)',
            color: 'var(--muted)', fontSize: 12, cursor: 'pointer',
            transition: 'border-color 150ms, color 150ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--foreground)'; e.currentTarget.style.color = 'var(--foreground)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--muted)'; }}
        >
          Remove
        </button>
      </div>
    </article>
  );
};

export default CartItem;
