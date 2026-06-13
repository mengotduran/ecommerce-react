import React from 'react';
import Link from 'next/link';
import { SHIPPING_OPTIONS } from './AddressForm';

const Review = ({ checkoutToken, shippingData = {} }) => {
  const items = checkoutToken.live.line_items;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalRaw = checkoutToken.live.subtotal.raw
    ?? items.reduce((sum, item) => sum + item.line_total.raw, 0);

  const shippingOption = SHIPPING_OPTIONS.find((o) => o.id === shippingData.shipping);
  const totalRaw = subtotalRaw + (shippingOption?.price ?? 0);

  return (
    <div>
      {/* Header */}
      <div className="checkout-summary-row" style={{ marginBottom: 16 }}>
        <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>Order summary</span>
        <span className="value">{itemCount} item{itemCount === 1 ? '' : 's'}</span>
      </div>

      <Link
        href="/cart"
        style={{
          display: 'inline-block', fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '1.5px', color: 'var(--foreground)', textDecoration: 'underline',
          marginBottom: 20,
        }}
      >
        Edit order
      </Link>

      {/* Line items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
        {items.map((item) => (
          <div key={item.id} className="checkout-summary-item">
            {item.image?.url && (
              <div className="checkout-summary-item__image">
                <img src={item.image.url} alt={item.name} />
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--foreground)' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', flexShrink: 0 }}>
                  {item.line_total.formatted_with_symbol}
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Qty: {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="checkout-summary-row">
          <span>Subtotal</span>
          <span className="value">${subtotalRaw.toFixed(2)}</span>
        </div>
        <div className="checkout-summary-row">
          <span>Shipping</span>
          <span className="value">{shippingOption ? `$${shippingOption.price.toFixed(2)}` : 'TBD'}</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 12, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)' }}>Total</span>
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--foreground)' }}>
          ${totalRaw.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default Review;
