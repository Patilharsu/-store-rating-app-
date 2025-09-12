import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Stores from './pages/Stores.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import { AuthProvider, useAuth } from './auth.jsx';

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd' }}>
      <Link to="/">Stores</Link>
      {!user && <Link to="/login">Login</Link>}
      {!user && <Link to="/signup">Signup</Link>}
      {user?.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
      {user?.role === 'OWNER' && <Link to="/owner">Owner</Link>}
      {user && <button onClick={logout}>Logout</button>}
    </nav>
  );
}

function PrivateRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Stores />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<PrivateRoute roles={['ADMIN']}><AdminDashboard /></PrivateRoute>} />
          <Route path="/owner" element={<PrivateRoute roles={['OWNER']}><OwnerDashboard /></PrivateRoute>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
