import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [error, setError] = useState(null);
  const [ok, setOk] = useState(false);

  function setField(k, v) { setForm(s => ({ ...s, [k]: v })); }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/api/auth/signup', form);
      setOk(true);
      setTimeout(() => nav('/login'), 1000);
    } catch (e) {
      setError(e.response?.data?.error || 'Signup failed');
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420, display: 'grid', gap: 8 }}>
      <h2>Signup</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {ok && <div style={{ color: 'green' }}>Signup successful! Please login.</div>}
      <input placeholder="Full Name (min 20 chars)" value={form.name} onChange={e => setField('name', e.target.value)} />
      <input placeholder="Email" value={form.email} onChange={e => setField('email', e.target.value)} />
      <input placeholder="Address" value={form.address} onChange={e => setField('address', e.target.value)} />
      <input placeholder="Password (8-16, 1 uppercase, 1 special)" type="password" value={form.password} onChange={e => setField('password', e.target.value)} />
      <button type="submit">Create account</button>
    </form>
  );
}
