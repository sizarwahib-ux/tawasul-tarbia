import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { storage } from '@/lib/storage';
import { ConcernItem, STATUSES, IMPORTANCE, OFFICIALS, CATEGORIES } from '@/lib/concernConfig';
import {
  FolderOpen,
  Search,
  PlusCircle,
  Calendar,
  Clock,
  Printer,
  ChevronLeft,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function MyConcerns() {
  const { user, isAuthenticated } = useAuth();
  const [concerns, setConcerns] = useState<ConcernItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadConcerns();
  }, [user]);

  const loadConcerns = () => {
    const all = storage.getConcerns();
    if (user) {
      // Filter for this user's concerns by user_id, phone, or email
      const myItems = all.filter(
        (c: ConcernItem) => c.user_id === user.id ||
             (c.phone && user.phone && c.phone === user.phone) ||
             (c.email && user.email && c.email.toLowerCase() === user.email.toLowerCase())
      );
      // If user has items show them, otherwise show all demo items so they can see data immediately
      setConcerns(myItems.length > 0 ? myItems : all);
    } else {
      setConcerns(all);
    }
  };

  const filteredConcerns = concerns.filter(c => {
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesSearch =
      searchTerm === '' ||
      c.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir="rtl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold mb-1">
            <FolderOpen className="w-4 h-4" />
            <span>سجل المتابعة الرقمي</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            انشغالاتي وطلبات المقابلات
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            تتبع مباشر لوضعية دراسة انشغالاتكم ومواعيد المقابلات المقررة مع مصالح مديرية التربية.
          </p>
        </div>

        <Link
          to="/submit"
          className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>تقديم انشغال جديد</span>
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث برقم الوصل، الموضوع، أو الاسم..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2.5 pr-10 pl-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              الكل ({concerns.length})
            </button>
            {Object.entries(STATUSES).map(([key, item]: [string, any]) => {
              const count = concerns.filter(c => c.status === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    filterStatus === key
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Concerns Cards List */}
      {filteredConcerns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">لا توجد انشغالات مطابقة</h3>
          <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto">
            لم نتمكن من العثور على أي انشغال وفق معايير البحث الحالية. يمكنك تغيير الفلتر أو إضافة انشغال جديد.
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إيداع انشغال الآن</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConcerns.map((c) => {
            const statusConfig = STATUSES[c.status] || STATUSES.new;
            const importanceConfig = IMPORTANCE[c.importance] || IMPORTANCE.medium;
            const officialConfig = OFFICIALS[c.official] || { name: c.official };

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-emerald-300 transition space-y-4"
              >
                {/* Header row: Ticket, queue, badges */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {c.ticket_number}
                    </span>
                    {c.queue_number && (
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                        طابور: {c.queue_number}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      {c.created_date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${importanceConfig.color}`}>
                      {importanceConfig.label}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Body: Subject & Description Preview */}
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {c.subject}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                {/* Scheduled Appointment Alert (If any) */}
                {c.status === 'scheduled' && c.appointment_date && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-3 text-xs text-blue-900">
                    <Calendar className="w-5 h-5 text-blue-700 shrink-0" />
                    <div>
                      <strong>موعد مقابلة مبرمج: </strong>
                      <span>يوم {c.appointment_date} على الساعة {c.appointment_time || '09:00'} بمقر المديرية ({officialConfig.name}).</span>
                    </div>
                  </div>
                )}

                {/* Reply snippet (If any) */}
                {c.reply && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>رد الإدارة ({c.replied_by || officialConfig.name}):</span>
                    </div>
                    <p className="line-clamp-2 text-slate-700">{c.reply}</p>
                  </div>
                )}

                {/* Footer: Official Department & View Receipt Link */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span>المصلحة:</span>
                    <span className="font-semibold text-slate-800">{officialConfig.name}</span>
                  </div>

                  <Link
                    to={`/receipt/${c.ticket_number}`}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-800 font-bold px-4 py-2 rounded-xl transition text-xs border border-slate-200 hover:border-emerald-300"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>عرض وطباعة الوصل الرسمي</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
