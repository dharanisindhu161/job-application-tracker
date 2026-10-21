const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('jobtracker_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('jobtracker_token', token);
  } else {
    localStorage.removeItem('jobtracker_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth API
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    demoLogin: () =>
      request('/auth/demo', {
        method: 'POST'
      }),
    getMe: () => request('/auth/me')
  },

  // Job Applications API
  applications: {
    // GET /api/applications (with filtering & sorting)
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'All') query.append('status', params.status);
      if (params.search) query.append('search', params.search);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);

      const qs = query.toString();
      return request(`/applications${qs ? `?${qs}` : ''}`);
    },

    // GET /api/applications/stats (Dashboard aggregation)
    getStats: () => request('/applications/stats'),

    // GET /api/applications/:id
    getById: (id) => request(`/applications/${id}`),

    // POST /api/applications (Create new job application)
    create: (applicationData) =>
      request('/applications', {
        method: 'POST',
        body: JSON.stringify(applicationData)
      }),

    // PATCH /api/applications/:id/status (Workflow stage transition)
    updateStatus: (id, status) =>
      request(`/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),

    // PUT /api/applications/:id (Full edit)
    update: (id, updates) =>
      request(`/applications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      }),

    // DELETE /api/applications/:id
    delete: (id) =>
      request(`/applications/${id}`, {
        method: 'DELETE'
      })
  }
};
