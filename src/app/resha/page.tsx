"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function ReshaDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ products: 0, categories: 0, orders: 0 });
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      if (!isSupabaseConfigured) {
        if (active) {
          setMessage("إعدادات Supabase غير موجودة في Vercel");
          setLoading(false);
        }
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/resha/login");
        return;
      }

      const [products, categories, orders] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id", { count: "exact", head: true }),
      ]);

      if (active) {
        setCounts({
          products: products.count ?? 0,
          categories: categories.count ?? 0,
          orders: orders.count ?? 0,
        });
        setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [router]);

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/resha/login");
  }

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-slate-100" dir="rtl"><p className="rounded-2xl bg-white px-6 py-4 font-bold shadow">جارٍ تحميل لوحة Resha...</p></main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8" dir="rtl">
      <section className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 rounded-3xl bg-slate-950 p-7 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-rose-300">RESHA CONTROL</p>
            <h1 className="mt-2 text-3xl font-black">لوحة إدارة De Roma</h1>
            <p className="mt-3 text-slate-300">لوحة جديدة مستقلة مرتبطة بـ Supabase.</p>
          </div>
          <button type="button" onClick={signOut} className="rounded-xl border border-white/20 px-5 py-3 font-bold">تسجيل الخروج</button>
        </div>

        {message && <p className="mt-5 rounded-2xl bg-amber-50 p-4 font-bold text-amber-800">{message}</p>}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-slate-500">الأصناف</span><strong className="mt-3 block text-4xl">{counts.products}</strong></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-slate-500">التصنيفات</span><strong className="mt-3 block text-4xl">{counts.categories}</strong></article>
          <article className="rounded-2xl bg-white p-6 shadow-sm"><span className="text-slate-500">الطلبات</span><strong className="mt-3 block text-4xl">{counts.orders}</strong></article>
        </div>
      </section>
    </main>
  );
}
