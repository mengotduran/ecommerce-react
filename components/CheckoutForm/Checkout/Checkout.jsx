'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/solid';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import Review from '../Review';

const STEPS = ['Delivery', 'Payment'];

const Checkout = ({ cart, order, onCaptureCheckout }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});

  // Steps swap in place, so the browser keeps the old scroll offset —
  // without this you land mid/bottom of the next step
  useEffect(() => { window.scrollTo(0, 0); }, [activeStep]);

  const checkoutToken = useMemo(() => {
    if (!cart.line_items?.length) return null;
    return {
      id: 'mock-token',
      live: {
        line_items: cart.line_items.map((item) => ({
          id:         item.product_id,
          name:       item.name,
          quantity:   item.quantity,
          unit_price: item.price.raw,
          image:      item.image,
          line_total: { formatted_with_symbol: `$${(item.price.raw * item.quantity).toFixed(2)}`, raw: item.price.raw * item.quantity },
        })),
        subtotal: cart.subtotal,
      },
    };
  }, [cart]);

  const next     = (data) => { setShippingData(data); setActiveStep((s) => s + 1); };
  const backStep = ()     => setActiveStep((s) => s - 1);

  const isConfirmed = activeStep === STEPS.length;

  return (
    <div className="checkout-page" style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: 80, paddingTop: 1 }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px) 0' }}>

        {/* Header */}
        <div className="checkout-header">
          <p className="checkout-title">Checkout</p>
          {!isConfirmed && checkoutToken && (
            <div className="checkout-steps">
              {STEPS.map((step, i) => {
                const done   = i < activeStep;
                const active = i === activeStep;
                return (
                  <span key={step} className={`checkout-step ${active ? 'active' : ''} ${done ? 'done' : ''}`}>
                    {String(i + 1).padStart(2, '0')}. {step}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {isConfirmed ? (
          /* ── Confirmation ── */
          <div style={{ maxWidth: 420, margin: '80px auto 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, border: '1.5px solid var(--foreground)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckIcon style={{ width: 24, height: 24, color: 'var(--foreground)' }} />
            </div>
            <h2 style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--foreground)', margin: 0 }}>
              Order confirmed
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
              Thank you{order?.customer?.firstname ? `, ${order.customer.firstname}` : ''}! Your order has been placed and will be on its way soon.
            </p>
            <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Ref: {Math.random().toString(36).slice(2, 10).toUpperCase()}
            </p>
            <Link
              href="/"
              style={{
                marginTop: 8, padding: '14px 36px', borderRadius: 0,
                background: 'var(--accent)', color: '#000',
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px',
                textDecoration: 'none',
              }}
            >
              Continue shopping
            </Link>
          </div>
        ) : !checkoutToken ? (
          /* ── Empty cart ── */
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
            <p style={{ fontSize: 13, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '1px' }}>Your cart is empty.</p>
            <Link
              href="/"
              style={{
                padding: '14px 36px', borderRadius: 0,
                background: 'var(--accent)', color: '#000',
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px',
                textDecoration: 'none',
              }}
            >
              Shop now
            </Link>
          </div>
        ) : (
          /* ── Form + sidebar ── */
          <div className="checkout-layout">

            {/* Left: form */}
            <div className="checkout-form-col">
              {activeStep === 0
                ? <AddressForm next={next} defaultValues={shippingData} />
                : <PaymentForm
                    checkoutToken={checkoutToken}
                    shippingData={shippingData}
                    backStep={backStep}
                    nextStep={() => setActiveStep((s) => s + 1)}
                    onCaptureCheckout={onCaptureCheckout}
                  />
              }
            </div>

            {/* Right: order summary */}
            <div className="checkout-summary-col">
              <Review checkoutToken={checkoutToken} shippingData={shippingData} />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
