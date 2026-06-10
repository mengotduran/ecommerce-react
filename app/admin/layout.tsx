'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
  ChartBarIcon, CubeIcon, ShoppingBagIcon, UsersIcon, CheckBadgeIcon,
} from '@heroicons/react/24/outline';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname();
  const token      = useAuthStore((s) => s.token);
  const user       = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!isSuperAdmin || !token) return;
    fetch(`${API}/approvals/count`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json()).then((d) => setPendingCount(d.count ?? 0)).catch(() => {});
  }, [isSuperAdmin, token]);

  const NAV = [
    { href: '/admin',             label: 'Overview',   icon: ChartBarIcon,    badge: 0 },
    { href: '/admin/products',    label: 'Products',   icon: CubeIcon,        badge: 0 },
    { href: '/admin/orders',      label: 'Orders',     icon: ShoppingBagIcon, badge: 0 },
    { href: '/admin/users',       label: 'Users',      icon: UsersIcon,       badge: 0 },
    ...(isSuperAdmin ? [{ href: '/admin/approvals', label: 'Approvals', icon: CheckBadgeIcon, badge: pendingCount }] : []),
  ];

  return (
    <div className="admin-shell">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand" style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border-color)', marginBottom: 12 }}>
          <Link href="/" className="admin-brand-logo" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.3px', color: 'var(--foreground)' }}>
              Veloc<span style={{ color: 'var(--accent)' }}>aris</span>
            </span>
          </Link>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--accent)', margin: '4px 0 0' }}>
            {isSuperAdmin ? 'Super Admin' : 'Admin panel'}
          </p>
        </div>

        <nav className="admin-nav">
          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
                  fontSize: 13, fontWeight: active ? 500 : 400,
                  background: active ? 'var(--background)' : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--muted)',
                  transition: 'background 150ms, color 150ms',
                  border: active ? '1px solid var(--border-color)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--foreground)'; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
              >
                <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{label}</span>
                {badge > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9, background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="admin-back" style={{ padding: '16px 20px 0', borderTop: '1px solid var(--border-color)' }}>
          <Link href="/" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', transition: 'color 150ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            ← Back to store
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
