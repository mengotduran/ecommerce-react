'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '../../store/uiStore';

// /cart is only reachable via direct navigation — the cart itself lives
// in the CartDrawer (opened from the navbar). Bounce to "/" and open it
// there.
export default function CartPage() {
  const router = useRouter();
  const openCart = useUIStore((s) => s.openCart);

  useEffect(() => {
    openCart();
    router.replace('/');
  }, [openCart, router]);

  return null;
}
