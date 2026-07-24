"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tags,
  Image,
  FileText,
  Palette,
  Type,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

const navGroups = [
  {
    label: "الإدارة اليومية",
    items: [
      { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
      { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
      { href: "/admin/menu", label: "الأصناف", icon: UtensilsCrossed },
      { href: "/admin/categories", label: "التصنيفات", icon: Tags },
    ],
  },
  {
    label: "محتوى الموقع",
    items: [
      { href: "/admin/content", label: "النصوص والصفحات", icon: FileText },
      { href: "/admin/media", label: "الصور والمعرض", icon: Image },
      { href: "/admin/reviews", label: "التقييمات", icon: Star },
    ],
  },
  {
    label: "التصميم والإعدادات",
    items: [
      { href: "/admin/appearance", label: "القوالب والمظهر", icon: Palette },
      { href: "/admin/typography", label: "الخطوط والأحجام", icon: Type },
      { href: "/admin/settings", label: "بيانات المطعم", icon: Settings },
    ],
  },
];

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

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) router.replace("/admin/login");
    });

    return () => sub.subscription.unsubscribe();
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
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb]" dir="rtl">
        <div className="rounded-2xl border border-black/5 bg-white px-6 py-4 text-sm text-slate-500 shadow-sm">
          جارٍ تجهيز لوحة التحكم...
        </div>
      </div>
    );
  }

  if (!session) return null;

  const sidebar = (
    <aside className="flex h-full w-[290px] flex-col border-l border-slate-200 bg-[#111827] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-300">
              Restaurant CMS
            </span>
            <h1 className="mt-1 text-xl font-black">De Roma</h1>
            <p className="mt-1 text-xs text-slate-400">إدارة المطعم والموقع من مكان واحد</p>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500 text-sm font-black shadow-lg shadow-rose-950/30">
            DR
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-5">
        {navGroups.map((group) => (
          <section key={group.label}>
            <p className="mb-2 px-3 text-[11px] font-bold text-slate-500">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all ${
                      active
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-950/25"
                        : "text-slate-300 hover:bg-white/8 hover:text-white"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={17} />
          معاينة الموقع
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <LogOut size={17} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f6f7fb]" dir="rtl">
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

      <div className="lg:pr-[290px]">
        <header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
              aria-label="فتح القائمة"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <p className="text-xs font-bold text-rose-500">لوحة إدارة De Roma</p>
              <h2 className="text-lg font-black text-slate-900">تحكم كامل بالمطعم والموقع</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-rose-200 hover:text-rose-600 sm:inline-flex"
            >
              معاينة الموقع
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
