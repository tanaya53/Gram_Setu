import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e, u = username, p = password) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(u, p);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (roleUsername, rolePassword) => {
    setUsername(roleUsername);
    setPassword(rolePassword);
    await handleLoginSubmit(null, roleUsername, rolePassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            margin: '0 auto 0.75rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
          }}>
            🌾
          </div>
          <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.35rem 0', fontWeight: '800', color: '#0f172a' }}>
            Gram Setu
          </h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
            Digital Gram Panchayat & Citizen Portal
          </p>
        </div>

        {/* Demo Roles Section */}
        <div className="demo-section">
          <div className="demo-title">
            <span>⚡ Demo Profiles (1-Click Access)</span>
          </div>
          <div className="demo-grid">
            {/* Demo Villager */}
            <button
              id="demo-villager-btn"
              type="button"
              className="demo-btn-card"
              onClick={() => handleDemoLogin('villager1', 'password123')}
              disabled={isLoading}
              title="Instant Login as Demo Villager"
            >
              <div className="demo-role-name">
                <span>👤</span>
                <span style={{ color: '#15803d' }}>Demo Villager</span>
              </div>
              <div className="demo-user-sub">Rahul Sharma (Ward 1)</div>
              <div className="demo-action-text">🚀 Click to Enter →</div>
            </button>

            {/* Demo Admin */}
            <button
              id="demo-admin-btn"
              type="button"
              className="demo-btn-card demo-btn-admin"
              onClick={() => handleDemoLogin('admin', 'admin123')}
              disabled={isLoading}
              title="Instant Login as Demo Panchayat Admin"
            >
              <div className="demo-role-name">
                <span>🏛️</span>
                <span style={{ color: '#4338ca' }}>Demo Admin</span>
              </div>
              <div className="demo-user-sub">Panchayat Officer</div>
              <div className="demo-action-text" style={{ color: '#4f46e5' }}>⚡ Click to Enter →</div>
            </button>
          </div>
          <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: '#15803d', textAlign: 'center' }}>
            ✓ Pre-loaded with meetings, ration, complaints & warnings
          </div>
        </div>

        {error && (
          <div style={{
            background: 'var(--error-bg)',
            color: 'var(--error-text)',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            textAlign: 'center',
            border: '1px solid rgba(220, 38, 38, 0.2)'
          }}>
            {error}
          </div>
        )}

        {/* Standard Credentials Form */}
        <form onSubmit={handleLoginSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username or Email</label>
            <input 
              id="username"
              type="text" 
              placeholder="e.g. villager1 or admin"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button id="login-submit-btn" type="submit" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
            {isLoading ? 'Signing In...' : 'Sign In to Portal'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
            Register New Citizen
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
