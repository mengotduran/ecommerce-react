'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { CheckIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  CREATE_PRODUCT:       { label: 'New product',       color: '#dcfce7' },
  DELETE_PRODUCT:       { label: 'Delete product',    color: '#fee2e2' },
  UPDATE_PRODUCT_PRICE: { label: 'Price change',       color: '#fef9c3' },
  PROMOTE_USER:         { label: 'Promote to admin',   color: '#dcfce7' },
  DEMOTE_ADMIN:         { label: 'Demote admin',       color: '#e0e7ff' },
  CANCEL_ORDER:         { label: 'Cancel order',       color: '#fce7f3' },
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  PENDING:  { bg: '#fef9c3', color: '#854d0e' },
  APPROVED: { bg: '#dcfce7', color: '#166534' },
  REJECTED: { bg: '#fee2e2', color: '#991b1b' },
};

export default function ApprovalsPage() {
  const token  = useAuthStore((s) => s.token);
  const user   = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [reason, setReason]     = useState<Record<string, string>>({});

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const load = () => {
    const url = isSuperAdmin ? `${API}/approvals` : `${API}/approvals/mine`;
    fetch(url, { headers })
      .then((r) => r.json())
      .then((d) => setRequests(Array.isArray(d) ? d : []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const act = async (id: string, action: 'approve' | 'reject') => {
    await fetch(`${API}/approvals/${id}/${action}`, {
      method: 'PATCH', headers,
      body: JSON.stringify({ reason: reason[id] || undefined }),
    });
    load();
  };

  const formatPayload = (type: string, payload: any) => {
    switch (type) {
      case 'CREATE_PRODUCT':       return `"${payload.name}" — $${payload.price} · ${payload.category}`;
      case 'DELETE_PRODUCT':       return `"${payload.productName}"`;
      case 'UPDATE_PRODUCT_PRICE': return `"${payload.productName}" $${payload.oldPrice} → $${payload.newPrice}`;
      case 'PROMOTE_USER':         return `${payload.userName} (${payload.userEmail})`;
      case 'DEMOTE_ADMIN':         return `${payload.userName} (${payload.userEmail})`;
      case 'CANCEL_ORDER':         return `Order ${payload.orderId?.slice(0, 8)}…`;
      default: return JSON.stringify(payload);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--foreground)', margin: '0 0 8px' }}>
        Approval requests
      </h1>
      <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 28px' }}>
        {isSuperAdmin ? 'Review and action requests submitted by admins.' : 'Track the status of your submitted requests.'}
      </p>

      {loading ? <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p>
        : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <ClockIcon style={{ width: 36, height: 36, margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: 14, margin: 0 }}>No requests yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {requests.map((r) => {
              const typeInfo   = TYPE_LABELS[r.type] ?? { label: r.type, color: 'var(--surface)' };
              const statusInfo = STATUS_STYLES[r.status] ?? STATUS_STYLES.PENDING;
              return (
                <div key={r.id} style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 14, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: typeInfo.color, color: '#000' }}>
                          {typeInfo.label}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: statusInfo.bg, color: statusInfo.color }}>
                          {r.status}
                        </span>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)', margin: '0 0 4px' }}>
                        {formatPayload(r.type, r.payload)}
                      </p>
                      {r.note && <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 4px' }}>Note: {r.note}</p>}
                      {r.reason && <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 4px' }}>Resolution: {r.reason}</p>}
                      <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>
                        {r.requestedBy && <span>By {r.requestedBy.name}</span>}
                        <span>{new Date(r.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Superadmin actions */}
                    {isSuperAdmin && r.status === 'PENDING' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 220 }}>
                        <input
                          type="text"
                          placeholder="Optional reason…"
                          value={reason[r.id] ?? ''}
                          onChange={(e) => setReason((p) => ({ ...p, [r.id]: e.target.value }))}
                          style={{ padding: '7px 12px', background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 12, color: 'var(--foreground)', outline: 'none' }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                        />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => act(r.id, 'approve')}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 0', background: '#dcfce7', color: '#166534', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            <CheckIcon style={{ width: 13, height: 13 }} /> Approve
                          </button>
                          <button onClick={() => act(r.id, 'reject')}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 0', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                            <XMarkIcon style={{ width: 13, height: 13 }} /> Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
