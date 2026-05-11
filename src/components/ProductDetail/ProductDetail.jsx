import React, { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Container, Grid, Typography, Button, IconButton, Chip } from '@material-ui/core';
import {
  AddShoppingCart, Favorite, FavoriteBorder, ArrowBack,
  LocalShipping, VerifiedUser, Autorenew,
} from '@material-ui/icons';
import useStyles from './styles';

const ProductDetail = ({ products, onAddToCart, likedItems, onToggleLike }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const classes = useStyles();

  const product = products.find(p => p.id === id);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return <Navigate to="/" />;

  const isLiked = likedItems.includes(id);

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className={classes.root}>
      <div className={classes.toolbar} />
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} className={classes.backBtn}>
          Back
        </Button>

        <Grid container spacing={4} className={classes.content}>

          {/* ── Image section ── */}
          <Grid item xs={12} md={7}>
            <div className={classes.imageSection}>

              {/* Thumbnail strip */}
              <div className={classes.thumbnailStrip}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={activeImg === i ? classes.thumbActive : classes.thumb}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img.url} alt={img.label} className={classes.thumbImg} />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div className={classes.mainImageWrapper}>
                <img
                  src={product.images[activeImg].url}
                  alt={product.images[activeImg].label}
                  className={classes.mainImage}
                />
              </div>
            </div>
          </Grid>

          {/* ── Product info ── */}
          <Grid item xs={12} md={5}>
            <div className={classes.info}>

              <div className={classes.titleRow}>
                <Typography variant="h4" className={classes.name}>
                  {product.name}
                </Typography>
                <IconButton onClick={() => onToggleLike(product.id)} className={classes.likeBtn} aria-label="like">
                  {isLiked
                    ? <Favorite className={classes.heartFilled} />
                    : <FavoriteBorder className={classes.heartEmpty} />
                  }
                </IconButton>
              </div>

              <Typography variant="h4" className={classes.price}>
                {product.price.formatted_with_symbol}
              </Typography>

              <Chip label="In Stock" className={classes.inStock} size="small" />

              <Typography
                variant="body1"
                className={classes.description}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              {/* Quantity */}
              <div className={classes.section}>
                <Typography variant="body2" className={classes.sectionLabel}>Quantity</Typography>
                <div className={classes.quantityControls}>
                  <button className={classes.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <Typography className={classes.qtyValue}>{quantity}</Typography>
                  <button className={classes.qtyBtn} onClick={() => setQuantity(q => q + 1)}>+</button>
                </div>
              </div>

              <Button
                fullWidth
                variant="contained"
                className={added ? classes.addedButton : classes.addButton}
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
              >
                {added ? 'Added to Cart!' : 'Add to Cart'}
              </Button>

              {/* Features */}
              <Typography variant="subtitle1" className={classes.featuresTitle}>
                Product highlights
              </Typography>
              <ul className={classes.featuresList}>
                {product.details.map(detail => (
                  <li key={detail} className={classes.featureItem}>
                    <Typography variant="body2">{detail}</Typography>
                  </li>
                ))}
              </ul>

              {/* Trust badges */}
              <div className={classes.badges}>
                <div className={classes.badge}>
                  <LocalShipping className={classes.badgeIcon} />
                  <Typography variant="caption">Free Shipping</Typography>
                </div>
                <div className={classes.badge}>
                  <Autorenew className={classes.badgeIcon} />
                  <Typography variant="caption">30-Day Returns</Typography>
                </div>
                <div className={classes.badge}>
                  <VerifiedUser className={classes.badgeIcon} />
                  <Typography variant="caption">2-Year Warranty</Typography>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ProductDetail;
