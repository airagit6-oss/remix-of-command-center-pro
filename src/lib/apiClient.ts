/**
 * API Client for AI API Manager
 * Real backend connection with MongoDB
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/ai-api-manager';

// Enable real backend
export const BACKEND_ENABLED = true;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

class APIManagerClient {
  private baseURL: string;
  private userId: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.userId = localStorage.getItem('userId') || 'user-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', this.userId);
  }

  private async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': this.userId,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        ...(options.body && { body: JSON.stringify(options.body) }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // API Registry
  async getAllAPIs(filters?: any) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/apis${queryParams ? '?' + queryParams : ''}`);
  }

  async getAPI(id: string) {
    return this.request(`/apis/${id}`);
  }

  async createAPI(apiData: any) {
    return this.request('/apis', { method: 'POST', body: apiData });
  }

  async updateAPI(id: string, updates: any) {
    return this.request(`/apis/${id}`, { method: 'PUT', body: updates });
  }

  async deleteAPI(id: string) {
    return this.request(`/apis/${id}`, { method: 'DELETE' });
  }

  // AI Providers
  async getAllAIProviders() {
    return this.request('/ai-providers');
  }

  async getAIProvider(id: string) {
    return this.request(`/ai-providers/${id}`);
  }

  async createAIProvider(providerData: any) {
    return this.request('/ai-providers', { method: 'POST', body: providerData });
  }

  // Usage
  async recordUsage(apiId: string, requestCount: number, cost: number) {
    return this.request('/usage', {
      method: 'POST',
      body: { apiId, requestCount, cost, unit: 'request' },
    });
  }

  // Alerts
  async getAllAlerts(filters?: any) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/alerts${queryParams ? '?' + queryParams : ''}`);
  }

  async createAlert(alertData: any) {
    return this.request('/alerts', { method: 'POST', body: alertData });
  }

  // Dashboard
  async getDashboardMetrics() {
    return this.request('/dashboard/metrics');
  }

  // Health
  async recordHealthCheck(apiId: string, healthData: any) {
    return this.request(`/health/${apiId}`, {
      method: 'POST',
      body: healthData,
    });
  }

  // Wallet
  async getWallet() {
    return this.request('/wallet');
  }

  // Connection test
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/../../../health`);
      return await response.json();
    } catch (error) {
      console.error('Backend connection failed:', error);
      throw error;
    }
  }
}

export const apiManagerClient = new APIManagerClient();

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const headers = {
    'x-user-id': localStorage.getItem('userId') || 'user-anonymous',
  };

  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
