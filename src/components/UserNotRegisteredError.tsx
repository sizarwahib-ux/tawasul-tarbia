import { AlertTriangle, UserPlus, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserNotRegisteredError() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">الحساب غير مسجل بالمنصة</h2>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          لم يتم العثور على بيانات هذا الحساب في قاعدة بيانات مديرية التربية لولاية تيارت. يرجى إنشاء حساب جديد أو التحقق من صحة المعطيات.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition"
          >
            <UserPlus className="w-5 h-5" />
            إنشاء حساب جديد
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition"
          >
            <Home className="w-5 h-5" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
