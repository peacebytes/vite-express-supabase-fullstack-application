import { useState } from 'react';
import { api } from '../api';

export default function Login({ onLogin, onClose }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await api.login(form);
    if (res?.error) setError(res.error);
    else if (res?.id) onLogin(res);
    else setError('Login failed');
  };

  return (
    <div className="login-wrapper" onClick={onClose}>
      <form onSubmit={handleSubmit} className="login-form" onClick={e => e.stopPropagation()}>
        <h1>Admin Login</h1>
        {error && <p className="error">{error}</p>}
        <label>Username<input required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></label>
        <label>Password<input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-primary" type="submit">Login</button>
          <button className="btn-secondary" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
