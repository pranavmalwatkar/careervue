export interface ConnectivityStatus {
  isOnline: boolean;
  lastChecked: Date;
  connectionType?: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  speed?: number; // in Mbps
}

export interface SyncStatus {
  lastSync: Date;
  syncInProgress: boolean;
  error?: string;
  pendingUpdates: number;
}

class ConnectivityService {
  private status: ConnectivityStatus = {
    isOnline: navigator.onLine,
    lastChecked: new Date()
  };

  private syncStatus: SyncStatus = {
    lastSync: new Date(),
    syncInProgress: false,
    pendingUpdates: 0
  };

  private listeners: Array<(status: ConnectivityStatus) => void> = [];
  private syncListeners: Array<(status: SyncStatus) => void> = [];

  constructor() {
    this.initializeEventListeners();
    this.startPeriodicChecks();
  }

  private initializeEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.updateStatus(true));
    window.addEventListener('offline', () => this.updateStatus(false));

    // Listen for connection changes (if supported)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', () => this.checkConnectionDetails());
    }
  }

  private updateStatus(isOnline: boolean) {
    this.status.isOnline = isOnline;
    this.status.lastChecked = new Date();
    this.notifyListeners();
  }

  private async checkConnectionDetails() {
    try {
      // Check connection type and speed
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        this.status.connectionType = connection.effectiveType || 'unknown';
        this.status.speed = connection.downlink || undefined;
      }

      // Test actual connectivity by making a lightweight request
      const startTime = Date.now();
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const endTime = Date.now();
      
      if (response.ok) {
        this.status.isOnline = true;
        this.status.speed = Math.round(1000 / (endTime - startTime)); // Rough speed estimate
      }
    } catch (error) {
      this.status.isOnline = false;
    }

    this.status.lastChecked = new Date();
    this.notifyListeners();
  }

  private startPeriodicChecks() {
    // Check connectivity every 30 seconds
    setInterval(() => {
      this.checkConnectionDetails();
    }, 30000);
  }

  public getStatus(): ConnectivityStatus {
    return { ...this.status };
  }

  public isOnline(): boolean {
    return this.status.isOnline;
  }

  public addStatusListener(listener: (status: ConnectivityStatus) => void) {
    this.listeners.push(listener);
    // Immediately notify with current status
    listener(this.status);
  }

  public removeStatusListener(listener: (status: ConnectivityStatus) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.status));
  }

  // Sync status methods
  public getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  public updateSyncStatus(updates: Partial<SyncStatus>) {
    this.syncStatus = { ...this.syncStatus, ...updates };
    this.notifySyncListeners();
  }

  public addSyncListener(listener: (status: SyncStatus) => void) {
    this.syncListeners.push(listener);
    listener(this.syncStatus);
  }

  public removeSyncListener(listener: (status: SyncStatus) => void) {
    const index = this.syncListeners.indexOf(listener);
    if (index > -1) {
      this.syncListeners.splice(index, 1);
    }
  }

  private notifySyncListeners() {
    this.syncListeners.forEach(listener => listener(this.syncStatus));
  }

  // Test internet connectivity
  public async testConnectivity(): Promise<boolean> {
    try {
      const startTime = Date.now();
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      const endTime = Date.now();
      
      this.status.isOnline = true;
      this.status.lastChecked = new Date();
      this.status.speed = Math.round(1000 / (endTime - startTime));
      
      this.notifyListeners();
      return true;
    } catch (error) {
      this.status.isOnline = false;
      this.status.lastChecked = new Date();
      this.notifyListeners();
      return false;
    }
  }

  // Queue updates for when connection is restored
  public queueUpdate(update: any) {
    this.syncStatus.pendingUpdates++;
    this.notifySyncListeners();
    
    // Store in localStorage for persistence
    const pendingUpdates = JSON.parse(localStorage.getItem('pendingJobUpdates') || '[]');
    pendingUpdates.push({
      ...update,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('pendingJobUpdates', JSON.stringify(pendingUpdates));
  }

  // Process pending updates when connection is restored
  public async processPendingUpdates() {
    if (!this.status.isOnline) return;

    const pendingUpdates = JSON.parse(localStorage.getItem('pendingJobUpdates') || '[]');
    if (pendingUpdates.length === 0) return;

    this.syncStatus.syncInProgress = true;
    this.syncStatus.pendingUpdates = pendingUpdates.length;
    this.notifySyncListeners();

    try {
      for (const update of pendingUpdates) {
        // Process each pending update
        await this.processUpdate(update);
      }

      // Clear pending updates
      localStorage.removeItem('pendingJobUpdates');
      this.syncStatus.pendingUpdates = 0;
      this.syncStatus.lastSync = new Date();
      this.syncStatus.error = undefined;
    } catch (error) {
      this.syncStatus.error = error instanceof Error ? error.message : 'Sync failed';
    } finally {
      this.syncStatus.syncInProgress = false;
      this.notifySyncListeners();
    }
  }

  private async processUpdate(update: any) {
    // Implement actual update processing logic
    // This would typically involve API calls to update job data
    console.log('Processing update:', update);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

// Create singleton instance
export const connectivityService = new ConnectivityService();

// Export convenience functions
export const isOnline = () => connectivityService.isOnline();
export const getConnectivityStatus = () => connectivityService.getStatus();
export const testConnectivity = () => connectivityService.testConnectivity();
export const addConnectivityListener = (listener: (status: ConnectivityStatus) => void) => 
  connectivityService.addStatusListener(listener);
export const removeConnectivityListener = (listener: (status: ConnectivityStatus) => void) => 
  connectivityService.removeStatusListener(listener); 