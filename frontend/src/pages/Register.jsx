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
    villageId: '',
    villageName: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    try {
      await register(formData);
      alert('Registration successful! You can now login.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error creating account';
      setError(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h1 style={{textAlign: 'center', marginBottom: '0.5rem'}}>Join Gram Setu</h1>
        <p style={{textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem'}}>Digital Civic Management</p>
        
        {error && <div style={{color: 'var(--error)', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={formData.fullName} 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Role</label>
            <select 
              value={formData.role} 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="VILLAGER">Villager</option>
              <option value="ADMIN">Authority / Admin</option>
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
                  placeholder="Enter provided admin key"
                  required 
                />
              </div>
            </>
          )}

          <button type="submit">Create Account</button>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem'}}>
          Already have an account? <Link to="/login" style={{color: 'var(--primary)', fontWeight: '600'}}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
