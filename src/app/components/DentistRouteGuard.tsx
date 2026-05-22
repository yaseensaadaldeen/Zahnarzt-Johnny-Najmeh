import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function DentistRouteGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('dentistToken');
    if (!token) {
      setAuthorized(false);
      return;
    }
    fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        setAuthorized(res.ok);
        if (!res.ok) sessionStorage.removeItem('dentistToken');
      })
      .catch(() => setAuthorized(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/auth/dentist-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Access denied' }));
        setError(err.message || 'Access denied');
        return;
      }
      const data = await res.json();
      sessionStorage.setItem('dentistToken', data.token);
      setAuthorized(true);
    } catch {
      setError('Connection error. Check server.');
    } finally {
      setLoading(false);
    }
  };

  if (authorized === null) return null;
  if (authorized === false) {
    return (
      <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 400,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <h2 className="font-serif text-xl font-bold" style={{ margin: 0 }}>Admin Panel</h2>
            </div>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>Enter the access code to manage appointments.</p>
            <form onSubmit={handleLogin}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Access Code</label>
              <input
                type="password"
                value={accessCode}
                onChange={(e) => { setAccessCode(e.target.value); setError(''); }}
                style={{ width: '100%', padding: '10px 14px', border: `1px solid ${error ? '#dc2626' : '#d1d5db'}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                autoFocus
              />
              {error && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 6 }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', marginTop: 16, padding: '10px 20px', background: '#0d9488', color: '#fff', border: 0, borderRadius: 8, fontSize: 14, fontWeight: 600, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Verifying...' : 'Access'}
              </button>
            </form>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
