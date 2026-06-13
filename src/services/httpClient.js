import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const TOKEN_KEY = 'accessToken';

// Create axios instance
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - add auth token
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
httpClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Don't show toast for registration/login errors - let components handle them
    const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    
    // Handle 401 - unauthorized
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      toast.error('انتهت صلاحية جلستك. يرجى تسجيل الدخول مجدداً');
      window.location.href = '/login';
    }

    // Handle 403 - forbidden
    if (error.response?.status === 403 && !isAuthRoute) {
      toast.error('ليس لديك صلاحية للوصول إلى هذا');
    }

    // Handle 404
    if (error.response?.status === 404 && !isAuthRoute) {
      toast.error('لم يتم العثور على البيانات المطلوبة');
    }

    // Handle 500
    if (error.response?.status === 500 && !isAuthRoute) {
      toast.error('حدث خطأ في الخادم. يرجى المحاولة لاحقاً');
    }

    // Show generic error only if not auth route
    if (!isAuthRoute) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
