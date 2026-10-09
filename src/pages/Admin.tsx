import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { storage } from '@/lib/storage';
import { exportConcernsToXlsx } from '@/lib/exportConcerns';
import { useToast } from '@/components/ui/toaster';
import {
  ConcernItem,
  STATUSES,
  IMPORTANCE,
  OFFICIALS,
  CATEGORIES,
  TIME_SLOTS,
  USER_TYPES
} from '@/lib/concernConfig';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  Printer,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  MessageSquare,
  Users,
  Building,
  RefreshCw,
  KeyRound,
  Settings,
  Lock,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const { user, updateAdminCredentials } = useAuth();
  const { toast } = useToast();

  const [concerns, setConcerns] = useState<ConcernItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOfficial, setFilterOfficial] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterImportance, setFilterImportance] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  // Admin Account Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [adminProfileForm, setAdminProfileForm] = useState({
    name: '',
    username: '',
    phone: '',
    rank: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Modal State for Action (Reply / Schedule / Status change)
  const [activeModalConcern, setActiveModalConcern] = useState<ConcernItem | null>(null);
  const [modalForm, setModalForm] = useState({
    status: 'in_review' as 'new' | 'in_review' | 'scheduled' | 'resolved' | 'rejected',
    reply: '',
    replied_by: user?.name || 'مديرية التربية لولاية تيارت',
    appointment_date: '',
    appointment_time: TIME_SLOTS[0],
    queue_number: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const list = storage.getConcerns();
    setConcerns(list);
  };

  const openSettingsModal = () => {
    const adminConfig = storage.getAdminConfig();
    setAdminProfileForm({
      name: adminConfig.name || user?.name || '',
      username: adminConfig.username || user?.email || '',
      phone: adminConfig.phone || user?.phone || '',
      rank: adminConfig.rank || user?.rank || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setSettingsError('');
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError('');

    if (!adminProfileForm.name.trim()) {
      setSettingsError('يرجى إدخال اسم المسؤول / المشرف');
      return;
    }
    if (!adminProfileForm.username.trim()) {
      setSettingsError('يرجى إدخال اسم المستخدم أو البريد الإلكتروني لتسجيل الدخول');
      return;
    }

    if (adminProfileForm.newPassword) {
      if (adminProfileForm.newPassword.length < 6) {
        setSettingsError('كلمة المرور الجديدة يجب أن لا تقل عن 6 أحرف أو أرقام');
        return;
      }
      if (adminProfileForm.newPassword !== adminProfileForm.confirmPassword) {
        setSettingsError('كلمتا المرور غير متطابقتين');
        return;
      }
      if (!adminProfileForm.currentPassword) {
        setSettingsError('يرجى إدخال كلمة المرور الحالية لتأكيد التغيير');
        return;
      }
    }

    setSettingsLoading(true);
    try {
      await updateAdminCredentials({
        currentPassword: adminProfileForm.currentPassword,
        newUsername: adminProfileForm.username.trim(),
        newName: adminProfileForm.name.trim(),
        newPhone: adminProfileForm.phone.trim(),
        newRank: adminProfileForm.rank.trim(),
        newPassword: adminProfileForm.newPassword ? adminProfileForm.newPassword.trim() : undefined,
      });

      toast({
        title: 'تم تحديث بيانات الحساب بنجاح',
        description: adminProfileForm.newPassword ? 'تم تغيير اسم المستخدم وكلمة السر بنجاح' : 'تم حفظ بيانات المشرف بنجاح',
        variant: 'success'
      });

      setIsSettingsOpen(false);
    } catch (err: any) {
      setSettingsError(err.message || 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleOpenModal = (c: ConcernItem) => {
    setActiveModalConcern(c);
    setModalForm({
      status: c.status,
      reply: c.reply || '',
      replied_by: c.replied_by || user?.name || OFFICIALS[c.official]?.name || 'مديرية التربية لولاية تيارت',
      appointment_date: c.appointment_date || '',
      appointment_time: c.appointment_time || TIME_SLOTS[0],
      queue_number: c.queue_number || 'Q-100',
    });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalConcern) return;

    const updates: Partial<ConcernItem> = {
      status: modalForm.status,
      reply: modalForm.reply,
      replied_by: modalForm.replied_by,
      replied_at: new Date().toISOString().split('T')[0],
      appointment_date: modalForm.status === 'scheduled' ? modalForm.appointment_date : activeModalConcern.appointment_date,
      appointment_time: modalForm.status === 'scheduled' ? modalForm.appointment_time : activeModalConcern.appointment_time,
      queue_number: modalForm.queue_number || activeModalConcern.queue_number,
    };

    storage.updateConcern(activeModalConcern.id, updates);
    toast({
      title: 'تم تحديث الملف بنجاح',
      description: `تم حفظ الإجراء للانشغال رقم ${activeModalConcern.ticket_number}`,
      variant: 'success'
    });

    setActiveModalConcern(null);
    loadData();
  };

  const handleDelete = (id: string, ticket: string) => {
    if (window.confirm(`هل أنت متأكد من حذف الانشغال رقم ${ticket}؟`)) {
      storage.deleteConcern(id);
      toast({
        title: 'تم حذف الانشغال',
        variant: 'destructive'
      });
      loadData();
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const count = await exportConcernsToXlsx({
        official: filterOfficial !== 'all' ? filterOfficial : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      });
      toast({
        title: 'تم التصدير بنجاح',
        description: `تم تنزيل ملف Excel يحتوي على ${count} انشغال`,
        variant: 'success'
      });
    } catch (err) {
      toast({
        title: 'فشل التصدير',
        description: 'حدث خطأ أثناء إعداد ملف الإكسيل',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const filtered = concerns.filter((c) => {
    const matchesSearch =
      searchTerm === '' ||
      c.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.institution && c.institution.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesOfficial = filterOfficial === 'all' || c.official === filterOfficial;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesImportance = filterImportance === 'all' || c.importance === filterImportance;

    return matchesSearch && matchesOfficial && matchesStatus && matchesImportance;
  });

  const stats = storage.getStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-slate-900 text-white p-6 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>لوحة القيادة الإدارية المركزية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            فضاء معالجة الانشغالات والمواعيد
          </h1>
          <p className="text-xs text-slate-400">
            متابعة، توجيه، برمجة المقابلات، والرد على انشغالات أسرة التربية والمواطنين بولاية تيارت.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openSettingsModal}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 font-bold px-4 py-2.5 rounded-xl text-xs transition border border-slate-700 shadow-xs cursor-pointer"
            title="تغيير اسم المستخدم، بيانات المشرف، وكلمة المرور"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>إعدادات الحساب وكلمة السر</span>
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isExporting ? 'جارٍ التصدير...' : 'تصدير إلى Excel (XLSX)'}</span>
          </button>
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-medium block">الإجمالي</span>
          <span className="text-2xl font-black text-slate-900">{stats.total}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-medium block">جديد</span>
          <span className="text-2xl font-black text-slate-800">{stats.new}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-medium block">قيد الدراسة</span>
          <span className="text-2xl font-black text-amber-600">{stats.in_review}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-medium block">مواعيد محجوزة</span>
          <span className="text-2xl font-black text-blue-600">{stats.scheduled}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-slate-500 font-medium block">تمت المعالجة</span>
          <span className="text-2xl font-black text-emerald-600">{stats.resolved}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-xs text-rose-600 font-bold block">انشغالات عاجلة</span>
          <span className="text-2xl font-black text-rose-600">{stats.urgent}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث برقم الوصل، الاسم، الهاتف..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pr-9 pl-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={filterOfficial}
              onChange={(e) => setFilterOfficial(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">جميع المصالح ({concerns.length})</option>
              {Object.entries(OFFICIALS).map(([key, item]: [string, any]) => (
                <option key={key} value={key}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">جميع الحالات</option>
              {Object.entries(STATUSES).map(([key, item]: [string, any]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <select
              value={filterImportance}
              onChange={(e) => setFilterImportance(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              <option value="all">جميع درجات الأهمية</option>
              {Object.entries(IMPORTANCE).map(([key, item]: [string, any]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">رقم الوصل / الطابور</th>
                <th className="py-3.5 px-4">صاحب الانشغال</th>
                <th className="py-3.5 px-4">المصلحة والتصنيف</th>
                <th className="py-3.5 px-4">موضوع الانشغال</th>
                <th className="py-3.5 px-4">درجة الأهمية</th>
                <th className="py-3.5 px-4">الحالة والموعد</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    لا توجد بيانات مطابقة لخيارات البحث
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const statusConfig = STATUSES[c.status] || STATUSES.new;
                  const importanceConfig = IMPORTANCE[c.importance] || IMPORTANCE.medium;
                  const officialConfig = OFFICIALS[c.official] || { name: c.official };

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition">
                      {/* Ticket & Queue */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-emerald-800">{c.ticket_number}</div>
                        <div className="text-[10px] text-slate-500 font-sans">{c.queue_number || 'بدون دور'}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{c.created_date}</div>
                      </td>

                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{c.full_name}</div>
                        <div className="text-[11px] text-slate-500">{c.phone}</div>
                        <div className="text-[10px] text-slate-600 font-medium">
                          {c.rank || USER_TYPES[c.user_type] || c.user_type}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{officialConfig.name}</div>
                        <div className="text-[10px] text-slate-500">
                          {CATEGORIES[c.category] || c.category}
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1">{c.subject}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{c.description}</div>
                      </td>

                      {/* Urgency */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${importanceConfig.color}`}>
                          {importanceConfig.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusConfig.color} block w-fit mb-1`}>
                          {statusConfig.label}
                        </span>
                        {c.status === 'scheduled' && c.appointment_date && (
                          <div className="text-[10px] text-blue-700 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{c.appointment_date} ({c.appointment_time})</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenModal(c)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg transition"
                            title="معالجة / تحديد موعد / رد"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <Link
                            to={`/receipt/${c.ticket_number}`}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            title="معاينة وطباعة الوصل"
                          >
                            <Printer className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDelete(c.id, c.ticket_number)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Process Concern / Appointment Scheduling / Reply */}
      {activeModalConcern && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  معالجة رسمية
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  إجراء إداري: {activeModalConcern.ticket_number}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalConcern(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">المعني:</span>
                <span className="font-bold text-slate-900">{activeModalConcern.full_name} ({activeModalConcern.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الموضوع:</span>
                <span className="font-semibold text-slate-800">{activeModalConcern.subject}</span>
              </div>
              <div className="pt-1 text-slate-600 border-t border-slate-200/60">
                {activeModalConcern.description}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveModal} className="space-y-4 text-xs">
              
              {/* Status Select */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  تحديث وضعية الانشغال:
                </label>
                <select
                  value={modalForm.status}
                  onChange={(e) => setModalForm({ ...modalForm, status: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                >
                  {Object.entries(STATUSES).map(([key, item]: [string, any]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional Appointment Booking fields */}
              {modalForm.status === 'scheduled' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
                  <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-blue-700" />
                    تفاصيل موعد المقابلة المبرمج:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        تاريخ المقابلة:
                      </label>
                      <input
                        type="date"
                        value={modalForm.appointment_date}
                        onChange={(e) => setModalForm({ ...modalForm, appointment_date: e.target.value })}
                        required={modalForm.status === 'scheduled'}
                        className="w-full bg-white border border-blue-300 rounded-xl p-2.5 text-xs text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        توقيت المقابلة:
                      </label>
                      <select
                        value={modalForm.appointment_time}
                        onChange={(e) => setModalForm({ ...modalForm, appointment_time: e.target.value })}
                        className="w-full bg-white border border-blue-300 rounded-xl p-2.5 text-xs text-slate-900"
                      >
                        {TIME_SLOTS.map((slot: string) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      رقم الطابور والاستقبال:
                    </label>
                    <input
                      type="text"
                      value={modalForm.queue_number}
                      onChange={(e) => setModalForm({ ...modalForm, queue_number: e.target.value })}
                      placeholder="مثال: Q-105"
                      className="w-full bg-white border border-blue-300 rounded-xl p-2.5 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              {/* Official Reply textarea */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  رد وتوجيه الإدارة (يظهر لصاحب الانشغال وفي الوصل):
                </label>
                <textarea
                  rows={4}
                  value={modalForm.reply}
                  onChange={(e) => setModalForm({ ...modalForm, reply: e.target.value })}
                  placeholder="اكتب التوجيه، الحل، أو سبب القرار المتخذ..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  اسم أو صفة المحرر / المصلحة المسؤولة عن الرد:
                </label>
                <input
                  type="text"
                  value={modalForm.replied_by}
                  onChange={(e) => setModalForm({ ...modalForm, replied_by: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveModalConcern(null)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm transition"
                >
                  حفظ وتأكيد الإجراء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change Admin Username & Password Settings */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    إعدادات حساب الإدارة وكلمة السر
                  </h3>
                  <p className="text-xs text-slate-500">
                    تعديل اسم المستخدم، البريد، وتغيير كلمة المرور الخاصة بالمشرف
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {settingsError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{settingsError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              
              {/* Section 1: User Profile & Login Identifier */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>1. بيانات الهوية واسم المستخدم لتسجيل الدخول</span>
                </h4>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    الاسم الكامل للمشرف / المسؤول: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={adminProfileForm.name}
                    onChange={(e) => setAdminProfileForm({ ...adminProfileForm, name: e.target.value })}
                    required
                    placeholder="مثال: أحمد بن علي (المشرف العام)"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    اسم المستخدم أو البريد الإلكتروني لتسجيل الدخول: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={adminProfileForm.username}
                    onChange={(e) => setAdminProfileForm({ ...adminProfileForm, username: e.target.value })}
                    required
                    placeholder="مثال: admin@tiaret-edu.dz أو اسم مستخدم إداري"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    * هذا هو الاسم أو البريد الذي ستستخدمه لتسجيل الدخول إلى فضاء الإدارة.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      رقم هاتف الاتصال:
                    </label>
                    <input
                      type="text"
                      value={adminProfileForm.phone}
                      onChange={(e) => setAdminProfileForm({ ...adminProfileForm, phone: e.target.value })}
                      placeholder="046421520"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      الرتبة أو المنصب الإداري:
                    </label>
                    <input
                      type="text"
                      value={adminProfileForm.rank}
                      onChange={(e) => setAdminProfileForm({ ...adminProfileForm, rank: e.target.value })}
                      placeholder="رئيس مصلحة التنظيم والوسائل"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Change Password */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3.5">
                <h4 className="font-bold text-amber-950 flex items-center gap-2 text-xs">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>2. تغيير كلمة المرور (أمان الحساب)</span>
                </h4>
                <p className="text-[11px] text-amber-900">
                  اترك حقول كلمة المرور فارغة إذا كنت ترغب فقط في تعديل الاسم أو اسم المستخدم.
                </p>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    كلمة المرور الحالية (المعتمدة حالياً):
                  </label>
                  <input
                    type="password"
                    value={adminProfileForm.currentPassword}
                    onChange={(e) => setAdminProfileForm({ ...adminProfileForm, currentPassword: e.target.value })}
                    placeholder="أدخل كلمة المرور الحالية لتأكيد التعديل..."
                    className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    (كلمة المرور الافتراضية الأولية إن لم تغيرها سابقاً هي: admin123)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      كلمة المرور الجديدة:
                    </label>
                    <input
                      type="password"
                      value={adminProfileForm.newPassword}
                      onChange={(e) => setAdminProfileForm({ ...adminProfileForm, newPassword: e.target.value })}
                      placeholder="6 أحرف على الأقل..."
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      تأكيد كلمة المرور الجديدة:
                    </label>
                    <input
                      type="password"
                      value={adminProfileForm.confirmPassword}
                      onChange={(e) => setAdminProfileForm({ ...adminProfileForm, confirmPassword: e.target.value })}
                      placeholder="أعد إدخال كلمة المرور..."
                      className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  disabled={settingsLoading}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {settingsLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جارٍ حفظ التعديلات...</span>
                    </>
                  ) : (
                    <span>حفظ التعديلات الجديدة</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
