'use client';

import { useState } from 'react';
import Link from 'next/link';

const SHOP = [
  { label: 'New arrivals',  href: '/?badge=new#catalogue' },
  { label: 'Sale',          href: '/?badge=sale#catalogue' },
  { label: 'Supercars',     href: '/?category=Supercars#catalogue' },
  { label: 'Sport Bikes',   href: '/?category=Sport%20Bikes#catalogue' },
  { label: 'Muscle Cars',   href: '/?category=Muscle%20Cars#catalogue' },
  { label: 'Adventure',     href: '/?category=Adventure#catalogue' },
];

const SUPPORT = [
  { label: 'FAQ',             href: '#' },
  { label: 'Shipping policy', href: '#' },
  { label: 'Returns',         href: '#' },
  { label: 'Contact us',      href: '#' },
  { label: 'Track order',     href: '#' },
];

const SOCIAL = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border-color)', marginTop: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(48px, 6vw, 72px) clamp(16px, 4vw, 32px) 0' }}>

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'clamp(32px, 4vw, 48px)', marginBottom: 56 }}>

          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.5px', color: 'var(--foreground)' }}>
                Veloc<span style={{ color: 'var(--accent-dark)' }}>aris</span>
              </span>
            </Link>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, margin: '12px 0 24px', maxWidth: 220 }}>
              Premium cars & motorcycles for those who live to drive.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIAL.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', textDecoration: 'none', transition: 'border-color 200ms, color 200ms' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-dark)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent-dark)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--foreground)', margin: '0 0 16px' }}>
              Shop
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SHOP.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none', transition: 'color 150ms' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-dark)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--foreground)', margin: '0 0 16px' }}>
              Support
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SUPPORT.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none', transition: 'color 150ms' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-dark)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter column */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--foreground)', margin: '0 0 16px' }}>
              Stay in the loop
            </p>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
              New drops, exclusive deals, and stories from the road.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  padding: '10px 14px', borderRadius: 8,
                  background: 'var(--background)', border: '1px solid var(--border-color)',
                  color: 'var(--foreground)', fontSize: 13, outline: 'none',
                  transition: 'border-color 150ms',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-dark)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: submitted ? '#16a34a' : 'var(--accent-dark)',
                  color: '#000', fontSize: 13, fontWeight: 600,
                  transition: 'background 300ms',
                }}
              >
                {submitted ? '✓ Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>

        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border-color)', padding: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
            © {new Date().getFullYear()} Velocaris. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy policy', 'Terms of use', 'Cookies'].map((item) => (
              <a key={item} href="#" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', transition: 'color 150ms' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
