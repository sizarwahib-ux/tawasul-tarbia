import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/toaster';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setDone(true);
    toast({
      title: 'تم تحديث كلمة المرور',
      description: 'يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة',
      variant: 'success'
    });
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">تعيين كلمة مرور جديدة</h2>
          <p className="text-xs text-slate-500">
            أدخل كلمة المرور الجديدة لحسابك لتسجيل الدخول بأمان.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        {done ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
            <h4 className="font-bold text-sm text-emerald-950">تم تغيير كلمة المرور بنجاح</h4>
            <p className="text-xs text-emerald-900">
              جارٍ تحويلك إلى صفحة تسجيل الدخول...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                كلمة المرور الجديدة:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تأكيد كلمة المرور الجديدة:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition cursor-pointer"
            >
              حفظ وتغيير كلمة المرور
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-800"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لصفحة تسجيل الدخول</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
