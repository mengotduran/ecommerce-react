import React from 'react';
import { Typography, Button, Card, CardActions, CardContent, CardMedia } from '@material-ui/core';
import useStyles from './styles';

const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {
  const classes = useStyles();
  const lineTotal = `$${(item.price.raw * item.quantity).toFixed(2)}`;

  return (
    <Card className={classes.root}>
      <CardMedia image={item.image.url} alt={item.name} className={classes.media} />
      <CardContent className={classes.cardContent}>
        <Typography variant="h6" className={classes.name}>{item.name}</Typography>
        <Typography variant="body1" className={classes.price}>{lineTotal}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <div className={classes.quantityControls}>
          <Button
            size="small"
            className={classes.qtyBtn}
            onClick={() => onUpdateCartQty(item.product_id, item.quantity - 1)}
          >
            −
          </Button>
          <Typography className={classes.qty}>{item.quantity}</Typography>
          <Button
            size="small"
            className={classes.qtyBtn}
            onClick={() => onUpdateCartQty(item.product_id, item.quantity + 1)}
          >
            +
          </Button>
        </div>
        <Button
          size="small"
          className={classes.removeBtn}
          onClick={() => onRemoveFromCart(item.product_id)}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default CartItem;
