import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,            setUser]            = useState(null);
  const [token,           setToken]           = useState(() => sessionStorage.getItem('nh_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('nh_token')
    const storedUser = sessionStorage.getItem('nh_user')
    if (stored && storedUser) {
      try {
        setToken(stored)
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch {
        sessionStorage.clear()
      }
    }
  }, [])

  const login = async (payload) => {
    try {
      const data = await api.loginHospital(payload)
      sessionStorage.setItem('nh_token', data.access_token)
      sessionStorage.setItem('nh_user',  JSON.stringify(data.user))
      setToken(data.access_token)
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const logout = () => {
    sessionStorage.removeItem('nh_token')
    sessionStorage.removeItem('nh_user')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  useEffect(() => {
    const handler = () => logout()
    window.addEventListener('unauthorized_error', handler)
    return () => window.removeEventListener('unauthorized_error', handler)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
