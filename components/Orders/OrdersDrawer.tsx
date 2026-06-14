'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useUIStore } from '../../store/uiStore';
import { useCloseOnNavigate } from '../../hooks/useCloseOnNavigate';

// Only the orders *body* is loaded dynamically (client-only, fetches from
// the API). The close button and title are rendered statically so they're
// always present and clickable — even while this chunk is still loading.
const OrdersBody = dynamic(() => import('./OrdersBody'), {
  ssr: false,
  loading: () => (
    <div className="cart-drawer__list">
      {[0, 1, 2].map((i) => (
        <div key={i} className="skeleton" style={{ height: 110, borderRadius: 10, margin: '12px 0' }} />
      ))}
    </div>
  ),
});

export default function OrdersDrawer() {
  const open = useUIStore((s) => s.ordersOpen);
  const closeOrders = useUIStore((s) => s.closeOrders);

  // Close automatically once a Link inside the drawer navigates to a
  // different route (rather than synchronously on click).
  useCloseOnNavigate(open, closeOrders);

  // Lock page scroll while the drawer is open, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeOrders(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, closeOrders]);

  return (
    <>
      <div className={`page-drawer-backdrop ${open ? 'open' : ''}`} onClick={closeOrders} aria-hidden={!open} />
      <div className={`page-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="My orders" aria-hidden={!open}>
        <button type="button" onClick={closeOrders} aria-label="close" className="page-drawer__close">
          <XMarkIcon style={{ width: 18, height: 18 }} />
        </button>

        <div className="page-drawer__content">
          <div className="cart-drawer__header">
            <h1 className="cart-drawer__title">Orders</h1>
          </div>

          <OrdersBody />
        </div>
      </div>
    </>
  );
}
