import React, { useEffect, useState } from 'react';
import { api, authHeader } from '../api';
import { useAuth } from '../auth';

export default function Stores() {
  const { user, token } = useAuth();
  const [q, setQ] = useState('');
  const [stores, setStores] = useState([]);
  const [message, setMessage] = useState(null);

  async function load() {
    const { data } = await api.get('/api/stores', { params: { q } });
    setStores(data);
  }
  useEffect(() => { load(); }, [q]);

  async function rate(storeId, value) {
    setMessage(null);
    try {
      await api.post('/api/stores/rate', { storeId, value }, { headers: authHeader(token) });
      setMessage('Rating saved!');
      load();
    } catch (e) {
      setMessage(e.response?.data?.error || 'Failed to rate');
    }
  }

  return (
    <div>
      <h2>Stores</h2>
      <input placeholder="Search by name or address" value={q} onChange={e => setQ(e.target.value)} />
      {message && <div>{message}</div>}
      <ul>
        {stores.map(s => (
          <li key={s.id} style={{ padding: 12, border: '1px solid #eee', marginTop: 8 }}>
            <div><b>{s.name}</b></div>
            <div>{s.address}</div>
            <div>Overall Rating: {s.overallRating ? s.overallRating.toFixed(2) : 'N/A'}</div>
            {user ? (
              <div>
                Rate: {[1,2,3,4,5].map(v => (
                  <button key={v} onClick={() => rate(s.id, v)}>{v}</button>
                ))}
              </div>
            ) : <div>Login to rate</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
