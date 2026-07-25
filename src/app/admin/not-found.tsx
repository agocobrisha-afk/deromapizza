import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export default function AdminNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0b0f19] px-4 text-white" dir="rtl">
      <section className="w-full max-w-xl rounded-[30px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-500 text-lg font-black">DR</span>
        <p className="mt-6 text-xs font-black tracking-[0.18em] text-rose-300">ADMIN RESET</p>
        <h1 className="mt-3 text-3xl font-black">هذا القسم غير موجود حاليًا</h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          تم حذف الأقسام القديمة من لوحة التحكم حتى نعيد بناءها من الصفر بدون تضارب أو روابط معطلة.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black hover:bg-rose-600">
            <ArrowRight size={17} /> العودة للوحة
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-black hover:bg-white/10">
            <Home size={17} /> فتح الموقع
          </Link>
        </div>
      </section>
    </main>
  );
}
