'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { TrashIcon } from '@heroicons/react/24/outline';

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
  const user  = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === 'SUPERADMIN';
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
  const load = () => fetch(`${API}/orders`, { headers })
    .then((r) => r.json())
    .then((d) => setOrders(Array.isArray(d) ? d : []))
    .catch(() => setOrders([]))
    .finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`${API}/orders/${id}/status`, { method: 'PATCH', headers, body: JSON.stringify({ status }) });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    await fetch(`${API}/orders/${confirmId}`, { method: 'DELETE', headers });
    setOrders((prev) => prev.filter((o) => o.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
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
                {['Customer', 'Items', 'Total', 'Date', 'Status', ...(isSuperAdmin ? [''] : [])].map((h) => (
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
                      <p style={{ margin: 0, fontWeight: 500, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {o.user?.name ?? o.customerName ?? 'Guest'}
                        {!o.user && <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px', color: 'var(--muted)', border: '1px solid var(--border-color)', borderRadius: 4, padding: '1px 5px' }}>Guest</span>}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--muted)' }}>{o.user?.email ?? o.email ?? '—'}</p>
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
                    {isSuperAdmin && (
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button onClick={() => setConfirmId(o.id)} title="Permanently delete order"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, transition: 'color 150ms' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#e11d48')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}>
                          <TrashIcon style={{ width: 15, height: 15 }} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          <div onClick={() => !deleting && setConfirmId(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90%', maxWidth: 420, background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 8px' }}>Delete order</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 18px' }}>
              Permanently delete this order? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmId(null)} disabled={deleting} style={{ flex: 1, padding: '10px 0', background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13, color: 'var(--muted)', cursor: deleting ? 'wait' : 'pointer' }}>
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting} style={{ flex: 1, padding: '10px 0', background: '#e11d48', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#fff', cursor: deleting ? 'wait' : 'pointer' }}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
