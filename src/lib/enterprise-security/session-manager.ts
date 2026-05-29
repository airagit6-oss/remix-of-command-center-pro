/**
 * ENTERPRISE SESSION MANAGER
 * ═══════════════════════════════════════════════════════════
 * Manages sessions, refresh tokens, device tracking,
 * and session security.
 * 
 * EXTENDS existing frontend auth patterns
 */

import {
  SessionData,
  SessionStatus,
  DeviceInfo,
  EnterpriseRole,
} from './types';

// ──────────────────────────────────────────────────────────
// SESSION STORAGE (frontend-only for now, backend-ready)
// ──────────────────────────────────────────────────────────

const SESSIONS_STORAGE_KEY = 'enterprise_sessions';
const SESSION_DEVICES_KEY = 'enterprise_session_devices';
const SESSION_EXPIRY_MINUTES = 15; // Access token expiry
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const DEVICE_TRUSTED_DAYS = 30;

/**
 * Generate unique session ID
 */
export function generateSessionId(): string {
  return 's_' + crypto.randomUUID().replace(/-/g, '').slice(0, 20);
}

/**
 * Generate device ID
 */
export function generateDeviceId(): string {
  return 'd_' + crypto.randomUUID().replace(/-/g, '').slice(0, 20);
}

/**
 * Parse user agent to extract device info
 */
export function parseUserAgent(userAgent: string): {
  browser: string;
  os: string;
  device: string;
} {
  // Simplified parsing — use a library in production
  const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)/i);
  const osMatch = userAgent.match(/(Windows|Mac|Linux|iOS|Android)/i);
  const device = userAgent.includes('Mobile') ? 'Mobile' : 'Desktop';

  return {
    browser: browserMatch?.[1] || 'Unknown',
    os: osMatch?.[1] || 'Unknown',
    device,
  };
}

/**
 * Get device info from current browser
 */
export function getCurrentDeviceInfo(deviceId?: string): DeviceInfo {
  return {
    deviceId: deviceId || generateDeviceId(),
    userAgent: navigator.userAgent,
    ipAddress: '0.0.0.0', // Will be populated by server
    lastSeenAt: new Date(),
    isCurrentDevice: true,
    isTrusted: false,
  };
}

/**
 * Hash refresh token (SHA-256)
 */
export async function hashRefreshToken(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ──────────────────────────────────────────────────────────
// SESSION LIFECYCLE
// ──────────────────────────────────────────────────────────

/**
 * Create new session
 */
export async function createSession(
  userId: string,
  role: EnterpriseRole,
  deviceInfo?: Partial<DeviceInfo>,
): Promise<SessionData> {
  const now = new Date();
  const device = {
    ...getCurrentDeviceInfo(),
    ...deviceInfo,
  };

  const session: SessionData = {
    sessionId: generateSessionId(),
    userId,
    role,
    device,
    createdAt: now,
    expiresAt: new Date(now.getTime() + SESSION_EXPIRY_MINUTES * 60 * 1000),
    lastRefreshAt: now,
    status: SessionStatus.ACTIVE,
    ipAddress: device.ipAddress,
    userAgent: device.userAgent,
    metadata: {
      createdFrom: 'enterprise_session_manager',
      deviceParsed: parseUserAgent(device.userAgent),
    },
  };

  // Store session locally (frontend)
  try {
    const sessions = getStoredSessions();
    sessions.push(session);
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Fail safe: localStorage may be unavailable
  }

  return session;
}

/**
 * Retrieve session by ID
 */
export function getSession(sessionId: string): SessionData | null {
  const sessions = getStoredSessions();
  return sessions.find(s => s.sessionId === sessionId) || null;
}

/**
 * Get all sessions for user
 */
export function getUserSessions(userId: string): SessionData[] {
  const sessions = getStoredSessions();
  return sessions.filter(s => s.userId === userId);
}

/**
 * Refresh session (update expiry, refresh token)
 */
export function refreshSession(sessionId: string): SessionData | null {
  const session = getSession(sessionId);
  if (!session) return null;

  // Check if session is still valid
  if (session.status !== SessionStatus.ACTIVE) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    revokeSession(sessionId);
    return null;
  }

  // Update session
  const now = new Date();
  session.lastRefreshAt = now;
  session.expiresAt = new Date(now.getTime() + SESSION_EXPIRY_MINUTES * 60 * 1000);
  session.device.lastSeenAt = now;

  // Persist
  persistSession(session);

  return session;
}

/**
 * Revoke session (logout)
 */
export function revokeSession(sessionId: string): boolean {
  const session = getSession(sessionId);
  if (!session) return false;

  session.status = SessionStatus.REVOKED;
  session.revokedAt = new Date();

  persistSession(session);
  return true;
}

/**
 * Revoke all user sessions (security event)
 */
export function revokeAllUserSessions(userId: string): number {
  const sessions = getUserSessions(userId);
  let count = 0;

  for (const session of sessions) {
    if (revokeSession(session.sessionId)) {
      count++;
    }
  }

  return count;
}

/**
 * Mark device as trusted
 */
export function trustDevice(sessionId: string): boolean {
  const session = getSession(sessionId);
  if (!session) return false;

  session.device.isTrusted = true;
  persistSession(session);
  return true;
}

/**
 * Check if session is valid
 */
export function isSessionValid(session: SessionData | null): boolean {
  if (!session) return false;
  if (session.status !== SessionStatus.ACTIVE) return false;
  if (session.expiresAt < new Date()) return false;
  return true;
}

// ──────────────────────────────────────────────────────────
// SESSION STORAGE HELPERS
// ──────────────────────────────────────────────────────────

function getStoredSessions(): SessionData[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionData[]) : [];
  } catch {
    return [];
  }
}

function persistSession(session: SessionData): void {
  try {
    const sessions = getStoredSessions();
    const index = sessions.findIndex(s => s.sessionId === session.sessionId);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // Fail safe
  }
}

// ──────────────────────────────────────────────────────────
// SESSION ANALYTICS
// ──────────────────────────────────────────────────────────

export interface SessionAnalytics {
  totalSessions: number;
  activeSessions: number;
  revokedSessions: number;
  expiredSessions: number;
  suspiciousSessions: number;
  uniqueDevices: number;
  trustedDevices: number;
}

export function getSessionAnalytics(userId: string): SessionAnalytics {
  const sessions = getUserSessions(userId);
  const devices = new Set<string>();
  const trustedDevices = new Set<string>();

  let active = 0;
  let revoked = 0;
  let expired = 0;
  let suspicious = 0;

  for (const session of sessions) {
    devices.add(session.device.deviceId);
    if (session.device.isTrusted) {
      trustedDevices.add(session.device.deviceId);
    }

    if (session.status === SessionStatus.ACTIVE) {
      if (session.expiresAt < new Date()) {
        expired++;
      } else {
        active++;
      }
    } else if (session.status === SessionStatus.REVOKED) {
      revoked++;
    } else if (session.status === SessionStatus.SUSPICIOUS) {
      suspicious++;
    }
  }

  return {
    totalSessions: sessions.length,
    activeSessions: active,
    revokedSessions: revoked,
    expiredSessions: expired,
    suspiciousSessions: suspicious,
    uniqueDevices: devices.size,
    trustedDevices: trustedDevices.size,
  };
}

// ──────────────────────────────────────────────────────────
// DEVICE MANAGEMENT
// ──────────────────────────────────────────────────────────

export function getStoredDevices(userId: string): DeviceInfo[] {
  try {
    const raw = localStorage.getItem(SESSION_DEVICES_KEY);
    const devices = raw ? (JSON.parse(raw) as Record<string, DeviceInfo[]>) : {};
    return devices[userId] || [];
  } catch {
    return [];
  }
}

export function saveDevice(userId: string, device: DeviceInfo): void {
  try {
    const raw = localStorage.getItem(SESSION_DEVICES_KEY);
    const devices = raw ? (JSON.parse(raw) as Record<string, DeviceInfo[]>) : {};

    if (!devices[userId]) {
      devices[userId] = [];
    }

    const index = devices[userId].findIndex(d => d.deviceId === device.deviceId);
    if (index >= 0) {
      devices[userId][index] = device;
    } else {
      devices[userId].push(device);
    }

    localStorage.setItem(SESSION_DEVICES_KEY, JSON.stringify(devices));
  } catch {
    // Fail safe
  }
}

export function removeDevice(userId: string, deviceId: string): void {
  try {
    const raw = localStorage.getItem(SESSION_DEVICES_KEY);
    const devices = raw ? (JSON.parse(raw) as Record<string, DeviceInfo[]>) : {};

    if (devices[userId]) {
      devices[userId] = devices[userId].filter(d => d.deviceId !== deviceId);
      localStorage.setItem(SESSION_DEVICES_KEY, JSON.stringify(devices));
    }
  } catch {
    // Fail safe
  }
}

/**
 * Check if device is recognized (returning user?)
 */
export function isDeviceRecognized(userId: string, userAgent: string): boolean {
  const devices = getStoredDevices(userId);
  return devices.some(d => d.userAgent === userAgent && d.isTrusted);
}

/**
 * Get suspicious sessions (different device, location, etc.)
 */
export function detectSuspiciousSessions(userId: string): SessionData[] {
  const sessions = getUserSessions(userId);
  const devices = getStoredDevices(userId);

  return sessions.filter(session => {
    // Session on unknown device
    if (!devices.some(d => d.deviceId === session.device.deviceId)) {
      return true;
    }

    // Session from unusual IP (would need geolocation)
    // Session at unusual time
    // Session with unusual activity patterns

    return false;
  });
}
