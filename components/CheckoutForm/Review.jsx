import React from 'react';

const Review = ({ checkoutToken }) => (
  <div>
    <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 14px' }}>
      Order summary
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
      {checkoutToken.live.line_items.map((item) => (
        <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
          <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>
            {item.name}
            <span style={{ color: 'var(--muted)', fontWeight: 400 }}> × {item.quantity}</span>
          </span>
          <span style={{ color: 'var(--foreground)', fontWeight: 500, flexShrink: 0, marginLeft: 16 }}>
            {item.line_total.formatted_with_symbol}
          </span>
        </div>
      ))}
    </div>
    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total</span>
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--foreground)' }}>
        {checkoutToken.live.subtotal.formatted_with_symbol}
      </span>
    </div>
  </div>
);

export default Review;
