const API_BASE_URL = import.meta.env.VITE_APP_API_URL || '/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create headers with auth token
const createHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: createHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    location?: { city: string; state: string };
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  },

  verifyResetToken: async (token: string) => {
    return apiRequest(`/auth/verify-reset-token/${token}`);
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (userData: any) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }
};

// Jobs API
export const jobsAPI = {
  getJobs: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    category?: string;
    employmentType?: string;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest(`/jobs?${queryParams.toString()}`);
  },

  getJobById: async (id: string) => {
    return apiRequest(`/jobs/${id}`);
  },

  createJob: async (jobData: any) => {
    return apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  },

  updateJob: async (id: string, jobData: any) => {
    return apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData)
    });
  },

  deleteJob: async (id: string) => {
    return apiRequest(`/jobs/${id}`, {
      method: 'DELETE'
    });
  },

  getCategories: async () => {
    return apiRequest('/jobs/meta/categories');
  },

  getLocations: async () => {
    return apiRequest('/jobs/meta/locations');
  }
};

// Applications API
export const applicationsAPI = {
  applyForJob: async (applicationData: {
    jobId: string;
    coverLetter?: string;
    resume: string;
  }) => {
    return apiRequest('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  },

  getMyApplications: async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest(`/applications/my-applications?${queryParams.toString()}`);
  },

  getJobApplications: async (jobId: string, params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest(`/applications/job/${jobId}?${queryParams.toString()}`);
  },

  updateApplicationStatus: async (id: string, status: string, notes?: string) => {
    return apiRequest(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes })
    });
  },

  getApplicationById: async (id: string) => {
    return apiRequest(`/applications/${id}`);
  }
};

// Users API
export const usersAPI = {
  getDashboardStats: async () => {
    return apiRequest('/users/dashboard-stats');
  },

  updateSkills: async (skills: string[]) => {
    return apiRequest('/users/skills', {
      method: 'PUT',
      body: JSON.stringify({ skills })
    });
  },

  updateEducation: async (education: any) => {
    return apiRequest('/users/education', {
      method: 'PUT',
      body: JSON.stringify({ education })
    });
  }
};

// Companies API
export const companiesAPI = {
  getCompanies: async (params: {
    page?: number;
    limit?: number;
    sector?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    featured?: boolean;
  } = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    return apiRequest(`/companies?${queryParams.toString()}`);
  },

  getCompanyById: async (id: string) => {
    return apiRequest(`/companies/${id}`);
  },

  getSectors: async () => {
    return apiRequest('/companies/meta/sectors');
  },

  getCompanyStats: async () => {
    return apiRequest('/companies/meta/stats');
  },

  createCompany: async (companyData: {
    id: string;
    name: string;
    sector: string;
    officialWebsite: string;
    careerLink: string;
    logo?: string;
    description?: string;
    headquarters: string;
    founded: string;
    employees: string;
    featured?: boolean;
  }) => {
    return apiRequest('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData)
    });
  },

  updateCompany: async (id: string, companyData: Partial<{
    name: string;
    sector: string;
    officialWebsite: string;
    careerLink: string;
    logo: string;
    description: string;
    headquarters: string;
    founded: string;
    employees: string;
    featured: boolean;
    isActive: boolean;
  }>) => {
    return apiRequest(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData)
    });
  },

  deleteCompany: async (id: string) => {
    return apiRequest(`/companies/${id}`, {
      method: 'DELETE'
    });
  },

  bulkOperation: async (data: {
    action: 'feature' | 'unfeature' | 'activate' | 'deactivate' | 'update';
    companyIds: string[];
    updates?: any;
  }) => {
    return apiRequest('/companies/bulk', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};