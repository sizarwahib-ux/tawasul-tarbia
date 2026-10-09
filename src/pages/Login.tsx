import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/toaster';
import { safeReturnTo } from '@/lib/authReturnTo';
import {
  LogIn,
  Lock,
  Mail,
  AlertCircle,
  Building,
  ArrowRight,
  ShieldCheck,
  User
} from 'lucide-react';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const returnTo = safeReturnTo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('يرجى إدخال البريد الإلكتروني أو رقم الهاتف');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(identifier.trim(), password.trim());
      if (success) {
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          variant: 'success'
        });
        navigate(returnTo);
      } else {
        setError('لم يتم العثور على حساب بهذه البيانات. يرجى التأكد أو إنشاء حساب جديد.');
      }
    } catch {
      setError('حدث خطأ أثناء محاولة تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-6">
        
        {/* Emblem & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
            <User className="w-3.5 h-3.5 text-emerald-700" />
            <span>فضاء المرتفقين والأسرة التربوية</span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md font-bold text-xl mt-1">
            14
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            تسجيل دخول المواطنين والموظفين
          </h1>
          <p className="text-xs text-slate-500">
            مديرية التربية لولاية تيارت — متابعة الانشغالات وحجز المواعيد
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الهاتف أو البريد الإلكتروني أو التعريف الوطني:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="0661234567 أو البريد أو رقم التعريف الوطني..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pr-10 pl-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  كلمة المرور:
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-emerald-700 hover:underline"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pr-10 pl-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold py-3 rounded-xl text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'جارٍ التحقق...' : 'دخول إلى الحساب'}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-2 text-xs text-slate-600 border-t border-slate-100">
            ليس لديك حساب بعد؟{' '}
            <Link to="/register" className="font-bold text-emerald-800 hover:underline">
              إنشاء حساب جديد الآن
            </Link>
          </div>

          {/* Separate Admin Portal Link */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 py-2.5 px-4 rounded-xl transition w-full justify-center border border-slate-200"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-800" />
              <span>فضاء الإدارة: تسجيل دخول رؤساء المصالح والمشرفين ←</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
