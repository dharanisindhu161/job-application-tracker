import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('jobtracker_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.auth.getMe();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          setToken(null);
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.auth.login({ email, password });
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.auth.register({ name, email, password });
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const demoLogin = async () => {
    setError(null);
    try {
      const res = await api.auth.demoLogin();
      setToken(res.token);
      setUser(res.user);
      return res;
    } catch (err) {
      setError(err.message || 'Demo login failed');
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        demoLogin,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
