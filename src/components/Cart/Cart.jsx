import React from 'react';
import { Container, Typography, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import CartItem from './CartItem/CartItem';
import useStyles from './styles';

const Cart = ({ cart, handleRemoveFromCart, handleUpdateCartQty, handleEmptyCart }) => {
  const classes = useStyles();

  if (!cart.line_items) return null;

  return (
    <Container maxWidth="md">
      <div className={classes.toolbar} />
      <Typography className={classes.title} variant="h4" gutterBottom>
        Shopping Cart
      </Typography>
      {!cart.line_items.length ? (
        <div className={classes.emptyCart}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Button component={Link} to="/" variant="contained" className={classes.continueBtn}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <>
          <Grid container spacing={3}>
            {cart.line_items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <CartItem
                  item={item}
                  onUpdateCartQty={handleUpdateCartQty}
                  onRemoveFromCart={handleRemoveFromCart}
                />
              </Grid>
            ))}
          </Grid>
          <div className={classes.summary}>
            <Typography variant="h5" className={classes.subtotal}>
              Subtotal: <strong>{cart.subtotal.formatted_with_symbol}</strong>
            </Typography>
            <div className={classes.actions}>
              <Button
                variant="outlined"
                className={classes.emptyButton}
                onClick={handleEmptyCart}
              >
                Empty Cart
              </Button>
              <Button
                component={Link}
                to="/checkout"
                variant="contained"
                className={classes.checkoutButton}
              >
                Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default Cart;
