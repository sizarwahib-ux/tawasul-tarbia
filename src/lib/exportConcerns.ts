import * as XLSX from "xlsx";
import { base44 } from "@/api/base44Client";
import { CATEGORIES, IMPORTANCE, OFFICIALS, STATUSES, USER_TYPES } from "@/lib/concernConfig";

const ALL = "all";

const COLUMNS = [
  { key: "ticket_number", label: "رقم الوصل" },
  { key: "queue_number", label: "رقم الدخول / الطابور" },
  { key: "created_date", label: "تاريخ التقديم" },
  { key: "full_name", label: "الاسم الكامل" },
  { key: "phone", label: "رقم الهاتف" },
  { key: "user_type", label: "صفة المعني" },
  { key: "rank", label: "الرتبة / المنصب" },
  { key: "institution", label: "المؤسسة التربوية" },
  { key: "subject", label: "موضوع الانشغال" },
  { key: "description", label: "تفاصيل الانشغال" },
  { key: "category", label: "التصنيف" },
  { key: "importance", label: "درجة الأهمية" },
  { key: "official", label: "المصلحة المعنية" },
  { key: "appointment_date", label: "تاريخ الموعد" },
  { key: "appointment_time", label: "توقيت الموعد" },
  { key: "status", label: "حالة المعالجة" },
  { key: "reply", label: "رد الإدارة" },
  { key: "replied_at", label: "تاريخ الرد" },
];

const LABEL: Record<string, (val: any) => string> = {
  user_type: (v) => USER_TYPES[v as keyof typeof USER_TYPES] || v,
  category: (v) => CATEGORIES[v] || v,
  importance: (v) => IMPORTANCE[v]?.label || v,
  official: (v) => OFFICIALS[v]?.name || v,
  status: (v) => STATUSES[v]?.label || v,
};

function rowFrom(c: any) {
  const row: Record<string, any> = {};
  COLUMNS.forEach(({ key, label }) => {
    let val = c[key];
    if (LABEL[key]) val = LABEL[key](val);
    if (val === null || val === undefined) val = "";
    row[label] = val;
  });
  return row;
}

export async function exportConcernsToXlsx(filter?: any) {
  const q: Record<string, any> = {};
  Object.entries(filter || {}).forEach(([k, v]) => {
    if (v !== ALL && v !== "" && v !== undefined) q[k] = v;
  });

  const page = await base44.entities.Concern.filter(q, { sort: "-created_date" });
  const all = page.items || [];

  const rows = all.map(rowFrom);
  const ws = XLSX.utils.json_to_sheet(rows, { cellDates: true });
  
  // Set column widths
  const colWidths = [
    { wch: 14 }, // رقم الوصل
    { wch: 16 }, // رقم الطابور
    { wch: 14 }, // التاريخ
    { wch: 20 }, // الاسم
    { wch: 14 }, // الهاتف
    { wch: 18 }, // الصفة
    { wch: 22 }, // الرتبة
    { wch: 25 }, // المؤسسة
    { wch: 30 }, // الموضوع
    { wch: 45 }, // التفاصيل
    { wch: 22 }, // التصنيف
    { wch: 15 }, // الأهمية
    { wch: 25 }, // المصلحة
    { wch: 14 }, // تاريخ الموعد
    { wch: 16 }, // توقيت الموعد
    { wch: 18 }, // الحالة
    { wch: 40 }, // الرد
    { wch: 14 }, // تاريخ الرد
  ];
  ws["!cols"] = colWidths;
  ws["!views"] = [{ RTL: true }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "سجل الانشغالات");
  
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `انشغالات_تربية_تيارت_${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return all.length;
}
