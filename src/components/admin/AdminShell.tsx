"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquareText,
  PackageOpen,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShoppingBag,
  Tags,
  Trash2,
  Truck,
  Users,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type Section = "dashboard" | "orders" | "products" | "categories" | "content" | "reviews" | "appearance" | "delivery" | "users" | "settings";
type Category = { id: string; name_ar: string; is_visible: boolean; sort_order: number | null };
type Product = { id: string; name_ar: string; description_ar: string | null; price: number; category_id: string | null; is_available: boolean | null; is_featured: boolean | null; is_visible: boolean; sort_order: number | null };
type Order = { id: string; customer_name: string; phone: string; total: number; status: string | null; order_type: string; created_at: string | null };
type Review = { id: string; customer_name: string; rating: number; comment: string | null; is_approved: boolean | null; created_at: string | null };
type SettingsRow = {
  id: number;
  restaurant_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  hours: string | null;
  tagline: string | null;
  hero_headline: string | null;
  hero_subheadline: string | null;
  about_title: string | null;
  about_body: string | null;
  theme_id: string | null;
  primary_color: string | null;
};

const navigation = [
  { id: "dashboard" as Section, label: "الرئيسية", icon: LayoutDashboard },
  { id: "orders" as Section, label: "الطلبات", icon: ShoppingBag },
  { id: "products" as Section, label: "الأصناف", icon: PackageOpen },
  { id: "categories" as Section, label: "التصنيفات", icon: Tags },
  { id: "content" as Section, label: "المحتوى", icon: FileText },
  { id: "reviews" as Section, label: "التقييمات", icon: MessageSquareText },
  { id: "appearance" as Section, label: "المظهر", icon: Palette },
  { id: "delivery" as Section, label: "التوصيل", icon: Truck },
  { id: "users" as Section, label: "المستخدمون", icon: Users },
  { id: "settings" as Section, label: "الإعدادات", icon: Settings },
];

const themes = [
  { id: "modern", name: "Modern", colors: ["#0f172a", "#f8fafc", "#ff174f"] },
  { id: "luxury", name: "Luxury", colors: ["#171717", "#f6f0e2", "#c68b2c"] },
  { id: "minimal", name: "Minimal", colors: ["#111827", "#ffffff", "#94a3b8"] },
  { id: "dark", name: "Dark", colors: ["#050505", "#18181b", "#ef4444"] },
  { id: "italian", name: "Italian", colors: ["#166534", "#ffffff", "#dc2626"] },
];

export default function AdminShell({ children: _children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | "loading">("loading");
  const [section, setSection] = useState<Section>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SettingsRow>({ id: 1, restaurant_name: "De Roma", phone: "", whatsapp: "", address: "", hours: "", tagline: "", hero_headline: "", hero_subheadline: "", about_title: "", about_body: "", theme_id: "modern", primary_color: "#ff174f" });

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    const [categoriesRes, productsRes, ordersRes, reviewsRes, settingsRes] = await Promise.all([
      supabase.from("categories").select("id,name_ar,is_visible,sort_order").order("sort_order"),
      supabase.from("products").select("id,name_ar,description_ar,price,category_id,is_available,is_featured,is_visible,sort_order").order("sort_order"),
      supabase.from("orders").select("id,customer_name,phone,total,status,order_type,created_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("reviews").select("id,customer_name,rating,comment,is_approved,created_at").order("created_at", { ascending: false }),
      supabase.from("site_settings").select("id,restaurant_name,phone,whatsapp,address,hours,tagline,hero_headline,hero_subheadline,about_title,about_body,theme_id,primary_color").eq("id", 1).maybeSingle(),
    ]);
    const firstError = categoriesRes.error || productsRes.error || ordersRes.error || reviewsRes.error || settingsRes.error;
    if (firstError) setError(firstError.message);
    setCategories((categoriesRes.data ?? []) as Category[]);
    setProducts((productsRes.data ?? []) as Product[]);
    setOrders((ordersRes.data ?? []) as Order[]);
    setReviews((reviewsRes.data ?? []) as Review[]);
    if (settingsRes.data) setSettings(settingsRes.data as SettingsRow);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setSession(null);
        router.replace("/admin/login");
        return;
      }
      const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");
      if (adminError || !isAdmin) {
        await supabase.auth.signOut();
        setSession(null);
        router.replace("/admin/login?error=unauthorized");
        return;
      }
      setSession(data.session);
      await loadData();
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!nextSession) router.replace("/admin/login");
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const saveProducts = async () => {
    setSaving(true); setError("");
    const payload = products.map(({ id, ...p }) => ({ id, ...p, updated_at: new Date().toISOString() }));
    const { error: saveError } = await supabase.from("products").upsert(payload);
    setSaving(false);
    if (saveError) return setError(saveError.message);
    flash("تم حفظ الأصناف في Supabase");
    await loadData();
  };

  const addProduct = async () => {
    const { error: insertError } = await supabase.from("products").insert({ name_ar: "صنف جديد", price: 0, category_id: categories[0]?.id ?? null, is_available: true, is_featured: false, is_visible: true, sort_order: products.length + 1 });
    if (insertError) return setError(insertError.message);
    flash("تمت إضافة صنف جديد"); await loadData();
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("هل تريد حذف الصنف نهائيًا؟")) return;
    const { error: deleteError } = await supabase.from("products").delete().eq("id", id);
    if (deleteError) return setError(deleteError.message);
    setProducts((items) => items.filter((item) => item.id !== id)); flash("تم حذف الصنف");
  };

  const saveCategories = async () => {
    setSaving(true); setError("");
    const { error: saveError } = await supabase.from("categories").upsert(categories.map((c) => ({ ...c, updated_at: new Date().toISOString() })));
    setSaving(false);
    if (saveError) return setError(saveError.message);
    flash("تم حفظ التصنيفات"); await loadData();
  };

  const addCategory = async () => {
    const { error: insertError } = await supabase.from("categories").insert({ name_ar: "تصنيف جديد", is_visible: true, sort_order: categories.length + 1 });
    if (insertError) return setError(insertError.message);
    flash("تمت إضافة تصنيف"); await loadData();
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm("سيتم حذف التصنيف، هل أنت متأكد؟")) return;
    const { error: deleteError } = await supabase.from("categories").delete().eq("id", id);
    if (deleteError) return setError(deleteError.message);
    flash("تم حذف التصنيف"); await loadData();
  };

  const updateOrderStatus = async (id: string, status: string) => {
    setOrders((items) => items.map((o) => o.id === id ? { ...o, status } : o));
    const { error: updateError } = await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (updateError) return setError(updateError.message);
    flash("تم تحديث حالة الطلب");
  };

  const updateReview = async (id: string, approved: boolean) => {
    const { error: updateError } = await supabase.from("reviews").update({ is_approved: approved }).eq("id", id);
    if (updateError) return setError(updateError.message);
    setReviews((items) => items.map((r) => r.id === id ? { ...r, is_approved: approved } : r)); flash(approved ? "تم اعتماد التقييم" : "تم إخفاء التقييم");
  };

  const deleteReview = async (id: string) => {
    const { error: deleteError } = await supabase.from("reviews").delete().eq("id", id);
    if (deleteError) return setError(deleteError.message);
    setReviews((items) => items.filter((r) => r.id !== id)); flash("تم حذف التقييم");
  };

  const saveSettings = async () => {
    setSaving(true); setError("");
    const { error: saveError } = await supabase.from("site_settings").upsert({ ...settings, id: 1, updated_at: new Date().toISOString() });
    setSaving(false);
    if (saveError) return setError(saveError.message);
    flash("تم حفظ إعدادات الموقع");
  };

  const filteredProducts = useMemo(() => products.filter((p) => p.name_ar.includes(search) || (categories.find((c) => c.id === p.category_id)?.name_ar ?? "").includes(search)), [products, categories, search]);
  const fieldClass = "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-rose-400";
  const primaryButton = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 text-sm font-black text-white disabled:opacity-50";

  if (session === "loading" || (session && loading)) return <main className="grid min-h-screen place-items-center bg-slate-100" dir="rtl"><div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold text-slate-600 shadow"><Loader2 className="animate-spin" /> جارٍ تحميل بيانات Supabase...</div></main>;
  if (!session) return null;

  const Header = ({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) => <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-black text-rose-500">DE ROMA CMS · SUPABASE</p><h1 className="mt-2 text-3xl font-black text-slate-950">{title}</h1><p className="mt-3 text-sm leading-7 text-slate-500">{subtitle}</p></div>{action}</div></section>;

  const dashboard = <div className="space-y-6"><section className="rounded-[32px] bg-slate-950 p-8 text-white shadow-xl"><p className="text-sm font-bold text-rose-300">النظام متصل مباشرة بقاعدة البيانات</p><h1 className="mt-3 text-3xl font-black sm:text-5xl">إدارة المطعم من شاشة واحدة</h1><div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">{[["الأصناف",products.length],["التصنيفات",categories.length],["الطلبات",orders.length],["تقييمات معلقة",reviews.filter(r=>!r.is_approved).length]].map(([label,value])=><article key={String(label)} className="rounded-2xl bg-white/10 p-4"><span className="text-xs text-slate-300">{label}</span><strong className="mt-2 block text-3xl">{value}</strong></article>)}</div></section><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{navigation.slice(1,9).map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>setSection(item.id)} className="rounded-2xl border bg-white p-5 text-right shadow-sm hover:border-rose-300"><Icon className="text-rose-500"/><strong className="mt-4 block text-lg">{item.label}</strong></button>})}</section></div>;

  const productsPage = <div className="space-y-6"><Header title="إدارة الأصناف" subtitle="إضافة وتعديل وحذف الأصناف والأسعار وظهورها في الموقع." action={<button onClick={addProduct} className={primaryButton}><Plus size={18}/>إضافة صنف</button>}/><section className="rounded-[28px] border bg-white p-5 shadow-sm"><div className="flex items-center rounded-xl border bg-slate-50 px-4"><Search size={18}/><input className="min-h-12 w-full bg-transparent px-3 outline-none" value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث بالاسم أو التصنيف"/></div><div className="mt-5 space-y-3">{filteredProducts.map(p=><article key={p.id} className="grid gap-3 rounded-2xl border p-4 lg:grid-cols-[1.2fr_120px_180px_auto]"><input className={fieldClass} value={p.name_ar} onChange={e=>setProducts(items=>items.map(x=>x.id===p.id?{...x,name_ar:e.target.value}:x))}/><input type="number" className={fieldClass} value={p.price} onChange={e=>setProducts(items=>items.map(x=>x.id===p.id?{...x,price:Number(e.target.value)}:x))}/><select className={fieldClass} value={p.category_id??""} onChange={e=>setProducts(items=>items.map(x=>x.id===p.id?{...x,category_id:e.target.value||null}:x))}><option value="">بدون تصنيف</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name_ar}</option>)}</select><div className="flex gap-2"><button onClick={()=>setProducts(items=>items.map(x=>x.id===p.id?{...x,is_available:!x.is_available,is_visible:!x.is_available}:x))} className={`rounded-xl px-3 font-bold ${p.is_available?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-500"}`}>{p.is_available?"متاح":"مخفي"}</button><button onClick={()=>deleteProduct(p.id)} className="rounded-xl border border-rose-200 px-3 text-rose-500"><Trash2 size={17}/></button></div></article>)}</div><button disabled={saving} onClick={saveProducts} className={`${primaryButton} mt-6`}>{saving?<Loader2 className="animate-spin"/>:<Save size={18}/>}حفظ الأصناف</button></section></div>;

  const categoriesPage = <div className="space-y-6"><Header title="التصنيفات" subtitle="إدارة أقسام المنيو وربط الأصناف بها." action={<button onClick={addCategory} className={primaryButton}><Plus size={18}/>إضافة تصنيف</button>}/><section className="space-y-3 rounded-[28px] border bg-white p-6">{categories.map(c=><article key={c.id} className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row"><input className={`${fieldClass} flex-1`} value={c.name_ar} onChange={e=>setCategories(items=>items.map(x=>x.id===c.id?{...x,name_ar:e.target.value}:x))}/><button onClick={()=>setCategories(items=>items.map(x=>x.id===c.id?{...x,is_visible:!x.is_visible}:x))} className="rounded-xl border px-4 font-bold">{c.is_visible?"ظاهر":"مخفي"}</button><button onClick={()=>deleteCategory(c.id)} className="rounded-xl border border-rose-200 px-4 text-rose-500"><Trash2/></button></article>)}<button disabled={saving} onClick={saveCategories} className={primaryButton}><Save size={18}/>حفظ</button></section></div>;

  const ordersPage = <div className="space-y-6"><Header title="الطلبات" subtitle="تظهر الطلبات الحقيقية فور تسجيلها في Supabase." action={<button onClick={loadData} className={primaryButton}><RefreshCw size={18}/>تحديث</button>}/><section className="grid gap-4 lg:grid-cols-3">{orders.map(o=><article key={o.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex justify-between"><strong>#{o.id.slice(0,8)}</strong><span className="text-xs text-slate-400">{o.created_at?new Date(o.created_at).toLocaleString("ar-LY"):""}</span></div><h3 className="mt-4 text-lg font-black">{o.customer_name}</h3><p className="text-sm text-slate-500">{o.phone} · {o.order_type}</p><p className="mt-2 text-2xl font-black text-rose-500">{o.total} د.ل</p><select className={`${fieldClass} mt-5`} value={o.status??"جديد"} onChange={e=>updateOrderStatus(o.id,e.target.value)}>{["جديد","قيد التحضير","جاهز","خرج للتوصيل","تم التسليم","ملغي"].map(s=><option key={s}>{s}</option>)}</select></article>)}{orders.length===0&&<p className="rounded-2xl bg-white p-8 text-center text-slate-500">لا توجد طلبات حتى الآن</p>}</section></div>;

  const reviewsPage = <div className="space-y-6"><Header title="التقييمات" subtitle="اعتماد أو إخفاء تقييمات الزبائن."/><section className="grid gap-4 lg:grid-cols-2">{reviews.map(r=><article key={r.id} className="rounded-2xl border bg-white p-5"><div className="text-amber-400">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div><h3 className="mt-3 font-black">{r.customer_name}</h3><p className="mt-2 leading-7 text-slate-600">{r.comment||"بدون تعليق"}</p><div className="mt-5 flex gap-2"><button onClick={()=>updateReview(r.id,!r.is_approved)} className={`rounded-xl px-4 py-2 font-bold ${r.is_approved?"bg-slate-100":"bg-emerald-50 text-emerald-700"}`}>{r.is_approved?"إخفاء":"اعتماد"}</button><button onClick={()=>deleteReview(r.id)} className="rounded-xl border border-rose-200 px-4 text-rose-500">حذف</button></div></article>)}</section></div>;

  const settingsPage = <div className="space-y-6"><Header title={section==="content"?"محتوى الموقع":section==="appearance"?"المظهر والقالب":section==="delivery"?"بيانات التوصيل":"إعدادات المطعم"} subtitle="كل تغيير هنا يُحفظ مباشرة في site_settings ويظهر في الموقع."/><section className="grid gap-5 rounded-[28px] border bg-white p-6 md:grid-cols-2">{[["اسم المطعم","restaurant_name"],["الهاتف","phone"],["واتساب","whatsapp"],["العنوان","address"],["ساعات العمل","hours"],["الوصف القصير","tagline"],["عنوان الواجهة","hero_headline"],["النص أسفل العنوان","hero_subheadline"],["عنوان قصتنا","about_title"],["نص قصتنا","about_body"]].map(([label,key])=><label key={key} className="grid gap-2"><span className="font-bold">{label}</span><textarea className={`${fieldClass} min-h-24 py-3`} value={String(settings[key as keyof SettingsRow]??"")} onChange={e=>setSettings({...settings,[key]:e.target.value})}/></label>)}<div className="md:col-span-2"><span className="mb-3 block font-bold">القالب</span><div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">{themes.map(t=><button key={t.id} onClick={()=>setSettings({...settings,theme_id:t.id,primary_color:t.colors[2]})} className={`rounded-2xl border p-3 text-right ${settings.theme_id===t.id?"border-rose-500 ring-2 ring-rose-100":""}`}><div className="flex h-10 overflow-hidden rounded-lg">{t.colors.map(c=><span key={c} className="flex-1" style={{backgroundColor:c}}/>)}</div><strong className="mt-2 block">{t.name}</strong></button>)}</div></div><button disabled={saving} onClick={saveSettings} className={`${primaryButton} md:col-span-2`}><Save size={18}/>حفظ الإعدادات</button></section></div>;

  const current = section==="dashboard"?dashboard:section==="products"?productsPage:section==="categories"?categoriesPage:section==="orders"?ordersPage:section==="reviews"?reviewsPage:settingsPage;

  return <div className="min-h-screen bg-slate-100 text-slate-950" dir="rtl"><aside className="fixed inset-y-0 right-0 z-40 hidden w-[292px] flex-col bg-[#081122] text-white lg:flex"><div className="border-b border-white/10 p-5"><h1 className="text-2xl font-black">{settings.restaurant_name||"De Roma"}</h1><p className="mt-1 text-xs text-slate-400">لوحة Supabase الحقيقية</p></div><nav className="flex-1 space-y-1 overflow-y-auto p-4">{navigation.map(item=>{const Icon=item.icon;return <button key={item.id} onClick={()=>setSection(item.id)} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-bold ${section===item.id?"bg-rose-500":"text-slate-300 hover:bg-white/10"}`}><span className="flex items-center gap-3"><Icon size={18}/>{item.label}</span><ChevronLeft size={16}/></button>})}</nav><div className="space-y-2 border-t border-white/10 p-4"><Link href="/" target="_blank" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3"><ExternalLink size={17}/>معاينة الموقع</Link><button onClick={signOut} className="flex w-full items-center justify-center gap-2 py-3 text-slate-300"><LogOut size={17}/>تسجيل الخروج</button></div></aside>{mobileOpen&&<div className="fixed inset-0 z-50 bg-[#081122] text-white lg:hidden"><button onClick={()=>setMobileOpen(false)} className="absolute left-5 top-5"><X/></button><nav className="space-y-2 p-8 pt-20">{navigation.map(item=><button key={item.id} onClick={()=>{setSection(item.id);setMobileOpen(false)}} className="block w-full rounded-xl bg-white/10 p-4 text-right font-bold">{item.label}</button>)}</nav></div>}<main className="lg:mr-[292px]"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-7"><button onClick={()=>setMobileOpen(true)} className="lg:hidden"><Menu/></button><strong>{navigation.find(n=>n.id===section)?.label}</strong><button onClick={loadData} title="تحديث البيانات"><RefreshCw size={19}/></button></header><div className="p-4 sm:p-7">{error&&<div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 font-bold text-rose-700">{error}</div>}{current}</div></main>{notice&&<div className="fixed bottom-5 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl"><CheckCircle2 className="text-emerald-400"/>{notice}</div>}</div>;
}
