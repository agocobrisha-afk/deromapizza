"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError("بيانات الدخول غير صحيحة");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-dark px-5"
      style={{ fontFamily: "var(--font-body)" }}
      dir="rtl"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-7"
      >
        <div className="mb-5 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red text-white">
            <Flame size={20} />
          </span>
          <span
            className="text-lg font-extrabold"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            لوحة تحكم De Roma
          </span>
        </div>

        <label className="mb-1.5 block text-sm font-semibold text-ink-soft">
          البريد الإلكتروني
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-red"
        />

        <label className="mb-1.5 block text-sm font-semibold text-ink-soft">
          كلمة المرور
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-5 w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-red"
        />

        {error && (
          <p className="mb-4 text-center text-sm text-red-dark">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-red py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "جارٍ الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
