import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h1 style={{textAlign: 'center', marginBottom: '0.5rem'}}>Gram Setu</h1>
        <p style={{textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem'}}>Welcome back!</p>
        
        {error && <div style={{color: 'var(--error)', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem'}}>
          Don't have an account? <Link to="/register" style={{color: 'var(--primary)', fontWeight: '600'}}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
