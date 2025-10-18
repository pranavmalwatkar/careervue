const ADMIN_API_BASE_URL = '/api/admin';

// Get admin auth token from localStorage
const getAdminAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Create headers with admin auth token
const createAdminHeaders = () => {
  const token = getAdminAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic admin API request function
const adminApiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${ADMIN_API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: createAdminHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Admin API request failed');
    }

    return data;
  } catch (error) {
    console.error('Admin API request error:', error);
    throw error;
  }
};

// Admin API
export const adminAPI = {
  // Authentication
  login: async (email: string, password: string) => {
    return adminApiRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // Dashboard
  getDashboardStats: async () => {
    return adminApiRequest('/dashboard/stats');
  },

  // Users Management
  getUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isVerified?: boolean;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return adminApiRequest(`/users?${queryParams.toString()}`);
  },

  updateUserStatus: async (userId: string, updates: {
    isVerified?: boolean;
    role?: string;
  }) => {
    return adminApiRequest(`/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  deleteUser: async (userId: string) => {
    return adminApiRequest(`/users/${userId}`, {
      method: 'DELETE'
    });
  },

  // Jobs Management
  getJobs: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    category?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return adminApiRequest(`/jobs?${queryParams.toString()}`);
  },

  createJob: async (jobData: any) => {
    return adminApiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  },

  updateJob: async (jobId: string, updates: any) => {
    return adminApiRequest(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  updateJobStatus: async (jobId: string, updates: {
    isActive?: boolean;
    featured?: boolean;
  }) => {
    return adminApiRequest(`/jobs/${jobId}/status`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  deleteJob: async (jobId: string) => {
    return adminApiRequest(`/jobs/${jobId}`, {
      method: 'DELETE'
    });
  },

  // Applications Management
  getApplications: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    jobId?: string;
    userId?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return adminApiRequest(`/applications?${queryParams.toString()}`);
  },

  // Admin Profile
  getProfile: async () => {
    return adminApiRequest('/profile');
  },

  updateProfile: async (profileData: any) => {
    return adminApiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Admin Management (Super Admin only)
  createAdmin: async (adminData: {
    name: string;
    email: string;
    password: string;
    role?: string;
    department?: string;
    permissions?: any;
  }) => {
    return adminApiRequest('/create', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  },

  getAdmins: async () => {
    return adminApiRequest('/admins');
  },

  updateAdminPermissions: async (adminId: string, updates: {
    permissions?: any;
    role?: string;
  }) => {
    return adminApiRequest(`/admins/${adminId}/permissions`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  // Messages/Contracts Management
  getMessages: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    userId?: string;
    jobId?: string;
    type?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return adminApiRequest(`/messages?${queryParams.toString()}`);
  },

  // Activity Management
  getActivities: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return adminApiRequest(`/activities?${queryParams.toString()}`);
  },

  getActivityStats: async (params: {
    startDate?: string;
    endDate?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return adminApiRequest(`/activities/stats?${queryParams.toString()}`);
  },

  // Government Jobs Management
  getGovernmentJobs: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return adminApiRequest(`/government-jobs?${queryParams.toString()}`);
  },

  createGovernmentJob: async (jobData: any) => {
    return adminApiRequest('/government-jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  },

  updateGovernmentJob: async (jobId: string, updates: any) => {
    return adminApiRequest(`/government-jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  updateGovernmentJobStatus: async (jobId: string, updates: {
    isActive?: boolean;
    featured?: boolean;
  }) => {
    return adminApiRequest(`/government-jobs/${jobId}/status`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  deleteGovernmentJob: async (jobId: string) => {
    return adminApiRequest(`/government-jobs/${jobId}`, {
      method: 'DELETE'
    });
  },

  // Companies Management
  getCompanies: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    sector?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return adminApiRequest(`/companies?${queryParams.toString()}`);
  },

  createCompany: async (companyData: any) => {
    return adminApiRequest('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData)
    });
  },

  updateCompany: async (companyId: string, updates: any) => {
    return adminApiRequest(`/companies/${companyId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  updateCompanyStatus: async (companyId: string, updates: {
    isActive?: boolean;
    featured?: boolean;
  }) => {
    return adminApiRequest(`/companies/${companyId}/status`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  deleteCompany: async (companyId: string) => {
    return adminApiRequest(`/companies/${companyId}`, {
      method: 'DELETE'
    });
  },

  // Contact Messages Management
  getContactMessages: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return adminApiRequest(`/contact-messages?${queryParams.toString()}`);
  },

  getContactMessage: async (messageId: string) => {
    return adminApiRequest(`/contact-messages/${messageId}`);
  },

  updateContactMessageStatus: async (messageId: string, updates: {
    status?: string;
    priority?: string;
  }) => {
    return adminApiRequest(`/contact-messages/${messageId}/status`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  respondToContactMessage: async (messageId: string, response: string) => {
    return adminApiRequest(`/contact-messages/${messageId}/response`, {
      method: 'PUT',
      body: JSON.stringify({ response })
    });
  },

  deleteContactMessage: async (messageId: string) => {
    return adminApiRequest(`/contact-messages/${messageId}`, {
      method: 'DELETE'
    });
  },

  getContactMessageStats: async () => {
    return adminApiRequest('/contact-messages/stats/overview');
  },

  // Message Statistics for Dashboard
  getMessageStatistics: async () => {
    return adminApiRequest('/messages/statistics');
  }
};