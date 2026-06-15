import httpClient from './httpClient';

// ============ WORKER APIs ============

export const workerAPI = {
  // Get all pending workers for approval
  getPendingWorkers: async () => {
    // httpClient interceptor unwraps response.data => { success, results, data: [...] }
    const response = await httpClient.get('/workers/pending-approval');
    return response.data || [];
  },

  // Approve or reject a worker
  updateWorkerApproval: async (workerId, status) => {
    const response = await httpClient.patch(`/workers/${workerId}/approval`, { status });
    return response.data;
  },

  // Get all workers (with pagination/filtering) for Admin
  getAllWorkers: async (params = {}) => {
    const response = await httpClient.get('/workers/admin', { params });
    // backend: { success, total, pages, page, limit, data: [...] }
    return response.data || [];
  },

  // Get top workers by category
  getTopWorkersByCategory: async () => {
    const response = await httpClient.get('/workers/top-by-category');
    return response.data || [];
  },

  // Get current worker profile
  getWorkerProfile: async () => {
    const response = await httpClient.get('/workers/profile');
    return response.data;
  },
};

// ============ REQUEST/ORDER APIs ============

export const requestAPI = {
  // Get all requests with optional filters
  getAllRequests: async (params = {}) => {
    const response = await httpClient.get('/requests', { params });
    // httpClient interceptor returns response.data => { success, count, data: [...] }
    // response here = { success, count, data: [...] }, so .data is the array
    return response.data || [];
  },

  // Get request statistics (count by status)
  getRequestStats: async (params = {}) => {
    // httpClient interceptor already unwraps response.data => { success, data: {...} }
    const response = await httpClient.get('/requests/stats', { params });
    return response.data || {};
  },

  // Get single request by ID
  getRequestById: async (requestId) => {
    const response = await httpClient.get(`/requests/${requestId}`);
    return response.data;
  },

  // Update request status
  updateRequestStatus: async (requestId, status) => {
    const response = await httpClient.patch(`/requests/${requestId}/status`, { status });
    return response.data;
  },

  // Cancel a request
  cancelRequest: async (requestId) => {
    const response = await httpClient.patch(`/requests/${requestId}/cancel`);
    return response.data;
  },

  // Get worker's own requests
  getMyWorkerRequests: async () => {
    const response = await httpClient.get('/requests/my-worker');
    return response.data || [];
  },
};

// ============ CATEGORY/SERVICE APIs ============

export const categoryAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await httpClient.get('/categories');
    return response.data || [];
  },

  // Get single category
  getCategoryById: async (categoryId) => {
    const response = await httpClient.get(`/categories/${categoryId}`);
    return response.data;
  },

  // Create new category
  createCategory: async (categoryData) => {
    const response = await httpClient.post('/categories', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (categoryId, categoryData) => {
    const response = await httpClient.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  },

  // Delete/deactivate category
  deleteCategory: async (categoryId) => {
    const response = await httpClient.delete(`/categories/${categoryId}`);
    return response.data;
  },
};

// ============ RATING APIs ============

export const ratingAPI = {
  createRating: async (requestId, ratingData) => {
    const response = await httpClient.post(`/requests/${requestId}/rating`, ratingData);
    return response.data;
  },
  getRating: async (requestId) => {
    const response = await httpClient.get(`/requests/${requestId}/rating`);
    return response.data;
  },
  updateRating: async (requestId, ratingData) => {
    const response = await httpClient.patch(`/requests/${requestId}/rating`, ratingData);
    return response.data;
  },
  deleteRating: async (requestId) => {
    const response = await httpClient.delete(`/requests/${requestId}/rating`);
    return response.data;
  },
};

// ============ AUTH APIs ============

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await httpClient.post('/auth/register', userData);
    // interceptor returns response.data directly => { message, user }
    return response;
  },

  // Login — interceptor returns response.data => { message, user }
  login: async (email, password) => {
    const response = await httpClient.post('/auth/login', {
      emailorPhone: email,
      password,
      role: 'admin',
    });
    return response;
  },

  // Logout
  logout: async () => {
    await httpClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  // Get current user
  getMe: async () => {
    const response = await httpClient.get('/auth/me');
    return response;
  },

  // Update current user
  updateMe: async (userData) => {
    const response = await httpClient.put('/auth/me', userData);
    return response;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await httpClient.post('/auth/refresh');
    return response;
  },
};

// ============ USER APIs ============

export const userAPI = {
  // Get all users with optional filters
  getAllUsers: async (params = {}) => {
    const response = await httpClient.get('/users', { params });
    // backend: { success, total, page, pages, data: [...] }
    return response;
  },

  // Get single user
  getUserById: async (userId) => {
    const response = await httpClient.get(`/users/${userId}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await httpClient.post('/users', userData);
    return response;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await httpClient.delete(`/users/${userId}`);
    return response;
  },
};

// ============ ORDER APIs ============

export const orderAPI = {
  createOrder: async (workerId, orderData) => {
    const response = await httpClient.post(`/orders/${workerId}`, orderData);
    return response.data;
  },
};

// ============ UPLOAD APIs ============

export const uploadAPI = {
  uploadFile: async (formData) => {
    const response = await httpClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  deleteFile: async (imageId) => {
    const response = await httpClient.post('/upload/delete', { imageId });
    return response.data;
  },
};

export default {
  worker: workerAPI,
  request: requestAPI,
  category: categoryAPI,
  rating: ratingAPI,
  auth: authAPI,
  user: userAPI,
  order: orderAPI,
  upload: uploadAPI,
};
