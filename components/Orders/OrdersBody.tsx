'use client';

import { useEffect, useState } from 'react';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  PENDING:   { bg: '#fef9c3', color: '#854d0e' },
  PAID:      { bg: '#dcfce7', color: '#166534' },
  SHIPPED:   { bg: '#dbeafe', color: '#1e40af' },
  DELIVERED: { bg: '#f3f4f6', color: '#374151' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b' },
};

// Only the orders *body* is loaded dynamically (client-only). The close
// button and title live in OrdersDrawer so they're always present and
// clickable, even while this chunk is still loading.
export default function OrdersBody() {
  const token = useAuthStore((s) => s.token);
  const ordersOpen = useUIStore((s) => s.ordersOpen);
  const openAuth = useUIStore((s) => s.openAuth);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Refetch on mount AND every time the drawer opens. This drawer is always
  // mounted in the layout, so a one-time mount fetch would serve the
  // page-load snapshot forever — a just-placed order wouldn't appear until
  // a manual refresh. We don't reset `loading` on refetch, so the current
  // list stays visible (no blank flash) while the fresh data loads in.
  useEffect(() => {
    if (!token) { setOrders([]); setLoading(false); return; }
    fetch(`${API}/orders/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, ordersOpen]);

  if (loading) return null;

  if (!token) {
    return (
      <div className="cart-drawer__guest-box">
        <p className="cart-drawer__guest-title">Continue as a registered user</p>
        <p className="cart-drawer__guest-text">
          Log in or create an account to view your order history.
        </p>
        <button type="button" className="cart-drawer__guest-link" onClick={() => openAuth('login')}>
          Log in or register
        </button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '60px 0', color: 'var(--muted)' }}>
        <ArchiveBoxIcon style={{ width: 40, height: 40, opacity: 0.3 }} />
        <p style={{ fontSize: 15, margin: 0 }}>No orders yet</p>
      </div>
    );
  }

  return (
    <div className="cart-drawer__list">
      {orders.map((order) => {
        const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING;
        const total = Number(order.total).toFixed(2);
        return (
          <div key={order.id} className="cart-drawer__item orders-drawer__group">
            <div className="orders-drawer__head">
              <div>
                <p className="orders-drawer__id">#{order.id.slice(0, 12).toUpperCase()}</p>
                <p className="orders-drawer__date">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="orders-drawer__meta">
                <span className="orders-drawer__total">${total}</span>
                <span className="orders-drawer__status" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="orders-drawer__items">
              {order.items?.map((item: any) => (
                <div key={item.id} className="orders-drawer__product">
                  {item.product?.image && (
                    <img src={item.product.image} alt={item.product.name} className="orders-drawer__thumb" />
                  )}
                  <div className="cart-drawer__details">
                    <p className="cart-drawer__name">{item.product?.name ?? 'Product'}</p>
                    <p className="cart-drawer__price">Qty {item.quantity} · ${Number(item.price).toFixed(2)} each</p>
                  </div>
                  <span className="cart-drawer__line-total">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
