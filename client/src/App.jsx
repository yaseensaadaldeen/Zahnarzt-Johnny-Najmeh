import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { initNotifications } from './services/notificationService';
import { authApi } from './services/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ContactPage from './pages/ContactPage';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import DentistPanel from './pages/DentistPanel';
import DentistShiftManager from './pages/DentistShiftManager';
import AdminPanel from './pages/AdminPanel';

function AdminLoginOverlay({ onLogin }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.verifyDentistCode(code);
      if (res.token) sessionStorage.setItem('dentistToken', res.token);
      sessionStorage.setItem('dentistAccessGranted', 'true');
      onLogin();
    } catch {
      setError('Invalid access code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2 style={{ fontFamily: 'serif', fontSize: 22, fontWeight: 600, margin: 0 }}>Admin Panel</h2>
        </div>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Enter the access code to manage appointments.</p>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Access Code</label>
          <input
            type="password"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            style={{ width: '100%', padding: '10px 14px', border: `1px solid ${error ? '#dc2626' : '#ddd'}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
            autoFocus
          />
          {error && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 6 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', marginTop: 16, padding: '12px 20px', background: '#0d9488', color: '#fff', border: 0, borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Verifying...' : 'Access'}
          </button>
        </form>
      </div>
    </div>
  );
}

function ProtectedDentistRoute({ children }) {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('dentistToken');
    if (!token) {
      setAuthorized(false);
      return;
    }
    authApi.verify()
      .then(() => setAuthorized(true))
      .catch(() => {
        sessionStorage.removeItem('dentistToken');
        sessionStorage.removeItem('dentistAccessGranted');
        setAuthorized(false);
      });
  }, []);

  if (authorized === null) return null;
  if (authorized === false) return <AdminLoginOverlay onLogin={() => setAuthorized(true)} />;
  return <>{children}</>;
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  return null;
}

export default function App() {
  useEffect(() => {
    initNotifications();
  }, []);

  return (
    <div className="app-shell">
      <ScrollToTop />
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route
            path="/dentist-panel"
            element={
              <ProtectedDentistRoute>
                <DentistPanel />
              </ProtectedDentistRoute>
            }
          />
          <Route
            path="/dentist/control-panel"
            element={
              <ProtectedDentistRoute>
                <DentistPanel />
              </ProtectedDentistRoute>
            }
          />
          <Route
            path="/dentist/shifts"
            element={
              <ProtectedDentistRoute>
                <DentistShiftManager />
              </ProtectedDentistRoute>
            }
          />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
