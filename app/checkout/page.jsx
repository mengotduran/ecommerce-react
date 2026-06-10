'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '../../hooks/useCart';

const Checkout = dynamic(() => import('../../components/CheckoutForm/Checkout/Checkout'), {
  ssr: false,
  loading: () => (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px) 80px' }}>
      <div className="skeleton" style={{ height: 22, width: 110, borderRadius: 6, marginBottom: 32 }} />
      <div className="checkout-layout">
        <div className="checkout-form-col">
          {/* Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div className="skeleton" style={{ height: 26, width: 110, borderRadius: 13 }} />
            <div className="skeleton" style={{ height: 1, flex: 1 }} />
            <div className="skeleton" style={{ height: 26, width: 110, borderRadius: 13 }} />
          </div>
          {/* Form panel */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[0,1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 44, width: '100%', borderRadius: 8 }} />)}
            <div className="skeleton" style={{ height: 46, width: '100%', borderRadius: 10, marginTop: 8 }} />
          </div>
        </div>
        {/* Order summary */}
        <div className="checkout-summary-col" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="skeleton" style={{ height: 14, width: '50%', borderRadius: 4 }} />
          {[0,1,2].map((i) => <div key={i} className="skeleton" style={{ height: 12, width: '100%', borderRadius: 4 }} />)}
          <div className="skeleton" style={{ height: 1, width: '100%' }} />
          <div className="skeleton" style={{ height: 16, width: '40%', borderRadius: 4 }} />
        </div>
      </div>
    </div>
  ),
});

export default function CheckoutPage() {
  const { cart, emptyCart } = useCart();
  const [order, setOrder] = useState({});
  const [errorMessage] = useState('');

  const handleCaptureCheckout = (checkoutTokenId, newOrder) => {
    setOrder(newOrder);
    emptyCart();
  };

  return (
    <Checkout
      cart={cart}
      order={order}
      onCaptureCheckout={handleCaptureCheckout}
      error={errorMessage}
    />
  );
}
