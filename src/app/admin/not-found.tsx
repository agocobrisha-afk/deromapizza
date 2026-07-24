import Link from "next/link";
import { ArrowRight, Home, LayoutDashboard } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="grid min-h-[65vh] place-items-center p-6" dir="rtl">
      <section className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <span className="text-sm font-black text-rose-500">404</span>
        <h1 className="mt-3 text-3xl font-black text-slate-950">هذا القسم غير متوفر بعد</h1>
        <p className="mt-3 leading-7 text-slate-500">تم منع ظهور الصفحة السوداء القديمة. يمكنك الرجوع للوحة أو فتح الموقع مباشرة.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/admin" className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white"><LayoutDashboard size={17} /> لوحة التحكم</Link>
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700"><Home size={17} /> الموقع <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
}
