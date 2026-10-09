import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/toaster';
import {
  ShieldCheck,
  Lock,
  User,
  AlertCircle,
  Building,
  ArrowRight,
  Sparkles,
  KeyRound,
  ExternalLink
} from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('يرجى إدخال اسم المستخدم أو البريد الإداري');
      return;
    }
    if (!password.trim()) {
      setError('يرجى إدخال كلمة المرور الإدارية');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username.trim(), password.trim());
      if (success) {
        toast({
          title: 'مرحباً بك في فضاء الإدارة والمصالح',
          description: 'تم تسجيل الدخول بصلاحيات المسؤول بنجاح',
          variant: 'success'
        });
        navigate('/admin');
      } else {
        setError('بيانات الاعتماد الإدارية غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة السر.');
      }
    } catch {
      setError('حدث خطأ أثناء الاتصال بالخادم الإداري');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/50" dir="rtl">
      <div className="max-w-md w-full space-y-6">
        
        {/* Emblem & Official Portal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-300 text-[11px] font-bold shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>فضاء المشرفين ورؤساء المصالح المعتمدين</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-xl border-2 border-amber-500/30 font-black text-2xl font-serif mt-2">
            14
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            بوابة الإدارة والمصالح
          </h1>
          <p className="text-xs text-slate-500">
            مديرية التربية لولاية تيارت — نظام معالجة الانشغالات المركزي
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs font-semibold shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Admin Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-slate-900/10 shadow-xl space-y-5 relative overflow-hidden">
          
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
              <KeyRound className="w-4 h-4 text-emerald-800" />
              <span>تسجيل دخول المسؤول الإداري</span>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">
              صلاحيات المديرية
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                اسم المستخدم أو البريد الإداري:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@tiaret-edu.dz أو اسم المستخدم..."
                  required
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pr-10 pl-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white font-mono"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                كلمة المرور الإدارية:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pr-10 pl-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold py-3 rounded-xl text-xs shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ التحقق من الصلاحيات...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>الدخول إلى لوحة القيادة الإدارية</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed text-right space-y-1">
            <span className="font-bold text-slate-700 block">• تنبيه أمني:</span>
            <span>
              هذه الواجهة مخصصة حصراً لموظفي مديرية التربية لولاية تيارت المكلفين بدراسة الملفات والرد على الانشغالات وحجز المواعيد.
            </span>
          </div>

          {/* Link to Citizen Portal */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline"
            >
              <span>للمواطنين وأولياء التلاميذ والموظفين: الانتقال لبوابة المرتفقين</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
