import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { ConcernItem, STATUSES, IMPORTANCE, OFFICIALS, CATEGORIES, USER_TYPES } from '@/lib/concernConfig';
import {
  Printer,
  ArrowRight,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Building,
  User,
  Phone,
  FileCheck,
  ShieldCheck,
  Download,
  Share2
} from 'lucide-react';

export default function ReceiptPage() {
  const { id } = useParams<{ id: string }>();
  const [concern, setConcern] = useState<ConcernItem | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const found = storage.getConcernById(id) || storage.getConcernByTicket(id);
      setConcern(found || null);
    }
    setLoading(false);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-300 border-t-emerald-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!concern) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center" dir="rtl">
        <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">لم يتم العثور على الوصل</h2>
        <p className="text-slate-600 text-sm mb-6">
          تعذر إيجاد أي انشغال مرتبط بالرقم المرجعي: <span className="font-mono font-bold text-rose-600">{id}</span>.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-6 rounded-xl transition text-sm"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>
    );
  }

  const statusConfig = STATUSES[concern.status] || STATUSES.new;
  const importanceConfig = IMPORTANCE[concern.importance] || IMPORTANCE.medium;
  const officialConfig = OFFICIALS[concern.official] || { name: concern.official, desc: '' };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      {/* Top Action Toolbar (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Link
            to="/my"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>قائمة انشغالاتي</span>
          </Link>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500">
            تاريخ التقديم: <strong className="text-slate-800">{concern.created_date}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة الوصل الرسمي (A4)</span>
          </button>
        </div>
      </div>

      {/* Official Printable Sheet Container */}
      <div className="print-card bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden text-slate-800">
        
        {/* Subtle Watermark Stamp */}
        <div className="absolute right-12 bottom-24 opacity-5 pointer-events-none select-none text-emerald-950 font-serif font-black text-7xl rotate-[-25deg]">
          مديرية التربية لولاية تيارت
        </div>

        {/* Official Algerian Republic Header */}
        <div className="border-b-2 border-slate-900/80 pb-6 mb-6 text-center space-y-1.5">
          <h2 className="text-sm font-bold tracking-wide text-slate-900">
            الجمهورية الجزائرية الديمقراطية الشعبية
          </h2>
          <h3 className="text-xs font-semibold text-slate-800">
            وزارة التربية الوطنية
          </h3>
          <h4 className="text-sm font-bold text-emerald-900">
            مديرية التربية لولاية تيارت — مصلحة التوجيه والرقمنة
          </h4>
          <div className="w-24 h-0.5 bg-slate-800 mx-auto mt-2" />
          
          <div className="pt-3">
            <span className="inline-block bg-slate-900 text-white font-black text-base sm:text-lg px-6 py-1.5 rounded-lg shadow-xs tracking-wider">
              وصل إيداع انشغال وبطاقة موعد رسمي
            </span>
          </div>
        </div>

        {/* Ticket & Queue Highlight Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <span className="block text-[11px] font-bold text-slate-500 mb-0.5">رقم الوصل المرجعي</span>
            <span className="font-mono font-black text-xl text-emerald-800 tracking-wider">
              {concern.ticket_number}
            </span>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-center">
            <span className="block text-[11px] font-bold text-emerald-800 mb-0.5">رقم الطابور والاستقبال</span>
            <span className="font-black text-2xl text-emerald-900">
              {concern.queue_number || 'Q-100'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
            <span className="block text-[11px] font-bold text-slate-500 mb-0.5">وضعية المعالجة الحالية</span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Appointment Notice (If Scheduled) */}
        {concern.status === 'scheduled' && concern.appointment_date && (
          <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-2xl flex items-start gap-4">
            <Calendar className="w-8 h-8 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-blue-950">
                موعد المقابلة المبرمج بمقر مديرية التربية:
              </h4>
              <p className="text-xs text-blue-900 leading-relaxed">
                تم تحديد موعد استقبالكم يوم: <strong className="text-blue-950 font-bold">{concern.appointment_date}</strong> على الساعة: <strong className="text-blue-950 font-bold">{concern.appointment_time || '09:00 صباحاً'}</strong> لدى: <strong className="text-blue-950">{officialConfig.name}</strong>.
              </p>
              <p className="text-[11px] text-blue-800 font-medium">
                * يرجى إحضار هذا الوصل وبطاقة التعريف الوطنية والحضور 15 دقيقة قبل الموعد.
              </p>
            </div>
          </div>
        )}

        {/* Administration Official Reply (If Resolved or Replied) */}
        {concern.reply && (
          <div className="mb-6 p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-emerald-950">
                  رد الإدارة الرسمي ({concern.replied_by || officialConfig.name}):
                </h4>
                {concern.replied_at && (
                  <span className="text-[10px] text-emerald-800 font-medium">بتاريخ: {concern.replied_at}</span>
                )}
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {concern.reply}
              </p>
            </div>
          </div>
        )}

        {/* Main Details Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6 text-xs">
          <div className="bg-slate-100 font-bold text-slate-800 px-4 py-2.5 border-b border-slate-200">
            بيانات صاحب الانشغال والطلب
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-200">
            {/* Column 1 */}
            <div className="p-4 space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">الاسم واللقب:</span>
                <span className="font-bold text-slate-900">{concern.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">الصفة:</span>
                <span className="font-semibold text-slate-800">
                  {USER_TYPES[concern.user_type] || concern.user_type}
                </span>
              </div>
              {concern.national_id && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">رقم التعريف الوطني (NIN):</span>
                  <span className="font-mono font-bold text-slate-800">{concern.national_id}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">رقم الهاتف:</span>
                <span className="font-mono font-bold text-slate-800">{concern.phone}</span>
              </div>
              {concern.rank && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">الرتبة والوظيفة:</span>
                  <span className="font-semibold text-slate-800">{concern.rank}</span>
                </div>
              )}
              {concern.institution && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">المؤسسة / مكان العمل:</span>
                  <span className="font-semibold text-slate-800">{concern.institution}</span>
                </div>
              )}
            </div>

            {/* Column 2 */}
            <div className="p-4 space-y-2.5 bg-slate-50/50">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">المصلحة المعنية:</span>
                <span className="font-bold text-emerald-900">{officialConfig.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">التصنيف:</span>
                <span className="font-medium text-slate-800">
                  {CATEGORIES[concern.category] || concern.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">درجة الاستعجال:</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${importanceConfig.color}`}>
                  {importanceConfig.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">تاريخ التسجيل:</span>
                <span className="font-medium text-slate-800">{concern.created_date}</span>
              </div>
            </div>
          </div>

          {/* Subject & Description */}
          <div className="border-t border-slate-200 p-4 space-y-2">
            <div>
              <span className="text-slate-500 font-bold block mb-1">موضوع الانشغال:</span>
              <div className="text-sm font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {concern.subject}
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-bold block mb-1">تفاصيل الانشغال المصرح بها:</span>
              <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-line">
                {concern.description}
              </p>
            </div>
          </div>
        </div>

        {/* QR Code, Barcode & Official Stamp Footer */}
        <div className="pt-4 border-t-2 border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-right">
          {/* Simulated QR & Barcode */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-slate-900 text-white p-1 rounded-lg flex flex-col items-center justify-center font-mono text-[9px] shadow-xs">
              {/* SVG QR Code Pattern */}
              <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h2v2h-2v-2zm-4 0h2v2h-2v-2zm4 4h2v2h-2v-2zm-4 2h2v2h-2v-2zm2-2h2v2h-2v-2zm4-2h2v2h-2v-2zm-2-2h2v2h-2v-2zm-8-6h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2z" />
              </svg>
              <span className="text-[7px] text-slate-300">{concern.ticket_number}</span>
            </div>

            <div className="text-right">
              <span className="block text-[11px] font-bold text-slate-900">رمز التحقق الإلكتروني</span>
              <span className="block text-[10px] text-slate-500">تم إنشاؤه عبر المنصة الرقمية</span>
              <span className="font-mono text-xs text-slate-700 tracking-widest mt-1 block">
                |||||| | |||| ||| |||||||
              </span>
            </div>
          </div>

          {/* Official Stamp Box */}
          <div className="w-52 border-2 border-emerald-900/70 rounded-2xl p-3 text-center space-y-1 bg-emerald-50/20">
            <span className="block text-[10px] font-bold text-emerald-950 uppercase">
              ختم وتأشيرة مكتب الاستقبال
            </span>
            <div className="h-12 flex items-center justify-center text-slate-400 font-serif italic text-xs">
              [ختم مديرية التربية لولاية تيارت]
            </div>
            <span className="block text-[9px] text-slate-500 font-mono">
              تاريخ الطباعة: {new Date().toLocaleDateString('fr-DZ')}
            </span>
          </div>
        </div>

        {/* Footer Notes for the Citizen */}
        <div className="mt-6 pt-3 border-t border-slate-100 text-[10px] text-slate-500 space-y-1 leading-normal">
          <p>
            • ملاحظة: يعتبر هذا الوصل وثيقة رسمية صادرة عن المنصة الرقمية لمديرية التربية لولاية تيارت تخول لحاملها متابعة ملفه أو الدخول إلى مقر المديرية في موعد المقابلة المبرمج.
          </p>
          <p>
            • للاستفسار أو تقديم طعن يمكنكم التواصل عبر الرقم المركزي: 046 42 15 20 مع ذكر رقم الوصل: {concern.ticket_number}.
          </p>
        </div>
      </div>
    </div>
  );
}
