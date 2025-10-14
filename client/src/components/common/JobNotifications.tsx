import React, { useState, useEffect } from 'react';
import { Bell, X, ExternalLink, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { checkNewJobNotifications, getTrendingJobCategories } from '../../services/jobUpdates';

interface JobNotificationsProps {
  onClose?: () => void;
}

export const JobNotifications: React.FC<JobNotificationsProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [newJobsCount, setNewJobsCount] = useState(0);
  const [updatedJobsCount, setUpdatedJobsCount] = useState(0);
  const [trendingCategories, setTrendingCategories] = useState<{
    category: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { newJobs, updatedJobs, notifications: jobNotifications } = await checkNewJobNotifications();
        const trends = await getTrendingJobCategories();
        
        setNewJobsCount(newJobs);
        setUpdatedJobsCount(updatedJobs);
        setNotifications(jobNotifications);
        setTrendingCategories(trends);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    
    // Refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const totalNotifications = newJobsCount + updatedJobsCount;

  if (totalNotifications === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Bell className="h-6 w-6" />
          {totalNotifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {totalNotifications > 9 ? '9+' : totalNotifications}
            </span>
          )}
        </button>

        {/* Expanded Notifications Panel */}
        {isExpanded && (
          <div className="absolute top-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-900">Job Updates</h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Summary Stats */}
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{newJobsCount}</div>
                  <div className="text-sm text-gray-600">New Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{updatedJobsCount}</div>
                  <div className="text-sm text-gray-600">Updated</div>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Recent Updates
              </h4>
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notification, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {notification.includes('🔥 NEW') ? (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{notification}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Categories */}
            <div className="p-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Categories
              </h4>
              <div className="space-y-2">
                {trendingCategories.slice(0, 3).map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{category.category}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {category.count.toLocaleString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        category.trend === 'up' 
                          ? 'bg-green-100 text-green-800'
                          : category.trend === 'down'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.trend === 'up' ? '↗' : category.trend === 'down' ? '↘' : '→'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Updated just now
                </span>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 