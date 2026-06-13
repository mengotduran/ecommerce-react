'use client';

import React, { useState } from 'react';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useLikedItems } from '../../hooks/useLikedItems';
import { useCart } from '../../hooks/useCart';

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  images: string[];
};

const LikedItem = ({ product }: { product: Product }) => {
  const { toggleLike } = useLikedItems();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const img = product.images?.[0] ?? product.image;

  const handleAddToCart = () => {
    addToCart(product.id, 1, { name: product.name, price: Number(product.price), image: img });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <article className="cart-drawer__item">
      <div className="cart-drawer__thumb">
        <img
          src={img}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <div className="cart-drawer__details">
        <p className="cart-drawer__name">{product.name}</p>
        <p className="cart-drawer__price">${product.price}</p>

        <div className="cart-drawer__qty-row">
          <button type="button" className="cart-drawer__add-btn" onClick={handleAddToCart}>
            {added ? 'Added' : 'Add to bag'}
          </button>
        </div>

        <div className="cart-drawer__actions">
          <button
            type="button"
            onClick={() => toggleLike(product.id)}
            aria-label="Remove from liked items"
          >
            <HeartSolid />
          </button>
        </div>
      </div>
    </article>
  );
};

export default LikedItem;
