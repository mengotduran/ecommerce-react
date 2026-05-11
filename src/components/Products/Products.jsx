import React, { useState } from 'react';
import { Grid, Typography, InputBase, Chip } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Product from './Product/Product';
import useStyles from './styles';

const PRICE_FILTERS = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $75', value: 'under75' },
  { label: '$75 – $125', value: '75to125' },
  { label: 'Over $125', value: 'over125' },
];

const Products = ({ products, onAddToCart, likedItems, onToggleLike }) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  const filtered = products.filter(product => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term);

    const matchesPrice =
      priceFilter === 'all' ||
      (priceFilter === 'under75' && product.price.raw < 75) ||
      (priceFilter === '75to125' && product.price.raw >= 75 && product.price.raw <= 125) ||
      (priceFilter === 'over125' && product.price.raw > 125);

    return matchesSearch && matchesPrice;
  });

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />

      <div className={classes.hero}>
        <Typography variant="h3" className={classes.heroTitle}>
          Discover Our Collection
        </Typography>
        <Typography variant="subtitle1" className={classes.heroSubtitle}>
          Premium products, delivered to your door
        </Typography>
      </div>

      <div className={classes.filterBar}>
        {/* Search */}
        <div className={classes.searchBox}>
          <Search className={classes.searchIcon} />
          <InputBase
            placeholder="Search products…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={classes.searchInput}
            inputProps={{ 'aria-label': 'search products' }}
          />
        </div>

        {/* Price filter chips */}
        <div className={classes.chips}>
          {PRICE_FILTERS.map(f => (
            <Chip
              key={f.value}
              label={f.label}
              onClick={() => setPriceFilter(f.value)}
              className={priceFilter === f.value ? classes.chipActive : classes.chip}
            />
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className={classes.resultRow}>
        <Typography variant="body2" className={classes.resultCount}>
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
        </Typography>
      </div>

      {filtered.length === 0 ? (
        <div className={classes.noResults}>
          <Typography variant="h6" color="textSecondary">
            No products match your search.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try a different keyword or price range.
          </Typography>
        </div>
      ) : (
        <Grid container spacing={3} className={classes.grid}>
          {filtered.map(product => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Product
                product={product}
                onAddToCart={onAddToCart}
                isLiked={likedItems.includes(product.id)}
                onToggleLike={onToggleLike}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </main>
  );
};

export default Products;
