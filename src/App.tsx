import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ToastProvider, Toaster } from '@/components/ui/toaster';
import ScrollToTop from '@/components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import PageNotFound from '@/lib/PageNotFound';

import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Submit from '@/pages/Submit';
import MyConcerns from '@/pages/MyConcerns';
import ReceiptPage from '@/pages/ReceiptPage';
import Admin from '@/pages/Admin';
import AdminLogin from '@/pages/AdminLogin';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

const AuthenticatedApp: React.FC = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-800 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-bold">جارٍ تحميل منصة مديرية التربية لولاية تيارت...</span>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Main Layout containing Header and Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/receipt/:id" element={<ReceiptPage />} />
        
        {/* Concerns list - accessible to users */}
        <Route path="/my" element={<MyConcerns />} />
        
        {/* Admin route - protected specifically for directorate administrators */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </AuthProvider>
    </ToastProvider>
  );
}
