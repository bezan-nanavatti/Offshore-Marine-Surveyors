'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router   = useRouter();
  const idRef    = useRef<HTMLInputElement>(null);
  const [adminId,  setAdminId]  = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [retryIn,    setRetryIn]    = useState(0);
  const [showPass,   setShowPass]   = useState(false);

  useEffect(() => { idRef.current?.focus(); }, []);

  // Countdown timer for rate-limit lockout
  useEffect(() => {
    if (retryIn <= 0) return;
    const t = setInterval(() => setRetryIn((n) => Math.max(0, n - 1)), 1000);
    return () => clearInterval(t);
  }, [retryIn]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (retryIn > 0) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ adminId: adminId.trim(), password }),
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        const match = String(data.error ?? '').match(/(\d+)/);
        setRetryIn(match ? parseInt(match[1], 10) : 900);
        setError(data.error ?? 'Too many attempts. Please wait.');
        return;
      }

      if (!res.ok) {
        setError('Invalid credentials. Please check your Admin ID and password.');
        setPassword('');
        return;
      }

      router.replace('/dashboard/enquiries');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #d0d7e2',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    background: '#fff',
    color: '#0E1B2A',
    boxSizing: 'border-box',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0B2545 0%, #0d2a50 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '40px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo / header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              background: '#0B2545',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#1CA7A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0B2545', margin: '0 0 4px' }}>
            Admin Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#7a8a9a', margin: 0 }}>
            Constellation Marine Services
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>
              Admin ID
            </label>
            <input
              ref={idRef}
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              placeholder="admin_username"
              autoComplete="username"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#4a5568', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                style={{ ...inputStyle, paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                  color: '#9ca3af', lineHeight: 1,
                }}
              >
                {showPass ? (
                  /* Eye-off */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  /* Eye */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: '#FFF3F3',
                border: '1px solid #FFCDD2',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '16px',
                fontSize: '13px',
                color: '#C62828',
              }}
            >
              {error}
              {retryIn > 0 && <span style={{ display: 'block', marginTop: '4px', fontWeight: 600 }}>Retry in {retryIn}s</span>}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || retryIn > 0}
            style={{
              width: '100%',
              padding: '12px',
              background: loading || retryIn > 0 ? '#b0bec5' : '#0B2545',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: loading || retryIn > 0 ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in…' : retryIn > 0 ? `Locked (${retryIn}s)` : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '11px', color: '#b0bec5' }}>
          This area is restricted to authorised personnel only.
        </p>
      </div>
    </div>
  );
}
