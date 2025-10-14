import React, { useState, useEffect } from 'react';
import { User, Briefcase, FileText, Settings, Bell, TrendingUp, Calendar, Award, Building } from 'lucide-react';
import { usersAPI, applicationsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, applicationsResponse] = await Promise.all([
        usersAPI.getDashboardStats(),
        applicationsAPI.getMyApplications({ limit: 5 })
      ]);
      
      setStats(statsResponse.stats);
      setApplications(applicationsResponse.applications || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'reviewing':
        return 'Under Review';
      case 'shortlisted':
        return 'Shortlisted';
      case 'rejected':
        return 'Not Selected';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalApplications || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.reviewingApplications || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shortlisted</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.shortlistedApplications || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.responseRate || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {applications.map(application => (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{application.jobId?.title}</h3>
                            <p className="text-sm text-gray-600">{application.jobId?.company}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            application.jobId?.type === 'government' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {application.jobId?.type === 'government' ? 'Gov' : 'Private'}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate('jobs')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span>Browse Jobs</span>
                </button>
                <button
                  onClick={() => onNavigate('government')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Building className="h-5 w-5 text-green-600" />
                  <span>Government Jobs</span>
                </button>
                <button
                  onClick={() => onNavigate('cv-creator')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span>Create CV</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <User className="h-5 w-5 text-yellow-600" />
                  <span>Update Resume</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Bell className="h-5 w-5 text-red-600" />
                  <span>Job Alerts</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Profile Info</span>
                  <span className="text-sm font-medium text-green-600">✓ Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resume</span>
                  <span className="text-sm font-medium text-yellow-600">Pending</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills</span>
                  <span className="text-sm font-medium text-yellow-600">Pending</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">33% Complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};