import React, { useState, useEffect } from 'react';
import { TrendingUp, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { adminAPI } from '../../services/adminAPI';

interface MessageStats {
  totalMessages: number;
  messagesByStatus: Array<{ status: string; count: number }>;
  dailyMessages: Array<{ 
    date: string; 
    count: number;
    positive?: number;
    negative?: number;
    neutral?: number;
  }>;
  messagesByPriority: Array<{ priority: string; count: number }>;
  sentimentStats?: {
    total: number;
    positive: number;
    negative: number;
    neutral: number;
    positivePercentage: number;
    negativePercentage: number;
    neutralPercentage: number;
  };
}

export const MessageStatistics: React.FC = () => {
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessageStatistics();
  }, []);

  const fetchMessageStatistics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getMessageStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching message statistics:', err);
      setError(err.message || 'Failed to fetch message statistics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'read':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'replied':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'archived':
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Calculate max value for graph scaling
  const maxDailyCount = Math.max(...stats.dailyMessages.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Message Statistics</h2>
      </div>

      {/* Total Messages Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Total Messages</p>
            <p className="text-4xl font-bold mt-2">{stats.totalMessages}</p>
          </div>
          <MessageSquare className="h-16 w-16 text-blue-200 opacity-50" />
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages by Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.messagesByStatus.map((item) => (
            <div key={item.status} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusIcon(item.status)}
                <span className="text-sm font-medium text-gray-600 capitalize">{item.status}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages by Priority</h3>
        <div className="grid grid-cols-3 gap-4">
          {stats.messagesByPriority.map((item) => (
            <div key={item.priority} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`h-3 w-3 rounded-full ${getPriorityColor(item.priority)}`}></div>
                <span className="text-sm font-medium text-gray-600 capitalize">{item.priority}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Stats */}
      {stats.sentimentStats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Sentiment Analysis</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-green-700">Positive</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{stats.sentimentStats.positive}</p>
              <p className="text-sm text-green-600 mt-1">{stats.sentimentStats.positivePercentage.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                <span className="text-sm font-medium text-gray-700">Neutral</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.sentimentStats.neutral}</p>
              <p className="text-sm text-gray-600 mt-1">{stats.sentimentStats.neutralPercentage.toFixed(1)}%</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-red-700">Negative</span>
              </div>
              <p className="text-2xl font-bold text-red-900">{stats.sentimentStats.negative}</p>
              <p className="text-sm text-red-600 mt-1">{stats.sentimentStats.negativePercentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Vertical Bar Chart with Sentiment Colors */}
      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              📊 Vertical Bar Chart - Message Trends
            </h3>
            <p className="text-sm text-gray-500 mt-1">Last 30 Days Analysis</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {stats.dailyMessages.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-xs text-gray-500">Total Messages</div>
          </div>
        </div>
        
        <div className="space-y-2">
          {stats.dailyMessages.length > 0 ? (
            <div className="relative pl-12 pr-4">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-80 flex flex-col justify-between text-xs font-semibold text-gray-600">
                <span className="bg-white px-1">{maxDailyCount}</span>
                <span className="bg-white px-1">{Math.floor(maxDailyCount * 0.75)}</span>
                <span className="bg-white px-1">{Math.floor(maxDailyCount * 0.5)}</span>
                <span className="bg-white px-1">{Math.floor(maxDailyCount * 0.25)}</span>
                <span className="bg-white px-1">0</span>
              </div>

              {/* Grid lines */}
              <div className="absolute left-12 right-4 top-0 h-80 flex flex-col justify-between pointer-events-none">
                <div className="border-t border-dashed border-gray-300"></div>
                <div className="border-t border-dashed border-gray-300"></div>
                <div className="border-t border-dashed border-gray-300"></div>
                <div className="border-t border-dashed border-gray-300"></div>
                <div className="border-t-2 border-gray-400"></div>
              </div>

              {/* Vertical Bar Chart */}
              <div className="relative flex items-end justify-around space-x-2 h-80 border-b-2 border-l-2 border-gray-400 pb-2 pl-2">
                {stats.dailyMessages.map((item, index) => {
                  const height = (item.count / maxDailyCount) * 100;
                  const positiveRatio = item.positive ? item.positive / item.count : 0;
                  const negativeRatio = item.negative ? item.negative / item.count : 0;
                  
                  // Determine bar color based on sentiment
                  let barColor = 'from-gray-500 to-gray-400'; // neutral
                  let borderColor = 'border-gray-600';
                  let shadowColor = 'shadow-gray-300';
                  if (positiveRatio > 0.5) {
                    barColor = 'from-green-500 to-green-400'; // positive
                    borderColor = 'border-green-600';
                    shadowColor = 'shadow-green-300';
                  } else if (negativeRatio > 0.5) {
                    barColor = 'from-red-500 to-red-400'; // negative
                    borderColor = 'border-red-600';
                    shadowColor = 'shadow-red-300';
                  }
                  
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center group relative"
                      style={{ width: '20px', maxWidth: '24px' }}
                    >
                      {/* Vertical Bar */}
                      <div
                        className={`w-full bg-gradient-to-t ${barColor} rounded-t-lg border-2 ${borderColor} hover:opacity-90 hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg ${shadowColor}`}
                        style={{ 
                          height: `${Math.max(height, 2)}%`,
                          minHeight: item.count > 0 ? '12px' : '0px',
                          minWidth: '18px'
                        }}
                      >
                        {/* Count label on top of bar */}
                        {item.count > 0 && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                            {item.count}
                          </div>
                        )}
                        
                        {/* Detailed Tooltip */}
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-20 shadow-xl">
                          <div className="font-bold text-center mb-1">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div className="border-t border-gray-700 my-1"></div>
                          <div className="font-semibold">📧 {item.count} Total Messages</div>
                          <div className="text-green-300">✓ {item.positive || 0} Positive</div>
                          <div className="text-gray-300">○ {item.neutral || 0} Neutral</div>
                          <div className="text-red-300">✗ {item.negative || 0} Negative</div>
                          {/* Arrow pointer */}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Date Label (show every 3rd date for better visibility) */}
                      {index % 3 === 0 && (
                        <span className="text-xs text-gray-600 mt-2 font-medium">
                          {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* X-axis label */}
              <div className="text-center mt-6 text-sm font-semibold text-gray-700 bg-gray-50 py-2 rounded">
                📅 Timeline (Date)
              </div>
              
              {/* Y-axis label - Vertical */}
              <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-semibold text-gray-700 bg-blue-50 px-3 py-1 rounded">
                ↑ Message Count ↑
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No message data available for the last 30 days</p>
            </div>
          )}
        </div>
        
        {/* Legend and Summary */}
        {stats.dailyMessages.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
            {/* Color Legend */}
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gradient-to-t from-green-500 to-green-400 rounded"></div>
                <span className="text-gray-600">Positive Feedback</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gradient-to-t from-gray-500 to-gray-400 rounded"></div>
                <span className="text-gray-600">Neutral</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gradient-to-t from-red-500 to-red-400 rounded"></div>
                <span className="text-gray-600">Negative Feedback</span>
              </div>
            </div>
            
            {/* Statistics */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-gray-600">
                  Average: <span className="font-semibold text-gray-900">
                    {(stats.dailyMessages.reduce((sum, item) => sum + item.count, 0) / stats.dailyMessages.length).toFixed(1)}
                  </span> messages/day
                </span>
              </div>
              <div className="text-gray-600">
                Peak: <span className="font-semibold text-gray-900">{maxDailyCount}</span> messages
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
