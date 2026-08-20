import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, adminLogout, isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  // If they somehow land here while already an admin, redirect them
  React.useEffect(() => {
    if (isAdmin) navigate('/admin/dashboard');
  }, [isAdmin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin({ email, password });
      
      // Wait a moment for onAuthStateChanged to resolve claims in context
      await new Promise(r => setTimeout(r, 800));
      
      // We can't strictly check isAdmin state immediately here because it updates asynchronously 
      // via the AuthContext listener, but the ProtectedRoute will catch them anyway.
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
      await adminLogout(); // Clear session if it failed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--gold)', fontFamily: 'var(--font-label)', letterSpacing: '2px', margin: 0, fontSize: '2rem' }}>SAVORIA</h1>
          <p style={{ color: 'var(--muted)', marginTop: '8px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Admin Portal</p>
        </div>
        
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Admin Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ width: '100%', padding: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--cream)', borderRadius: '8px', outline: 'none' }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'var(--gold)', color: 'black', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--muted)' }}>
          This is a private administrative area. <br/><a href="/" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Return to public site</a>
        </div>
      </div>
    </div>
  );
}
