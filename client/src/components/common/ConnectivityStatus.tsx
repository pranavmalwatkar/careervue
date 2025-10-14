import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { 
  connectivityService, 
  ConnectivityStatus, 
  SyncStatus 
} from '../../services/connectivity';

export const ConnectivityIndicator: React.FC = () => {
  const [connectivity, setConnectivity] = useState<ConnectivityStatus>({
    isOnline: true,
    lastChecked: new Date()
  });
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSync: new Date(),
    syncInProgress: false,
    pendingUpdates: 0
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const handleConnectivityChange = (status: ConnectivityStatus) => {
      setConnectivity(status);
    };

    const handleSyncChange = (status: SyncStatus) => {
      setSyncStatus(status);
    };

    // Add listeners
    connectivityService.addStatusListener(handleConnectivityChange);
    connectivityService.addSyncListener(handleSyncChange);

    // Test connectivity on mount
    connectivityService.testConnectivity();

    return () => {
      connectivityService.removeStatusListener(handleConnectivityChange);
      connectivityService.removeSyncListener(handleSyncChange);
    };
  }, []);

  const handleTestConnectivity = async () => {
    await connectivityService.testConnectivity();
  };

  const handleProcessUpdates = async () => {
    await connectivityService.processPendingUpdates();
  };

  const getStatusColor = () => {
    if (!connectivity.isOnline) return 'text-red-500';
    if (syncStatus.pendingUpdates > 0) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (!connectivity.isOnline) return <WifiOff className="h-4 w-4" />;
    if (syncStatus.pendingUpdates > 0) return <Clock className="h-4 w-4" />;
    if (syncStatus.syncInProgress) return <RefreshCw className="h-4 w-4 animate-spin" />;
    return <Wifi className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!connectivity.isOnline) return 'Offline';
    if (syncStatus.syncInProgress) return 'Syncing...';
    if (syncStatus.pendingUpdates > 0) return `${syncStatus.pendingUpdates} pending`;
    return 'Online';
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="relative">
        {/* Main Status Button */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all ${getStatusColor()}`}
        >
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </button>

        {/* Detailed Status Panel */}
        {showDetails && (
          <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl border border-gray-200 w-80 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Connection Status</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Connection Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon()}
                  <span className={`text-sm font-medium ${getStatusColor()}`}>
                    {connectivity.isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {connectivity.connectionType && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Connection:</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {connectivity.connectionType}
                  </span>
                </div>
              )}

              {connectivity.speed && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Speed:</span>
                  <span className="text-sm font-medium text-gray-900">
                    ~{connectivity.speed} Mbps
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Checked:</span>
                <span className="text-sm text-gray-500">
                  {connectivity.lastChecked.toLocaleTimeString()}
                </span>
              </div>

              {/* Sync Status */}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Sync Status</span>
                  <button
                    onClick={handleProcessUpdates}
                    disabled={!connectivity.isOnline || syncStatus.pendingUpdates === 0}
                    className="text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Process Updates
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Sync:</span>
                    <span className="text-sm text-gray-500">
                      {syncStatus.lastSync.toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pending Updates:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {syncStatus.pendingUpdates}
                    </span>
                  </div>

                  {syncStatus.error && (
                    <div className="flex items-center space-x-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>{syncStatus.error}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={handleTestConnectivity}
                  disabled={syncStatus.syncInProgress}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Test Connection</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 