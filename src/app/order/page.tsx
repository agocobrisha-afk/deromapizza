"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Minus, Plus, ReceiptText, ShoppingBag, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Product = { id: string; name_ar: string; description_ar: string | null; price: number; image_url: string | null };
type Cart = Record<string, number>;
type Settings = {
  restaurant_name: string | null; deposit_enabled: boolean | null; deposit_type: string | null; deposit_value: number | null;
  bank_name: string | null; bank_account_name: string | null; bank_account_number: string | null; bank_iban: string | null;
  allow_cash_on_delivery: boolean | null; allow_bank_transfer: boolean | null;
};

export default function OrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [cart, setCart] = useState<Cart>({});
  const [payment, setPayment] = useState("cash");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", orderType: "delivery", address: "", notes: "", reference: "" });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ order_id: string; total: number; deposit_required: number } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      supabase.from("products").select("id,name_ar,description_ar,price,image_url").eq("is_visible", true).eq("is_available", true).order("sort_order"),
      supabase.from("site_settings").select("restaurant_name,deposit_enabled,deposit_type,deposit_value,bank_name,bank_account_name,bank_account_number,bank_iban,allow_cash_on_delivery,allow_bank_transfer").eq("id", 1).maybeSingle(),
    ]).then(([p, s]) => { setProducts((p.data ?? []) as Product[]); setSettings(s.data as Settings | null); });
  }, []);

  const selected = useMemo(() => products.filter((p) => (cart[p.id] ?? 0) > 0), [products, cart]);
  const subtotal = useMemo(() => selected.reduce((sum, p) => sum + p.price * (cart[p.id] ?? 0), 0), [selected, cart]);
  const deposit = useMemo(() => {
    if (!settings?.deposit_enabled) return 0;
    const value = Number(settings.deposit_value ?? 0);
    return settings.deposit_type === "percent" ? Math.round(subtotal * value) / 100 : Math.min(subtotal, value);
  }, [settings, subtotal]);

  const changeQty = (id: string, delta: number) => setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + delta) }));

  async function submit() {
    setError("");
    if (!selected.length) return setError("اختر صنفًا واحدًا على الأقل");
    if (!form.name.trim() || !form.phone.trim()) return setError("أدخل الاسم ورقم الهاتف");
    if (form.orderType === "delivery" && !form.address.trim()) return setError("أدخل عنوان التوصيل");
    if (payment === "bank_transfer" && !receipt && !form.reference.trim()) return setError("أرفق إيصال التحويل أو اكتب رقم العملية");

    setSending(true);
    let receiptPath = "";
    if (receipt) {
      const ext = receipt.name.split(".").pop() || "jpg";
      receiptPath = `receipts/${crypto.randomUUID()}.${ext}`;
      const upload = await supabase.storage.from("payment-receipts").upload(receiptPath, receipt, { upsert: false });
      if (upload.error) { setSending(false); return setError("تعذر رفع إيصال التحويل"); }
    }

    const { data, error: rpcError } = await supabase.rpc("create_order_v2", {
      p_customer_name: form.name,
      p_phone: form.phone,
      p_customer_email: form.email,
      p_order_type: form.orderType,
      p_address: form.address,
      p_notes: form.notes,
      p_delivery_fee: 0,
      p_payment_method: payment,
      p_transfer_reference: form.reference,
      p_receipt_path: receiptPath,
      p_items: selected.map((p) => ({ product_id: p.id, quantity: cart[p.id], options: [] })),
    });
    setSending(false);
    if (rpcError) return setError("تعذر إرسال الطلب، راجع البيانات وحاول مرة أخرى");
    setResult(data as { order_id: string; total: number; deposit_required: number });
    setCart({});
  }

  if (result) return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-4" dir="rtl">
      <section className="w-full max-w-xl rounded-[32px] bg-white p-8 text-center shadow-xl">
        <CheckCircle2 className="mx-auto text-emerald-500" size={58} />
        <h1 className="mt-5 text-3xl font-black">تم استلام طلبك</h1>
        <p className="mt-3 text-slate-500">رقم الطلب: #{result.order_id.slice(0, 8)}</p>
        <div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-slate-50 p-4"><span className="text-sm text-slate-500">الإجمالي</span><strong className="mt-2 block text-2xl">{result.total} د.ل</strong></div><div className="rounded-2xl bg-rose-50 p-4"><span className="text-sm text-rose-600">العربون المطلوب</span><strong className="mt-2 block text-2xl text-rose-600">{result.deposit_required} د.ل</strong></div></div>
        <p className="mt-5 text-sm leading-7 text-slate-500">سيقوم المطعم بمراجعة الطلب والتحويل ثم التواصل معك لتأكيده.</p>
        <Link href="/" className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-black text-white">العودة للموقع</Link>
      </section>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#f5f6fa] p-4 sm:p-8" dir="rtl">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-[30px] bg-slate-950 p-7 text-white"><p className="text-xs font-black text-rose-300">SMART CHECKOUT</p><h1 className="mt-2 text-3xl font-black">اطلب من {settings?.restaurant_name || "المطعم"}</h1><p className="mt-3 text-slate-300">اختر طلبك، أدخل بياناتك، وادفع العربون لتحويل الطلب إلى طلب جدي.</p></header>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map((p) => <article key={p.id} className="overflow-hidden rounded-3xl border bg-white shadow-sm"><div className="aspect-[4/3] bg-slate-100 bg-cover bg-center" style={{ backgroundImage: p.image_url ? `url(${p.image_url})` : undefined }} /><div className="p-4"><h2 className="font-black">{p.name_ar}</h2><p className="mt-2 line-clamp-2 text-sm text-slate-500">{p.description_ar || "صنف طازج من المنيو"}</p><div className="mt-4 flex items-center justify-between"><strong className="text-rose-500">{p.price} د.ل</strong><div className="flex items-center gap-2"><button onClick={() => changeQty(p.id, -1)} className="grid h-9 w-9 place-items-center rounded-xl border"><Minus size={15} /></button><span className="w-6 text-center font-black">{cart[p.id] ?? 0}</span><button onClick={() => changeQty(p.id, 1)} className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500 text-white"><Plus size={15} /></button></div></div></div></article>)}</section>
          <aside className="h-fit rounded-[30px] border bg-white p-5 shadow-sm xl:sticky xl:top-5">
            <div className="flex items-center gap-2"><ShoppingBag className="text-rose-500" /><h2 className="text-xl font-black">ملخص الطلب</h2></div>
            <div className="mt-4 space-y-2">{selected.map((p) => <div key={p.id} className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm"><span>{p.name_ar} × {cart[p.id]}</span><strong>{p.price * cart[p.id]} د.ل</strong></div>)}</div>
            <div className="mt-4 border-t pt-4"><div className="flex justify-between"><span>الإجمالي</span><strong className="text-xl">{subtotal} د.ل</strong></div><div className="mt-2 flex justify-between text-rose-600"><span>العربون المطلوب</span><strong>{deposit} د.ل</strong></div><p className="mt-2 text-xs leading-6 text-slate-500">المتبقي يُدفع كاش عند الاستلام بعد اعتماد التحويل.</p></div>
            <div className="mt-5 grid gap-3"><input placeholder="الاسم الكامل" className="h-12 rounded-xl border px-4" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input placeholder="رقم الهاتف" className="h-12 rounded-xl border px-4" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /><input placeholder="البريد الإلكتروني اختياري" className="h-12 rounded-xl border px-4" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><select className="h-12 rounded-xl border px-4" value={form.orderType} onChange={(e) => setForm({ ...form, orderType: e.target.value })}><option value="delivery">توصيل</option><option value="pickup">استلام من المطعم</option></select>{form.orderType === "delivery" && <textarea placeholder="عنوان التوصيل بالتفصيل" className="min-h-24 rounded-xl border p-4" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />}</div>
            <div className="mt-5 grid gap-2"><button onClick={() => setPayment("cash")} className={`rounded-xl border p-4 text-right ${payment === "cash" ? "border-rose-500 bg-rose-50" : ""}`}><strong>عربون + الباقي كاش عند الاستلام</strong><p className="mt-1 text-xs text-slate-500">يدفع الزبون العربون مقدمًا ثم يسدد الباقي عند الاستلام.</p></button><button onClick={() => setPayment("bank_transfer")} className={`rounded-xl border p-4 text-right ${payment === "bank_transfer" ? "border-rose-500 bg-rose-50" : ""}`}><strong>تحويل مصرفي</strong><p className="mt-1 text-xs text-slate-500">يُراجع التحويل يدويًا قبل اعتماد الطلب.</p></button></div>
            {payment === "bank_transfer" && <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm"><ReceiptText className="mb-2 text-rose-500" /><p><b>المصرف:</b> {settings?.bank_name || "يحدد من لوحة التحكم"}</p><p><b>اسم الحساب:</b> {settings?.bank_account_name || "غير محدد"}</p><p><b>رقم الحساب:</b> {settings?.bank_account_number || "غير محدد"}</p><input placeholder="رقم عملية التحويل" className="mt-3 h-11 w-full rounded-xl border bg-white px-3" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} /><label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed bg-white p-3"><Upload size={17} /> إرفاق صورة الإيصال<input type="file" accept="image/*" className="hidden" onChange={(e) => setReceipt(e.target.files?.[0] ?? null)} /></label>{receipt && <p className="mt-2 text-xs text-emerald-600">تم اختيار: {receipt.name}</p>}</div>}
            <textarea placeholder="ملاحظات إضافية" className="mt-4 min-h-20 w-full rounded-xl border p-3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            {error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}
            <button onClick={() => void submit()} disabled={sending} className="mt-4 h-13 w-full rounded-xl bg-rose-500 font-black text-white disabled:opacity-60">{sending ? "جارٍ إرسال الطلب..." : "تأكيد وإرسال الطلب"}</button>
          </aside>
        </div>
      </div>
    </main>
  );
}
