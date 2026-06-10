'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function RegisterPage() {
  const router    = useRouter();
  const register  = useAuthStore((s) => s.register);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

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

  const field = (label, type, value, setter, placeholder) => (
    <div>
      <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => setter(e.target.value)}
        required
        placeholder={placeholder}
        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13, color: 'var(--foreground)', outline: 'none', transition: 'border-color 150ms' }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
      />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        <Link href="/" style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: 32 }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--foreground)' }}>
            Shop<span style={{ color: 'var(--accent)' }}>Ease</span>
          </span>
        </Link>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-color)', borderRadius: 20, padding: 'clamp(24px, 5vw, 36px)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.4px', color: 'var(--foreground)', margin: '0 0 6px' }}>
            Create account
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 28px' }}>
            Join Velocaris today
          </p>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: '#991b1b', margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {field('Full name', 'text', name, setName, 'John Doe')}
            {field('Email', 'email', email, setEmail, 'your@email.com')}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)', display: 'block', marginBottom: 6 }}>
                Password <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(min. 6 characters)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', background: 'var(--background)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13, color: 'var(--foreground)', outline: 'none', transition: 'border-color 150ms' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ marginTop: 4, padding: '12px 0', borderRadius: 10, border: 'none', background: loading ? 'var(--muted)' : 'var(--accent)', color: '#000', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 200ms' }}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', margin: '24px 0 0' }}>
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
