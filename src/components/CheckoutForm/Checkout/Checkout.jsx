import React, { useState, useMemo } from 'react';
import {
  Stepper, Step, StepLabel, Typography, Divider, Button, Paper, CssBaseline,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const classes = useStyles();

  const checkoutToken = useMemo(() => {
    if (!cart.line_items || !cart.line_items.length) return null;
    return {
      id: 'mock-token',
      live: {
        line_items: cart.line_items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          line_total: {
            formatted_with_symbol: `$${(item.price.raw * item.quantity).toFixed(2)}`,
          },
        })),
        subtotal: cart.subtotal,
      },
    };
  }, [cart]);

  const nextStep = () => setActiveStep(prev => prev + 1);
  const backStep = () => setActiveStep(prev => prev - 1);

  const next = (data) => {
    setShippingData(data);
    nextStep();
  };

  const Confirmation = () => (
    <div className={classes.confirmation}>
      <div className={classes.confirmIcon}>&#10003;</div>
      <Typography variant="h5" className={classes.confirmTitle} gutterBottom>
        Order Confirmed!
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Thank you, {order.customer && order.customer.firstname}! Your order has been placed successfully.
      </Typography>
      <Divider className={classes.divider} />
      <Typography variant="body2" color="textSecondary">
        Order ref: {Math.random().toString(36).substring(2, 10).toUpperCase()}
      </Typography>
      <Button component={Link} to="/" variant="contained" className={classes.backHomeButton}>
        Continue Shopping
      </Button>
    </div>
  );

  const ErrorScreen = () => (
    <div style={{ textAlign: 'center', padding: '32px 0' }}>
      <Typography variant="h6" color="error" gutterBottom>
        Something went wrong
      </Typography>
      <Typography color="textSecondary" gutterBottom>{error}</Typography>
      <Button component={Link} to="/" variant="outlined">Back to home</Button>
    </div>
  );

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        nextStep={nextStep}
        backStep={backStep}
        onCaptureCheckout={onCaptureCheckout}
      />
    );

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper} elevation={2}>
          <Typography variant="h4" align="center" className={classes.heading}>
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(step => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Confirmation />
          ) : !checkoutToken ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Typography color="textSecondary" gutterBottom>Your cart is empty.</Typography>
              <Button component={Link} to="/" variant="contained" className={classes.backHomeButton}>
                Shop Now
              </Button>
            </div>
          ) : error ? (
            <ErrorScreen />
          ) : (
            <Form />
          )}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
