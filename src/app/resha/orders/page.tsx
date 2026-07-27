"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, CreditCard, FileImage, RefreshCw, ShoppingBag, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string; customer_name: string; phone: string; customer_email: string | null; order_type: string;
  address: string | null; status: string | null; total: number; deposit_required: number; paid_amount: number;
  balance_due: number; payment_method: string | null; payment_status: string; transfer_reference: string | null;
  receipt_path: string | null; created_at: string | null;
};

const paymentLabels: Record<string, string> = {
  unpaid: "غير مدفوع", pending_verification: "بانتظار المراجعة", deposit_paid: "العربون مدفوع", paid: "مدفوع بالكامل", rejected: "مرفوض",
};
const orderLabels: Record<string, string> = {
  pending_payment: "بانتظار الدفع", pending: "جديد", preparing: "قيد التحضير", ready: "جاهز", delivery: "خرج للتوصيل", delivered: "تم التسليم", cancelled: "ملغي",
};

export default function ReshaOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("orders").select("id,customer_name,phone,customer_email,order_type,address,status,total,deposit_required,paid_amount,balance_due,payment_method,payment_status,transfer_reference,receipt_path,created_at").order("created_at", { ascending: false }).limit(200);
    setLoading(false);
    if (error) return setMessage("تعذر تحميل الطلبات");
    setOrders((data ?? []) as Order[]);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function verify(order: Order, accepted: boolean) {
    const paid = accepted ? Number(order.deposit_required || 0) : 0;
    const { error } = await supabase.from("orders").update({
      payment_status: accepted ? "deposit_paid" : "rejected",
      paid_amount: paid,
      balance_due: Math.max(0, Number(order.total) - paid),
      status: accepted ? "pending" : "pending_payment",
      payment_verified_at: accepted ? new Date().toISOString() : null,
    }).eq("id", order.id);
    if (error) return setMessage("تعذر تحديث حالة الدفع");
    setMessage(accepted ? "تم اعتماد العربون والطلب" : "تم رفض إثبات الدفع");
    void load();
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) setOrders((current) => current.map((o) => o.id === id ? { ...o, status } : o));
  }

  async function openReceipt(order: Order) {
    if (!order.receipt_path) return;
    const { data, error } = await supabase.storage.from("payment-receipts").createSignedUrl(order.receipt_path, 120);
    if (error || !data) return setMessage("تعذر فتح الإيصال");
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-[#f4f6fb] p-4 sm:p-8" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 rounded-[30px] bg-slate-950 p-7 text-white sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-xs font-black text-rose-300">PAYMENT & ORDER CENTER</p><h1 className="mt-2 text-3xl font-black">الطلبات والمدفوعات</h1><p className="mt-3 text-slate-300">راجع العربون وإثبات التحويل ثم اعتمد الطلب وابدأ التحضير.</p></div>
          <div className="flex gap-2"><button onClick={() => void load()} className="grid h-11 w-11 place-items-center rounded-xl border border-white/15"><RefreshCw size={18} /></button><Link href="/resha" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-3 font-bold"><ArrowRight size={17} /> لوحة Resha</Link></div>
        </header>

        {message && <p className="mt-4 rounded-2xl bg-white p-4 font-bold shadow-sm">{message}</p>}
        {loading ? <div className="mt-8 flex justify-center"><RefreshCw className="animate-spin" /></div> : (
          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            {orders.map((o) => (
              <article key={o.id} className="rounded-[26px] border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><ShoppingBag size={18} className="text-rose-500" /><strong>#{o.id.slice(0, 8)}</strong></div><h2 className="mt-3 text-xl font-black">{o.customer_name}</h2><p className="text-sm text-slate-500">{o.phone}{o.customer_email ? ` · ${o.customer_email}` : ""}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black">{o.created_at ? new Date(o.created_at).toLocaleString("ar-LY") : ""}</span></div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4"><Box label="الإجمالي" value={`${o.total} د.ل`} /><Box label="العربون" value={`${o.deposit_required} د.ل`} /><Box label="المدفوع" value={`${o.paid_amount} د.ل`} /><Box label="المتبقي" value={`${o.balance_due} د.ل`} /></div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-slate-500">طريقة الدفع</p><strong className="mt-1 block">{o.payment_method === "bank_transfer" ? "تحويل مصرفي" : "عربون ثم كاش عند الاستلام"}</strong></div><span className={`rounded-full px-3 py-1 text-xs font-black ${o.payment_status === "deposit_paid" || o.payment_status === "paid" ? "bg-emerald-100 text-emerald-700" : o.payment_status === "rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{paymentLabels[o.payment_status] || o.payment_status}</span></div>{o.transfer_reference && <p className="mt-3 text-sm"><b>رقم العملية:</b> {o.transfer_reference}</p>}{o.receipt_path && <button onClick={() => void openReceipt(o)} className="mt-3 inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-bold"><FileImage size={16} /> فتح إيصال التحويل</button>}</div>
                {o.address && <p className="mt-4 rounded-xl border p-3 text-sm"><b>العنوان:</b> {o.address}</p>}
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]"><select value={o.status ?? "pending_payment"} onChange={(e) => void updateStatus(o.id, e.target.value)} className="h-11 rounded-xl border px-3">{Object.entries(orderLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><div className="flex gap-2"><button onClick={() => void verify(o, true)} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 font-black text-white"><CheckCircle2 size={17} /> اعتماد</button><button onClick={() => void verify(o, false)} className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 font-black text-rose-700"><XCircle size={17} /> رفض</button></div></div>
              </article>
            ))}
            {orders.length === 0 && <div className="rounded-3xl bg-white p-12 text-center lg:col-span-2"><Clock3 className="mx-auto text-slate-400" size={38} /><h2 className="mt-4 text-xl font-black">لا توجد طلبات حتى الآن</h2></div>}
          </section>
        )}
      </div>
    </main>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border p-3"><span className="text-xs text-slate-500">{label}</span><strong className="mt-1 block">{value}</strong></div>;
}
