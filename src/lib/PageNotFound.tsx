import { useLocation, Link } from 'react-router-dom';
import { FileQuestion, Home, Search, ArrowRight } from 'lucide-react';

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-lg w-full text-center shadow-md">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <FileQuestion className="w-10 h-10" />
        </div>
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full mb-3">
          خطأ 404
        </span>
        <h1 className="text-2xl font-black text-slate-900 mb-2">الصفحة غير موجودة</h1>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          عذراً، المسار المطلوب <code className="bg-slate-100 px-2 py-0.5 rounded text-emerald-800 font-mono text-xs">{location.pathname}</code> غير متوفر أو ربما تم نقله.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-6 rounded-xl transition shadow-sm"
          >
            <Home className="w-4 h-4" />
            الصفحة الرئيسية
          </Link>
          <Link
            to="/submit"
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2.5 px-5 rounded-xl transition"
          >
            <span>تقديم انشغال جديد</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
