import { useState } from 'react';
import { api } from '../api';

export default function Login({ onLogin }) {
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
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>AI Tools Manager</h1>
        {error && <p className="error">{error}</p>}
        <label>Username<input required value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></label>
        <label>Password<input required type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
        <button className="btn-primary" type="submit">Login</button>
      </form>
    </div>
  );
}
