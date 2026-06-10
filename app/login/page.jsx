'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const router   = useRouter();
  const login    = useAuthStore((s) => s.login);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace', fontSize: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.4px', color: 'var(--foreground)' }}>
            Veloc<span style={{ color: 'var(--accent)' }}>aris</span>
          </span>
        </Link>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 20, padding: 'clamp(24px, 5vw, 36px)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--foreground)', margin: '0 0 6px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 28px' }}>
            Sign in to your account
          </p>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: '#991b1b', margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="auth-input"
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="auth-input"
                  style={{ paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', padding: 6, cursor: 'pointer', color: 'var(--muted)', display: 'flex' }}
                >
                  {showPassword ? <EyeSlashIcon width={18} height={18} /> : <EyeIcon width={18} height={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: 4, padding: '12px 0', borderRadius: 10, border: 'none', background: loading ? 'var(--muted)' : 'var(--accent)', color: '#000', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 200ms' }}
            >
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span className="btn-spinner" />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', margin: '24px 0 0' }}>
            No account?{' '}
            <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
