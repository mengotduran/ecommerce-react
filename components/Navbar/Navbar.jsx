'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCartIcon, ChevronDownIcon, MagnifyingGlassIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../../hooks/useCart';
import { useLikedItems } from '../../hooks/useLikedItems';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const categories = ['Supercars', 'Sports Cars', 'Muscle Cars', 'Cruisers', 'Sport Bikes', 'Adventure'];

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const Navbar = () => {
  const pathname = usePathname();
  const { cart } = useCart();
  const { likedItems, prune } = useLikedItems();
  const user   = useAuthStore((s) => s.user);
  const token  = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const openCart = useUIStore((s) => s.openCart);
  const openAuth = useUIStore((s) => s.openAuth);
  const openLiked = useUIStore((s) => s.openLiked);
  const [showCats, setShowCats]   = useState(false);
  const [showUser, setShowUser]   = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userRef = useRef(null);
  const catsRef = useRef(null);
  const lastScrollY = useRef(0);

  // Hide the header on scroll-down, reveal it again on scroll-up — on every page.
  // A small delta threshold filters out trackpad/momentum jitter that would
  // otherwise flip the direction every frame and make the transition feel jumpy.
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.max(window.scrollY, 0);
        const delta = y - lastScrollY.current;
        setScrolled(y > 80);
        if (Math.abs(delta) > 5) {
          setHidden(delta > 0 && y > 80);
          lastScrollY.current = y;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Drop any liked-item IDs that no longer exist (e.g. after a catalogue
  // reseed), so the wishlist badge count matches what's actually shown.
  useEffect(() => {
    if (likedItems.length === 0) return;
    fetch(`${API}/products`)
      .then((r) => r.json())
      .then((products) => prune(products.map((p) => p.id)))
      .catch(() => {});
  }, [likedItems.length, prune]);

  useEffect(() => {
    const handler = (e) => {
      if (catsRef.current && !catsRef.current.contains(e.target)) setShowCats(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Homepage: no solid bar — icons float transparently over HeroSlider,
  // which already renders the centered VELOCARIS wordmark as the logo.
  const isHome = pathname === '/';
  // Once scrolled past the hero, the transparent home header gains a solid
  // background (like every other page) so its icons stay visible over the
  // white catalogue — needed for the fixed header to be legible on scroll-up.
  const mutedColor = isHome && !scrolled ? 'var(--home-nav-fg)' : 'var(--muted)';
  const hoverColor = isHome && !scrolled ? 'var(--home-nav-fg-hover)' : 'var(--foreground)';

  return (
    <header
      className={isHome
        ? `fixed top-0 left-0 z-[100] flex h-[52px] w-full items-center justify-between sm:justify-end px-5${scrolled ? ' border-b border-border bg-background' : ''}`
        : 'sticky top-0 z-[100] flex h-[52px] w-full items-center justify-between border-b border-border bg-background px-5'
      }
      style={{ transform: hidden ? 'translateY(-100%)' : 'translateY(0)', transition: 'transform 300ms ease, background-color 200ms ease', willChange: 'transform' }}
    >
      {!isHome && (
        <Link
          href="/"
          className="text-[19px] font-extrabold uppercase tracking-[-0.5px] text-foreground"
          style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace' }}
        >
          Veloc<span className="text-accent">aris</span>
        </Link>
      )}

      {/* Mobile home logo — top-left, always visible (no centered hero
          wordmark on mobile). */}
      {isHome && (
        <Link
          href="/"
          className="text-[15px] font-extrabold uppercase tracking-[-0.5px] text-foreground sm:hidden"
          style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace' }}
        >
          Veloc<span className="text-accent">aris</span>
        </Link>
      )}

      {/* Desktop home logo — centered, fades in once scrolled past the hero
          (whose own centered wordmark scrolls out of view), including on
          scroll-up reveal. Always mounted so the fade is smooth, not a
          mount/unmount blink. */}
      {isHome && (
        <Link
          href="/"
          className={`hidden sm:block absolute left-1/2 -translate-x-1/2 text-[19px] font-extrabold uppercase tracking-[-0.5px] text-foreground ${scrolled ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', transition: 'opacity 250ms ease' }}
        >
          Veloc<span className="text-accent">aris</span>
        </Link>
      )}

      {!isHome && (
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
      )}

      <div className="flex items-center gap-3">
        {/* Search — desktop only */}
        <button
          type="button"
          aria-label="search"
          onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
          className="flex"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: mutedColor, alignItems: 'center', transition: 'color 150ms' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = mutedColor)}
        >
          <MagnifyingGlassIcon style={{ width: 18, height: 18 }} />
        </button>

        {user && (
          <Link
            href="/orders"
            aria-label="orders"
            title="My orders"
            style={{ position: 'relative', color: pathname === '/orders' ? 'var(--accent)' : mutedColor, display: 'flex', alignItems: 'center', transition: 'color 150ms' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
            onMouseLeave={(e) => (e.currentTarget.style.color = pathname === '/orders' ? 'var(--accent)' : mutedColor)}
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

        <button
          type="button"
          onClick={openLiked}
          aria-label="wishlist"
          style={{ position: 'relative', color: mutedColor, display: 'flex', alignItems: 'center', background: 'none', border: 'none', padding: 0, cursor: 'pointer', transition: 'color 150ms' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = mutedColor)}
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
        </button>

        {pathname !== '/checkout' && (
          <button
            type="button"
            onClick={openCart}
            className={isHome ? 'flex items-center gap-1.5 px-[14px] py-[6px] text-[13px] font-medium' : 'flex items-center gap-1.5 rounded-lg border border-border px-[14px] py-[6px] text-[13px] font-medium'}
            style={isHome
              ? { background: 'transparent', color: mutedColor, transition: 'color 150ms', border: 'none', cursor: 'pointer' }
              : { background: '#ffffff', color: '#000000', cursor: 'pointer' }
            }
            onMouseEnter={isHome ? (e) => (e.currentTarget.style.color = hoverColor) : undefined}
            onMouseLeave={isHome ? (e) => (e.currentTarget.style.color = mutedColor) : undefined}
          >
            <ShoppingCartIcon className="h-[16px] w-[16px]" />
            Cart ({cart.total_items})
          </button>
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
          <button
            type="button"
            onClick={() => openAuth('login')}
            style={isHome
              ? { padding: '6px 14px', fontSize: 13, fontWeight: 500, background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', transition: 'opacity 150ms' }
              : { padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: 'var(--accent)', border: 'none', color: '#000', cursor: 'pointer', transition: 'opacity 150ms' }
            }
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
