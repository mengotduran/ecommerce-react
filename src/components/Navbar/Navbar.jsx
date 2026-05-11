import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import { Link, useLocation } from 'react-router-dom';
import useStyles from './styles';

const Navbar = ({ totalItems }) => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <Typography component={Link} to="/" className={classes.title}>
          ShopEase
        </Typography>
        {location.pathname !== '/checkout' && (
          <IconButton component={Link} to="/cart" className={classes.cartButton} aria-label="cart">
            <Badge badgeContent={totalItems} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
