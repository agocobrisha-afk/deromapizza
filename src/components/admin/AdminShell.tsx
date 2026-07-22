"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
  FileText,
  Star,
  UtensilsCrossed,
  Palette,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

const navItems = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/theme", label: "الثيمات", icon: Palette },
  { href: "/admin/settings", label: "إعدادات الموقع", icon: Settings },
  { href: "/admin/menu", label: "المنيو", icon: UtensilsCrossed },
  { href: "/admin/pages", label: "الصفحات", icon: FileText },
  { href: "/admin/reviews", label: "التقييمات", icon: Star },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null | "loading">(
    "loading"
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) router.replace("/admin/login");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) router.replace("/admin/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  if (session === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-ink-soft">جارٍ التحميل...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div
      className="flex min-h-screen bg-cream"
      dir="rtl"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <aside className="hidden w-60 shrink-0 flex-col border-l border-line bg-white p-4 sm:flex">
        <p
          className="mb-6 px-2 text-lg font-extrabold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          De Roma
        </p>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-red-tint text-red-dark"
                    : "text-ink-soft hover:bg-cream"
                }`}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-soft hover:bg-cream"
        >
          <LogOut size={17} />
          تسجيل الخروج
        </button>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-line bg-white px-5 py-3.5 sm:hidden">
          <p
            className="font-extrabold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            De Roma
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm font-semibold text-ink-soft"
          >
            خروج
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-line bg-white px-3 py-2 sm:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                pathname === item.href
                  ? "bg-red text-white"
                  : "bg-cream text-ink-soft"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
