import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { audit } from '@/lib/auditLog';

// Encryption key types
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'reseller';
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  hasSubscription: boolean;
  isAdmin: boolean;
  isReseller: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: true; redirect: string } | { ok: false; error: string }>;
  register: (email: string, password: string, name: string) => Promise<{ ok: true; redirect: string } | { ok: false; error: string }>;
  updateProfile: (profile: Pick<AuthUser, 'name' | 'email'>) => void;
  logout: () => void;
  activateSubscription: () => void;
}

const AUTH_KEY = 'saashub_auth';
const TOKEN_KEY = 'saashub_token';
const SUB_KEY = 'saashub_sub';
const API_BASE = '/api/v1';

function loadAuth(): { user: AuthUser | null; token: string | null } {
  try {
    const user = localStorage.getItem(AUTH_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    return {
      user: user ? JSON.parse(user) : null,
      token: token || null,
    };
  } catch {
    return { user: null, token: null };
  }
}

function loadSub(): boolean {
  return localStorage.getItem(SUB_KEY) === '1';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: initialUser, token: initialToken } = loadAuth();
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [token, setToken] = useState<string | null>(initialToken);
  const [hasSubscription, setHasSubscription] = useState<boolean>(loadSub);
  const [isLoading, setIsLoading] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;
      
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!res.ok) {
          // Token invalid, clear auth
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(AUTH_KEY);
          setToken(null);
          setUser(null);
        }
      } catch {
        // Network error, keep current auth
      }
    };

    verifyToken();
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false as const, error: data.error || 'Login failed' };
      }

      const authUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || 'user',
      };

      // Store auth data
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      localStorage.setItem(TOKEN_KEY, data.token);
      
      setUser(authUser);
      setToken(data.token);
      
      // Audit log
      try {
        audit.login(authUser.id, { email, role: authUser.role });
      } catch {
        // Ignore audit log errors
      }

      // Determine redirect based on role
      const roleRedirect: Record<string, string> = {
        admin: '/admin/dashboard',
        reseller: '/reseller/dashboard',
        author: '/author/dashboard',
        user: '/dashboard',
      };

      const redirect = roleRedirect[authUser.role] || '/dashboard';
      return { ok: true as const, redirect };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false as const, error: data.error || 'Registration failed' };
      }

      const authUser = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role || 'user',
      };

      // Store auth data
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
      localStorage.setItem(TOKEN_KEY, data.token);
      
      setUser(authUser);
      setToken(data.token);

      return { ok: true as const, redirect: '/dashboard' };
    } catch (error) {
      return { ok: false as const, error: error instanceof Error ? error.message : 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback((profile: Pick<AuthUser, 'name' | 'email'>) => {
    setUser(current => {
      if (!current) return current;
      const updated = { ...current, name: profile.name.trim(), email: profile.email.trim().toLowerCase() };
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    const current = user;
    if (current) {
      try {
        audit.logout(current.id);
      } catch {
        // Ignore audit log errors
      }
    }
    setUser(null);
    setToken(null);
    setHasSubscription(false);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SUB_KEY);
  }, [user]);

  const activateSubscription = useCallback(() => {
    setHasSubscription(true);
    localStorage.setItem(SUB_KEY, '1');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user && !!token,
        hasSubscription,
        isAdmin: user?.role === 'admin',
        isReseller: user?.role === 'reseller' || user?.role === 'admin',
        isLoading,
        login,
        register,
        updateProfile,
        logout,
        activateSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
