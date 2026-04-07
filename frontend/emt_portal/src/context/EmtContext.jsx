import React, { createContext, useContext, useState, useCallback } from 'react';
import { emtApi } from '../utils/emtApi.js';

const EmtContext = createContext(null);

export const EmtProvider = ({ children }) => {
  const [user,            setUser]            = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('emt_user')) } catch { return null }
  });
  const [token,           setToken]           = useState(() => sessionStorage.getItem('emt_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('emt_token'));
  const [dispatchList,    setDispatchList]    = useState([]);

  const login = async (staffId, password) => {
    try {
      const data = await emtApi.login(staffId.trim(), password)
      sessionStorage.setItem('emt_token', data.access_token)
      sessionStorage.setItem('emt_user',  JSON.stringify(data.user))
      setToken(data.access_token)
      setUser(data.user)
      setIsAuthenticated(true)
      // Load dispatches for this unit
      const dispatches = await emtApi.getDispatches(data.access_token)
      setDispatchList(dispatches)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const logout = () => {
    sessionStorage.removeItem('emt_token')
    sessionStorage.removeItem('emt_user')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    setDispatchList([])
  }

  // Called by paramedic after entering vitals
  const submitDispatch = useCallback(async (vitals) => {
    if (!token) throw new Error('Not authenticated')
    const result = await emtApi.createDispatch(vitals, token)
    // Refresh dispatch list
    const dispatches = await emtApi.getDispatches(token)
    setDispatchList(dispatches)
    return result
  }, [token])

  const claimDispatch = useCallback(async (dispatchId, status) => {
    if (!token) return
    await emtApi.updateDispatchStatus(dispatchId, status, token)
    // Refresh full list so assignedBed.status updates (reserved → occupied on arrival)
    try {
      const dispatches = await emtApi.getDispatches(token)
      setDispatchList(dispatches)
    } catch {
      // Optimistic fallback if refresh fails
      setDispatchList(prev =>
        prev.map(d => d.id === dispatchId ? { ...d, status } : d)
      )
    }
  }, [token])

  const refreshDispatches = useCallback(async () => {
    if (!token) return
    try {
      const dispatches = await emtApi.getDispatches(token)
      setDispatchList(dispatches)
    } catch {}
  }, [token])

  return (
    <EmtContext.Provider value={{
      user, token, isAuthenticated,
      login, logout,
      submitDispatch, claimDispatch,
      dispatchList, refreshDispatches,
    }}>
      {children}
    </EmtContext.Provider>
  );
};

export const useEmt = () => useContext(EmtContext);
