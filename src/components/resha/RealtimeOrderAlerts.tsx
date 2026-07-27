"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellRing, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AlertOrder = { id: string; customer_name: string; total: number; payment_method: string | null };

export default function RealtimeOrderAlerts() {
  const [order, setOrder] = useState<AlertOrder | null>(null);

  useEffect(() => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      void Notification.requestPermission();
    }

    const channel = supabase
      .channel("resha-new-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        const next = payload.new as AlertOrder;
        setOrder(next);
        try {
          const audio = new Audio("data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAgICA////gICA////gICA");
          void audio.play();
        } catch {}
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("طلب جديد وصل للمطعم", { body: `${next.customer_name} — ${next.total} د.ل` });
        }
      })
      .subscribe();

    return () => { void supabase.removeChannel(channel); };
  }, []);

  if (!order) return null;

  return (
    <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-slate-950 p-4 text-white shadow-2xl" dir="rtl">
      <button onClick={() => setOrder(null)} className="absolute left-3 top-3 text-slate-400"><X size={18} /></button>
      <div className="flex gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-500"><BellRing size={20} /></span><div><strong className="block">طلب جديد وصل الآن</strong><p className="mt-1 text-sm text-slate-300">{order.customer_name} — {order.total} د.ل</p><Link href="/resha/orders" className="mt-3 inline-flex text-sm font-black text-rose-300">فتح الطلبات</Link></div></div>
    </div>
  );
}
