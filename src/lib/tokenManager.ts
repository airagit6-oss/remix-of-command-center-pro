// ============================================================
// TOKEN MANAGER - JWT Lifecycle Management
// Handles access token, refresh token rotation, and auto-refresh
// ============================================================

interface TokenPayload {
  sub: string;      // userId
  email: string;
  role: string;
  sessionId: string;
  iat: number;
  exp: number;
}

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  sessionId: string | null;
  deviceId: string | null;
}

const TOKEN_KEY = 'cc_access_token';
const SESSION_KEY = 'cc_session_id';
const DEVICE_KEY = 'cc_device_id';
const REFRESH_TIME_BUFFER = 60 * 1000; // Refresh 1 min before expiry

export class TokenManager {
  private state: TokenState = {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    sessionId: null,
    deviceId: null,
  };

  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.loadFromStorage();
    this.scheduleRefresh();
  }

  /**
   * Load tokens from storage (sessionStorage for access, cookies for refresh)
   */
  private loadFromStorage(): void {
    try {
      const stored = sessionStorage.getItem(TOKEN_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.state.accessToken = parsed.accessToken;
        this.state.expiresAt = parsed.expiresAt;
        this.state.sessionId = parsed.sessionId;
      }

      const deviceId = localStorage.getItem(DEVICE_KEY);
      if (deviceId) {
        this.state.deviceId = deviceId;
      } else {
        this.state.deviceId = this.generateDeviceId();
        localStorage.setItem(DEVICE_KEY, this.state.deviceId);
      }
    } catch (e) {
      console.error('Failed to load tokens from storage', e);
    }
  }

  /**
   * Store tokens in storage
   */
  private saveToStorage(): void {
    try {
      if (this.state.accessToken && this.state.expiresAt) {
        sessionStorage.setItem(
          TOKEN_KEY,
          JSON.stringify({
            accessToken: this.state.accessToken,
            expiresAt: this.state.expiresAt,
            sessionId: this.state.sessionId,
          })
        );
      }
    } catch (e) {
      console.error('Failed to save tokens to storage', e);
    }
  }

  /**
   * Generate unique device ID
   */
  private generateDeviceId(): string {
    return 'device_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  }

  /**
   * Decode JWT token (without verification - for client-side)
   */
  private decodeToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const decoded = JSON.parse(
        atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
      );
      return decoded;
    } catch (e) {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;
    return Date.now() >= payload.exp * 1000;
  }

  /**
   * Set tokens after login/register
   */
  setTokens(accessToken: string, sessionId: string): void {
    this.state.accessToken = accessToken;
    this.state.sessionId = sessionId;

    const payload = this.decodeToken(accessToken);
    if (payload) {
      this.state.expiresAt = payload.exp * 1000;
    }

    this.saveToStorage();
    this.scheduleRefresh();
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    // Check if expired
    if (this.state.accessToken && this.isTokenExpired(this.state.accessToken)) {
      return null; // Token expired
    }
    return this.state.accessToken;
  }

  /**
   * Get session ID
   */
  getSessionId(): string | null {
    return this.state.sessionId;
  }

  /**
   * Get device ID
   */
  getDeviceId(): string | null {
    return this.state.deviceId;
  }

  /**
   * Get remaining time in milliseconds
   */
  getTokenTTL(): number {
    if (!this.state.expiresAt) return 0;
    return Math.max(0, this.state.expiresAt - Date.now());
  }

  /**
   * Check if token needs refresh (within buffer time)
   */
  needsRefresh(): boolean {
    if (!this.state.expiresAt) return false;
    const timeLeft = this.state.expiresAt - Date.now();
    return timeLeft < REFRESH_TIME_BUFFER;
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': this.state.deviceId || '',
        },
        credentials: 'include', // Send refresh token cookie
        body: JSON.stringify({
          sessionId: this.state.sessionId,
        }),
      });

      if (!response.ok) {
        this.clear();
        return false;
      }

      const data = await response.json();
      this.setTokens(data.accessToken, data.sessionId);
      return true;
    } catch (e) {
      console.error('Token refresh failed', e);
      this.clear();
      return false;
    }
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleRefresh(): void {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const ttl = this.getTokenTTL();
    if (ttl <= 0) return;

    // Refresh when token is within buffer time
    const refreshIn = Math.max(100, ttl - REFRESH_TIME_BUFFER);

    this.refreshTimer = setTimeout(() => {
      this.refreshToken().then(() => {
        this.scheduleRefresh(); // Reschedule after refresh
      });
    }, refreshIn);
  }

  /**
   * Clear all tokens (logout)
   */
  clear(): void {
    this.state = {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      sessionId: null,
      deviceId: this.state.deviceId, // Keep device ID
    };

    sessionStorage.removeItem(TOKEN_KEY);

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  /**
   * Get token for API requests
   */
  getAuthHeader(): { Authorization: string } | null {
    const token = this.getAccessToken();
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  }

  /**
   * Get all headers for requests
   */
  getRequestHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const authHeader = this.getAuthHeader();
    if (authHeader) {
      headers.Authorization = authHeader.Authorization;
    }

    if (this.state.deviceId) {
      headers['X-Device-ID'] = this.state.deviceId;
    }

    return headers;
  }

  /**
   * Validate token still valid
   */
  isValid(): boolean {
    if (!this.state.accessToken) return false;
    return !this.isTokenExpired(this.state.accessToken);
  }
}

// Singleton instance
export const tokenManager = new TokenManager();
