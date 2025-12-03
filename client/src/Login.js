import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login', { username, password });
      setUser(res.data.user);
      if (res.data.user.role === 'admin') navigate('/admin');
      else navigate('/user');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#2563eb', fontSize: '2rem' }}>TaskApp</h2>
          <p>Manage your projects efficiently</p>
        </div>
        
        <div className="form-stack">
          <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button className="btn-primary" onClick={handleLogin} style={{ marginTop: '10px' }}>Sign In</button>
        </div>
        
        <div style={{ marginTop: '30px', padding: '15px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem', color: '#64748b' }}>
          <strong>Demo Accounts:</strong><br/>
          Admin: <code>admin / admin123</code><br/>
          User: <code>user1 / user123</code>
        </div>
      </div>
    </div>
  );
};

export default Login;