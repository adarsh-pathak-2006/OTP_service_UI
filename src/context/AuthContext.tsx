'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isAuthenticated, clearTokens } from '@/lib/api';

interface AuthContextType {
  isLoggedIn: boolean;
  setLoggedIn: (val: boolean) => void;
  logoutUser: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setLoggedIn: () => {},
  logoutUser: () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLoggedIn(isAuthenticated());
    setIsLoading(false);
  }, []);

  const logoutUser = useCallback(() => {
    clearTokens();
    setLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setLoggedIn, logoutUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
