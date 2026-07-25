"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  LogOut,
  LayoutDashboard,
  PackageOpen,
  Tags,
  FileText,
  Image as ImageIcon,
  Palette,
  Settings,
  Menu,
  X,
  ArrowLeft,
  Sparkles,
  Search,
  Plus,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

const navItems = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/menu", label: "الأصناف", icon: PackageOpen },
  { href: "/admin/categories", label: "التصنيفات", icon: Tags },
  { href: "/admin/content", label: "المحتوى", icon: FileText },
  { href: "/admin/media", label: "الصور", icon: ImageIcon },
  { href: "/admin/appearance", label: "المظهر", icon: Palette },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

const descriptions: Record<string, string> = {
  "/admin/menu": "إدارة الأصناف والأسعار والصور وحالة التوفر من واجهة جديدة بالكامل.",
  "/admin/categories": "إنشاء التصنيفات وترتيب ظهورها داخل المنيو بدون أي مكونات قديمة.",
  "/admin/content": "تعديل عناوين الموقع ونصوص الأقسام والأزرار من نظام محتوى جديد.",
  "/admin/media": "إدارة صور الواجهة والمعرض وصور المنتجات من مكتبة وسائط موحدة.",
  "/admin/appearance": "اختيار الهوية والألوان وشكل الواجهة بعد تجهيز قاعدة البيانات الجديدة.",
  "/admin/settings": "بيانات المطعم والتواصل وساعات العمل وإعدادات الطلب والتوصيل.",
};

export default function AdminShell({ children: _children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null | "loading">("loading");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) router.replace("/admin/login");
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) router.replace("/admin/login");
    });

    return () => subscription.subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const currentItem = useMemo(
    () => navItems.find((item) => item.href === pathname) ?? navItems[0],
    [pathname],
  );
  const CurrentIcon = currentItem.icon;

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (session === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f6fa] px-4" dir="rtl">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-500 shadow-sm">
          جارٍ تجهيز لوحة التحكم الجديدة...
        </div>
      </main>
    );
  }

  if (!session) return null;

  const sidebar = (
    <aside className="flex h-full w-[286px] flex-col bg-[#0b1224] text-white">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black tracking-[0.16em] text-rose-300">RESTAURANT CMS</p>
            <h1 className="mt-1 text-xl font-black">De Roma</h1>
            <p className="mt-1 text-xs text-slate-400">لوحة إدارة جديدة بالكامل</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500 text-sm font-black shadow-lg shadow-rose-950/30">DR</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition ${
                active ? "bg-rose-500 text-white shadow-lg shadow-rose-950/25" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3"><Icon size={18} /><span>{item.label}</span></span>
              <ArrowLeft size={15} className="opacity-60" />
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <Link href="/" target="_blank" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white">
          <ExternalLink size={16} /> معاينة الموقع
        </Link>
        <button type="button" onClick={signOut} className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white">
          <LogOut size={16} /> تسجيل الخروج
        </button>
      </div>
    </aside>
  );

  const dashboardHome = (
    <div className="space-y-6" dir="rtl">
      <section className="overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-xl shadow-slate-300/40">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.35fr_.65fr] lg:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-black text-rose-300"><Sparkles size={14} /> النسخة الجديدة</span>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">إدارة المطعم والموقع من مكان واحد</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">تم إيقاف كل واجهات وأزرار اللوحة القديمة. الأقسام التالية تُبنى الآن بنظام واحد نظيف ومتوافق مع الهاتف.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 self-start">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-slate-400">حالة اللوحة</span><strong className="mt-2 block text-lg font-black text-emerald-300">نشطة</strong></article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-slate-400">النظام القديم</span><strong className="mt-2 block text-lg font-black">مخفي بالكامل</strong></article>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <span className="text-xs font-black text-rose-500">الإدارة الأساسية</span>
        <h2 className="mt-1 text-2xl font-black">اختر القسم الذي تريد إدارته</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {navItems.slice(1).map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-rose-200 hover:bg-white hover:shadow-lg">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-rose-500 shadow-sm"><Icon size={20} /></span>
                <strong className="mt-4 block text-lg font-black">{item.label}</strong>
                <p className="mt-2 text-sm leading-6 text-slate-500">{descriptions[item.href]}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-rose-500">فتح القسم <ArrowLeft size={16} /></span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );

  const sectionPage = (
    <div className="space-y-6" dir="rtl">
      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-black text-rose-500">لوحة الإدارة الجديدة</span>
            <h1 className="mt-2 text-3xl font-black">{currentItem.label}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{descriptions[pathname] ?? "هذا القسم جزء من نظام الإدارة الجديد."}</p>
          </div>
          <button type="button" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 text-sm font-black text-white shadow-lg shadow-rose-200">
            <Plus size={18} /> إضافة جديد
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">مساحة العمل</h2>
              <p className="mt-1 text-sm text-slate-500">تم تعطيل واجهة القسم القديمة حتى لا تظهر أي أزرار أو أخطاء سابقة.</p>
            </div>
            <div className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-400"><Search size={17} /><span className="text-sm">بحث داخل القسم</span></div>
          </div>

          <div className="mt-6 grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <div>
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-rose-500 shadow-sm"><CurrentIcon size={24} /></span>
              <h3 className="mt-4 text-xl font-black">يتم بناء {currentItem.label} من الصفر</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-500">لن نستخدم الحقول أو الحفظ أو المكونات القديمة. سيتم ربط هذا القسم بقاعدة البيانات بعد اعتماد مخطط جديد متوافق.</p>
            </div>
          </div>
        </article>

        <aside className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3"><CheckCircle2 className="text-emerald-500" size={20} /><strong>تم إخفاء النظام القديم</strong></div>
            <p className="mt-3 text-sm leading-6 text-slate-500">لن تظهر القوائم أو النماذج السابقة داخل هذا القسم.</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3"><Clock3 className="text-amber-500" size={20} /><strong>قيد إعادة البناء</strong></div>
            <p className="mt-3 text-sm leading-6 text-slate-500">الربط والحفظ سيضافان بعد تجهيز الجداول الجديدة بدون أخطاء أعمدة مفقودة.</p>
          </article>
        </aside>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-950" dir="rtl">
      <div className="fixed inset-y-0 right-0 z-40 hidden lg:block">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="إغلاق القائمة" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <div className="absolute inset-y-0 right-0 shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="lg:pr-[286px]">
        <header className="sticky top-0 z-30 flex min-h-[74px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden" aria-label="فتح القائمة">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <p className="text-xs font-black text-rose-500">لوحة إدارة De Roma</p>
              <h2 className="text-lg font-black text-slate-950">{currentItem.label}</h2>
            </div>
          </div>
          <Link href="/" target="_blank" className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-rose-200 hover:text-rose-600 sm:inline-flex">معاينة الموقع</Link>
        </header>

        <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {pathname === "/admin" ? dashboardHome : sectionPage}
        </main>
      </div>
    </div>
  );
}
