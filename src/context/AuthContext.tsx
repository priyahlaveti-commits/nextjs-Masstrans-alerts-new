'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: number;
  userTypeId: number;
  userName: string | null;
  firstName: string;
  active: boolean;
  mobile?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  sendOtp: (mobile: string) => Promise<void>;
  verifyOtp: (mobile: string, otp: string) => Promise<void>;
  resendOtp: (mobile: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  sendOtp: async () => {},
  verifyOtp: async () => {},
  resendOtp: async () => {},
  logout: async () => {},
  isLoading: true,
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const sendOtp = async (mobile: string) => {
    setError(null);
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
    });
    const data = await res.json();
    if (!res.ok || !data.status) {
      throw new Error(data.error || 'Failed to send OTP');
    }
  };

  const verifyOtp = async (mobile: string, otp: string) => {
    setError(null);
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp: Number(otp), deviceId: 'web' }),
    });
    const data = await res.json();
    if (!res.ok || !data.status) {
      throw new Error(data.error || 'Invalid OTP');
    }
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      setToken(data.token);
    }
    if (data.user) {
      const userWithMobile = { ...data.user, mobile };
      localStorage.setItem('auth_user', JSON.stringify(userWithMobile));
      setUser(userWithMobile);
    }
    router.push('/');
  };

  const resendOtp = async (mobile: string) => {
    setError(null);
    const res = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile }),
    });
    const data = await res.json();
    if (!res.ok || !data.status) {
      throw new Error(data.error || 'Failed to resend OTP');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // best-effort
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        token,
        sendOtp,
        verifyOtp,
        resendOtp,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
