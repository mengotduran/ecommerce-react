import React from 'react';
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Review from './Review';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#1a1a2e',
      fontFamily: '"Roboto", sans-serif',
      fontSize: '16px',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#e63946', iconColor: '#e63946' },
  },
};

const PaymentForm = ({ checkoutToken, backStep, shippingData, onCaptureCheckout, nextStep }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const orderData = {
      line_items: checkoutToken.live.line_items,
      customer: {
        firstname: shippingData.firstName,
        lastname: shippingData.lastName,
        email: shippingData.email,
      },
      shipping: {
        name: 'Primary',
        street: shippingData.address1,
        town_city: shippingData.city,
        postal_zip_code: shippingData.zip,
        country: shippingData.country,
      },
    };
    onCaptureCheckout(checkoutToken.id, orderData);
    nextStep();
  };

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider style={{ margin: '24px 0' }} />
      <Typography variant="h6" gutterBottom style={{ fontWeight: 600, color: '#1a1a2e' }}>
        Payment Details
      </Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <form onSubmit={handleSubmit}>
              <div style={{
                border: '1px solid #d0d0d0',
                borderRadius: '8px',
                padding: '14px 16px',
                marginBottom: '8px',
                backgroundColor: '#fafafa',
              }}>
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
              <Typography
                variant="caption"
                style={{ color: '#9ca3af', display: 'block', marginBottom: '24px' }}
              >
                Demo: use card 4242 4242 4242 4242, any future date, any CVC
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={backStep}
                  style={{ textTransform: 'none' }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: '#1a1a2e',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                    padding: '8px 24px',
                  }}
                >
                  Pay {checkoutToken.live.subtotal.formatted_with_symbol}
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm;
