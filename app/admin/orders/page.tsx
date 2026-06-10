'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:   { bg: '#fef9c3', color: '#854d0e' },
  PAID:      { bg: '#dcfce7', color: '#166534' },
  SHIPPED:   { bg: '#dbeafe', color: '#1e40af' },
  DELIVERED: { bg: '#f3f4f6', color: '#374151' },
  CANCELLED: { bg: '#fee2e2', color: '#991b1b' },
};

export default function AdminOrders() {
  const token = useAuthStore((s) => s.token);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const load = () => fetch(`${API}/orders`, { headers }).then((r) => r.json()).then(setOrders).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API}/orders/${id}/status`, { method: 'PATCH', headers, body: JSON.stringify({ status }) });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--foreground)', margin: '0 0 24px' }}>Orders</h1>

      {loading ? <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p> : orders.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>No orders yet.</p>
      ) : (
        <div className="table-scroll" style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 14 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Customer', 'Items', 'Total', 'Date', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase', color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const s = STATUS_COLORS[o.status] ?? STATUS_COLORS.PENDING;
                return (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--background)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ margin: 0, fontWeight: 500, color: 'var(--foreground)' }}>{o.user.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--muted)' }}>{o.user.email}</p>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>
                      {o.items.map((i: any) => (
                        <span key={i.id} style={{ display: 'block', fontSize: 12 }}>{i.product.name} ×{i.quantity}</span>
                      ))}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--accent)' }}>${Number(o.total).toFixed(2)}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        style={{ background: s.bg, color: s.color, border: 'none', borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer', outline: 'none' }}
                      >
                        {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
