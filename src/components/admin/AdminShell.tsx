"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ExternalLink,
  LogOut,
  LayoutDashboard,
  PackageOpen,
  Tags,
  FileText,
  Image as ImageIcon,
  Palette,
  Settings,
  Menu,
  X,
  ArrowLeft,
  Sparkles,
  Search,
  Plus,
  Save,
  Trash2,
  Eye,
  Upload,
  Phone,
  MapPin,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

const navItems = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/menu", label: "الأصناف", icon: PackageOpen },
  { href: "/admin/categories", label: "التصنيفات", icon: Tags },
  { href: "/admin/content", label: "المحتوى", icon: FileText },
  { href: "/admin/media", label: "الصور", icon: ImageIcon },
  { href: "/admin/appearance", label: "المظهر", icon: Palette },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

const demoProducts = [
  { id: 1, name: "كالازوني مفروم", price: "22 د.ل", category: "المعجنات", available: true },
  { id: 2, name: "مشتعلة دجاج", price: "24 د.ل", category: "المعجنات", available: true },
  { id: 3, name: "مقلوبة دجاج", price: "18 د.ل", category: "المعجنات", available: true },
  { id: 4, name: "باقيت دجاج", price: "23 د.ل", category: "المعجنات", available: true },
];

const demoCategories = [
  { id: 1, name: "المعجنات", count: 6, active: true },
  { id: 2, name: "البيتزا", count: 10, active: true },
  { id: 3, name: "المشروبات", count: 3, active: true },
];

export default function AdminShell({ children: _children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null | "loading">("loading");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [products, setProducts] = useState(demoProducts);
  const [categories, setCategories] = useState(demoCategories);

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

  useEffect(() => setMobileOpen(false), [pathname]);

  const currentItem = useMemo(
    () => navItems.find((item) => item.href === pathname) ?? navItems[0],
    [pathname],
  );

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  };

  if (session === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f4f6fa] px-4" dir="rtl">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-500 shadow-sm">
          جارٍ تجهيز لوحة التحكم...
        </div>
      </main>
    );
  }

  if (!session) return null;

  const sidebar = (
    <aside className="flex h-full w-[286px] flex-col bg-[#0b1224] text-white">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black tracking-[0.16em] text-rose-300">RESTAURANT CMS</p>
            <h1 className="mt-1 text-xl font-black">De Roma</h1>
            <p className="mt-1 text-xs text-slate-400">إدارة المطعم من مكان واحد</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-rose-500 text-sm font-black shadow-lg shadow-rose-950/30">DR</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition ${active ? "bg-rose-500 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
            >
              <span className="flex items-center gap-3"><Icon size={18} /><span>{item.label}</span></span>
              <ArrowLeft size={15} className="opacity-60" />
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <Link href="/" target="_blank" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white">
          <ExternalLink size={16} /> معاينة الموقع
        </Link>
        <button type="button" onClick={signOut} className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white">
          <LogOut size={16} /> تسجيل الخروج
        </button>
      </div>
    </aside>
  );

  const SectionHeader = ({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) => (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-black text-rose-500">لوحة إدارة De Roma</span>
          <h1 className="mt-2 text-3xl font-black">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{subtitle}</p>
        </div>
        {action}
      </div>
    </section>
  );

  const dashboardHome = (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-xl shadow-slate-300/40">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.35fr_.65fr] lg:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-black text-rose-300"><Sparkles size={14} /> لوحة التحكم الكاملة</span>
            <h1 className="mt-4 text-3xl font-black sm:text-4xl">إدارة المطعم والموقع من مكان واحد</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">إدارة الأصناف والتصنيفات والمحتوى والصور والمظهر وبيانات التواصل من واجهة واحدة متجاوبة.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 self-start">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-slate-400">الأصناف</span><strong className="mt-2 block text-2xl font-black">{products.length}</strong></article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-slate-400">التصنيفات</span><strong className="mt-2 block text-2xl font-black">{categories.length}</strong></article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-slate-400">المتاحة</span><strong className="mt-2 block text-2xl font-black text-emerald-300">{products.filter((item) => item.available).length}</strong></article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-slate-400">الحالة</span><strong className="mt-2 block text-lg font-black">نشطة</strong></article>
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {navItems.slice(1).map((item) => {
          const Icon = item.icon;
          return <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg"><span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-500"><Icon size={20} /></span><strong className="mt-4 block text-lg font-black">{item.label}</strong><span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-rose-500">فتح القسم <ArrowLeft size={16} /></span></Link>;
        })}
      </section>
    </div>
  );

  const menuPage = (
    <div className="space-y-6">
      <SectionHeader title="إدارة الأصناف" subtitle="أضف الأصناف وعدل الأسعار وحالة التوفر." action={<button onClick={() => flash("تم فتح نموذج إضافة صنف") } className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-rose-500 px-5 text-sm font-black text-white"><Plus size={18}/> إضافة صنف</button>} />
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3"><Search size={17}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="ابحث عن صنف" className="w-full bg-transparent outline-none"/></div>
        <div className="mt-5 space-y-3">
          {products.filter((item)=>item.name.includes(search)).map((item)=><article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"><div><strong>{item.name}</strong><p className="mt-1 text-sm text-slate-500">{item.category} · {item.price}</p></div><div className="flex gap-2"><button onClick={()=>setProducts(products.map((p)=>p.id===item.id?{...p,available:!p.available}:p))} className={`rounded-xl px-3 py-2 text-sm font-bold ${item.available?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-500"}`}>{item.available?"متاح":"مخفي"}</button><button onClick={()=>flash(`تعديل ${item.name}`)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold">تعديل</button><button onClick={()=>setProducts(products.filter((p)=>p.id!==item.id))} className="rounded-xl border border-rose-200 px-3 py-2 text-rose-500"><Trash2 size={16}/></button></div></article>)}
        </div>
      </section>
    </div>
  );

  const categoriesPage = (
    <div className="space-y-6">
      <SectionHeader title="التصنيفات" subtitle="نظم أقسام المنيو ورتب ظهورها." action={<button onClick={()=>setCategories([...categories,{id:Date.now(),name:"تصنيف جديد",count:0,active:true}])} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-rose-500 px-5 text-sm font-black text-white"><Plus size={18}/> إضافة تصنيف</button>} />
      <section className="space-y-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">{categories.map((item)=><article key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"><div><strong>{item.name}</strong><p className="mt-1 text-sm text-slate-500">{item.count} صنف</p></div><div className="flex gap-2"><button onClick={()=>setCategories(categories.map((c)=>c.id===item.id?{...c,active:!c.active}:c))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold">{item.active?"ظاهر":"مخفي"}</button><button onClick={()=>setCategories(categories.filter((c)=>c.id!==item.id))} className="rounded-xl border border-rose-200 px-3 py-2 text-rose-500"><Trash2 size={16}/></button></div></article>)}</section>
    </div>
  );

  const contentPage = (
    <div className="space-y-6"><SectionHeader title="محتوى الموقع" subtitle="عدّل العناوين والنصوص الرئيسية." action={<button onClick={()=>flash("تم حفظ المحتوى") } className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-rose-500 px-5 text-sm font-black text-white"><Save size={18}/> حفظ</button>} /><section className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7"><label className="grid gap-2"><span className="font-bold">عنوان الهيرو</span><input defaultValue="بيتزا تُخبز بحب وتصل ساخنة إلى بابك" className="rounded-xl border border-slate-200 p-3"/></label><label className="grid gap-2"><span className="font-bold">النص القصير</span><input defaultValue="طعم إيطالي حقيقي في قلب طرابلس" className="rounded-xl border border-slate-200 p-3"/></label><label className="grid gap-2 sm:col-span-2"><span className="font-bold">قصة المطعم</span><textarea defaultValue="نختار المكونات بعناية ونحضّر العجينة يوميًا." className="min-h-32 rounded-xl border border-slate-200 p-3"/></label></section></div>
  );

  const mediaPage = (
    <div className="space-y-6"><SectionHeader title="الصور والمعرض" subtitle="إدارة صورة الواجهة وصور المنتجات والمعرض." action={<button onClick={()=>flash("تم فتح نافذة رفع الصور") } className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-rose-500 px-5 text-sm font-black text-white"><Upload size={18}/> رفع صورة</button>} /><section className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3 sm:p-7">{[1,2,3,4,5,6].map((n)=><article key={n} className="overflow-hidden rounded-2xl border border-slate-200"><div className="aspect-[4/3] bg-gradient-to-br from-rose-100 to-amber-100"/><div className="flex items-center justify-between p-3"><span className="text-sm font-bold">صورة {n}</span><button onClick={()=>flash(`معاينة صورة ${n}`)}><Eye size={17}/></button></div></article>)}</section></div>
  );

  const appearancePage = (
    <div className="space-y-6"><SectionHeader title="المظهر والقوالب" subtitle="اختر الهوية والألوان وشكل البطاقات." action={<button onClick={()=>flash("تم حفظ إعدادات المظهر") } className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-rose-500 px-5 text-sm font-black text-white"><Save size={18}/> حفظ</button>} /><section className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3 sm:p-7">{["Modern","Luxury","Minimal","Dark","Italian"].map((theme)=><button key={theme} onClick={()=>flash(`تم اختيار ${theme}`)} className="rounded-2xl border border-slate-200 p-5 text-right hover:border-rose-300"><div className="mb-4 h-16 rounded-xl bg-gradient-to-l from-rose-500 via-slate-950 to-white"/><strong>{theme}</strong></button>)}</section></div>
  );

  const settingsPage = (
    <div className="space-y-6"><SectionHeader title="إعدادات المطعم" subtitle="بيانات الاتصال والعنوان وساعات العمل." action={<button onClick={()=>flash("تم حفظ إعدادات المطعم") } className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-rose-500 px-5 text-sm font-black text-white"><Save size={18}/> حفظ</button>} /><section className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7"><label className="grid gap-2"><span className="flex items-center gap-2 font-bold"><Phone size={16}/> الهاتف</span><input defaultValue="0944400150" className="rounded-xl border border-slate-200 p-3"/></label><label className="grid gap-2"><span className="flex items-center gap-2 font-bold"><Phone size={16}/> واتساب</span><input defaultValue="0944400150" className="rounded-xl border border-slate-200 p-3"/></label><label className="grid gap-2 sm:col-span-2"><span className="flex items-center gap-2 font-bold"><MapPin size={16}/> العنوان</span><input defaultValue="طرابلس، طريق السدرة" className="rounded-xl border border-slate-200 p-3"/></label><label className="grid gap-2 sm:col-span-2"><span className="flex items-center gap-2 font-bold"><Clock3 size={16}/> ساعات العمل</span><input defaultValue="يوميًا 1:00 ظهرًا - 1:00 صباحًا" className="rounded-xl border border-slate-200 p-3"/></label></section></div>
  );

  const pageMap: Record<string, React.ReactNode> = {
    "/admin": dashboardHome,
    "/admin/menu": menuPage,
    "/admin/categories": categoriesPage,
    "/admin/content": contentPage,
    "/admin/media": mediaPage,
    "/admin/appearance": appearancePage,
    "/admin/settings": settingsPage,
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-950" dir="rtl">
      <div className="fixed inset-y-0 right-0 z-40 hidden lg:block">{sidebar}</div>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="إغلاق القائمة" onClick={()=>setMobileOpen(false)} className="absolute inset-0 bg-black/50"/><div className="absolute inset-y-0 right-0 shadow-2xl">{sidebar}</div></div>}
      <div className="lg:pr-[286px]">
        <header className="sticky top-0 z-30 flex min-h-[74px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8"><div className="flex items-center gap-3"><button onClick={()=>setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 lg:hidden">{mobileOpen?<X size={20}/>:<Menu size={20}/>}</button><div><p className="text-xs font-black text-rose-500">لوحة إدارة De Roma</p><h2 className="text-lg font-black">{currentItem.label}</h2></div></div><Link href="/" target="_blank" className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold sm:inline-flex">معاينة الموقع</Link></header>
        <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">{pageMap[pathname] ?? dashboardHome}</main>
      </div>
      {notice && <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-xl"><span className="inline-flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-400"/>{notice}</span></div>}
    </div>
  );
}
