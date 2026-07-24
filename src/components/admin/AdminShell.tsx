"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function AdminShell({ children }: { children: React.ReactNode }) {
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

  if (session === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7]" dir="rtl">
        <div className="rounded-2xl border border-black/5 bg-white px-6 py-4 text-sm text-slate-500 shadow-sm">
          جارٍ تجهيز لوحة التحكم...
        </div>
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
