const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private userId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Initialize or generate userId
    if (typeof window !== 'undefined') {
      this.userId = localStorage.getItem('userId') || this.generateUserId();
      localStorage.setItem('userId', this.userId);
    }
  }

  private generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  setUserId(userId: string) {
    this.userId = userId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('userId', userId);
    }
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.userId) {
      headers['x-user-id'] = this.userId;
    }

    return headers;
  }

  async get<T = any>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const api = new ApiClient(API_BASE_URL);

// Auth helpers
export function setAuthToken(token: string) {
  api.setToken(token);
  if (typeof window !== 'undefined') {
    localStorage.setItem('saashub_token', token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('saashub_token');
  }
  return null;
}

export function clearAuthToken() {
  api.clearToken();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('saashub_token');
  }
}

// Initialize token from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('saashub_token');
  if (token) {
    api.setToken(token);
  }
}
