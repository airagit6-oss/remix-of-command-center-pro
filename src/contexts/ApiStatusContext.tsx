import React, { createContext, useContext, useEffect, useState } from 'react';
import { AlertCircle, WifiOff } from 'lucide-react';

interface ApiStatus {
  isHealthy: boolean;
  lastChecked: Date | null;
  error: string | null;
}

interface ApiStatusContextType {
  status: ApiStatus;
  retry: () => void;
}

const ApiStatusContext = createContext<ApiStatusContextType | undefined>(undefined);

const checkApiHealth = async (): Promise<ApiStatus> => {
  try {
    const response = await fetch('/api/v1/health', {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    // Only consider 200-299 status codes as healthy
    if (response.status >= 200 && response.status < 300) {
      return {
        isHealthy: true,
        lastChecked: new Date(),
        error: null
      };
    } else if (response.status === 404) {
      // 404 is acceptable - backend may not have health check endpoint
      // Don't show error banner for 404
      return {
        isHealthy: true,
        lastChecked: new Date(),
        error: null
      };
    } else {
      return {
        isHealthy: false,
        lastChecked: new Date(),
        error: `API returned status ${response.status}`
      };
    }
  } catch (error) {
    // Network errors are concerning, show them
    return {
      isHealthy: false,
      lastChecked: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const ApiStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ApiStatus>({
    isHealthy: true,
    lastChecked: null,
    error: null
  });

  const checkHealth = async () => {
    const newStatus = await checkApiHealth();
    setStatus(newStatus);
  };

  useEffect(() => {
    // Check on mount
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    // Listen for online/offline events
    const handleOnline = () => checkHealth();
    const handleOffline = () => {
      setStatus({
        isHealthy: false,
        lastChecked: new Date(),
        error: 'Network connection lost'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ApiStatusContext.Provider value={{ status, retry: checkHealth }}>
      {!status.isHealthy && <ApiStatusBanner status={status} onRetry={checkHealth} />}
      {children}
    </ApiStatusContext.Provider>
  );
};

export const useApiStatus = (): ApiStatusContextType => {
  const context = useContext(ApiStatusContext);
  if (context === undefined) {
    throw new Error('useApiStatus must be used within ApiStatusProvider');
  }
  return context;
};

interface ApiStatusBannerProps {
  status: ApiStatus;
  onRetry: () => void;
}

const ApiStatusBanner: React.FC<ApiStatusBannerProps> = ({ status, onRetry }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const lastCheckText = status.lastChecked 
    ? `Last checked: ${status.lastChecked.toLocaleTimeString()}`
    : 'Checking connection...';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-50 border-b border-red-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-start justify-between gap-4 sm:items-center">
        <div className="flex items-start gap-3 sm:items-center flex-1">
          <WifiOff className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1">
            <p className="font-medium text-red-900">
              Backend Service Unavailable
            </p>
            <p className="text-sm text-red-700">
              {status.error || 'Unable to connect to the server. Please check your connection or try again later.'}
            </p>
            <p className="text-xs text-red-600 mt-1">{lastCheckText}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onRetry}
            className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-2 py-1.5 text-red-600 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiStatusProvider;
