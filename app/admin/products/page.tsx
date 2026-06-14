'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const EMPTY = { name: '', description: '', price: '', image: '', images: '', category: '', stock: '0', featured: false, badge: '', features: '' };

type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
interface ApprovalRequest { id: string; type: string; status: RequestStatus; payload: any; reason?: string; note?: string; }

function getDeleteRequest(requests: ApprovalRequest[], productId: string) {
  return requests
    .filter((r) => r.type === 'DELETE_PRODUCT' && r.payload?.productId === productId)
    .sort((a, b) => (a.status === 'PENDING' ? -1 : 1))[0] ?? null;
}

function getPriceRequest(requests: ApprovalRequest[], productId: string) {
  return requests
    .filter((r) => r.type === 'UPDATE_PRODUCT_PRICE' && r.payload?.productId === productId)
    .sort((a, b) => (a.status === 'PENDING' ? -1 : 1))[0] ?? null;
}

export default function AdminProducts() {
  const token        = useAuthStore((s) => s.token);
  const user         = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const [products, setProducts]     = useState<any[]>([]);
  const [requests, setRequests]     = useState<ApprovalRequest[]>([]);
  const [deleted, setDeleted]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState<'create' | 'edit' | null>(null);
  const [form, setForm]             = useState<any>(EMPTY);
  const [editId, setEditId]         = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);
  const [noteModal, setNoteModal]   = useState<{ type: 'delete' | 'price'; id: string; product?: any } | null>(null);
  const [note, setNote]             = useState('');
  const [toast, setToast]           = useState('');

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const load = useCallback(async () => {
    const [prods, reqs, del] = await Promise.all([
      fetch(`${API}/products`, { headers }).then((r) => r.json()),
      isSuperAdmin ? Promise.resolve([]) : fetch(`${API}/approvals/mine`, { headers }).then((r) => r.json()),
      fetch(`${API}/products/deleted`, { headers }).then((r) => r.json()).catch(() => []),
    ]);
    setProducts(Array.isArray(prods) ? prods : []);
    setRequests(Array.isArray(reqs) ? reqs : []);
    setDeleted(Array.isArray(del) ? del : []);
    setLoading(false);
  }, [token, isSuperAdmin]);

  useEffect(() => { load(); }, [load]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal('create'); };
  const openEdit   = (p: any) => {
    setForm({ ...p, price: String(p.price), stock: String(p.stock), images: (p.images ?? []).join(', '), features: (p.features ?? []).join(', ') });
    setEditId(p.id); setModal('edit');
  };

  const save = async () => {
    setSaving(true);
    const body = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images: form.images ? form.images.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      features: form.features ? form.features.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      badge: form.badge || null,
    };

    if (modal === 'edit' && !isSuperAdmin) {
      const original = products.find((p) => p.id === editId);
      if (original && Number(original.price) !== body.price) {
        setNoteModal({ type: 'price', id: editId!, product: { ...body, originalPrice: Number(original.price) } });
        setSaving(false); setModal(null); return;
      }
    }

    const url    = modal === 'edit' ? `${API}/products/${editId}` : `${API}/products`;
    const method = modal === 'edit' ? 'PATCH' : 'POST';
    const data   = await fetch(url, { method, headers, body: JSON.stringify(body) }).then((r) => r.json());

    if (data?.status === 'PENDING') {
      showToast(modal === 'create'
        ? 'Product submitted for SUPERADMIN approval — it will appear once approved'
        : 'Price change request submitted — awaiting SUPERADMIN approval');
    }
    setSaving(false); setModal(null); load();
  };

  const remove = (id: string, name: string) => {
    if (isSuperAdmin) {
      if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
      fetch(`${API}/products/${id}`, { method: 'DELETE', headers }).then(load);
    } else {
      setNote(''); setNoteModal({ type: 'delete', id });
    }
  };

  const restore = async (id: string, name: string) => {
    await fetch(`${API}/products/${id}/restore`, { method: 'PATCH', headers });
    showToast(`"${name}" restored`);
    load();
  };

  const restoreAll = async () => {
    await fetch(`${API}/products/restore-all`, { method: 'PATCH', headers });
    showToast('All deleted products restored');
    load();
  };

  const submitRequest = async () => {
    if (!noteModal) return;
    const data = noteModal.type === 'delete'
      ? await fetch(`${API}/products/${noteModal.id}`, { method: 'DELETE', headers, body: JSON.stringify({ note }) }).then((r) => r.json())
      : await fetch(`${API}/products/${noteModal.id}`, { method: 'PATCH', headers, body: JSON.stringify({ ...noteModal.product, note }) }).then((r) => r.json());

    if (data?.status === 'PENDING') showToast('Request submitted — awaiting SUPERADMIN approval');
    setNoteModal(null); setNote(''); load();
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#1a1a1a', color: '#fff', padding: '12px 18px', borderRadius: 10, fontSize: 13, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ClockIcon style={{ width: 15, height: 15, color: 'var(--accent)', flexShrink: 0 }} /> {toast}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--foreground)', margin: 0 }}>Products</h1>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <PlusIcon style={{ width: 14, height: 14 }} /> Add product
        </button>
      </div>

      {loading ? <p style={{ color: 'var(--muted)', fontSize: 14 }}>Loading…</p> : (
        <div className="table-scroll" style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 14 }}>
          <table style={{ width: '100%', minWidth: 760, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase', color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const deleteReq = getDeleteRequest(requests, p.id);
                const priceReq  = getPriceRequest(requests, p.id);
                const hasPendingDelete   = deleteReq?.status === 'PENDING';
                const hasRejectedDelete  = deleteReq?.status === 'REJECTED';
                const hasPendingPrice    = priceReq?.status === 'PENDING';
                const hasRejectedPrice   = priceReq?.status === 'REJECTED';

                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: hasPendingDelete ? 0.65 : 1 }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--background)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Product */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.image} alt={p.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{p.name}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{p.category}</td>

                    {/* Price — show pending badge if price change request is open */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>${Number(p.price).toFixed(2)}</span>
                        {hasPendingPrice && (
                          <span style={{ fontSize: 10, fontWeight: 600, color: '#854d0e', background: '#fef9c3', border: '1px solid #fde047', borderRadius: 4, padding: '1px 5px', whiteSpace: 'nowrap' }}>
                            → ${priceReq!.payload.newPrice} pending
                          </span>
                        )}
                        {hasRejectedPrice && (
                          <span title={priceReq!.reason ?? ''} style={{ fontSize: 10, fontWeight: 600, color: '#991b1b', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 4, padding: '1px 5px', whiteSpace: 'nowrap', cursor: 'help' }}>
                            price change denied
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '12px 16px', color: 'var(--foreground)' }}>{p.stock}</td>

                    {/* Featured */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: p.featured ? '#dcfce7' : 'var(--border-color)', color: p.featured ? '#166534' : 'var(--muted)' }}>
                        {p.featured ? 'Yes' : 'No'}
                      </span>
                    </td>

                    {/* Status + actions — one column so the icons sit under the Status header */}
                    <td style={{ padding: '12px 16px' }}>
                      {hasPendingDelete && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#fef9c3', color: '#854d0e', border: '1px solid #fde047', whiteSpace: 'nowrap', marginBottom: 6 }}>
                          <ClockIcon style={{ width: 11, height: 11 }} /> Deletion pending
                        </span>
                      )}
                      {hasRejectedDelete && (
                        <span title={deleteReq!.reason ? `Reason: ${deleteReq!.reason}` : 'No reason provided'} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', cursor: 'help', whiteSpace: 'nowrap', marginBottom: 6 }}>
                          <XCircleIcon style={{ width: 11, height: 11 }} /> Deletion denied
                        </span>
                      )}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, transition: 'color 150ms' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}>
                          <PencilIcon style={{ width: 15, height: 15 }} />
                        </button>

                        {hasPendingDelete ? (
                          <span title="Deletion request is awaiting SUPERADMIN approval" style={{ padding: 4, color: '#854d0e', cursor: 'default' }}>
                            <ClockIcon style={{ width: 15, height: 15 }} />
                          </span>
                        ) : (
                          <button onClick={() => remove(p.id, p.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, transition: 'color 150ms' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#e11d48')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}>
                            <TrashIcon style={{ width: 15, height: 15 }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Deleted products — soft-deleted items, restorable */}
      {!loading && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, margin: '0 0 4px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>
              Deleted products{deleted.length > 0 ? ` (${deleted.length})` : ''}
            </h2>
            {deleted.length > 1 && (
              <button onClick={restoreAll}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                <ArrowUturnLeftIcon style={{ width: 13, height: 13 }} /> Restore all
              </button>
            )}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 14px' }}>
            Hidden from the store but kept for order history. Restore to make them live again.
          </p>
          {deleted.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--muted)', padding: '16px 0' }}>No deleted products.</p>
          ) : (
            <div className="table-scroll" style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 14 }}>
              <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: 13 }}>
                <tbody>
                  {deleted.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={p.image} alt={p.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0, opacity: 0.6 }} />
                          <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{p.category}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{p.featured ? 'Featured' : 'Catalogue'}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button onClick={() => restore(p.id, p.name)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 12, fontWeight: 600, color: 'var(--muted)', cursor: 'pointer', transition: 'all 150ms' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--muted)'; }}>
                          <ArrowUturnLeftIcon style={{ width: 13, height: 13 }} /> Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          <div onClick={() => setModal(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90%', maxWidth: 560, background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 28, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>{modal === 'create' ? 'Add product' : 'Edit product'}</h2>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><XMarkIcon style={{ width: 18, height: 18 }} /></button>
            </div>
            {!isSuperAdmin && (
              <p style={{ fontSize: 12, color: '#854d0e', background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, padding: '8px 12px', marginBottom: 16 }}>
                {modal === 'create'
                  ? 'New products require SUPERADMIN approval before going live.'
                  : 'Price changes require SUPERADMIN approval and will be submitted as a request.'}
              </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[['name','Name','text'],['category','Category','text'],['price','Price','number'],['stock','Stock','number'],['image','Main image URL','text'],['images','Extra images (comma-separated)','text'],['badge','Badge (new/sale/hot)','text'],['features','Features (comma-separated)','text']].map(([key,label,type]) => (
                <div key={key} style={{ gridColumn: ['images','features','image'].includes(key) ? 'span 2' : 'span 1' }}>
                  <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>{label}</label>
                  <input type={type} value={form[key] ?? ''} onChange={(e) => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13, color: 'var(--foreground)', outline: 'none' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                  />
                </div>
              ))}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--muted)' }}>Description</label>
                <textarea value={form.description ?? ''} onChange={(e) => setForm((f: any) => ({ ...f, description: e.target.value }))} rows={3}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13, color: 'var(--foreground)', outline: 'none', resize: 'vertical' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" id="featured" checked={!!form.featured} onChange={(e) => setForm((f: any) => ({ ...f, featured: e.target.checked }))} />
                <label htmlFor="featured" style={{ fontSize: 13, color: 'var(--foreground)', cursor: 'pointer' }}>Featured on homepage</label>
              </div>
            </div>
            <button onClick={save} disabled={saving} style={{ marginTop: 20, width: '100%', padding: '11px 0', background: 'var(--accent)', color: '#000', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
              {saving ? 'Submitting…' : modal === 'create' ? (isSuperAdmin ? 'Create product' : 'Submit for approval') : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      {/* Request note modal */}
      {noteModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }}>
          <div onClick={() => setNoteModal(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '90%', maxWidth: 420, background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: 16, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)', margin: '0 0 8px' }}>
              {noteModal.type === 'delete' ? 'Request product deletion' : 'Request price change'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 18px' }}>
              This requires SUPERADMIN approval. Add a note explaining the reason (optional).
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
    </div>
  );
}
