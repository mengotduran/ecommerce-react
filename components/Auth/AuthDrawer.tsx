'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { useCloseOnNavigate } from '../../hooks/useCloseOnNavigate';

export default function AuthDrawer() {
  const open       = useUIStore((s) => s.authOpen);
  const mode       = useUIStore((s) => s.authMode);
  const closeAuth  = useUIStore((s) => s.closeAuth);
  const setAuthMode = useUIStore((s) => s.setAuthMode);
  const login    = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  const isLogin = mode === 'login';

  // Close automatically once a Link inside the drawer navigates to a
  // different route (rather than synchronously on click).
  useCloseOnNavigate(open, closeAuth);

  // Lock page scroll while the drawer is open, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAuth(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, closeAuth]);

  // Reset the form whenever the drawer opens/closes or switches mode.
  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setSuccess('');
    setShowPassword(false);
  }, [open, mode]);

  // Keep the spinner visible for a minimum stretch so a fast response
  // (success or rejection) doesn't look like nothing happened at all.
  const MIN_LOADING_MS = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    const start = Date.now();
    const waitOut = async () => {
      const remaining = MIN_LOADING_MS - (Date.now() - start);
      if (remaining > 0) await new Promise((r) => setTimeout(r, remaining));
    };
    try {
      if (isLogin) await login(email, password);
      else await register(name, email, password);
      await waitOut();
      setLoading(false);
      setSuccess(isLogin ? 'Signed in successfully' : 'Account created successfully');
      setTimeout(() => closeAuth(), 700);
    } catch (err: any) {
      await waitOut();
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`page-drawer-backdrop ${open ? 'open' : ''}`} onClick={closeAuth} aria-hidden={!open} />
      <div className={`page-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label={isLogin ? 'Log in' : 'Create account'} aria-hidden={!open}>
        <button type="button" onClick={closeAuth} aria-label="close" className="page-drawer__close">
          <XMarkIcon style={{ width: 18, height: 18 }} />
        </button>

        <div className="page-drawer__content">
          <Link href="/" style={{ textDecoration: 'none', display: 'block', marginBottom: 40 }}>
            <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.4px', color: 'var(--foreground)' }}>
              Veloc<span style={{ color: 'var(--accent)' }}>aris</span>
            </span>
          </Link>

          <p className="drawer-tag">{isLogin ? 'Log in' : 'Sign up'}</p>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--foreground)', margin: '8px 0 32px' }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: '#991b1b', margin: 0 }}>{error}</p>
            </div>
          )}

          {success && (
            <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: '#166534', margin: 0 }}>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {!isLogin && (
              <div>
                <label className="drawer-label">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="drawer-input"
                />
              </div>
            )}

            <div>
              <label className="drawer-label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="drawer-input"
              />
            </div>

            <div>
              <label className="drawer-label">{isLogin ? 'Password' : 'Password (min. 6 characters)'}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={isLogin ? undefined : 6}
                  placeholder="••••••••"
                  className="drawer-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: 0, bottom: 6, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}
                >
                  {showPassword ? <EyeSlashIcon width={18} height={18} /> : <EyeIcon width={18} height={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || !!success} className="drawer-submit">
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="btn-spinner drawer-spinner" />
                  {isLogin ? 'Signing in…' : 'Creating account…'}
                </span>
              ) : (isLogin ? 'Log in' : 'Create account')}
            </button>
          </form>

          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', margin: '28px 0 0' }}>
            {isLogin ? (
              <>
                No account?{' '}
                <button type="button" onClick={() => setAuthMode('register')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent)', fontWeight: 500, fontSize: 13 }}>
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button type="button" onClick={() => setAuthMode('login')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--accent)', fontWeight: 500, fontSize: 13 }}>
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
