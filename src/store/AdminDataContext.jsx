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
 *   - workersTotal                   ← /workers/admin (total count only, limit=1)
 *   - clientsData                    ← /users (page 1 cache)
 *
 * Usage:
 *   const { pendingWorkers, orders, requestStats, workersTotal, loading, refreshAll } = useAdminData();
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { workerAPI, requestAPI, categoryAPI, userAPI } from '../services/adminApi';

const AdminDataContext = createContext(null);

const REFRESH_INTERVAL_MS = 60_000; // 1 minute — prevent constant re-fetching

export const AdminDataProvider = ({ children }) => {
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [pendingTotal, setPendingTotal]     = useState(0);
  const [orders, setOrders] = useState([]);
  const [requestStats, setRequestStats] = useState({});
  const [workersTotal, setWorkersTotal] = useState(0); // Total count only — no bulk fetch
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
      const [
        pendingRes,
        ordersRes,
        statsRes,
        workersCountRes,
        categoriesRes,
        clientsRes
      ] = await Promise.all([
        workerAPI.getPendingWorkers({ limit: 1 }), // Only need total count for badge
        requestAPI.getAllRequests(),
        requestAPI.getRequestStats(),
        workerAPI.getAllWorkers({ limit: 1 }),
        categoryAPI.getCategories(),
        userAPI.getAllUsers({ page: 1, limit: 15, role: 'client' }),
      ]);

      if (!isMounted.current) return;

      // pendingWorkers kept for backward compat — use total from pagination response
      setPendingWorkers(pendingRes?.data || []);
      // Use total count from response for the badge/counter
      const pendingTotal = pendingRes?.total ?? (pendingRes?.data?.length ?? 0);
      setPendingTotal(pendingTotal);
      setOrders(ordersRes?.data || []);
      
      // Handle requestStats — might be in data property or directly
      const statsData = statsRes?.data || statsRes || {};
      setRequestStats(statsData);

      // Read total from backend response — never load full worker list in context
      const total = workersCountRes?.total ?? workersCountRes?.data?.[0]?.total ?? 0;
      setWorkersTotal(total);

      setCategories(categoriesRes?.data || []);
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
    pendingCount: pendingTotal,
    orders,
    requestStats,
    workersTotal,      // ← total count for display in Reports/Analytics
    workersCount: workersTotal, // alias for backward compat
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
