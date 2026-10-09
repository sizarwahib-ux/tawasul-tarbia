import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/toaster';
import {
  FileText,
  Send,
  Upload,
  User,
  Phone,
  Building,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  USER_TYPES,
  CATEGORIES,
  OFFICIALS,
  IMPORTANCE,
  makeTicket,
  makeQueueNumber
} from '@/lib/concernConfig';

export default function Submit() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    user_type: user?.user_type || 'citizen',
    full_name: user?.name || '',
    national_id: user?.national_id || '',
    phone: user?.phone || '',
    email: user?.email || '',
    rank: user?.rank || '',
    institution: user?.institution || '',
    category: 'educational',
    official: 'organization',
    importance: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    subject: '',
    description: '',
    attachments: [] as string[],
    pledge: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadFileName, setUploadFileName] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      setFormData((prev) => ({
        ...prev,
        attachments: [file.name]
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.full_name.trim()) {
      setErrorMsg('يرجى إدخال الاسم واللقب كاملاً');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('يرجى إدخال رقم الهاتف للتواصل');
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMsg('يرجى تحديد موضوع الانشغال');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg('يرجى كتابة تفاصيل الانشغال بوضوح');
      return;
    }
    if (!formData.pledge) {
      setErrorMsg('يرجى التأكيد والموافقة على صحة المعلومات المصرح بها');
      return;
    }

    setIsSubmitting(true);

    try {
      const ticketNumber = makeTicket();
      const queueNumber = makeQueueNumber();
      const priorityRank = IMPORTANCE[formData.importance]?.rank || 2;

      const created = storage.saveConcern({
        ticket_number: ticketNumber,
        queue_number: queueNumber,
        full_name: formData.full_name,
        national_id: formData.national_id,
        phone: formData.phone,
        email: formData.email,
        user_type: formData.user_type as 'citizen' | 'employee',
        rank: formData.rank,
        institution: formData.institution,
        category: formData.category,
        official: formData.official,
        importance: formData.importance,
        subject: formData.subject,
        description: formData.description,
        attachments: formData.attachments,
        user_id: user?.id,
        priority_rank: priorityRank
      });

      toast({
        title: 'تم تسجيل انشغالكم بنجاح',
        description: `رقم الوصل الرسمي هو: ${created.ticket_number}`,
        variant: 'success'
      });

      // Redirect directly to the generated official receipt
      navigate(`/receipt/${created.ticket_number}`);
    } catch (err: any) {
      setErrorMsg('حدث خطأ أثناء حفظ الانشغال، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10" dir="rtl">
      {/* Header & Instructions */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              استمارة إيداع انشغال / طلب مقابلة رسمية
            </h1>
            <p className="text-xs text-slate-500">
              مديرية التربية لولاية تيارت — مصلحة التوجيه والاستقبال
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1 leading-relaxed">
          <p className="font-bold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-700 shrink-0" />
            توجيهات هامة للمرتفقين:
          </p>
          <p>
            • يرجى تحري الدقة والوضوح في ملء الحقول لتسهيل توجيه ملفكم للمصلحة المختصة ومعالجته بالسرعة المطلوبة.
          </p>
          <p>
            • بعد إرسال الاستمارة، ستتحصل فوراً على <strong>وصل إيداع رسمي وبطاقة موعد</strong> يمكنك طباعتها أو حفظها في هاتفك لإظهارها عند زيارة مقر المديرية.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: User Identity */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-700" />
            1. هوية وصفة صاحب الانشغال
          </h2>

          {/* User Type Choice */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">الصفة:</label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <label
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                  formData.user_type === 'citizen'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="user_type"
                  value="citizen"
                  checked={formData.user_type === 'citizen'}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <span className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center">
                  {formData.user_type === 'citizen' && <span className="w-2 h-2 rounded-full bg-emerald-700" />}
                </span>
                <span>مواطن / ولي أمر تلميذ</span>
              </label>

              <label
                className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold cursor-pointer transition ${
                  formData.user_type === 'employee'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-600'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="user_type"
                  value="employee"
                  checked={formData.user_type === 'employee'}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <span className="w-4 h-4 rounded-full border border-slate-400 flex items-center justify-center">
                  {formData.user_type === 'employee' && <span className="w-2 h-2 rounded-full bg-emerald-700" />}
                </span>
                <span>أستاذ أو موظف بالقطاع</span>
              </label>
            </div>
          </div>

          {/* Core Personal Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الاسم واللقب الكامل <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                placeholder="مثال: عبد القادر بن عيسى"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الهاتف للتواصل <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="مثال: 0661234567"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم التعريف الوطني (NIN)
              </label>
              <input
                type="text"
                name="national_id"
                value={formData.national_id}
                onChange={handleInputChange}
                placeholder="رقم بطاقة التعريف البيومترية (18 رقماً)"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                البريد الإلكتروني (اختياري)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>
          </div>

          {/* Extra fields if Employee */}
          {formData.user_type === 'employee' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الرتبة والمنصب
                </label>
                <input
                  type="text"
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  placeholder="مثال: أستاذ التعليم الثانوي / مقتصد / مستشار تربية"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المؤسسة التربوية / مكان العمل الحالي
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="مثال: ثانوية ابن خلدون - تيارت"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                />
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المؤسسة المعنية بالانشغال (إن وجدت)
              </label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="مثال: مدرسة الأمير عبد القادر / بلدية الدحموني"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>
          )}
        </div>

        {/* Section 2: Concern Classification & Details */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-700" />
            2. موضوع وتفاصيل الانشغال
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المصلحة المعنية بالمديرية <span className="text-rose-500">*</span>
              </label>
              <select
                name="official"
                value={formData.official}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              >
                {Object.entries(OFFICIALS).map(([key, item]: [string, any]) => (
                  <option key={key} value={key}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تصنيف الانشغال <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              >
                {Object.entries(CATEGORIES).map(([key, label]: [string, any]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                درجة الأهمية / الاستعجال <span className="text-rose-500">*</span>
              </label>
              <select
                name="importance"
                value={formData.importance}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              >
                {Object.entries(IMPORTANCE).map(([key, item]: [string, any]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              موضوع الانشغال باختصار <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="مثال: طلب تسوية المخلفات المالية للترقية / طلب تحويل تلميذ"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              تفاصيل وشرح الانشغال <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="يرجى كتابة كافة الوقائع والمراجع الإدارية والتفاصيل اللازمة لتمكين المصلحة من دراسة انشغالكم بدقة..."
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white leading-relaxed"
            />
          </div>

          {/* Attachment upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              إرفاق وثيقة ثبوتية أو تقرير (PDF أو صور - اختياري)
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 text-center cursor-pointer transition bg-slate-50/50 relative">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500">
                <Paperclip className="w-5 h-5 text-emerald-700" />
                <span className="text-xs font-medium">
                  {uploadFileName ? (
                    <span className="text-emerald-700 font-bold">{uploadFileName} (تم الإرفاق)</span>
                  ) : (
                    'اضغط هنا لتحميل وثيقة من جهازك (مقرر، كشف راتب، شهادة مدرسية...)'
                  )}
                </span>
                <span className="text-[10px] text-slate-400">الحد الأقصى للملف: 10 ميغابايت</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Legal Undertaking & Submit */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.pledge}
              onChange={(e) => setFormData((prev) => ({ ...prev, pledge: e.target.checked }))}
              className="mt-1 w-4 h-4 text-emerald-700 rounded border-slate-300 focus:ring-emerald-600"
            />
            <span className="text-xs text-slate-700 leading-relaxed">
              أصرح بشرفي بصحة ودقة كافة المعلومات المصرح بها في هذه الاستمارة، وأعلم أن التصريحات الكاذبة تعرض صاحبها للمساءلة القانونية والإدارية طبقاً للتنظيم المعمول به.
            </span>
          </label>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              سيتم توليد وصل الإيداع الإلكتروني ورقم الطابور مباشرة بعد التأكيد.
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold px-8 py-3.5 rounded-xl shadow-md text-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جارٍ التسجيل وإصدار الوصل...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>تأكيد الإيداع واستخراج الوصل</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
