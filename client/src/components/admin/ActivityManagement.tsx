import React, { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  Filter,
  Calendar,
  User,
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  Users,
  Building
} from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';

interface Activity {
  id: string;
  type: string;
  description: string;
  user: string;
  email?: string;
  createdAt: string;
  resource: string;
}

interface ActivityStats {
  totalUsers: number;
  totalJobs: number;
  totalApplications: number;
  totalActivities: number;
}

interface ActivityManagementProps {
  onActivityUpdate?: () => void;
}

export const ActivityManagement: React.FC<ActivityManagementProps> = ({ onActivityUpdate }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getActivities({
        page: currentPage,
        limit: 15,
        search: searchTerm,
        resource: resourceFilter,
        action: actionFilter,
        startDate: startDate,
        endDate: endDate,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      setActivities(response.activities);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityStats = async () => {
    try {
      const response = await adminAPI.getActivityStats({
        startDate: startDate,
        endDate: endDate
      });
      setStats(response.stats);
    } catch (error) {
      console.error('Error fetching activity stats:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchActivityStats();
  }, [currentPage, searchTerm, resourceFilter, actionFilter, startDate, endDate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'job_created':
        return <Briefcase className="h-4 w-4 text-green-500" />;
      case 'application_submitted':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getResourceBadgeColor = (resource: string) => {
    switch (resource) {
      case 'User': return 'bg-blue-100 text-blue-800';
      case 'Job': return 'bg-green-100 text-green-800';
      case 'Application': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'user_created': return 'text-blue-600';
      case 'job_created': return 'text-green-600';
      case 'application_submitted': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activity Management</h2>
          <p className="text-gray-600">Monitor and track all platform activities</p>
        </div>
        <div className="text-sm text-gray-500">
          Total Activities: {activities.length > 0 ? `${(currentPage - 1) * 15 + 1}-${Math.min(currentPage * 15, activities.length)} of ${totalPages * 15}` : '0'}
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalActivities.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Resources</option>
            <option value="User">User</option>
            <option value="Job">Job</option>
            <option value="Application">Application</option>
          </select>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Actions</option>
            <option value="user_created">User Created</option>
            <option value="job_created">Job Created</option>
            <option value="application_submitted">Application Submitted</option>
          </select>

          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setResourceFilter('');
              setActionFilter('');
              setStartDate('');
              setEndDate('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getResourceBadgeColor(activity.resource)}`}>
                        {activity.resource}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(activity.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      <span>{activity.user}</span>
                    </div>
                    {activity.email && (
                      <div className="flex items-center">
                        <span>{activity.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-12">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || resourceFilter || actionFilter || startDate || endDate
                ? 'Try adjusting your filters'
                : 'No activities have been recorded yet'}
            </p>
          </div>
        )}
      </div>

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
    </div>
  );
};