import React, { createContext, useState, useContext, useEffect } from 'react';
import { storage, User } from '@/lib/storage';
import { base44 } from '@/api/base44Client';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  isLoadingPublicSettings: boolean;
  authError: any;
  appPublicSettings: any;
  authChecked: boolean;
  logout: (shouldRedirect?: boolean) => void;
  navigateToLogin: () => void;
  checkUserAuth: () => Promise<void>;
  checkAppState: () => Promise<void>;
  login: (identifier: string, password?: string) => Promise<boolean>;
  register: (userData: any) => Promise<User>;
  updateAdminCredentials: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState<boolean>(true);
  const [authError, setAuthError] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [appPublicSettings, setAppPublicSettings] = useState<any>(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      const publicSettings = await base44.app.getPublicSettings();
      setAppPublicSettings(publicSettings);
      await checkUserAuth();
      setIsLoadingPublicSettings(false);
    } catch (err: any) {
      console.error('App state error:', err);
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = storage.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const login = async (identifier: string, password?: string): Promise<boolean> => {
    // Check if it's admin login via server first
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          storage.setCurrentUser(data.user);
          setUser(data.user);
          setIsAuthenticated(true);
          return true;
        }
      }
    } catch {}

    const found = storage.findUser(identifier);
    if (found) {
      storage.setCurrentUser(found);
      setUser(found);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const updateAdminCredentials = async (data: any) => {
    const updatedUser = await storage.updateAdminCredentials(data);
    setUser(updatedUser);
    return updatedUser;
  };

  const register = async (userData: any): Promise<User> => {
    const created = storage.registerUser(userData);
    setUser(created);
    setIsAuthenticated(true);
    return created;
  };

  const logout = (shouldRedirect = false) => {
    storage.setCurrentUser(null);
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      window.location.href = '/';
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login?returnTo=' + encodeURIComponent(window.location.pathname);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
        login,
        register,
        updateAdminCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
