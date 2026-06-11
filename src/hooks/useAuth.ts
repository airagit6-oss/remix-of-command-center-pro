/**
 * Simple Auth Hook - Gets current user from localStorage/session
 */

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get user from localStorage
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Fallback: create mock user for demo
        const mockUser: User = {
          id: 'demo-user-' + Date.now(),
          name: 'Demo User',
          email: 'demo@example.com',
          role: 'RESELLER',
        };
        setUser(mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
      }
    } catch (error) {
      console.error('Error loading user:', error);
      // Fallback to mock user
      const mockUser: User = {
        id: 'demo-user-' + Date.now(),
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'RESELLER',
      };
      setUser(mockUser);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
};

export default useAuth;
