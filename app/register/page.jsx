'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';

export default function RegisterPage() {
  const router    = useRouter();
  const register  = useAuthStore((s) => s.register);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const close = () => router.push('/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (label, type, value, setter, placeholder, extra) => (
    <div>
      <label className="drawer-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setter(e.target.value)}
        required
        placeholder={placeholder}
        className="drawer-input"
        {...extra}
      />
    </div>
  );

  return (
    <div className="page-drawer-backdrop" onClick={close}>
      <div className="page-drawer" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={close} aria-label="close" className="page-drawer__close">
          <XMarkIcon style={{ width: 18, height: 18 }} />
        </button>

        <div className="page-drawer__content">
          <Link href="/" style={{ textDecoration: 'none', display: 'block', marginBottom: 40 }}>
            <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 18, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.4px', color: 'var(--foreground)' }}>
              Veloc<span style={{ color: 'var(--accent)' }}>aris</span>
            </span>
          </Link>

          <p className="drawer-tag">Sign up</p>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--foreground)', margin: '8px 0 32px' }}>
            Create account
          </h1>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: '#991b1b', margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {field('Full name', 'text', name, setName, 'John Doe')}
            {field('Email address', 'email', email, setEmail, 'your@email.com')}
            <div>
              <label className="drawer-label">Password (min. 6 characters)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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

            <button type="submit" disabled={loading} className="drawer-submit">
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span className="btn-spinner drawer-spinner" />
                  Creating account…
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', margin: '28px 0 0' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
