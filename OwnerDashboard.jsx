import React, { useEffect, useState } from 'react';
import { api, authHeader } from '../api';
import { useAuth } from '../auth';

export default function OwnerDashboard() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);

  async function load() {
    const { data } = await api.get('/api/stores/owner/ratings', { headers: authHeader(token) });
    setRows(data);
  }
  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>Owner Dashboard</h2>
      {rows.map(r => (
        <div key={r.storeId} style={{ border: '1px solid #eee', padding: 12, marginTop: 8 }}>
          <div><b>{r.storeName}</b> — Avg: {r.averageRating ? r.averageRating.toFixed(2) : 'N/A'}</div>
          <ul>
            {r.ratings.map(x => <li key={x.userId}>{x.userName}: {x.value}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
