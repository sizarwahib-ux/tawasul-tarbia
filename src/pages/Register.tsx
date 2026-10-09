import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/toaster';
import {
  UserPlus,
  User,
  Phone,
  Mail,
  Lock,
  Building,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    user_type: 'citizen' as 'citizen' | 'employee',
    name: '',
    national_id: '',
    phone: '',
    email: '',
    rank: '',
    institution: '',
    password: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('يرجى كتابة الاسم واللقب كاملاً');
      return;
    }
    if (!formData.phone.trim()) {
      setError('يرجى إدخال رقم الهاتف');
      return;
    }
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email || `${formData.phone}@tiaret-edu.dz`,
        phone: formData.phone,
        user_type: formData.user_type,
        national_id: formData.national_id,
        rank: formData.rank,
        institution: formData.institution,
      });

      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'مرحباً بك في منصة مديرية التربية لولاية تيارت',
        variant: 'success'
      });

      navigate('/submit');
    } catch {
      setError('حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="text-center space-y-2 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md font-bold text-lg">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">
          إنشاء حساب جديد بالمنصة
        </h1>
        <p className="text-xs text-slate-500">
          التسجيل يتيح لكم إيداع الانشغالات ومتابعة المواعيد والردود الإدارية في أي وقت.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* User Type Choice */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">الصفة:</label>
            <div className="grid grid-cols-2 gap-3">
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
                <span>أستاذ أو موظف بالقطاع</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الاسم واللقب الكامل <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="الاسم واللقب..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                رقم الهاتف <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="06XXXXXXXX"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
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
                placeholder="18 رقماً"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white font-mono"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>
          </div>

          {formData.user_type === 'employee' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الرتبة والوظيفة
                </label>
                <input
                  type="text"
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  placeholder="أستاذ، مقتصد، ناظر..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المؤسسة التربوية / مصلحة العمل
                </label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="المؤسسة بولاية تيارت..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تأكيد كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'جارٍ تسجيل الحساب...' : 'تأكيد التسجيل وإنشاء الحساب'}
            </button>
          </div>

          <div className="text-center text-xs text-slate-600 pt-2">
            لديك حساب بالفعل؟{' '}
            <Link to="/login" className="font-bold text-emerald-800 hover:underline">
              تسجيل الدخول هنا
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
