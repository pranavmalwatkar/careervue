import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  TrendingDown,
  Shield,
  Clock,
  Activity,
  MessageSquare,
  Home,
  LogOut
} from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';
import { UserManagement } from './UserManagement';
import { JobManagement } from './JobManagement';
import { MessageManagement } from './MessageManagement';
import { ActivityManagement } from './ActivityManagement';
import { MessageStatistics } from './MessageStatistics';
import { fetchLatestJobUpdates, JobUpdate } from '../../services/jobUpdates';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">
            There was an error loading this section. Please try refreshing the page.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

interface DashboardStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  activeJobs: number;
  pendingApplications: number;
  userGrowthRate: number;
  jobGrowthRate: number;
}

interface RecentActivity {
  users: Array<{
    _id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  jobs: Array<{
    _id: string;
    title: string;
    company: string;
    createdAt: string;
  }>;
  applications: Array<{
    _id: string;
    userId: { name: string; email: string };
    jobId: { title: string; company: string };
    createdAt: string;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null);
  const [jobUpdates, setJobUpdates] = useState<JobUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
    fetchAdminProfile();
    fetchJobUpdates();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const adminData = await adminAPI.getProfile();
      setAdmin(adminData);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
    }
  };

  const fetchJobUpdates = async () => {
    try {
      const updates = await fetchLatestJobUpdates();
      setJobUpdates(updates);
    } catch (error) {
      console.error('Error fetching job updates:', error);
      setJobUpdates([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    // Force page reload to redirect to main app
    window.location.href = '/';
  };

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.stats);
      setRecentActivity(response.recent);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values if API fails
      setStats({
        totalUsers: 0,
        totalJobs: 0,
        totalApplications: 0,
        activeJobs: 0,
        pendingApplications: 0,
        userGrowthRate: 0,
        jobGrowthRate: 0
      });
      setRecentActivity({
        users: [],
        jobs: [],
        applications: []
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatGrowthRate = (rate: number) => {
    const isPositive = rate >= 0;
    return (
      <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span className="text-sm font-medium">{Math.abs(rate)}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const navigation = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'jobs', name: 'Jobs', icon: Briefcase },
    { id: 'messages', name: 'Messages', icon: MessageSquare },
    { id: 'activities', name: 'Activities', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Always visible */}
      <div className="w-64 bg-white shadow-lg flex flex-col fixed h-screen overflow-y-auto">
        <div className="flex items-center justify-center p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-500">Careervue</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 px-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </nav>

      </div>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 capitalize">
                {navigation.find(nav => nav.id === activeTab)?.name || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">Manage your Careervue platform</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {admin?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{admin?.name || 'Admin'}</p>
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  {formatGrowthRate(stats?.userGrowthRate || 0)}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalJobs.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  {formatGrowthRate(stats?.jobGrowthRate || 0)}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalApplications.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">All time</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.activeJobs.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-1 text-green-600">
                    <span className="text-sm font-medium">Live</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.pendingApplications.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <span className="text-sm font-medium">Needs Review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Users */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity?.users.map((user) => (
                      <div key={user._id} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(user.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Jobs */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Jobs</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity?.jobs.map((job) => (
                      <div key={job._id} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                          <p className="text-sm text-gray-500 truncate">{job.company}</p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatDate(job.createdAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {jobUpdates.length > 0 ? (
                      jobUpdates.map((update) => (
                        <div key={update.id} className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {update.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {update.source} • Posts: {update.posts}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(update.lastUpdated)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No recent job updates available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <ErrorBoundary>
            <UserManagement onUserUpdate={fetchDashboardData} />
          </ErrorBoundary>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <ErrorBoundary>
            <div className="space-y-6">
              <JobManagement onJobUpdate={fetchDashboardData} />
            </div>
          </ErrorBoundary>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <ErrorBoundary>
            <div className="space-y-6">
              <MessageStatistics />
              <MessageManagement onMessageUpdate={fetchDashboardData} />
            </div>
          </ErrorBoundary>
        )}

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <ErrorBoundary>
            <div className="space-y-6">
              <ActivityManagement onActivityUpdate={fetchDashboardData} />
            </div>
          </ErrorBoundary>
        )}

        </main>
      </div>
    </div>
  );
};