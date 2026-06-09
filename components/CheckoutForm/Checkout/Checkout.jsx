'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/solid';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import Review from '../Review';

const STEPS = ['Shipping', 'Payment'];

const Checkout = ({ cart, order, onCaptureCheckout }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});

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
    <div style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: 80, paddingTop: 1 }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 32px) 0' }}>

        {/* Header */}
        <h1 style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.3px', color: 'var(--foreground)', margin: '0 0 32px' }}>
          Checkout
        </h1>

        {isConfirmed ? (
          /* ── Confirmation ── */
          <div style={{ maxWidth: 480, margin: '80px auto 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckIcon style={{ width: 28, height: 28, color: '#16a34a' }} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--foreground)', margin: 0, letterSpacing: '-0.5px' }}>
              Order confirmed!
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
              Thank you{order?.customer?.firstname ? `, ${order.customer.firstname}` : ''}! Your order has been placed and will be on its way soon.
            </p>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
              Ref: {Math.random().toString(36).slice(2, 10).toUpperCase()}
            </p>
            <Link
              href="/"
              style={{
                marginTop: 8, padding: '11px 28px', borderRadius: 10,
                background: 'var(--accent)', color: '#000',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}
            >
              Continue shopping
            </Link>
          </div>
        ) : !checkoutToken ? (
          /* ── Empty cart ── */
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
            <p style={{ fontSize: 15, marginBottom: 20 }}>Your cart is empty.</p>
            <Link
              href="/"
              style={{
                padding: '11px 28px', borderRadius: 10,
                background: 'var(--accent)', color: '#000',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
              }}
            >
              Shop now
            </Link>
          </div>
        ) : (
          /* ── Form + sidebar ── */
          <div className="checkout-layout">

            {/* Left: stepper + form */}
            <div className="checkout-form-col">

              {/* Stepper */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
                {STEPS.map((step, i) => {
                  const done   = i < activeStep;
                  const active = i === activeStep;
                  return (
                    <React.Fragment key={step}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: done ? 'var(--foreground)' : active ? 'var(--accent)' : 'transparent',
                          border: `1.5px solid ${done ? 'var(--foreground)' : active ? 'var(--accent)' : 'var(--border-color)'}`,
                          transition: 'all 200ms',
                        }}>
                          {done
                            ? <CheckIcon style={{ width: 13, height: 13, color: 'var(--background)' }} />
                            : <span style={{ fontSize: 11, fontWeight: 600, color: active ? '#000' : 'var(--muted)' }}>{i + 1}</span>
                          }
                        </div>
                        <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, color: active ? 'var(--foreground)' : 'var(--muted)', transition: 'color 200ms' }}>
                          {step}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div style={{ flex: 1, height: 1, background: 'var(--border-color)', margin: '0 12px' }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Form panel */}
              <div style={{ border: '1px solid var(--border-color)', borderRadius: 16, padding: 28 }}>
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
            </div>

            {/* Right: order summary */}
            <div className="checkout-summary-col">
              <Review checkoutToken={checkoutToken} />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Checkout;
