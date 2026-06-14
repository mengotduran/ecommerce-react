'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useLikedItems } from '../../hooks/useLikedItems';
import LikedItem from './LikedItem';

type Product = {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
  images: string[];
  badge: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Only the liked-items *body* is loaded dynamically (client-only). The
// close button and title live in LikedDrawer so they're always present
// and clickable, even while this chunk is still loading.
const LikedBody = () => {
  const { likedItems } = useLikedItems();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/products/featured`).then((r) => r.json()).catch(() => []),
      fetch(`${API_URL}/products/catalogue`).then((r) => r.json()).catch(() => []),
    ]).then(([featured, catalogue]) => {
      setProducts([...featured, ...catalogue]);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  const liked = products.filter((p) => likedItems.includes(p.id));

  if (!liked.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '60px 0', color: 'var(--muted)' }}>
        <HeartIcon style={{ width: 40, height: 40, opacity: 0.3 }} />
        <p style={{ fontSize: 15, margin: 0 }}>No liked items yet</p>
        <Link
          href="/"
          style={{
            marginTop: 8, padding: '10px 24px', borderRadius: 10,
            background: 'var(--accent)', color: '#000',
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
          }}
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-drawer__list">
      {liked.map((product) => (
        <LikedItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default LikedBody;
