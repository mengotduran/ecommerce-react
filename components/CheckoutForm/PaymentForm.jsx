import React, { useEffect, useState } from 'react';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthStore } from '../../store/authStore';
import { SHIPPING_OPTIONS } from './AddressForm';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  : null;

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const PaymentForm = ({ checkoutToken, backStep, shippingData, onCaptureCheckout, nextStep }) => {
  const token   = useAuthStore((s) => s.token);
  const [darkMode, setDarkMode]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mq.matches);
    const h = (e) => setDarkMode(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  const cardOptions = {
    style: {
      base: {
        color: darkMode ? '#f5f5f5' : '#111111',
        fontFamily: 'inherit',
        fontSize: '14px',
        '::placeholder': { color: darkMode ? '#666' : '#aab7c4' },
      },
      invalid: { color: '#e11d48', iconColor: '#e11d48' },
    },
  };

  const shippingOption = SHIPPING_OPTIONS.find((o) => o.id === shippingData.shipping);
  const subtotalRaw = checkoutToken.live.subtotal.raw
    ?? checkoutToken.live.line_items.reduce((sum, item) => sum + item.line_total.raw, 0);
  const totalRaw = subtotalRaw + (shippingOption?.price ?? 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const items = checkoutToken.live.line_items.map((item) => ({
        productId: item.id,
        quantity:  item.quantity,
        price:     item.line_total.raw ?? item.unit_price,
      }));

      const orderData = {
        line_items: checkoutToken.live.line_items,
        customer: {
          firstname: shippingData.firstName,
          lastname:  shippingData.lastName,
          email:     shippingData.email,
        },
        shipping: {
          name:            'Primary',
          street:          shippingData.address1,
          town_city:       shippingData.city,
          postal_zip_code: shippingData.zip,
          country:         shippingData.country,
        },
      };

      if (token) {
        const res = await fetch(`${API}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ items }),
        });
        const saved = await res.json();
        orderData.id = saved.id;
      }

      onCaptureCheckout(checkoutToken.id, orderData);
      nextStep();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--foreground)', margin: '0 0 24px' }}>
        Payment details
      </p>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {() => (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Card details
                </label>
                <div style={{
                  padding: '10px 2px',
                  borderBottom: '1px solid var(--border-color)',
                  transition: 'border-color 150ms',
                }}>
                  <CardElement options={cardOptions} />
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: '8px 0 28px' }}>
                Demo: use 4242 4242 4242 4242 · any future date · any CVC
              </p>

              {error && (
                <p style={{ fontSize: 12, color: '#e11d48', margin: '-16px 0 16px' }}>{error}</p>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    width: '100%', padding: '15px 0', borderRadius: 0, border: 'none',
                    background: 'var(--accent)', color: '#000',
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? 'Placing order…' : `Pay $${totalRaw.toFixed(2)}`}
                </button>
                <button
                  type="button"
                  onClick={backStep}
                  style={{
                    fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px',
                    background: 'none', border: 'none', padding: 0,
                    color: 'var(--muted)', cursor: 'pointer', textAlign: 'center',
                    transition: 'color 150ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  ← Back
                </button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;
