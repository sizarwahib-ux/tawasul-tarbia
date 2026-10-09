import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

interface ProtectedRouteProps {
  unauthenticatedElement?: React.ReactNode;
  requireAdmin?: boolean;
  children?: React.ReactNode;
}

export default function ProtectedRoute({
  unauthenticatedElement,
  requireAdmin = false,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoadingAuth } = useAuth();

  const defaultUnauthenticated = requireAdmin ? (
    <Navigate to="/admin/login" replace />
  ) : (
    <Navigate to="/login" replace />
  );

  const fallback = unauthenticatedElement || defaultUnauthenticated;

  if (isLoadingAuth) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
