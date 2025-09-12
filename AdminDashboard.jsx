import React, { useEffect, useState } from 'react';
import { api, authHeader } from '../api';
import { useAuth } from '../auth';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState('');

  async function load() {
    const s = await api.get('/api/admin/stats', { headers: authHeader(token) });
    setStats(s.data);
    const u = await api.get('/api/admin/users', { headers: authHeader(token), params: { q } });
    setUsers(u.data);
    const st = await api.get('/api/admin/stores', { headers: authHeader(token), params: { q } });
    setStores(st.data);
  }

  useEffect(() => { load(); }, [q]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'flex', gap: 16 }}>
        <div>Users: {stats.users}</div>
        <div>Stores: {stats.stores}</div>
        <div>Ratings: {stats.ratings}</div>
      </div>

      <div style={{ marginTop: 16 }}>
        <input placeholder="Filter by name/email/address/role" value={q} onChange={e => setQ(e.target.value)} />
      </div>

      <h3>Users</h3>
      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
        <tbody>
          {users.map(u => (<tr key={u.id}>
            <td>{u.id}</td>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.address}</td>
            <td>{u.role}</td>
          </tr>))}
        </tbody>
      </table>

      <h3>Stores</h3>
      <table border="1" cellPadding="6">
        <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Address</th><th>Owner</th><th>Avg Rating</th></tr></thead>
        <tbody>
          {stores.map(s => (<tr key={s.id}>
            <td>{s.id}</td>
            <td>{s.name}</td>
            <td>{s.email || '-'}</td>
            <td>{s.address}</td>
            <td>{s.ownerName || '-'}</td>
            <td>{s.rating ? s.rating.toFixed(2) : 'N/A'}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  );
}
