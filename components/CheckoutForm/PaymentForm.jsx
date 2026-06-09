import React, { useEffect, useState } from 'react';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthStore } from '../../store/authStore';

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
      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 20px' }}>
        Payment details
      </p>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {() => (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Card details
                </label>
                <div style={{
                  padding: '13px 14px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 10,
                  background: 'var(--background)',
                  transition: 'border-color 150ms',
                }}>
                  <CardElement options={cardOptions} />
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', margin: '6px 0 24px' }}>
                Demo: use 4242 4242 4242 4242 · any future date · any CVC
              </p>

              {error && (
                <p style={{ fontSize: 12, color: '#e11d48', margin: '-16px 0 16px' }}>{error}</p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={backStep}
                  style={{
                    padding: '11px 20px', borderRadius: 10,
                    background: 'none', border: '1px solid var(--border-color)',
                    color: 'var(--muted)', fontSize: 13, cursor: 'pointer',
                    transition: 'border-color 150ms, color 150ms',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--foreground)'; e.currentTarget.style.color = 'var(--foreground)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--muted)'; }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '11px 28px', borderRadius: 10, border: 'none',
                    background: 'var(--accent)', color: '#000',
                    fontSize: 13, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? 'Placing order…' : `Pay ${checkoutToken.live.subtotal.formatted_with_symbol}`}
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
