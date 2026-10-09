import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto font-bold">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">استرجاع كلمة المرور</h2>
          <p className="text-xs text-slate-500">
            أدخل بريدك الإلكتروني أو رقم هاتفك لإرسال رابط إعادة تعيين كلمة المرور.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
            <h4 className="font-bold text-sm text-emerald-950">تم إرسال تعليمات الاسترجاع</h4>
            <p className="text-xs text-emerald-900">
              تم إرسال رابط إعادة تعيين كلمة المرور إلى ({email}). يرجى التحقق من صندوق الوارد.
            </p>
            <div className="pt-2">
              <Link
                to="/reset-password"
                className="inline-block text-xs font-bold text-emerald-800 underline"
              >
                الانتقال لصفحة تعيين كلمة المرور الجديدة
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                البريد الإلكتروني أو الهاتف:
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com أو 0661..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition cursor-pointer"
            >
              إرسال رابط إعادة التعيين
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
