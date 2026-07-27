"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function ReshaLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isSupabaseConfigured) {
      setMessage("إعدادات Supabase غير موجودة في Vercel");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("بيانات الدخول غير صحيحة");
      setLoading(false);
      return;
    }

    router.replace("/resha");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4" dir="rtl">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <p className="text-sm font-black text-rose-500">RESHA CONTROL</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">تسجيل دخول الإدارة</h1>
        <p className="mt-3 text-sm leading-7 text-slate-500">لوحة إدارة De Roma المرتبطة بـ Supabase.</p>

        <label className="mt-7 block text-sm font-bold text-slate-700">البريد الإلكتروني</label>
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-rose-400" />

        <label className="mt-5 block text-sm font-bold text-slate-700">كلمة المرور</label>
        <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 outline-none focus:border-rose-400" />

        {message && <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{message}</p>}

        <button type="submit" disabled={loading} className="mt-6 h-12 w-full rounded-xl bg-rose-500 font-black text-white disabled:opacity-60">
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>
      </form>
    </main>
  );
}
