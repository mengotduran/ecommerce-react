'use client';

import React from 'react';
import { TrashIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useLikedItems } from '../../../hooks/useLikedItems';

const CartItem = ({ item, onUpdateCartQty, onRemoveFromCart }) => {
  const { likedItems, toggleLike } = useLikedItems();
  const liked = likedItems.includes(item.product_id);
  const lineTotal = `$${(item.price.raw * item.quantity).toFixed(2)}`;

  return (
    <article className="cart-drawer__item">
      <div className="cart-drawer__thumb">
        <img
          src={item.image.url}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <div className="cart-drawer__details">
        <p className="cart-drawer__name">{item.name}</p>
        <p className="cart-drawer__price">${item.price.raw.toFixed(2)} each</p>

        <div className="cart-drawer__qty-row">
          <span className="cart-drawer__qty-label">Qty</span>
          <div className="cart-drawer__stepper">
            <button type="button" onClick={() => onUpdateCartQty(item.product_id, item.quantity - 1)}>−</button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => onUpdateCartQty(item.product_id, item.quantity + 1)}>+</button>
          </div>
          <span className="cart-drawer__line-total">{lineTotal}</span>
        </div>

        <div className="cart-drawer__actions">
          <button
            type="button"
            onClick={() => toggleLike(item.product_id)}
            aria-label={liked ? 'Remove from saved items' : 'Save for later'}
          >
            {liked ? <BookmarkSolid /> : <BookmarkIcon />}
          </button>
          <button type="button" onClick={() => onRemoveFromCart(item.product_id)} aria-label="Remove">
            <TrashIcon />
          </button>
        </div>
      </div>
    </article>
  );
};

export default CartItem;
