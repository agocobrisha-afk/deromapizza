"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronLeft,
  CircleDollarSign,
  ExternalLink,
  Eye,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageOpen,
  Palette,
  Pizza,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Tags,
  Truck,
  Users,
  X,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Section = "overview" | "products" | "categories" | "orders" | "reviews" | "appearance" | "settings";
type Product = { id: string; name_ar: string; price: number; category_id: string | null; is_available: boolean | null; is_featured: boolean | null; is_visible: boolean };
type Category = { id: string; name_ar: string; is_visible: boolean; sort_order: number | null };
type Order = { id: string; customer_name: string; phone: string; total: number; status: string | null; created_at: string | null };
type Review = { id: string; customer_name: string; rating: number; comment: string | null; is_approved: boolean | null };
type SettingsRow = { id: number; restaurant_name: string | null; tagline: string | null; phone: string | null; whatsapp: string | null; address: string | null; hours: string | null; primary_color?: string | null; secondary_color?: string | null };

const navigation = [
  ["overview", "نظرة عامة", LayoutDashboard],
  ["orders", "الطلبات", ShoppingBag],
  ["products", "الأصناف", PackageOpen],
  ["categories", "التصنيفات", Tags],
  ["reviews", "التقييمات", Star],
  ["appearance", "الهوية والمظهر", Palette],
  ["settings", "إعدادات المطعم", Settings],
] as const;

const statusLabel: Record<string, string> = {
  pending: "جديد",
  preparing: "قيد التحضير",
  ready: "جاهز",
  delivery: "خرج للتوصيل",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export default function ReshaDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SettingsRow>({ id: 1, restaurant_name: "De Roma", tagline: "", phone: "", whatsapp: "", address: "", hours: "" });

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      flash("إعدادات Supabase غير مكتملة");
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.replace("/resha/login");
      return;
    }

    const { data: allowed } = await supabase.rpc("is_admin");
    if (!allowed) {
      await supabase.auth.signOut();
      router.replace("/resha/login");
      return;
    }

    const [p, c, o, r, s] = await Promise.all([
      supabase.from("products").select("id,name_ar,price,category_id,is_available,is_featured,is_visible").order("sort_order"),
      supabase.from("categories").select("id,name_ar,is_visible,sort_order").order("sort_order"),
      supabase.from("orders").select("id,customer_name,phone,total,status,created_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("reviews").select("id,customer_name,rating,comment,is_approved").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("id,restaurant_name,tagline,phone,whatsapp,address,hours,primary_color,secondary_color").eq("id", 1).maybeSingle(),
    ]);

    setProducts((p.data ?? []) as Product[]);
    setCategories((c.data ?? []) as Category[]);
    setOrders((o.data ?? []) as Order[]);
    setReviews((r.data ?? []) as Review[]);
    if (s.data) setSettings(s.data as SettingsRow);
    setLoading(false);
  }, [router]);

  useEffect(() => { void loadData(); }, [loadData]);

  const filteredProducts = useMemo(
    () => products.filter((item) => item.name_ar.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );

  const revenue = useMemo(() => orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + Number(o.total || 0), 0), [orders]);
  const activeOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.status ?? "pending")).length;
  const approvedReviews = reviews.filter((r) => r.is_approved).length;

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/resha/login");
  }

  async function updateOrder(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) setOrders((current) => current.map((o) => o.id === id ? { ...o, status } : o));
    flash(error ? "تعذر تحديث الطلب" : "تم تحديث حالة الطلب");
  }

  async function saveProduct(item: Product) {
    const { error } = await supabase.from("products").update(item).eq("id", item.id);
    flash(error ? "تعذر حفظ الصنف" : "تم حفظ الصنف");
  }

  async function saveCategory(item: Category) {
    const { error } = await supabase.from("categories").update(item).eq("id", item.id);
    flash(error ? "تعذر حفظ التصنيف" : "تم حفظ التصنيف");
  }

  async function toggleReview(item: Review) {
    const next = !item.is_approved;
    const { error } = await supabase.from("reviews").update({ is_approved: next }).eq("id", item.id);
    if (!error) setReviews((current) => current.map((r) => r.id === item.id ? { ...r, is_approved: next } : r));
    flash(error ? "تعذر تحديث التقييم" : "تم تحديث التقييم");
  }

  async function saveSettings() {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ ...settings, id: 1 });
    setSaving(false);
    flash(error ? "تعذر حفظ الإعدادات" : "تم حفظ إعدادات المطعم");
  }

  const field = "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100";

  const Sidebar = () => (
    <aside className="flex h-full w-[286px] flex-col bg-[#07111f] text-white">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 shadow-lg"><Pizza /></span>
          <div><p className="text-[10px] font-black tracking-[.22em] text-rose-300">RESHA RESTAURANT OS</p><h1 className="text-xl font-black">{settings.restaurant_name || "المطعم"}</h1></div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map(([id, label, Icon]) => (
          <button key={id} onClick={() => { setSection(id); setMobileOpen(false); }} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition ${section === id ? "bg-rose-500 text-white shadow-lg shadow-rose-950/30" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
            <span className="flex items-center gap-3"><Icon size={18} />{label}</span><ChevronLeft size={15} className="opacity-50" />
          </button>
        ))}
      </nav>
      <div className="space-y-2 border-t border-white/10 p-4">
        <Link href="/" target="_blank" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"><ExternalLink size={16} /> معاينة الموقع</Link>
        <button onClick={signOut} className="flex w-full items-center justify-center gap-2 py-3 text-sm font-bold text-slate-400 hover:text-white"><LogOut size={16} /> تسجيل الخروج</button>
      </div>
    </aside>
  );

  if (loading) return <main className="grid min-h-screen place-items-center bg-slate-100" dir="rtl"><div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold shadow"><RefreshCw className="animate-spin" size={18} /> جارٍ تشغيل نظام المطعم...</div></main>;

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-950" dir="rtl">
      <div className="fixed inset-y-0 right-0 z-40 hidden lg:block"><Sidebar /></div>
      {mobileOpen && <div className="fixed inset-0 z-50 bg-black/50 lg:hidden"><div className="absolute inset-y-0 right-0"><Sidebar /></div><button onClick={() => setMobileOpen(false)} className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white"><X /></button></div>}

      <main className="lg:mr-[286px]">
        <header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="grid h-11 w-11 place-items-center rounded-xl border lg:hidden"><Menu /></button><div><p className="text-xs font-black text-rose-500">نظام إدارة المطعم</p><h2 className="text-lg font-black">{navigation.find(([id]) => id === section)?.[1]}</h2></div></div>
          <div className="flex items-center gap-2"><button className="relative grid h-11 w-11 place-items-center rounded-xl border bg-white"><Bell size={18} /><span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-rose-500" /></button><button onClick={() => void loadData()} className="grid h-11 w-11 place-items-center rounded-xl border bg-white"><RefreshCw size={18} /></button></div>
        </header>

        <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-7">
          {section === "overview" && <>
            <section className="overflow-hidden rounded-[30px] bg-gradient-to-l from-[#07111f] via-slate-900 to-slate-800 p-7 text-white shadow-xl sm:p-10">
              <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between"><div><span className="inline-flex rounded-full bg-rose-500/15 px-3 py-1 text-xs font-black text-rose-300">RESTAURANT BUSINESS CENTER</span><h1 className="mt-4 text-3xl font-black sm:text-5xl">كل مطعمك في شاشة واحدة</h1><p className="mt-4 max-w-2xl leading-8 text-slate-300">تابع الطلبات والمبيعات والأصناف والسمعة الرقمية، وغيّر شكل الموقع بدون لمس الكود.</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-slate-400">حالة المتجر</span><strong className="mt-2 flex items-center gap-2 text-emerald-300"><CheckCircle2 size={17} /> يعمل الآن</strong></div><div className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-slate-400">طلبات نشطة</span><strong className="mt-2 block text-2xl">{activeOrders}</strong></div></div></div>
            </section>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[["إجمالي المبيعات", `${revenue.toFixed(2)} د.ل`, CircleDollarSign], ["الطلبات", orders.length, ShoppingBag], ["الأصناف", products.length, PackageOpen], ["التقييمات المنشورة", approvedReviews, Star]].map(([label, value, Icon]) => <article key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-slate-500">{label}</span><span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-500"><Icon size={19} /></span></div><strong className="mt-4 block text-3xl font-black">{value}</strong></article>)}
            </section>
            <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]"><div className="rounded-[26px] border bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="text-xl font-black">أحدث الطلبات</h3><p className="text-sm text-slate-500">آخر حركة داخل المطعم</p></div><BarChart3 className="text-rose-500" /></div><div className="mt-5 space-y-3">{orders.slice(0, 5).map((o) => <div key={o.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"><div><strong>{o.customer_name}</strong><p className="text-xs text-slate-500">#{o.id.slice(0, 8)} · {statusLabel[o.status ?? "pending"]}</p></div><strong className="text-rose-500">{o.total} د.ل</strong></div>)}</div></div><div className="rounded-[26px] border bg-white p-5 shadow-sm"><h3 className="text-xl font-black">أدوات سريعة</h3><div className="mt-5 grid gap-3">{[["إدارة الطلبات", "orders", ShoppingBag], ["تحديث المنيو", "products", Pizza], ["تخصيص الهوية", "appearance", Palette]].map(([label, id, Icon]) => <button key={String(id)} onClick={() => setSection(id as Section)} className="flex items-center justify-between rounded-2xl border p-4 text-right hover:border-rose-200 hover:bg-rose-50"><span className="flex items-center gap-3 font-bold"><Icon size={18} className="text-rose-500" />{label}</span><ChevronLeft size={16} /></button>)}</div></div></section>
          </>}

          {section === "orders" && <section><div className="mb-5"><h2 className="text-2xl font-black">إدارة الطلبات</h2><p className="text-sm text-slate-500">متابعة الطلب من الاستلام حتى التسليم.</p></div><div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{orders.map((o) => <article key={o.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex justify-between"><strong>#{o.id.slice(0, 8)}</strong><span className="text-xs text-slate-400">{o.created_at ? new Date(o.created_at).toLocaleString("ar-LY") : ""}</span></div><h3 className="mt-4 text-lg font-black">{o.customer_name}</h3><p className="text-sm text-slate-500">{o.phone}</p><strong className="mt-3 block text-2xl text-rose-500">{o.total} د.ل</strong><select value={o.status ?? "pending"} onChange={(e) => void updateOrder(o.id, e.target.value)} className={`${field} mt-4`}>{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></article>)}</div></section>}

          {section === "products" && <section className="rounded-[28px] border bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black">الأصناف والمنيو</h2><p className="text-sm text-slate-500">تعديل الأسعار والتوفر والتصنيف.</p></div><div className="relative"><Search className="absolute right-3 top-3 text-slate-400" size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن صنف" className={`${field} pr-10`} /></div></div><div className="mt-6 space-y-3">{filteredProducts.map((p) => <article key={p.id} className="grid gap-3 rounded-2xl border p-4 xl:grid-cols-[1fr_130px_190px_auto]"><input className={field} value={p.name_ar} onChange={(e) => setProducts((current) => current.map((x) => x.id === p.id ? { ...x, name_ar: e.target.value } : x))} /><input className={field} type="number" value={p.price} onChange={(e) => setProducts((current) => current.map((x) => x.id === p.id ? { ...x, price: Number(e.target.value) } : x))} /><select className={field} value={p.category_id ?? ""} onChange={(e) => setProducts((current) => current.map((x) => x.id === p.id ? { ...x, category_id: e.target.value || null } : x))}><option value="">بدون تصنيف</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}</select><div className="flex gap-2"><button onClick={() => setProducts((current) => current.map((x) => x.id === p.id ? { ...x, is_available: !x.is_available } : x))} className={`rounded-xl border px-3 text-sm font-bold ${p.is_available ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"}`}>{p.is_available ? "متاح" : "متوقف"}</button><button onClick={() => void saveProduct(p)} className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white"><Save size={16} /></button></div></article>)}</div></section>}

          {section === "categories" && <section className="rounded-[28px] border bg-white p-5 shadow-sm sm:p-7"><h2 className="text-2xl font-black">التصنيفات</h2><p className="text-sm text-slate-500">رتّب أقسام المنيو وحدد الظاهر منها.</p><div className="mt-6 space-y-3">{categories.map((c) => <article key={c.id} className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row"><input className={`${field} flex-1`} value={c.name_ar} onChange={(e) => setCategories((current) => current.map((x) => x.id === c.id ? { ...x, name_ar: e.target.value } : x))} /><button onClick={() => setCategories((current) => current.map((x) => x.id === c.id ? { ...x, is_visible: !x.is_visible } : x))} className="rounded-xl border px-4 font-bold">{c.is_visible ? "ظاهر" : "مخفي"}</button><button onClick={() => void saveCategory(c)} className="rounded-xl bg-slate-950 px-4 text-white"><Save size={16} /></button></article>)}</div></section>}

          {section === "reviews" && <section><div className="mb-5"><h2 className="text-2xl font-black">سمعة المطعم</h2><p className="text-sm text-slate-500">اعتماد أو إخفاء تقييمات العملاء.</p></div><div className="grid gap-4 lg:grid-cols-2">{reviews.map((r) => <article key={r.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="text-amber-400">{"★".repeat(r.rating)}{"☆".repeat(Math.max(0, 5-r.rating))}</div><h3 className="mt-3 font-black">{r.customer_name}</h3><p className="mt-2 leading-7 text-slate-600">{r.comment || "بدون تعليق"}</p><button onClick={() => void toggleReview(r)} className={`mt-5 rounded-xl px-4 py-2 font-bold ${r.is_approved ? "bg-slate-100" : "bg-emerald-50 text-emerald-700"}`}>{r.is_approved ? "إخفاء التقييم" : "اعتماد التقييم"}</button></article>)}</div></section>}

          {section === "appearance" && <section className="grid gap-5 xl:grid-cols-[1fr_.8fr]"><div className="rounded-[28px] border bg-white p-6 shadow-sm"><h2 className="text-2xl font-black">هوية المطعم</h2><p className="text-sm text-slate-500">هذه الألوان ستصبح أساس الواجهة العامة.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="grid gap-2"><span className="font-bold">اللون الأساسي</span><input type="color" value={settings.primary_color || "#f43f5e"} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} className="h-14 w-full rounded-xl border p-1" /></label><label className="grid gap-2"><span className="font-bold">اللون الثانوي</span><input type="color" value={settings.secondary_color || "#fb923c"} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} className="h-14 w-full rounded-xl border p-1" /></label></div><button onClick={() => void saveSettings()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-black text-white"><Save size={17} /> حفظ الهوية</button></div><div className="overflow-hidden rounded-[28px] border bg-white shadow-sm"><div className="h-28" style={{ background: `linear-gradient(135deg, ${settings.primary_color || "#f43f5e"}, ${settings.secondary_color || "#fb923c"})` }} /><div className="p-6"><span className="text-xs font-black text-slate-400">معاينة الهوية</span><h3 className="mt-2 text-3xl font-black">{settings.restaurant_name}</h3><p className="mt-2 text-slate-500">{settings.tagline || "طعم يصنع الفرق"}</p><button className="mt-5 rounded-full px-6 py-3 font-black text-white" style={{ background: settings.primary_color || "#f43f5e" }}>اطلب الآن</button></div></div></section>}

          {section === "settings" && <section className="rounded-[28px] border bg-white p-5 shadow-sm sm:p-7"><h2 className="text-2xl font-black">بيانات المطعم</h2><p className="text-sm text-slate-500">المعلومات الأساسية التي تظهر للعميل.</p><div className="mt-6 grid gap-5 md:grid-cols-2">{[["اسم المطعم", "restaurant_name"], ["الوصف القصير", "tagline"], ["الهاتف", "phone"], ["واتساب", "whatsapp"], ["العنوان", "address"], ["ساعات العمل", "hours"]].map(([label, key]) => <label key={key} className="grid gap-2"><span className="font-bold">{label}</span><input className={field} value={String(settings[key as keyof SettingsRow] ?? "")} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} /></label>)}</div><button onClick={() => void saveSettings()} disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 font-black text-white"><Save size={17} /> {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}</button></section>}
        </div>
      </main>

      {notice && <div className="fixed bottom-5 left-1/2 z-[90] -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl"><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-400" />{notice}</span></div>}
    </div>
  );
}
