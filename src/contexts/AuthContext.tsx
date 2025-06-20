"use client";

import type { User } from '@/lib/types';
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mock loading user from localStorage
    try {
      const storedUser = localStorage.getItem('ideaSparkUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load user from localStorage", error);
      localStorage.removeItem('ideaSparkUser');
    }
    setLoading(false);
  }, []);

  const login = (email: string, name: string = 'Demo User') => {
    const demoUser: User = { 
      id: 'user-' + Date.now(), 
      email, 
      name,
      avatarUrl: `https://placehold.co/100x100.png?text=${name.substring(0,1)}` 
    };
    localStorage.setItem('ideaSparkUser', JSON.stringify(demoUser));
    setUser(demoUser);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('ideaSparkUser');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
