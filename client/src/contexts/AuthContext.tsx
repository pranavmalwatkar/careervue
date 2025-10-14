import React, { createContext, useContext, useState, ReactNode } from 'react';
import { authAPI } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);
      const userData = { ...response.user, isAuthenticated: true };
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await authAPI.register({ name, email, password });
      localStorage.setItem('token', response.token);
      setUser({ ...response.user, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Check if user is logged in on app start
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getCurrentUser()
        .then(userData => {
          setUser({ ...userData, isAuthenticated: true });
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, []);
  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: user?.isAuthenticated || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};