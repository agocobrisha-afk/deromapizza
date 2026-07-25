"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function AdminShell({ children: _children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | "loading">("loading");

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

  return (
    <main className="min-h-screen bg-[#f4f6fa] text-slate-950" dir="rtl">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[76px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500 text-sm font-black text-white shadow-lg shadow-rose-200">
              DR
            </span>
            <div>
              <p className="text-xs font-black tracking-[0.16em] text-rose-500">RESTAURANT CMS</p>
              <h1 className="mt-1 text-lg font-black">لوحة إدارة De Roma</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 hover:border-rose-200 hover:text-rose-600"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">معاينة الموقع</span>
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-black text-white hover:bg-slate-800"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-76px)] max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-3xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <div className="bg-slate-950 px-7 py-8 text-white sm:px-10 sm:py-10">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500 shadow-lg shadow-rose-950/30">
              <ShieldCheck size={28} />
            </span>
            <p className="mt-6 text-xs font-black tracking-[0.18em] text-rose-300">CLEAN REBUILD</p>
            <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">لوحة التحكم أصبحت فارغة ونظيفة</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              تم إيقاف جميع القوائم والأقسام والروابط القديمة نهائيًا من واجهة الإدارة. لن يظهر أي خيار قديم أو رابط يؤدي إلى صفحة غير موجودة.
            </p>
          </div>

          <div className="grid gap-4 p-7 sm:grid-cols-3 sm:p-10">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <span className="text-xs font-black text-slate-400">الحالة</span>
              <strong className="mt-2 block text-lg font-black text-emerald-600">نظيفة</strong>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <span className="text-xs font-black text-slate-400">الأقسام القديمة</span>
              <strong className="mt-2 block text-lg font-black">موقوفة</strong>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <span className="text-xs font-black text-slate-400">المرحلة الحالية</span>
              <strong className="mt-2 block text-lg font-black text-rose-500">إعادة بناء</strong>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
