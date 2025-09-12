import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw) : null;
  });

  const login = (payload) => {
    setUser(payload);
    localStorage.setItem('auth', JSON.stringify(payload));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth');
  };

  const token = user?.token;

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext);
}
