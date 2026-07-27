"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminShell({ children: _children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    router.replace("/resha");
  }, [router]);

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 text-white" dir="rtl">
      <p className="font-bold">جارٍ الانتقال إلى لوحة Resha الجديدة...</p>
    </main>
  );
}
