import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'VILLAGER',
    villageId: 'VILL001',
    villageName: 'Rampur',
    secretKey: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await register(formData);
      alert('Registration successful! You can now login.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Error creating account';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 0.5rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: '0 6px 12px rgba(79, 70, 229, 0.2)'
          }}>
            📋
          </div>
          <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem 0', fontWeight: '800' }}>Create Account</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Join your Gram Panchayat digital network</p>
        </div>
        
        {error && (
          <div style={{
            background: 'var(--error-bg)',
            color: 'var(--error-text)',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textAlign: 'center',
            border: '1px solid rgba(220, 38, 38, 0.2)'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="e.g. Ramesh Patel"
              value={formData.fullName} 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="Choose a username"
              value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Create a secure password"
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Account Role</label>
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="VILLAGER">Villager / Citizen</option>
              <option value="ADMIN">Gram Panchayat Authority / Admin</option>
            </select>
          </div>

          <div className="input-group">
            <label>Village ID</label>
            <input 
              type="text" 
              value={formData.villageId} 
              onChange={(e) => setFormData({...formData, villageId: e.target.value})} 
              placeholder="e.g. VILL001"
              required 
            />
          </div>

          {formData.role === 'ADMIN' && (
            <>
              <div className="input-group">
                <label>Village Name</label>
                <input 
                  type="text" 
                  value={formData.villageName} 
                  onChange={(e) => setFormData({...formData, villageName: e.target.value})} 
                  placeholder="e.g. Rampur"
                  required 
                />
              </div>
              <div className="input-group">
                <label>Admin Secret Key</label>
                <input 
                  type="password" 
                  value={formData.secretKey || ''} 
                  onChange={(e) => setFormData({...formData, secretKey: e.target.value})} 
                  placeholder="GramSetuAdmin123"
                  required 
                />
              </div>
            </>
          )}

          <button type="submit" disabled={isSubmitting} style={{ marginTop: '0.5rem' }}>
            {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '1.25rem', marginBottom: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
