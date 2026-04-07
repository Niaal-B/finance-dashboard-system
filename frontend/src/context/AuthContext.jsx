import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (username && role) {
      setUser({ username, role });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await apiClient.post('users/login/', { username, password });
    const { access, refresh } = response.data;
    
    // Decode JWT for role and username (we sent it in the claims)
    const payload = JSON.parse(atob(access.split('.')[1]));
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('username', payload.username);
    localStorage.setItem('role', payload.role);
    
    setUser({ username: payload.username, role: payload.role });
    return true;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
