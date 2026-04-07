/**
 * DataContext — fetches all data from PostgreSQL backend.
 * No mock data. Hospital, beds, inventory all come from real API calls.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../utils/api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user, token } = useAuth();

  const [hospitalData,   setHospitalData]   = useState(null);   // full hospital + ward_details
  const [inventory,      setInventory]      = useState([]);
  const [inventoryLogs,  setInventoryLogs]  = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);

  const hospitalId = user?.hospital_id;

  // ── Load hospital data ────────────────────────────────────────────────────
  const fetchHospital = useCallback(async () => {
    if (!hospitalId || !token) return;
    try {
      const data = await api.getHospital(hospitalId, token);
      setHospitalData(data);
    } catch (e) {
      setError(e.message);
    }
  }, [hospitalId, token]);

  const fetchInventory = useCallback(async () => {
    if (!hospitalId || !token) return;
    try {
      const [items, logs] = await Promise.all([
        api.getInventory(hospitalId, token),
        api.getInventoryLogs(hospitalId, token, 100),
      ]);
      setInventory(items);
      setInventoryLogs(logs);
    } catch (e) {
      setError(e.message);
    }
  }, [hospitalId, token]);

  useEffect(() => {
    if (!hospitalId || !token) return;
    setLoading(true);
    Promise.all([fetchHospital(), fetchInventory()])
      .finally(() => setLoading(false));
  }, [hospitalId, token, fetchHospital, fetchInventory]);

  // ── Bed operations ────────────────────────────────────────────────────────
  const updateBedStatus = useCallback(async (bedId, newStatus) => {
    try {
      await api.updateBedStatus(bedId, newStatus.toLowerCase(), token);
      // Refresh hospital data so bed counts and status update everywhere
      await fetchHospital();
    } catch (e) {
      setError(e.message);
    }
  }, [token, fetchHospital]);

  const dischargePatient = useCallback(async (bedId) => {
    try {
      await api.dischargePatient(bedId, token);
      await fetchHospital();
    } catch (e) {
      setError(e.message);
    }
  }, [token, fetchHospital]);

  // ── Inventory operations ──────────────────────────────────────────────────
  const updateInventoryQuantity = useCallback(async (itemId, newQty, changeType = null) => {
    if (!hospitalId) return;
    try {
      const updated = await api.updateInventoryItem(
        hospitalId, itemId,
        { quantity: parseInt(newQty) || 0, change_type: changeType },
        token,
      );
      setInventory(prev => prev.map(i => i.id === itemId ? updated : i));
      // Refresh logs
      const logs = await api.getInventoryLogs(hospitalId, token, 100);
      setInventoryLogs(logs);
    } catch (e) {
      setError(e.message);
    }
  }, [hospitalId, token]);

  const verifyInventoryItem = useCallback(async (itemId) => {
    if (!hospitalId) return;
    try {
      await api.verifyInventoryItem(hospitalId, itemId, token);
      // Refresh both
      const [items, logs] = await Promise.all([
        api.getInventory(hospitalId, token),
        api.getInventoryLogs(hospitalId, token, 100),
      ]);
      setInventory(items);
      setInventoryLogs(logs);
    } catch (e) {
      setError(e.message);
    }
  }, [hospitalId, token]);

  return (
    <DataContext.Provider value={{
      hospitalData,
      inventory,
      inventoryLogs,
      error,
      refreshHospital: fetchHospital,
      refreshInventory: fetchInventory,
      updateBedStatus,
      dischargePatient,
      updateInventoryQuantity,
      verifyInventoryItem,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
