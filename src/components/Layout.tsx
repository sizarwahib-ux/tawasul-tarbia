import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import {
  FileText,
  PlusCircle,
  FolderOpen,
  ShieldCheck,
  LogOut,
  LogIn,
  Search,
  Phone,
  Clock,
  Menu,
  X,
  UserCheck,
  Building2,
  HelpCircle,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { storage } from '@/lib/storage';

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickTicket, setQuickTicket] = useState('');
  const [ticketSearchError, setTicketSearchError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTicket.trim()) return;

    const found = storage.getConcernByTicket(quickTicket.trim());
    if (found) {
      setTicketSearchError('');
      navigate(`/receipt/${found.ticket_number}`);
      setQuickTicket('');
      setMobileMenuOpen(false);
    } else {
      setTicketSearchError('لم يتم العثور على انشغال بهذا الرقم');
      setTimeout(() => setTicketSearchError(''), 4000);
    }
  };

  const navLinks = [
    { to: '/', label: 'الرئيسية', icon: Building2 },
    { to: '/submit', label: 'تقديم انشغال', icon: PlusCircle },
    { to: '/my', label: 'متابعة انشغالاتي', icon: FolderOpen, authOnly: true },
    { to: '/admin', label: 'فضاء الإدارة', icon: ShieldCheck, adminOnly: true },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800" dir="rtl">
      {/* Official Government Top Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-right">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>الجمهورية الجزائرية الديمقراطية الشعبية — وزارة التربية الوطنية</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-emerald-300">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              الاتصال: 046.42.15.20
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              أيام الاستقبال: الإثنين والأربعاء (08:30 - 16:30)
            </span>
            <Link
              to={user?.role === 'admin' ? '/admin' : '/admin/login'}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 bg-emerald-900 hover:bg-emerald-800 border border-emerald-700 px-2.5 py-0.5 rounded-md font-bold transition"
            >
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>{user?.role === 'admin' ? 'لوحة تحكم الإدارة' : 'بوابة الإدارة والمصالح'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header / Branding */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo and Titles */}
            <Link to="/" className="flex items-center gap-3.5 group shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white flex items-center justify-center shadow-md shadow-emerald-900/10 border border-emerald-600/30 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-black font-serif">14</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-emerald-800 tracking-wide uppercase">
                  مديرية التربية لولاية تيارت
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                  المنصة الرقمية لإدارة الانشغالات
                </span>
              </div>
            </Link>

            {/* Quick Search for Ticket (Desktop) */}
            <div className="hidden lg:flex items-center">
              <form onSubmit={handleQuickSearch} className="relative w-72">
                <input
                  type="text"
                  value={quickTicket}
                  onChange={(e) => setQuickTicket(e.target.value)}
                  placeholder="ابحث برقم الوصل (مثال: TR-26-...)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pr-9 pl-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700 transition"
                  title="بحث"
                >
                  <Search className="w-4 h-4" />
                </button>
                {ticketSearchError && (
                  <span className="absolute -bottom-5 right-0 text-[10px] text-rose-600 font-medium">
                    {ticketSearchError}
                  </span>
                )}
              </form>
            </div>

            {/* Navigation links & User actions (Desktop) */}
            <div className="hidden md:flex items-center gap-1 sm:gap-2">
              <nav className="flex items-center gap-1">
                {navLinks.map((link) => {
                  if (link.authOnly && !isAuthenticated) return null;
                  if (link.adminOnly && user?.role !== 'admin') return null;
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;

                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="h-6 w-px bg-slate-200 mx-2" />

              {/* User State */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <div className="flex flex-col text-left text-xs leading-tight">
                    <span className="font-bold text-slate-900 text-right truncate max-w-[130px]">{user.name}</span>
                    <span className="text-[11px] text-emerald-700 text-right font-medium">
                      {user.role === 'admin' ? 'مشرف المديرية' : user.user_type === 'employee' ? 'موظف القطاع' : 'مواطن'}
                    </span>
                  </div>
                  <button
                    onClick={() => logout(true)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
                    title="دخول المواطنين وأولياء التلاميذ والموظفين"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    دخول المرتفقين
                  </Link>

                  <Link
                    to="/admin/login"
                    className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
                    title="فضاء رؤساء المصالح والمشرفين الإداريين"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                    فضاء الإدارة
                  </Link>

                  <Link
                    to="/submit"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    تقديم انشغال
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="flex items-center md:hidden gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <form onSubmit={handleQuickSearch} className="relative">
              <input
                type="text"
                value={quickTicket}
                onChange={(e) => setQuickTicket(e.target.value)}
                placeholder="ابحث برقم الوصل (TR-26-...)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pr-9 pl-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <Search className="w-4 h-4" />
              </button>
              {ticketSearchError && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{ticketSearchError}</p>
              )}
            </form>

            <div className="space-y-1 pt-2">
              {navLinks.map((link) => {
                if (link.authOnly && !isAuthenticated) return null;
                if (link.adminOnly && user?.role !== 'admin') return null;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Icon className="w-4 h-4 text-emerald-700" />
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-bold text-sm text-slate-900">{user.name}</div>
                    <div className="text-xs text-emerald-700">{user.email}</div>
                  </div>
                  <button
                    onClick={() => { logout(true); setMobileMenuOpen(false); }}
                    className="text-xs text-rose-600 font-semibold px-2 py-1 bg-white border border-rose-200 rounded"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200"
                    >
                      دخول المرتفقين
                    </Link>
                    <Link
                      to="/submit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 text-xs font-bold text-white bg-emerald-700 rounded-lg"
                    >
                      تقديم انشغال
                    </Link>
                  </div>
                  <Link
                    to="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                    <span>فضاء الإدارة (رؤساء المصالح)</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content View */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Official Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Identity */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-lg">
                  14
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">مديرية التربية لولاية تيارت</h3>
                  <p className="text-xs text-slate-400">قطاع التربية الوطنية</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                المنصة الرقمية الموحدة لاستقبال وتصنيف ومتابعة انشغالات وشكاوى أساتذة وموظفي القطاع وكذا أولياء التلاميذ والمواطنين في كنف الشفافية والسرعة.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm">روابط سريعة</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/" className="text-slate-400 hover:text-emerald-400 transition">الصفحة الرئيسية</Link>
                </li>
                <li>
                  <Link to="/submit" className="text-slate-400 hover:text-emerald-400 transition">إيداع انشغال جديد</Link>
                </li>
                <li>
                  <Link to="/my" className="text-slate-400 hover:text-emerald-400 transition">متابعة وضعية انشغال سابق</Link>
                </li>
                <li>
                  <Link to="/login" className="text-slate-400 hover:text-emerald-400 transition">دخول المرتفقين (المواطنين والموظفين)</Link>
                </li>
                <li>
                  <Link to="/admin/login" className="text-amber-400 hover:text-amber-300 transition font-semibold">بوابة دخول الإدارة والمصالح</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Hours */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm">المقر وأوقات العمل</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">•</span>
                  <span>المقر: نهج أول نوفمبر 1954، تيارت، الجزائر</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">•</span>
                  <span>الهاتف المركزي: 046 42 15 20 / 046 42 15 21</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">•</span>
                  <span>الفاكس الرسمي: 046 42 15 22</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">•</span>
                  <span>أيام استقبال الجمهور: الإثنين والأربعاء</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Official Instructions & Security */}
            <div className="space-y-3 bg-slate-800/60 p-4 rounded-xl border border-slate-800">
              <h4 className="text-white font-bold text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                تعليمات الاستقبال الرسمي
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تُعالج الانشغالات إلكترونياً بالتنسيق مع المصالح المختصة. المقابلات الحضورية تتم وفق المواعيد الرسمية المبرمجة مع ضرورة إحضار وصل الإيداع وبطاقة التعريف.
              </p>
              <div className="pt-2 border-t border-slate-700/60 flex flex-col gap-1.5 text-xs">
                <Link
                  to="/submit"
                  className="text-center bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-1.5 px-3 rounded-lg transition text-xs"
                >
                  إيداع انشغال جديد
                </Link>
                <Link
                  to="/login"
                  className="text-center bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-1.5 px-3 rounded-lg transition text-xs"
                >
                  تسجيل الدخول إلى الحساب
                </Link>
              </div>
            </div>

          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 text-center flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
            <div>
              جميع الحقوق محفوظة © {new Date().getFullYear()} — مديرية التربية لولاية تيارت (الجمهورية الجزائرية الديمقراطية الشعبية).
            </div>
            <div className="flex items-center gap-3 text-slate-400 text-xs">
              <span>رقم الولاية: 14</span>
              <span>•</span>
              <span>نظام الرقمنة الإدارية</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
