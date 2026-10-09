import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  PlusCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Building,
  ArrowLeft,
  ChevronDown,
  Info,
  Shield,
  Users,
  Award,
  Sparkles,
  PhoneCall,
  Download,
  AlertCircle
} from 'lucide-react';
import { storage } from '@/lib/storage';
import { OFFICIALS, CATEGORIES } from '@/lib/concernConfig';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const stats = storage.getStats();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError('يرجى كتابة رقم الوصل أو رقم الهاتف');
      return;
    }
    const found = storage.getConcernByTicket(searchQuery.trim());
    if (found) {
      navigate(`/receipt/${found.ticket_number}`);
    } else {
      setSearchError('عذراً، لم يتم العثور على أي انشغال مسجل بهذا الرقم. يرجى التأكد من الرقم والمحاولة مجدداً.');
    }
  };

  const steps = [
    {
      num: '01',
      title: 'إيداع الانشغال إلكترونياً',
      desc: 'ملء استمارة الانشغال بدقة مع إرفاق الوثائق والمستندات الثبوتية إن وجدت.'
    },
    {
      num: '02',
      title: 'استخراج وصل الإيداع الفوري',
      desc: 'تحميل وطباعة وصل رسمي يحمل رقم التذكرة (TR-26) ورقم الطابور ورمز الاستجابة QR.'
    },
    {
      num: '03',
      title: 'الدراسة وتحديد موعد المقابلة',
      desc: 'تحويل الملف آلياً للمصلحة الإدارية المختصة مع تحديد موعد استقبال عند الحاجة.'
    },
    {
      num: '04',
      title: 'تلقي الرد والتسوية',
      desc: 'إشعاركم بالنتيجة النهائية والحلول المتخذة عبر المنصة بكل شفافية.'
    }
  ];

  const faqs = [
    {
      q: 'من يمكنه تقديم انشغال عبر هذه المنصة؟',
      a: 'المنصة مفتوحة لجميع مكونات الأسرة التربوية بولاية تيارت: أساتذة، إداريون، عمال مهنيون، متقاعدون، وكذا أولياء التلاميذ والمواطنون المعنيون بقطاع التربية.'
    },
    {
      q: 'كيف أعرف المصلحة المختصة بانشغالي؟',
      a: 'عند ملء الاستمارة، يمكنك اختيار المصلحة المعنية (مصلحة المستخدمين للترقيات والرواتب، مصلحة التنظيم للتمدرس والتحويل، مصلحة الامتحانات، إلخ) أو اختيار أقرب تصنيف وسيقوم النظام بتوجيهه تلقائياً.'
    },
    {
      q: 'ما هي أهمية وصل الإيداع ورقم التذكرة؟',
      a: 'وصل الإيداع هو وثيقة رسمية تثبت تاريخ وساعة تقديم طلبك، وهو بمثابة استدعاء رسمي ورقم دور عند حضورك لمقر المديرية في حال تمت برمجتك لمقابلة حضورية.'
    },
    {
      q: 'كم تستغرق دراسة الانشغال عادة؟',
      a: 'تتم معالجة الانشغالات العاجلة خلال 48 ساعة، في حين تستغرق الانشغالات الإدارية والتربوية العادية ما بين 3 إلى 7 أيام عمل كحد أقصى وفقاً لطبيعة الملف.'
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative grid/glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>الرقمنة في خدمة الأسرة التربوية والمواطن — ولاية تيارت</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-tight">
            بوابة استقبال ومتابعة الانشغالات
            <br />
            <span className="text-amber-300 font-extrabold text-2xl sm:text-4xl block mt-2">
              مديرية التربية لولاية تيارت
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
            فضاء رسمي وموحد يتيح للأساتذة والموظفين وأولياء التلاميذ إيداع انشغالاتهم، حجز مواعيد المقابلات، ومتابعة مآل ملفاتهم الإدارية والتربوية والمالية بكل يسر وشفافية.
          </p>

          {/* Quick Track Box */}
          <div className="max-w-2xl mx-auto mt-8 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/20 shadow-2xl">
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="أدخل رقم الوصل (مثال: TR-26-8K2M1) أو رقم الهاتف..."
                  className="w-full bg-white text-slate-900 placeholder:text-slate-400 py-3.5 pr-11 pl-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                />
                <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold px-6 py-3.5 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>متابعة الوصل</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </form>

            {searchError && (
              <div className="flex items-center gap-2 mt-3 text-xs text-rose-200 bg-rose-950/60 p-2.5 rounded-lg border border-rose-800 text-right">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-300" />
                <span>{searchError}</span>
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-lg shadow-emerald-950/30 transition transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إيداع انشغال جديد الآن</span>
            </Link>
            <Link
              to="/my"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-emerald-100 font-semibold py-3 px-6 rounded-xl text-sm border border-white/20 backdrop-blur-sm transition"
            >
              <Clock className="w-4 h-4" />
              <span>سجل انشغالاتي السابقة</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Statistics Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{stats.total}</div>
              <div className="text-xs font-medium text-slate-500">إجمالي الانشغالات</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-600">{stats.in_review + stats.new}</div>
              <div className="text-xs font-medium text-slate-500">قيد الدراسة والتحقيق</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-blue-600">{stats.scheduled}</div>
              <div className="text-xs font-medium text-slate-500">مواعيد استقبال محجوزة</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600">{stats.resolved}</div>
              <div className="text-xs font-medium text-slate-500">تمت التسوية والرد</div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Process Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            مسار المعالجة
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            كيف تتم معالجة انشغالك في مديرية التربية؟
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            خطوات منظمة ومضبوطة تضمن دراسة طلبكم من طرف المصلحة المختصة مع إشعاركم في كل مرحلة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative hover:border-emerald-300 transition group"
            >
              <div className="text-3xl font-black text-emerald-800/20 group-hover:text-emerald-700/30 transition mb-3">
                {step.num}
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-800 transition">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Directory of Departments (المصالح الرسمية) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-xs font-bold text-emerald-400">هيكل مديرية التربية لولاية تيارت</span>
                <h2 className="text-2xl sm:text-3xl font-black mt-1">دليل المصالح واختصاصاتها</h2>
              </div>
              <Link
                to="/submit"
                className="self-start sm:self-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
              >
                <span>تقديم انشغال لمصلحة محددة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(OFFICIALS).map(([key, item]: [string, any]) => (
                <div
                  key={key}
                  className="bg-slate-800/80 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/60 transition"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h4 className="font-bold text-sm text-emerald-100">{item.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pr-6">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            الأسئلة الشائعة وتوضيحات الاستقبال
          </h2>
          <p className="text-slate-600 text-sm">
            إجابات عن التساؤلات المتكررة حول تنظيم مواعيد ومقابلات مديرية التربية.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 text-right flex items-center justify-between font-bold text-sm text-slate-800 hover:bg-slate-50 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-black">
            هل لديك انشغال أو استفسار بخصوص تمدرس أو وظيفة بقطاع التربية؟
          </h3>
          <p className="text-emerald-100 text-sm max-w-2xl mx-auto">
            لا داعي للتنقل دون موعد، سجّل انشغالك الآن لتحصل على وصل رسمي ومتابعة مباشرة من المصالح الإدارية المعنية.
          </p>
          <div className="pt-2">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg transition text-sm cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>بدء إيداع الانشغال الآن</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
