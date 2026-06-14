/**
 * AdminDataContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for shared admin data.
 * Fetches ONCE on mount (and every 60 s) then shares the data with all pages.
 * Pages must NOT make their own independent calls for the same endpoints —
 * they should read from this context to avoid duplicate network requests.
 *
 * Shared data:
 *   - pendingWorkers / pendingCount  ← /workers/pending-approval
 *   - orders                         ← /requests
 *   - requestStats                   ← /requests/stats
 *   - workers (all)                  ← /workers  (for Reports/Analytics)
 *
 * Usage:
 *   const { pendingWorkers, orders, requestStats, workers, loading, refreshAll } = useAdminData();
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { workerAPI, requestAPI } from '../services/adminApi';

const AdminDataContext = createContext(null);

const REFRESH_INTERVAL_MS = 60_000; // 1 minute — prevent constant re-fetching

export const AdminDataProvider = ({ children }) => {
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requestStats, setRequestStats] = useState({});
  const [workers, setWorkers] = useState([]);       // all workers (for reports page)
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);
  const fetchingRef = useRef(false);               // guard: prevent concurrent fetches

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  /**
   * fetchAll — fires a single batch of 4 parallel requests.
   * Subsequent calls within the same 60-second window are no-ops
   * unless triggered by refreshAll() explicitly.
   */
  const fetchAll = useCallback(async () => {
    if (fetchingRef.current) return;   // already in-flight, skip
    fetchingRef.current = true;
    try {
      const [pendingRes, ordersRes, statsRes, workersRes] = await Promise.all([
        workerAPI.getPendingWorkers(),
        requestAPI.getAllRequests(),
        requestAPI.getRequestStats(),
        workerAPI.getAllWorkers({ limit: 1000 }),
      ]);

      if (!isMounted.current) return;

      const pending    = Array.isArray(pendingRes)  ? pendingRes  : (pendingRes?.data  || []);
      const allOrders  = Array.isArray(ordersRes)   ? ordersRes   : (ordersRes?.data   || []);
      const stats      = statsRes  || {};
      const allWorkers = Array.isArray(workersRes)  ? workersRes  : (workersRes?.data  || []);

      setPendingWorkers(pending);
      setOrders(allOrders);
      setRequestStats(stats);
      setWorkers(allWorkers);
    } catch (err) {
      console.error('[AdminDataContext] fetch error:', err);
    } finally {
      fetchingRef.current = false;
      if (isMounted.current) setLoading(false);
    }
  }, []);

  // Initial load + periodic refresh every 60 s
  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const value = {
    pendingWorkers,
    pendingCount: pendingWorkers.length,
    orders,
    requestStats,
    workers,
    workersCount: workers.length,
    loading,
    refreshAll: fetchAll,
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used inside AdminDataProvider');
  return ctx;
};

export default AdminDataContext;
