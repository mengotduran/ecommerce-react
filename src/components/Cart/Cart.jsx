import React from 'react';
import { Container, Typography, Button, Grid} from '@material-ui/core';
import {Link} from 'react-router-dom';
import CartItem from './CartItem/CartItem';
import 'bootstrap/dist/css/bootstrap.min.css';
import useStyles from './styles';

const Cart = ({cart, handleRemoveFromCart, handleUpdateCartQty, handleEmptyCart}) => {
    const classes = useStyles();

    const EmptyCart = () => (
        <Typography variant="subtitle1"> 
            You have no items in your shopping cart, 
            <Link to="/" className={classes.link}>start adding some Products</Link>!
        </Typography>
    );

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem item={item} onUpdateCartQty = {handleUpdateCartQty} onRemoveFromCart ={handleRemoveFromCart}/>
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant='h4'>
                    Subtotal: { cart.subtotal.formatted_with_symbol}
                </Typography>  
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" var="contained" color="secondary" onClick={handleEmptyCart}>EMPTY CART</Button>
                    <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" var="contained" color="primary">CHECKOUT</Button>
                </div>
            </div>
        </>
    );

    if(!cart.line_items) return 'Loading...';


  return ( 
    <Container>
        <div className={classes.toolbar} />
        <Typography className={classes.title} variant="h3" gutterBottom> Your Shopping Cart</Typography>
        { !cart.line_items.length ? <EmptyCart /> : <FilledCart />}
    </Container>
  )
}

export default Cart; 

