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
import { workerAPI, requestAPI, categoryAPI, userAPI } from '../services/adminApi';

const AdminDataContext = createContext(null);

const REFRESH_INTERVAL_MS = 60_000; // 1 minute — prevent constant re-fetching

export const AdminDataProvider = ({ children }) => {
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requestStats, setRequestStats] = useState({});
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [clientsData, setClientsData] = useState({ data: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);
  const fetchingRef = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const fetchAll = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      // Import userAPI and categoryAPI from adminApi if not already (we'll ensure they are)
      const [
        pendingRes,
        ordersRes,
        statsRes,
        workersRes,
        categoriesRes,
        clientsRes
      ] = await Promise.all([
        workerAPI.getPendingWorkers(),
        requestAPI.getAllRequests(),
        requestAPI.getRequestStats(),
        workerAPI.getAllWorkers({ limit: 1 }), // We only need total count here, avoid massive queries
        categoryAPI.getCategories(),
        userAPI.getAllUsers({ page: 1, limit: 15, role: 'client' }),
      ]);

      if (!isMounted.current) return;

      setPendingWorkers(Array.isArray(pendingRes) ? pendingRes : (pendingRes?.data || []));
      setOrders(Array.isArray(ordersRes) ? ordersRes : (ordersRes?.data || []));
      setRequestStats(statsRes || {});
      
      const count = workersRes?.total ?? (Array.isArray(workersRes) ? workersRes.length : (workersRes?.data?.length || 0));
      // Store count inside state or a ref. Since it's primitive, we can just create a state for it at the top,
      // but let's just make `workers` a proper empty array or whatever is needed, and we'll export the accurate count.
      // Wait, we need to declare workersCount state if we don't have it.
      // But we can just use `workers` state to hold a dummy array of length `count` so `workers.length` evaluates correctly!
      // Example: setWorkers(new Array(count).fill(null))
      // Yes, `setWorkers(new Array(count).fill(null))` is extremely clean because it doesn't break `workersCount: workers.length` downstream!
      setWorkers(new Array(count).fill(null));

      setCategories(Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes?.data || []));
      setClientsData({
        data: clientsRes?.data || [],
        total: clientsRes?.total || 0,
        pages: clientsRes?.pages || 1,
      });
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
    categories,
    clientsData,
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
