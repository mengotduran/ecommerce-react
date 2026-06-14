'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '../../store/uiStore';

// /orders is only reachable via direct navigation — order history itself
// lives in the OrdersDrawer (opened from the navbar). Bounce to "/" and
// open it there.
export default function OrdersPage() {
  const router = useRouter();
  const openOrders = useUIStore((s) => s.openOrders);

  useEffect(() => {
    openOrders();
    router.replace('/');
  }, [openOrders, router]);

  return null;
}
