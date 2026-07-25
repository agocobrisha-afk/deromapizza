"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={16} />
          معاينة الموقع
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-950" dir="rtl">
      <div className="fixed inset-y-0 right-0 z-40 hidden lg:block">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="إغلاق القائمة"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute inset-y-0 right-0 shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="lg:pr-[280px]">
        <header className="sticky top-0 z-30 flex min-h-[74px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
              aria-label="فتح القائمة"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <p className="text-xs font-black text-rose-500">لوحة إدارة De Roma</p>
              <h2 className="text-lg font-black text-slate-950">إدارة المطعم والموقع</h2>
            </div>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-rose-200 hover:text-rose-600 sm:inline-flex"
          >
            معاينة الموقع
          </Link>
        </header>

        <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
