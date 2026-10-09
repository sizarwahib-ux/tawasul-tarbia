export interface ConcernItem {
  id: string;
  ticket_number: string;
  queue_number?: string;
  created_date: string;
  full_name: string;
  national_id?: string;
  phone: string;
  email?: string;
  user_type: 'citizen' | 'employee';
  rank?: string;
  institution?: string;
  category: string;
  importance: 'low' | 'medium' | 'high' | 'urgent';
  official: string;
  subject: string;
  description: string;
  attachments?: string[];
  appointment_date?: string;
  appointment_time?: string;
  status: 'new' | 'in_review' | 'scheduled' | 'resolved' | 'rejected';
  reply?: string;
  replied_at?: string;
  replied_by?: string;
  user_id?: string;
  priority_rank?: number;
}

export const USER_TYPES = {
  citizen: "مواطن / ولي أمر",
  employee: "موظف بقطاع التربية"
} as const;

export const CATEGORIES: Record<string, string> = {
  educational: "تربوي / بيداغوجي (تمدرس، توجيه، امتحانات)",
  administrative: "إداري (شهادات، تعيينات، تحويلات)",
  financial: "مالي (رواتب، مخلفات، منح، سكنات)",
  transport: "نقل ومطاعم مدرسية وتضامن مدرسي",
  hr: "موارد بشرية (ترقيات، تقاعد، مناصب نوعية)",
  infrastructure: "هياكل وتجهيزات ومرافق مدرسية",
  other: "انشغالات عامة وأخرى"
};

export const IMPORTANCE: Record<string, { label: string; rank: number; color: string; badge: string }> = {
  low: {
    label: "عادية / منخفضة",
    rank: 1,
    color: "bg-slate-100 text-slate-700 border-slate-200",
    badge: "border-slate-300 text-slate-700 bg-slate-50"
  },
  medium: {
    label: "متوسطة الأهمية",
    rank: 2,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    badge: "border-blue-300 text-blue-800 bg-blue-50"
  },
  high: {
    label: "عالية الأهمية",
    rank: 3,
    color: "bg-amber-100 text-amber-800 border-amber-200",
    badge: "border-amber-300 text-amber-800 bg-amber-50"
  },
  urgent: {
    label: "عاجلة جداً وتتطلب تدخلاً",
    rank: 4,
    color: "bg-red-100 text-red-700 border-red-200",
    badge: "border-red-300 text-red-700 bg-red-50"
  }
};

export const OFFICIALS: Record<string, { name: string; desc: string }> = {
  programming: {
    name: "مصلحة البرمجة والمتابعة",
    desc: "متابعة مشاريع البناء والترميم، الخريطة المدرسية، التجهيز"
  },
  training: {
    name: "مصلحة التكوين والتفتيش",
    desc: "التفتيش البيداغوجي، التكوين المستمر والندوات التربوية"
  },
  organization: {
    name: "مصلحة التنظيم التربوي",
    desc: "تمدرس التلاميذ، التوجيه المدرسي، فتح وغلق الأفواج"
  },
  exams: {
    name: "مصلحة الدراسة والامتحانات",
    desc: "شهادة البكالوريا، شهادة التعليم المتوسط، مسابقات التوظيف"
  },
  finance: {
    name: "مصلحة المالية والوسائل",
    desc: "ميزانية المؤسسات، التسيير المالي، الوسائل العامة والنقل"
  },
  users: {
    name: "مصلحة المستخدمين",
    desc: "الحركة النقلية، التثبيت، الترقية، الإحالة على التقاعد، الإجازات"
  },
  user_expenses: {
    name: "مصلحة تسيير نفقات المستخدمين",
    desc: "الرواتب الشهرية، المخلفات المالية، التعويضات والمنح العائلية"
  },
  secretary_general: {
    name: "الأمانة العامة للمديرية",
    desc: "التنسيق الإداري العام ومتابعة الشكاوى الميدانية"
  },
  director: {
    name: "مدير التربية (الاستقبال الخاص)",
    desc: "المقابلات الرسمية والحالات الخاصة التي تتطلب تدخل السيد المدير"
  }
};

export const STATUSES: Record<string, { label: string; color: string; badge: string; step: number }> = {
  new: {
    label: "جديد مسجل",
    color: "bg-slate-100 text-slate-800 border-slate-300",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    step: 1
  },
  in_review: {
    label: "قيد الدراسة والتحقيق",
    color: "bg-amber-100 text-amber-800 border-amber-300",
    badge: "bg-amber-50 text-amber-800 border-amber-300",
    step: 2
  },
  scheduled: {
    label: "تم حجز موعد استقبال",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    badge: "bg-blue-50 text-blue-700 border-blue-300",
    step: 3
  },
  resolved: {
    label: "تمت المعالجة والرد",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-300",
    step: 4
  },
  rejected: {
    label: "مرفوض / غير مبرر",
    color: "bg-rose-100 text-rose-800 border-rose-300",
    badge: "bg-rose-50 text-rose-700 border-rose-300",
    step: 4
  }
};

export const TIME_SLOTS = [
  "08:30 - 09:15",
  "09:15 - 10:00",
  "10:15 - 11:00",
  "11:00 - 11:45",
  "13:00 - 13:45",
  "14:00 - 14:45",
  "15:00 - 15:45"
];

export const makeTicket = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear().toString().slice(-2);
  return `TR-${year}-${code}`;
};

export const makeQueueNumber = () => {
  const num = Math.floor(100 + Math.random() * 900);
  return `Q-${num}`;
};
