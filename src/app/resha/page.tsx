"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageOpen,
  Pizza,
  Plus,
  RefreshCw,
  Save,
  Settings,
  ShoppingBag,
  Star,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Tab = "dashboard" | "products" | "categories" | "orders" | "reviews" | "settings";
type Category = { id: string; name_ar: string; is_visible: boolean; sort_order: number | null };
type Product = { id: string; name_ar: string; price: number; category_id: string | null; is_available: boolean | null; is_featured: boolean | null; is_visible: boolean };
type Order = { id: string; customer_name: string; phone: string; total: number; status: string | null; created_at: string | null };
type Review = { id: string; customer_name: string; rating: number; comment: string | null; is_approved: boolean | null };
type SiteSettings = { id: number; restaurant_name: string | null; phone: string | null; whatsapp: string | null; address: string | null; hours: string | null; tagline: string | null };

const nav = [
  ["dashboard", "الرئيسية", LayoutDashboard],
  ["products", "الأصناف", PackageOpen],
  ["categories", "التصنيفات", Tags],
  ["orders", "الطلبات", ShoppingBag],
  ["reviews", "التقييمات", Star],
  ["settings", "الإعدادات", Settings],
] as const;

export default function ReshaDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ id: 1, restaurant_name: "De Roma", phone: "", whatsapp: "", address: "", hours: "", tagline: "" });

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
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

    const [categoryResult, productResult, orderResult, reviewResult, settingsResult] = await Promise.all([
      supabase.from("categories").select("id,name_ar,is_visible,sort_order").order("sort_order"),
      supabase.from("products").select("id,name_ar,price,category_id,is_available,is_featured,is_visible").order("sort_order"),
      supabase.from("orders").select("id,customer_name,phone,total,status,created_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("reviews").select("id,customer_name,rating,comment,is_approved").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("id,restaurant_name,phone,whatsapp,address,hours,tagline").eq("id", 1).maybeSingle(),
    ]);

    setCategories((categoryResult.data ?? []) as Category[]);
    setProducts((productResult.data ?? []) as Product[]);
    setOrders((orderResult.data ?? []) as Order[]);
    setReviews((reviewResult.data ?? []) as Review[]);
    if (settingsResult.data) setSettings(settingsResult.data as SiteSettings);
    setLoading(false);
  }, [router]);

  useEffect(() => { void loadData(); }, [loadData]);

  const filteredProducts = useMemo(() => products.filter((p) => p.name_ar.includes(search)), [products, search]);
  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name_ar ?? "بدون تصنيف";

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/resha/login");
  }

  async function addCategory() {
    const { data, error } = await supabase.from("categories").insert({ name_ar: "تصنيف جديد", is_visible: true, sort_order: categories.length + 1 }).select("id,name_ar,is_visible,sort_order").single();
    if (error) return flash("تعذر إضافة التصنيف");
    setCategories([...categories, data as Category]);
    flash("تمت إضافة التصنيف");
  }

  async function saveCategory(item: Category) {
    const { error } = await supabase.from("categories").update({ name_ar: item.name_ar, is_visible: item.is_visible, sort_order: item.sort_order }).eq("id", item.id);
    flash(error ? "تعذر حفظ التصنيف" : "تم حفظ التصنيف");
  }

  async function deleteCategory(id: string) {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) setCategories(categories.filter((c) => c.id !== id));
    flash(error ? "لا يمكن حذف تصنيف مرتبط بأصناف" : "تم حذف التصنيف");
  }

  async function addProduct() {
    const { data, error } = await supabase.from("products").insert({ name_ar: "صنف جديد", price: 0, category_id: categories[0]?.id ?? null, is_available: true, is_featured: false, is_visible: true }).select("id,name_ar,price,category_id,is_available,is_featured,is_visible").single();
    if (error) return flash("تعذر إضافة الصنف");
    setProducts([data as Product, ...products]);
    flash("تمت إضافة الصنف");
  }

  async function saveProduct(item: Product) {
    const { error } = await supabase.from("products").update({ name_ar: item.name_ar, price: item.price, category_id: item.category_id, is_available: item.is_available, is_featured: item.is_featured, is_visible: item.is_visible }).eq("id", item.id);
    flash(error ? "تعذر حفظ الصنف" : "تم حفظ الصنف");
  }

  async function deleteProduct(id: string) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setProducts(products.filter((p) => p.id !== id));
    flash(error ? "تعذر حذف الصنف" : "تم حذف الصنف");
  }

  async function changeOrderStatus(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) setOrders(orders.map((o) => o.id === id ? { ...o, status } : o));
    flash(error ? "تعذر تحديث الطلب" : "تم تحديث حالة الطلب");
  }

  async function updateReview(id: string, approved: boolean) {
    const { error } = await supabase.from("reviews").update({ is_approved: approved }).eq("id", id);
    if (!error) setReviews(reviews.map((r) => r.id === id ? { ...r, is_approved: approved } : r));
    flash(error ? "تعذر تحديث التقييم" : "تم تحديث التقييم");
  }

  async function deleteReview(id: string) {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (!error) setReviews(reviews.filter((r) => r.id !== id));
    flash(error ? "تعذر حذف التقييم" : "تم حذف التقييم");
  }

  async function saveSettings() {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert({ ...settings, id: 1 });
    setSaving(false);
    flash(error ? "تعذر حفظ الإعدادات" : "تم حفظ الإعدادات");
  }

  const field = "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-rose-400";
  const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 text-sm font-black text-white";

  const Sidebar = () => (
    <aside className="flex h-full w-[280px] flex-col bg-[#07111f] text-white">
      <div className="border-b border-white/10 p-5"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500"><Pizza /></span><div><strong className="text-xl">Resha</strong><p className="text-xs text-slate-400">إدارة De Roma</p></div></div></div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">{nav.map(([id, label, Icon]) => <button key={id} onClick={() => { setTab(id); setMobileOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-right text-sm font-bold ${tab === id ? "bg-rose-500" : "text-slate-300 hover:bg-white/10"}`}><Icon size={18} />{label}</button>)}</nav>
      <div className="border-t border-white/10 p-4"><Link href="/" target="_blank" className="mb-2 flex justify-center rounded-xl border border-white/10 py-3 text-sm font-bold">فتح الموقع</Link><button onClick={signOut} className="flex w-full items-center justify-center gap-2 py-3 text-sm font-bold text-slate-400"><LogOut size={17} /> تسجيل الخروج</button></div>
    </aside>
  );

  if (loading) return <main className="grid min-h-screen place-items-center bg-slate-100" dir="rtl"><div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold shadow-sm"><RefreshCw className="animate-spin" size={18} /> جارٍ تحميل لوحة Resha...</div></main>;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950" dir="rtl">
      <div className="fixed inset-y-0 right-0 hidden lg:block"><Sidebar /></div>
      {mobileOpen && <div className="fixed inset-0 z-50 bg-black/50 lg:hidden"><div className="absolute inset-y-0 right-0"><Sidebar /></div><button onClick={() => setMobileOpen(false)} className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white"><X /></button></div>}
      <main className="lg:mr-[280px]">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-7"><button onClick={() => setMobileOpen(true)} className="grid h-11 w-11 place-items-center rounded-xl border lg:hidden"><Menu /></button><div><strong>لوحة Resha</strong><p className="text-xs text-slate-500">إدارة حقيقية مرتبطة بـSupabase</p></div><button onClick={() => void loadData()} className="grid h-11 w-11 place-items-center rounded-xl border"><RefreshCw size={18} /></button></header>
        <div className="space-y-6 p-4 sm:p-7">
          {tab === "dashboard" && <><section className="overflow-hidden rounded-[30px] bg-gradient-to-l from-[#07111f] to-slate-800 p-7 text-white shadow-xl sm:p-10"><p className="text-sm font-black text-rose-300">RESHA CONTROL</p><h1 className="mt-3 text-3xl font-black sm:text-5xl">أهلًا بك في لوحة الإدارة الجديدة</h1><p className="mt-4 max-w-2xl leading-8 text-slate-300">اللوحة القديمة انتهت. هذه النسخة تعمل مباشرة على بيانات المطعم الحقيقية.</p></section><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["الأصناف", products.length],["التصنيفات", categories.length],["الطلبات", orders.length],["التقييمات المنشورة", reviews.filter((r) => r.is_approved).length]].map(([label, value]) => <article key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-sm text-slate-500">{label}</span><strong className="mt-3 block text-3xl font-black">{value}</strong></article>)}</section></>}

          {tab === "products" && <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-black">الأصناف</h2><p className="text-sm text-slate-500">تعديل وحذف وإظهار المنتجات.</p></div><button onClick={addProduct} className={button}><Plus size={17} /> إضافة صنف</button></div><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث عن صنف" className={`${field} mt-6`} /><div className="mt-5 space-y-3">{filteredProducts.map((p) => <article key={p.id} className="grid gap-3 rounded-2xl border border-slate-200 p-4 xl:grid-cols-[1fr_130px_190px_auto]"><input className={field} value={p.name_ar} onChange={(e) => setProducts(products.map((x) => x.id === p.id ? { ...x, name_ar: e.target.value } : x))} /><input className={field} type="number" value={p.price} onChange={(e) => setProducts(products.map((x) => x.id === p.id ? { ...x, price: Number(e.target.value) } : x))} /><select className={field} value={p.category_id ?? ""} onChange={(e) => setProducts(products.map((x) => x.id === p.id ? { ...x, category_id: e.target.value || null } : x))}><option value="">بدون تصنيف</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}</select><div className="flex gap-2"><button onClick={() => setProducts(products.map((x) => x.id === p.id ? { ...x, is_available: !x.is_available } : x))} className="rounded-xl border px-3 text-sm font-bold">{p.is_available ? "متاح" : "غير متاح"}</button><button onClick={() => saveProduct(p)} className="rounded-xl bg-slate-950 px-3 text-white"><Save size={16} /></button><button onClick={() => deleteProduct(p.id)} className="rounded-xl border border-rose-200 px-3 text-rose-500"><Trash2 size={16} /></button></div><p className="text-xs text-slate-400 xl:col-span-4">التصنيف: {categoryName(p.category_id)}</p></article>)}</div></section>}

          {tab === "categories" && <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-black">التصنيفات</h2><p className="text-sm text-slate-500">أقسام المنيو الرئيسية.</p></div><button onClick={addCategory} className={button}><Plus size={17} /> إضافة</button></div><div className="mt-6 space-y-3">{categories.map((c) => <article key={c.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row"><input className={`${field} flex-1`} value={c.name_ar} onChange={(e) => setCategories(categories.map((x) => x.id === c.id ? { ...x, name_ar: e.target.value } : x))} /><button onClick={() => setCategories(categories.map((x) => x.id === c.id ? { ...x, is_visible: !x.is_visible } : x))} className="rounded-xl border px-4 font-bold">{c.is_visible ? "ظاهر" : "مخفي"}</button><button onClick={() => saveCategory(c)} className="rounded-xl bg-slate-950 px-4 text-white"><Save size={16} /></button><button onClick={() => deleteCategory(c.id)} className="rounded-xl border border-rose-200 px-4 text-rose-500"><Trash2 size={16} /></button></article>)}</div></section>}

          {tab === "orders" && <section><div className="mb-5"><h2 className="text-2xl font-black">الطلبات</h2><p className="text-sm text-slate-500">تغيير الحالة من الاستلام حتى التسليم.</p></div><div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{orders.map((o) => <article key={o.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex justify-between"><strong>#{o.id.slice(0, 8)}</strong><span className="text-xs text-slate-400">{o.created_at ? new Date(o.created_at).toLocaleString("ar-LY") : ""}</span></div><h3 className="mt-4 text-lg font-black">{o.customer_name}</h3><p className="text-sm text-slate-500">{o.phone}</p><strong className="mt-3 block text-2xl text-rose-500">{o.total} د.ل</strong><select className={`${field} mt-4`} value={o.status ?? "pending"} onChange={(e) => changeOrderStatus(o.id, e.target.value)}><option value="pending">جديد</option><option value="preparing">قيد التحضير</option><option value="ready">جاهز</option><option value="delivery">خرج للتوصيل</option><option value="delivered">تم التسليم</option><option value="cancelled">ملغي</option></select></article>)}</div></section>}

          {tab === "reviews" && <section><div className="mb-5"><h2 className="text-2xl font-black">التقييمات</h2><p className="text-sm text-slate-500">اعتماد أو إخفاء آراء العملاء.</p></div><div className="grid gap-4 lg:grid-cols-2">{reviews.map((r) => <article key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="text-amber-400">{"★".repeat(r.rating)}{"☆".repeat(Math.max(0, 5-r.rating))}</div><h3 className="mt-3 font-black">{r.customer_name}</h3><p className="mt-2 leading-7 text-slate-600">{r.comment || "بدون تعليق"}</p><div className="mt-5 flex gap-2"><button onClick={() => updateReview(r.id, !r.is_approved)} className={`rounded-xl px-4 py-2 font-bold ${r.is_approved ? "bg-slate-100" : "bg-emerald-50 text-emerald-700"}`}>{r.is_approved ? "إخفاء" : "اعتماد"}</button><button onClick={() => deleteReview(r.id)} className="rounded-xl border border-rose-200 px-4 text-rose-500"><Trash2 size={16} /></button></div></article>)}</div></section>}

          {tab === "settings" && <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-2xl font-black">إعدادات المطعم</h2><p className="text-sm text-slate-500">تُعرض هذه البيانات مباشرة في الموقع.</p><div className="mt-6 grid gap-5 md:grid-cols-2">{[["اسم المطعم","restaurant_name"],["الهاتف","phone"],["واتساب","whatsapp"],["العنوان","address"],["ساعات العمل","hours"],["الوصف القصير","tagline"]].map(([label,key]) => <label key={key} className="grid gap-2"><span className="font-bold">{label}</span><input className={field} value={String(settings[key as keyof SiteSettings] ?? "")} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} /></label>)}</div><button onClick={saveSettings} disabled={saving} className={`${button} mt-6`}><Save size={17} /> {saving ? "جارٍ الحفظ..." : "حفظ الإعدادات"}</button></section>}
        </div>
      </main>
      {notice && <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl"><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-400" />{notice}</span></div>}
    </div>
  );
}
