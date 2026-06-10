'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCartIcon, ChevronDownIcon, MagnifyingGlassIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';
import { useLikedItems } from '../../hooks/useLikedItems';
import { useAuthStore } from '../../store/authStore';

const categories = ['Supercars', 'Sports Cars', 'Muscle Cars', 'Cruisers', 'Sport Bikes', 'Adventure'];

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const Navbar = () => {
  const pathname = usePathname();
  const { cart } = useCart();
  const { likedItems } = useLikedItems();
  const user   = useAuthStore((s) => s.user);
  const token  = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const [showCats, setShowCats]   = useState(false);
  const [showUser, setShowUser]   = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const userRef = useRef(null);
  const catsRef = useRef(null);

  // Badge on the orders icon = orders still awaiting approval; clears once
  // an admin moves them past PENDING. Re-checked on every route change so
  // it picks up new checkouts and status updates without a manual refresh.
  useEffect(() => {
    if (!user || !token) { setPendingOrders(0); return; }
    fetch(`${API}/orders/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((orders) => setPendingOrders(Array.isArray(orders) ? orders.filter((o) => o.status === 'PENDING').length : 0))
      .catch(() => {});
  }, [user, token, pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (catsRef.current && !catsRef.current.contains(e.target)) setShowCats(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auth pages render their own logo; no navbar (Footer hides on these too)
  if (pathname === '/login' || pathname === '/register') return null;

  return (
    <header className="sticky top-0 z-[100] flex h-[52px] w-full items-center justify-between border-b border-border bg-background px-5">
      <Link
        href="/"
        className="text-[19px] font-extrabold uppercase tracking-[-0.5px] text-foreground"
        style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace' }}
      >
        Veloc<span className="text-accent">aris</span>
      </Link>

      <nav className="hidden items-center gap-7 sm:flex">
        <Link
          href="/?badge=new#catalogue"
          className="text-[13px] text-muted transition-colors hover:text-foreground"
        >
          New arrivals
        </Link>

        {/* Categories dropdown */}
        <div ref={catsRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowCats((v) => !v)}
            className="flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-foreground"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            Categories
            <ChevronDownIcon
              className="h-[13px] w-[13px]"
              style={{ transition: 'transform 200ms ease', transform: showCats ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {showCats && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 14px)', left: '50%', transform: 'translateX(-50%)',
              background: 'var(--background)', border: '1px solid var(--border-color)',
              borderRadius: 12, padding: '6px 0', minWidth: 170,
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              zIndex: 200,
            }}>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/?category=${encodeURIComponent(cat)}#catalogue`}
                  onClick={() => setShowCats(false)}
                  style={{
                    display: 'block', padding: '9px 18px',
                    fontSize: 13, color: 'var(--foreground)', textDecoration: 'none',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/?badge=sale#catalogue"
          className="text-[13px] text-muted transition-colors hover:text-foreground"
        >
          Sale
        </Link>
      </nav>

      <div className="flex items-center gap-3">
        {/* Search — desktop only */}
        <button
          type="button"
          aria-label="search"
          onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
          className="flex"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--muted)', alignItems: 'center', transition: 'color 150ms' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          <MagnifyingGlassIcon style={{ width: 18, height: 18 }} />
        </button>

        {user && (
          <Link
            href="/orders"
            aria-label="orders"
            title="My orders"
            style={{ position: 'relative', color: pathname === '/orders' ? 'var(--accent)' : 'var(--muted)', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = pathname === '/orders' ? 'var(--accent)' : 'var(--muted)')}
          >
            <ArchiveBoxIcon style={{ width: 18, height: 18 }} />
            {pendingOrders > 0 && (
              <span style={{
                position: 'absolute', top: -5, right: -6,
                background: '#e11d48', color: '#fff',
                fontSize: 9, fontWeight: 700, lineHeight: 1,
                minWidth: 14, height: 14, borderRadius: 7,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '0 3px',
              }}>
                {pendingOrders}
              </span>
            )}
          </Link>
        )}

        <Link
          href="/liked"
          aria-label="wishlist"
          style={{ position: 'relative', color: 'var(--muted)', display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          <HeartIcon style={{ width: 18, height: 18 }} />
          {likedItems.length > 0 && (
            <span style={{
              position: 'absolute', top: -5, right: -6,
              background: '#e11d48', color: '#fff',
              fontSize: 9, fontWeight: 700, lineHeight: 1,
              minWidth: 14, height: 14, borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 3px',
            }}>
              {likedItems.length}
            </span>
          )}
        </Link>

        {pathname !== '/checkout' && (
          <Link
            href="/cart"
            className="flex items-center gap-1.5 rounded-lg border border-border px-[14px] py-[6px] text-[13px] font-medium"
            style={{ background: '#ffffff', color: '#000000' }}
          >
            <ShoppingCartIcon className="h-[16px] w-[16px]" />
            Cart ({cart.total_items})
          </Link>
        )}

        {/* User menu */}
        {user ? (
          <div ref={userRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowUser((v) => !v)}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--accent)', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#000', flexShrink: 0,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </button>
            {showUser && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                background: 'var(--background)', border: '1px solid var(--border-color)',
                borderRadius: 12, padding: '6px 0', minWidth: 180,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 200,
              }}>
                <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', margin: 0 }}>{user.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--muted)', margin: '2px 0 0' }}>{user.email}</p>
                  {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginTop: 4 }}>{user.role === 'SUPERADMIN' ? 'Super Admin' : 'Admin'}</span>
                  )}
                </div>
                <Link
                  href="/orders"
                  onClick={() => setShowUser(false)}
                  style={{ display: 'block', padding: '9px 16px', fontSize: 13, color: 'var(--foreground)', textDecoration: 'none', transition: 'background 150ms' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  My orders
                </Link>
                {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
                  <Link
                    href="/admin"
                    onClick={() => setShowUser(false)}
                    style={{ display: 'block', padding: '9px 16px', fontSize: 13, color: 'var(--foreground)', textDecoration: 'none', transition: 'background 150ms' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    Admin panel
                  </Link>
                )}
                <div style={{ borderTop: '1px solid var(--border-color)', marginTop: 4, paddingTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => { logout(); setShowUser(false); }}
                    style={{ display: 'block', width: '100%', padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#e11d48', textAlign: 'left', transition: 'background 150ms' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500,
              background: 'var(--accent)', color: '#000', textDecoration: 'none',
              transition: 'opacity 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
