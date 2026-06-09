'use client';

import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, Button, IconButton } from '@material-ui/core';
import { AddShoppingCart, Favorite, FavoriteBorder } from '@material-ui/icons';
import { useRouter } from 'next/navigation';
import useStyles from './styles';

const Product = ({ product, onAddToCart, isLiked, onToggleLike }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Card className={classes.root} onClick={() => router.push(`/product/${product.id}`)}>
      <div className={classes.mediaWrapper}>
        <CardMedia
          className={classes.media}
          image={product.image.url}
          title={product.name}
        />
        <IconButton
          className={classes.heartBtn}
          onClick={(e) => { e.stopPropagation(); onToggleLike(product.id); }}
          aria-label="like"
        >
          {isLiked
            ? <Favorite className={classes.heartFilled} />
            : <FavoriteBorder className={classes.heartEmpty} />
          }
        </IconButton>
      </div>
      <CardContent className={classes.cardContent}>
        <div className={classes.nameRow}>
          <Typography variant="h6" className={classes.productName}>
            {product.name}
          </Typography>
          <Typography variant="h6" className={classes.price}>
            {product.price.formatted_with_symbol}
          </Typography>
        </div>
        <Typography
          variant="body2"
          className={classes.description}
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          fullWidth
          variant="contained"
          className={classes.addButton}
          startIcon={<AddShoppingCart />}
          onClick={(e) => { e.stopPropagation(); onAddToCart(product.id, 1); }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default Product;
