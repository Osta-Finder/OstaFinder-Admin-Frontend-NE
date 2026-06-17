import httpClient from './httpClient';

// ============ WORKER APIs ============

export const workerAPI = {
  // Get all pending workers for approval
  getPendingWorkers: async (params = {}) => {
    const response = await httpClient.get('/workers/pending-approval', { params });
    // backend: { success, data: [...], total, pages, page, limit }
    return response || {};
  },

  // Approve or reject a worker
  updateWorkerApproval: async (workerId, status) => {
    const response = await httpClient.patch(`/workers/${workerId}/approval`, { status });
    return response;
  },

  // Get all pending works for approval
  getPendingWorks: async (params = {}) => {
    const response = await httpClient.get('/workers/works/pending-approval', { params });
    return response || {};
  },

  // Approve or reject a work item
  updateWorkApproval: async (workId, status) => {
    const response = await httpClient.patch(`/workers/works/${workId}/approval`, { status });
    return response;
  },

  // Get all workers (with pagination/filtering) for Admin
  getAllWorkers: async (params = {}) => {
    const response = await httpClient.get('/workers/admin', { params });
    // httpClient interceptor already unwraps response.data => { success, total, pages, page, limit, data: [...] }
    // response here = { success, total, pages, page, limit, data: [...] }
    return response || {};
  },

  // Get top workers by category
  getTopWorkersByCategory: async () => {
    const response = await httpClient.get('/workers/top-by-category');
    return response || {};
  },

  // Get current worker profile
  getWorkerProfile: async () => {
    const response = await httpClient.get('/workers/profile');
    return response;
  },
};

// ============ REQUEST/ORDER APIs ============

export const requestAPI = {
  // Get all requests with optional filters
  getAllRequests: async (params = {}) => {
    const response = await httpClient.get('/requests', { params });
    // httpClient interceptor returns response.data => { success, count, data: [...] }
    // response here = { success, count, data: [...] }
    return response || {};
  },

  // Get request statistics (count by status)
  getRequestStats: async (params = {}) => {
    // httpClient interceptor already unwraps response.data => { success, data: {...} }
    const response = await httpClient.get('/requests/stats', { params });
    return response || {};
  },

  // Get single request by ID
  getRequestById: async (requestId) => {
    const response = await httpClient.get(`/requests/${requestId}`);
    return response;
  },

  // Update request status
  updateRequestStatus: async (requestId, status) => {
    const response = await httpClient.patch(`/requests/${requestId}/status`, { status });
    return response;
  },

  // Cancel a request
  cancelRequest: async (requestId) => {
    const response = await httpClient.patch(`/requests/${requestId}/cancel`);
    return response;
  },

  // Get worker's own requests
  getMyWorkerRequests: async () => {
    const response = await httpClient.get('/requests/my-worker');
    return response || {};
  },
};

// ============ CATEGORY/SERVICE APIs ============

export const categoryAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await httpClient.get('/categories');
    return response || {};
  },

  // Get single category
  getCategoryById: async (categoryId) => {
    const response = await httpClient.get(`/categories/${categoryId}`);
    return response;
  },

  // Create new category
  createCategory: async (categoryData) => {
    const response = await httpClient.post('/categories', categoryData);
    return response;
  },

  // Update category
  updateCategory: async (categoryId, categoryData) => {
    const response = await httpClient.put(`/categories/${categoryId}`, categoryData);
    return response;
  },

  // Delete/deactivate category
  deleteCategory: async (categoryId) => {
    const response = await httpClient.delete(`/categories/${categoryId}`);
    return response;
  },
};

// ============ RATING APIs ============

export const ratingAPI = {
  createRating: async (requestId, ratingData) => {
    const response = await httpClient.post(`/requests/${requestId}/rating`, ratingData);
    return response;
  },
  getRating: async (requestId) => {
    const response = await httpClient.get(`/requests/${requestId}/rating`);
    return response;
  },
  updateRating: async (requestId, ratingData) => {
    const response = await httpClient.patch(`/requests/${requestId}/rating`, ratingData);
    return response;
  },
  deleteRating: async (requestId) => {
    const response = await httpClient.delete(`/requests/${requestId}/rating`);
    return response;
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
    return response || {};
  },

  // Get single user
  getUserById: async (userId) => {
    const response = await httpClient.get(`/users/${userId}`);
    return response;
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
    return response;
  },
};

// ============ UPLOAD APIs ============

export const uploadAPI = {
  uploadFile: async (formData) => {
    const response = await httpClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response;
  },
  deleteFile: async (imageId) => {
    const response = await httpClient.post('/upload/delete', { imageId });
    return response;
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
