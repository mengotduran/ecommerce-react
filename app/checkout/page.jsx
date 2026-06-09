'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCart } from '../../hooks/useCart';

const Checkout = dynamic(() => import('../../components/CheckoutForm/Checkout/Checkout'), {
  ssr: false,
  loading: () => (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 32px' }}>
      <div className="skeleton" style={{ height: 28, width: '40%', borderRadius: 6, margin: '0 auto 32px' }} />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 36 }}>
        {[0,1].map((i) => <div key={i} className="skeleton" style={{ height: 12, width: 120, borderRadius: 4 }} />)}
      </div>
      <div style={{ border: '1px solid var(--border-color)', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[0,1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 44, width: '100%', borderRadius: 8 }} />)}
        <div className="skeleton" style={{ height: 46, width: '100%', borderRadius: 10, marginTop: 8 }} />
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
