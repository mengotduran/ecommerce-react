'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  PENDING:   { bg: '#fef9c3', color: '#854d0e' },
  PAID:      { bg: '#dcfce7', color: '#166534' },
  SHIPPED:   { bg: '#dbeafe', color: '#1e40af' },
  DELIVERED: { bg: '#f3f4f6', color: '#374151' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b' },
};

export default function OrdersPage() {
  const token = useAuthStore((s) => s.token);
  const user  = useAuthStore((s) => s.user);

  const [orders, setOrders]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/orders/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', paddingBottom: 80 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(32px, 5vw, 56px) clamp(16px, 4vw, 32px) 0' }}>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', color: 'var(--foreground)', margin: '0 0 4px' }}>
            My orders
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>
            {user?.name ? `Logged in as ${user.name}` : ''}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[0,1,2].map((i) => (
              <div key={i} className="skeleton" style={{ height: 96, borderRadius: 14 }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 24 }}>No orders yet.</p>
            <Link href="/" style={{ padding: '11px 28px', borderRadius: 10, background: 'var(--accent)', color: '#000', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Shop now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map((order) => {
              const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING;
              const total = Number(order.total).toFixed(2);
              return (
                <div key={order.id} style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 14, padding: 20 }}>
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 2px', fontFamily: 'monospace', letterSpacing: '0.3px' }}>
                        #{order.id.slice(0, 12).toUpperCase()}
                      </p>
                      <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>${total}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: statusStyle.bg, color: statusStyle.color }}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {order.items?.map((item: any) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {item.product?.image && (
                          <img src={item.product.image} alt={item.product.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border-color)' }} />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.product?.name ?? 'Product'}
                          </p>
                          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '2px 0 0' }}>
                            Qty {item.quantity} · ${Number(item.price).toFixed(2)} each
                          </p>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', flexShrink: 0 }}>
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
