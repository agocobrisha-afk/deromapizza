"use client";

import { useEffect, useState } from "react";
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

const dashboardCards = navItems.slice(1).map((item) => ({
  ...item,
  description:
    item.href === "/admin/menu"
      ? "إدارة الأصناف والأسعار والصور وحالة التوفر."
      : item.href === "/admin/categories"
        ? "إنشاء التصنيفات وترتيب ظهورها داخل المنيو."
        : item.href === "/admin/content"
          ? "تعديل عناوين الموقع ونصوص الأقسام والأزرار."
          : item.href === "/admin/media"
            ? "إدارة صور الواجهة والمعرض وصور المنتجات."
            : item.href === "/admin/appearance"
              ? "اختيار الهوية والألوان وشكل الواجهة."
              : "بيانات المطعم والتواصل وساعات العمل.",
}));

export default function AdminShell({ children }: { children: React.ReactNode }) {
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

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (session === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f6fa] px-4" dir="rtl">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-500 shadow-sm">
          جارٍ تجهيز لوحة التحكم...
        </div>
      </main>
    );
  }

  if (!session) return null;

  const sidebar = (
    <aside className="flex h-full w-[280px] flex-col bg-[#0f172a] text-white">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black tracking-[0.16em] text-rose-300">RESTAURANT CMS</p>
            <h1 className="mt-1 text-xl font-black">De Roma</h1>
            <p className="mt-1 text-xs text-slate-400">لوحة إدارة جديدة من الصفر</p>
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
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                active ? "bg-rose-500 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
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
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-black text-rose-300">
              <Sparkles size={14} /> لوحة الإدارة الجديدة
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">إدارة المطعم والموقع من مكان واحد</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">تم إيقاف محتوى الصفحة القديمة نهائيًا. هذه هي البداية الجديدة لإدارة الأصناف والتصنيفات والمحتوى والصور والمظهر.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 self-start">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-slate-400">حالة اللوحة</span><strong className="mt-2 block text-lg font-black text-emerald-300">نشطة</strong></article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-slate-400">الإصدار</span><strong className="mt-2 block text-lg font-black">CMS جديد</strong></article>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div>
          <span className="text-xs font-black text-rose-500">الإدارة الأساسية</span>
          <h2 className="mt-1 text-2xl font-black">اختر القسم الذي تريد إدارته</h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardCards.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-rose-200 hover:bg-white hover:shadow-lg">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-rose-500 shadow-sm"><Icon size={20} /></span>
                <strong className="mt-4 block text-lg font-black">{item.label}</strong>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-rose-500">فتح القسم <ArrowLeft size={16} /></span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-950" dir="rtl">
      <div className="fixed inset-y-0 right-0 z-40 hidden lg:block">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="إغلاق القائمة" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-y-0 right-0 shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="lg:pr-[280px]">
        <header className="sticky top-0 z-30 flex min-h-[74px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden" aria-label="فتح القائمة">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <p className="text-xs font-black text-rose-500">لوحة إدارة De Roma</p>
              <h2 className="text-lg font-black text-slate-950">إدارة المطعم والموقع</h2>
            </div>
          </div>
          <Link href="/" target="_blank" className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-rose-200 hover:text-rose-600 sm:inline-flex">معاينة الموقع</Link>
        </header>

        <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
          {pathname === "/admin" ? dashboardHome : children}
        </main>
      </div>
    </div>
  );
}
