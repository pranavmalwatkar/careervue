import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';

interface Job {
  _id: string;
  title: string;
  company: string;
  type: 'government' | 'private';
  location: {
    city: string;
    state: string;
    remote: boolean;
  };
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  experience: {
    min: number;
    max: number;
  };
  category: string;
  employmentType: string;
  deadline: string;
  isActive: boolean;
  featured: boolean;
  applicationsCount: number;
  createdAt: string;
  postedBy: {
    name: string;
    email: string;
  };
}

interface JobManagementProps {
  onJobUpdate?: () => void;
}

export const JobManagement: React.FC<JobManagementProps> = ({ onJobUpdate }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    type: 'private' as 'government' | 'private',
    location: {
      city: '',
      state: '',
      remote: false
    },
    salary: {
      min: 0,
      max: 0,
      currency: 'INR'
    },
    experience: {
      min: 0,
      max: 5
    },
    category: '',
    employmentType: 'full-time',
    description: '',
    requirements: [''],
    benefits: [''],
    skills: [''],
    deadline: '',
    isPremium: false,
    applicationFee: 0
  });
  const [formLoading, setFormLoading] = useState(false);

  const categories = [
    'Technology', 'Government', 'Banking', 'Healthcare', 'Education',
    'Marketing', 'Sales', 'Finance', 'Engineering', 'Design',
    'Operations', 'HR', 'Legal', 'Consulting', 'Other'
  ];

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getJobs({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        type: typeFilter,
        category: categoryFilter,
        isActive: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      setJobs(response.jobs);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, searchTerm, typeFilter, categoryFilter, statusFilter]);

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      type: 'private',
      location: {
        city: '',
        state: '',
        remote: false
      },
      salary: {
        min: 0,
        max: 0,
        currency: 'INR'
      },
      experience: {
        min: 0,
        max: 5
      },
      category: '',
      employmentType: 'full-time',
      description: '',
      requirements: [''],
      benefits: [''],
      skills: [''],
      deadline: '',
      isPremium: false,
      applicationFee: 0
    });
  };

  const handleCreateJob = () => {
    resetForm();
    setEditingJob(null);
    setShowCreateModal(true);
  };

  const handleEditJob = (job: Job) => {
    setFormData({
      title: job.title,
      company: job.company,
      type: job.type,
      location: job.location,
      salary: job.salary,
      experience: job.experience,
      category: job.category,
      employmentType: job.employmentType,
      description: '', // This would need to be fetched from the full job object
      requirements: [], // This would need to be fetched from the full job object
      benefits: [], // This would need to be fetched from the full job object
      skills: [], // This would need to be fetched from the full job object
      deadline: job.deadline.split('T')[0], // Convert to date format
      isPremium: false, // This would need to be fetched from the full job object
      applicationFee: 0 // This would need to be fetched from the full job object
    });
    setEditingJob(job);
    setShowCreateModal(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleSalaryChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: value
      }
    }));
  };

  const handleExperienceChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        [field]: value
      }
    }));
  };

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) =>
        i === index ? value : item
      )
    }));
  };

  const addArrayField = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }));
  };

  const removeArrayField = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);

      if (editingJob) {
        await adminAPI.updateJob(editingJob._id, formData);
      } else {
        await adminAPI.createJob(formData);
      }

      setShowCreateModal(false);
      resetForm();
      await fetchJobs();
      onJobUpdate?.();
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleJobAction = async (jobId: string, action: string) => {
    try {
      setActionLoading(jobId);

      if (action === 'delete') {
        if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
          return;
        }
        await adminAPI.deleteJob(jobId);
      } else if (action === 'activate') {
        await adminAPI.updateJobStatus(jobId, { isActive: true });
      } else if (action === 'deactivate') {
        await adminAPI.updateJobStatus(jobId, { isActive: false });
      } else if (action === 'feature') {
        await adminAPI.updateJobStatus(jobId, { featured: true });
      } else if (action === 'unfeature') {
        await adminAPI.updateJobStatus(jobId, { featured: false });
      }

      await fetchJobs();
      onJobUpdate?.();
    } catch (error) {
      console.error(`Error ${action}ing job:`, error);
    } finally {
      setActionLoading(null);
      setShowActions(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSalary = (min: number, max: number, currency: string = 'INR') => {
    const formatNumber = (num: number) => {
      if (num >= 100000) {
        return `${(num / 100000).toFixed(1)}L`;
      }
      return num.toLocaleString();
    };
    return `${currency} ${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const getTypeBadgeColor = (type: string) => {
    return type === 'government' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Add error state handling
  if (!jobs && !loading) {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Unable to load jobs</h3>
        <p className="mt-1 text-sm text-gray-500">
          There was an error loading the jobs. Please try refreshing the page.
        </p>
        <button
          onClick={fetchJobs}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Management</h2>
          <p className="text-gray-600">Manage and monitor all job postings</p>
        </div>
        <button
          onClick={handleCreateJob}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Job</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('');
              setCategoryFilter('');
              setStatusFilter('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadgeColor(job.type)}`}>
                  {job.type}
                </span>
                {job.featured && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowActions(showActions === job._id ? null : job._id)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {showActions === job._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => handleJobAction(job._id, job.isActive ? 'deactivate' : 'activate')}
                        disabled={actionLoading === job._id}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {job.isActive ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleJobAction(job._id, job.featured ? 'unfeature' : 'feature')}
                        disabled={actionLoading === job._id}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        {job.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button
                        onClick={() => handleJobAction(job._id, 'delete')}
                        disabled={actionLoading === job._id}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <Building className="h-4 w-4 mr-1" />
              <span className="text-sm">{job.company}</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{job.location.city}, {job.location.state}</span>
                {job.location.remote && <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Remote</span>}
              </div>

              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-sm">{formatSalary(job.salary.min, job.salary.max, job.salary.currency)}</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm">{job.experience.min}-{job.experience.max} years experience</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">Deadline: {formatDate(job.deadline)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(job.isActive)}`}>
                {job.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="text-sm text-gray-500">
                {job.applicationsCount} applications
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Posted by: {job.postedBy.name}</span>
                <span>{formatDate(job.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || typeFilter || categoryFilter || statusFilter
              ? 'Try adjusting your filters'
              : 'No jobs have been posted yet'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Job Creation/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingJob ? 'Edit Job' : 'Create New Job'}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="private">Private</option>
                      <option value="government">Government</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => handleInputChange('employmentType', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      value={formData.location.city}
                      onChange={(e) => handleLocationChange('city', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">State</label>
                    <input
                      type="text"
                      value={formData.location.state}
                      onChange={(e) => handleLocationChange('state', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      checked={formData.location.remote}
                      onChange={(e) => handleLocationChange('remote', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">Remote Work</label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Salary</label>
                    <input
                      type="number"
                      value={formData.salary.min}
                      onChange={(e) => handleSalaryChange('min', Number(e.target.value))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Salary</label>
                    <input
                      type="number"
                      value={formData.salary.max}
                      onChange={(e) => handleSalaryChange('max', Number(e.target.value))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <select
                      value={formData.salary.currency}
                      onChange={(e) => handleInputChange('salary', { ...formData.salary, currency: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Min Experience (years)</label>
                    <input
                      type="number"
                      value={formData.experience.min}
                      onChange={(e) => handleExperienceChange('min', Number(e.target.value))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Experience (years)</label>
                    <input
                      type="number"
                      value={formData.experience.max}
                      onChange={(e) => handleExperienceChange('max', Number(e.target.value))}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the job role, responsibilities, and requirements..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {formLoading ? 'Saving...' : (editingJob ? 'Update Job' : 'Create Job')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};