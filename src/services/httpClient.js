import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// --- Token refresh state to avoid multiple simultaneous refresh calls ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request interceptor - no-op (cookies are sent automatically via withCredentials)
httpClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
httpClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh');

    // ── 401: Try to silently refresh the token, then retry ──
    if (error.response?.status === 401 && !isAuthRoute && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => httpClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Hit refresh endpoint (uses httpOnly refreshToken cookie automatically)
        await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        isRefreshing = false;
        // Retry the original request
        return httpClient(originalRequest);
      } catch (refreshError) {
        // Refresh also failed → logout the user
        processQueue(refreshError);
        isRefreshing = false;
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        toast.error('انتهت صلاحية جلستك. يرجى تسجيل الدخول مجدداً', {
          toastId: 'session-expired', // deduplicate
        });
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // ── 403 ──
    if (error.response?.status === 403 && !isAuthRoute) {
      toast.error('ليس لديك صلاحية للوصول إلى هذا', { toastId: 'err-403' });
      return Promise.reject(error);
    }

    // ── 404 ──
    if (error.response?.status === 404 && !isAuthRoute) {
      toast.error('لم يتم العثور على البيانات المطلوبة', { toastId: 'err-404' });
      return Promise.reject(error);
    }

    // ── 500 ──
    if (error.response?.status === 500 && !isAuthRoute) {
      toast.error('حدث خطأ في الخادم. يرجى المحاولة لاحقاً', { toastId: 'err-500' });
      return Promise.reject(error);
    }

    // ── Generic errors (non-auth routes only) ──
    if (!isAuthRoute) {
      const msg = error.response?.data?.message || error.message;
      if (msg) {
        // Use the message as toastId so identical messages don't stack
        toast.error(msg, { toastId: msg });
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
