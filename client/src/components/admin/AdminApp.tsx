import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { adminAPI } from '../../services/adminAPI';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        // Test token validity with a simple API call
        const adminData = await adminAPI.getProfile();
        setAdmin(adminData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Admin auth check failed:', error);
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const handleLoginSuccess = (token: string, adminData: any) => {
    setAdmin(adminData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard />;
};