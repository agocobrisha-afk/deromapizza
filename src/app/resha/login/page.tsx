"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, Pizza } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ReshaLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }

    const { data: allowed } = await supabase.rpc("is_admin");
    if (!allowed) {
      await supabase.auth.signOut();
      setError("هذا الحساب لا يملك صلاحية إدارة المطعم");
      setLoading(false);
      return;
    }

    router.replace("/resha");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#07111f] px-4 py-10" dir="rtl">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[34px] bg-white shadow-2xl lg:grid-cols-[1.05fr_.95fr]">
        <div className="hidden bg-gradient-to-br from-rose-600 via-rose-500 to-orange-400 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20"><Pizza /></span><strong className="text-2xl">De Roma</strong></div>
          <div><p className="text-sm font-black tracking-[.2em] text-white/70">RESHA CONTROL</p><h1 className="mt-4 text-5xl font-black leading-tight">لوحة جديدة بالكامل لإدارة المطعم</h1><p className="mt-5 max-w-md leading-8 text-white/80">إدارة الأصناف والطلبات والمحتوى والتقييمات من رابط خاص وآمن.</p></div>
          <p className="text-sm text-white/70">المسار الإداري الجديد: /resha</p>
        </div>

        <form onSubmit={submit} className="p-7 sm:p-12">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-50 text-rose-500"><LockKeyhole /></span>
          <h2 className="mt-6 text-3xl font-black text-slate-950">تسجيل دخول الإدارة</h2>
          <p className="mt-3 text-sm leading-7 text-slate-500">استخدم حساب المشرف المسجل في Supabase.</p>

          <label className="mt-8 block text-sm font-bold text-slate-700">البريد الإلكتروني</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-rose-400" />

          <label className="mt-5 block text-sm font-bold text-slate-700">كلمة المرور</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 min-h-13 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-rose-400" />

          {error && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p>}

          <button disabled={loading} className="mt-7 flex min-h-13 w-full items-center justify-center rounded-2xl bg-rose-500 font-black text-white shadow-lg shadow-rose-200 disabled:opacity-60">{loading ? "جارٍ التحقق..." : "دخول لوحة Resha"}</button>
          <Link href="/" className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft size={16} /> العودة للموقع</Link>
        </form>
      </section>
    </main>
  );
}
