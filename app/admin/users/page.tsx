'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { PlusIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const ROLE_BADGE: Record<string, { bg: string; color: string }> = {
  SUPERADMIN: { bg: '#fce7f3', color: '#9d174d' },
  ADMIN:      { bg: '#fef3c7', color: '#92400e' },
  CUSTOMER:   { bg: 'var(--border-color)', color: 'var(--muted)' },
};

export default function AdminUsers() {
  const token      = useAuthStore((s) => s.token);
  const authUser   = useAuthStore((s) => s.user);
  const isSuperAdmin = authUser?.role === 'SUPERADMIN';

  const [users, setUsers]         = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [noteModal, setNoteModal] = useState<{ type: 'promote' | 'demote'; id: string; name: string } | null>(null);
  const [note, setNote]           = useState('');
  const [toast, setToast]         = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [createForm, setCreateForm]   = useState({ name: '', email: '', password: '' });
  const [creating, setCreating]       = useState(false);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const load = () => {
    fetch(`${API}/users`, { headers })
      .then((r) => r.json())
      .then((d) => setUsers(Array.isArray(d) ? d : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleRoleClick = (id: string, name: string, currentRole: string) => {
    if (isSuperAdmin) {
      const role = currentRole === 'ADMIN' ? 'CUSTOMER' : 'ADMIN';
      fetch(`${API}/users/${id}/role`, { method: 'PATCH', headers, body: JSON.stringify({ role }) })
        .then((r) => r.json())
        .then((updated) => setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: updated.role } : u)));
    } else {
      setNote('');
      setNoteModal({ type: currentRole === 'ADMIN' ? 'demote' : 'promote', id, name });
    }
  };

  const submitRequest = async () => {
    if (!noteModal) return;
    const endpoint = noteModal.type === 'promote'
      ? `${API}/users/${noteModal.id}/request-promote`
      : `${API}/users/${noteModal.id}/request-demote`;
    await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ note }) });
    showToast(`${noteModal.type === 'promote' ? 'Promotion' : 'Demotion'} request submitted for SUPERADMIN approval`);
    setNoteModal(null); setNote('');
  };

  const createAdmin = async () => {
    setCreating(true);
    await fetch(`${API}/users`, { method: 'POST', headers, body: JSON.stringify(createForm) });
    setCreating(false); setCreateModal(false);
    setCreateForm({ name: '', email: '', password: '' });
    load();
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#1a1a1a', color: '#fff', padding: '12px 18px', borderRadius: 10, fontSize: 13, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClockIcon style={{ width: 15, height: 15, color: 'var(--accent)' }} /> {toast}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 24px' }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--foreground)', margin: 0 }}>Users</h1>
        {isSuperAdmin && (
          <button onClick={() => setCreateModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <PlusIcon style={{ width: 14, height: 14 }} /> Create admin
          </button>
        )}
      </div>

      {loading ? <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p> : (
        <div className="table-scroll" style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 14 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Name', 'Email', 'Role', 'Orders', 'Joined', 'Action'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase', color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const roleStyle = ROLE_BADGE[u.role] ?? ROLE_BADGE.CUSTOMER;
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--background)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#000', flexShrink: 0 }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: roleStyle.bg, color: roleStyle.color }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{u._count?.orders ?? 0}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: 12, whiteSpace: 'nowrap' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {u.id !== authUser?.id && u.role !== 'SUPERADMIN' && (
                        <button
                          onClick={() => handleRoleClick(u.id, u.name, u.role)}
                          style={{ fontSize: 12, padding: '4px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'none', cursor: 'pointer', color: 'var(--muted)', transition: 'all 150ms' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--muted)'; }}
                        >
                          {u.role === 'ADMIN' ? (isSuperAdmin ? 'Make Customer' : 'Request demote') : (isSuperAdmin ? 'Make Admin' : 'Request promote')}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Note modal for ADMIN approval requests */}
      {noteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          <div onClick={() => setNoteModal(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90%', maxWidth: 420, background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 8px' }}>
              Request {noteModal.type === 'promote' ? 'promotion' : 'demotion'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 18px' }}>
              Requesting to {noteModal.type === 'promote' ? 'promote' : 'demote'} <strong style={{ color: 'var(--foreground)' }}>{noteModal.name}</strong>. This requires SUPERADMIN approval.
            </p>
            <textarea
              placeholder="Reason for this request…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13, color: 'var(--foreground)', outline: 'none', resize: 'none', marginBottom: 16 }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setNoteModal(null)} style={{ flex: 1, padding: '10px 0', background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={submitRequest} style={{ flex: 1, padding: '10px 0', background: 'var(--accent)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#000', cursor: 'pointer' }}>
                Submit request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPERADMIN: create admin modal */}
      {createModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          <div onClick={() => setCreateModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90%', maxWidth: 420, background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>Create admin account</h2>
              <button onClick={() => setCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><XMarkIcon style={{ width: 18, height: 18 }} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {([['name', 'Full name', 'text'], ['email', 'Email address', 'email'], ['password', 'Password', 'password']] as [string, string, string][]).map(([key, label, type]) => (
                <div key={key}>
                  <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input type={type} value={(createForm as any)[key]} onChange={(e) => setCreateForm((f) => ({ ...f, [key]: e.target.value }))}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13, color: 'var(--foreground)', outline: 'none' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                  />
                </div>
              ))}
            </div>
            <button onClick={createAdmin} disabled={creating} style={{ marginTop: 20, width: '100%', padding: '11px 0', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: creating ? 'not-allowed' : 'pointer' }}>
              {creating ? 'Creating…' : 'Create admin'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
