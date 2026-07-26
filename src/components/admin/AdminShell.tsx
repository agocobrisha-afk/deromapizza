"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  PackageOpen,
  Palette,
  Plus,
  Save,
  Search,
  Settings,
  ShoppingBag,
  Tags,
  Trash2,
  Truck,
  Type,
  Upload,
  Users,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type Section =
  | "dashboard"
  | "orders"
  | "products"
  | "categories"
  | "content"
  | "media"
  | "reviews"
  | "appearance"
  | "delivery"
  | "users"
  | "settings";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  available: boolean;
  featured: boolean;
};

type Category = { id: number; name: string; active: boolean };
type Order = { id: string; customer: string; total: number; status: string; time: string };

const navigation = [
  { id: "dashboard" as Section, label: "الرئيسية", icon: LayoutDashboard },
  { id: "orders" as Section, label: "الطلبات", icon: ShoppingBag },
  { id: "products" as Section, label: "الأصناف", icon: PackageOpen },
  { id: "categories" as Section, label: "التصنيفات", icon: Tags },
  { id: "content" as Section, label: "المحتوى", icon: FileText },
  { id: "media" as Section, label: "الصور والوسائط", icon: ImageIcon },
  { id: "reviews" as Section, label: "التقييمات", icon: MessageSquareText },
  { id: "appearance" as Section, label: "القوالب والمظهر", icon: Palette },
  { id: "delivery" as Section, label: "التوصيل", icon: Truck },
  { id: "users" as Section, label: "المستخدمون", icon: Users },
  { id: "settings" as Section, label: "الإعدادات", icon: Settings },
];

const initialProducts: Product[] = [
  { id: 1, name: "كالازوني مفروم", price: 22, category: "البيتزا", available: true, featured: true },
  { id: 2, name: "مشتعلة دجاج", price: 24, category: "البيتزا", available: true, featured: true },
  { id: 3, name: "مقلوبة دجاج", price: 18, category: "المعجنات", available: true, featured: false },
  { id: 4, name: "باقيت دجاج", price: 23, category: "المعجنات", available: true, featured: false },
];

const initialCategories: Category[] = [
  { id: 1, name: "البيتزا", active: true },
  { id: 2, name: "المعجنات", active: true },
  { id: 3, name: "المشروبات", active: true },
];

const initialOrders: Order[] = [
  { id: "DR-1042", customer: "محمد سالم", total: 58, status: "جديد", time: "منذ 4 دقائق" },
  { id: "DR-1041", customer: "سارة علي", total: 36, status: "قيد التحضير", time: "منذ 18 دقيقة" },
  { id: "DR-1040", customer: "أحمد الورفلي", total: 74, status: "جاهز", time: "منذ 31 دقيقة" },
];

const themes = [
  { id: "modern", name: "Modern", colors: ["#0f172a", "#f8fafc", "#ff174f"] },
  { id: "luxury", name: "Luxury", colors: ["#171717", "#f6f0e2", "#c68b2c"] },
  { id: "minimal", name: "Minimal", colors: ["#111827", "#ffffff", "#94a3b8"] },
  { id: "dark", name: "Dark", colors: ["#050505", "#18181b", "#ef4444"] },
  { id: "italian", name: "Italian", colors: ["#166534", "#ffffff", "#dc2626"] },
];

export default function AdminShell({ children: _legacyChildren }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | "loading">("loading");
  const [section, setSection] = useState<Section>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [theme, setTheme] = useState("modern");
  const [restaurant, setRestaurant] = useState({
    name: "De Roma",
    phone: "0944400150",
    whatsapp: "218944400150",
    address: "طريق السدرة، طرابلس، ليبيا",
    hours: "يوميًا 1:00 ظهرًا – 1:00 صباحًا",
    heroTitle: "بيتزا بطعم ومذاق خرافي",
    heroText: "طعم إيطالي حقيقي في قلب طرابلس",
    story: "نخبز كل قطعة وكأنها أول طلب في اليوم.",
    deliveryFee: "5",
    minimumOrder: "25",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) router.replace("/admin/login");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) router.replace("/admin/login");
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("deroma_admin_cms_v1");
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed.products) setProducts(parsed.products);
      if (parsed.categories) setCategories(parsed.categories);
      if (parsed.orders) setOrders(parsed.orders);
      if (parsed.theme) setTheme(parsed.theme);
      if (parsed.restaurant) setRestaurant(parsed.restaurant);
    } catch {
      // Keep safe defaults when stored data is invalid.
    }
  }, []);

  const persist = (message = "تم حفظ التغييرات") => {
    localStorage.setItem(
      "deroma_admin_cms_v1",
      JSON.stringify({ products, categories, orders, theme, restaurant }),
    );
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  const filteredProducts = useMemo(
    () => products.filter((item) => item.name.includes(search) || item.category.includes(search)),
    [products, search],
  );

  if (session === "loading") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100" dir="rtl">
        <div className="rounded-2xl bg-white px-6 py-4 font-bold text-slate-500 shadow-sm">جارٍ تشغيل لوحة التحكم...</div>
      </main>
    );
  }
  if (!session) return null;

  const openSection = (id: Section) => {
    setSection(id);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Sidebar = () => (
    <aside className="flex h-full w-[292px] flex-col bg-[#081122] text-white">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black tracking-[.2em] text-rose-300">RESTAURANT CMS</p>
            <h1 className="mt-1 text-2xl font-black">De Roma</h1>
            <p className="mt-1 text-xs text-slate-400">لوحة تحكم السكربت</p>
          </div>
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-500 font-black shadow-lg shadow-rose-950/40">DR</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => openSection(item.id)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-right text-sm font-bold transition ${active ? "bg-rose-500 text-white shadow-lg shadow-rose-950/30" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}
            >
              <span className="flex items-center gap-3"><Icon size={18} />{item.label}</span>
              <ChevronLeft size={16} className={active ? "opacity-100" : "opacity-30"} />
            </button>
          );
        })}
      </nav>
      <div className="space-y-2 border-t border-white/10 p-4">
        <Link href="/" target="_blank" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-slate-300 hover:bg-white/5">
          <ExternalLink size={17} /> معاينة الموقع
        </Link>
        <button type="button" onClick={signOut} className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white">
          <LogOut size={17} /> تسجيل الخروج
        </button>
      </div>
    </aside>
  );

  const Header = ({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) => (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black text-rose-500">RESTAURANT CMS</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{subtitle}</p>
        </div>
        {action}
      </div>
    </section>
  );

  const fieldClass = "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-rose-400";
  const primaryButton = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 text-sm font-black text-white shadow-lg shadow-rose-200";

  const dashboard = (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-slate-950 text-white shadow-xl">
        <div className="grid gap-8 p-7 lg:grid-cols-[1.25fr_.75fr] lg:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-black text-rose-300">لوحة الإدارة الاحترافية</span>
            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">تحكم كامل بالمطعم والموقع من شاشة واحدة</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">أصناف، طلبات، تصنيفات، محتوى، صور، تقييمات، توصيل، مستخدمون، قوالب وإعدادات.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["الأصناف", products.length],
              ["التصنيفات", categories.length],
              ["طلبات مفتوحة", orders.filter((o) => o.status !== "تم التسليم").length],
              ["المتاح", products.filter((p) => p.available).length],
            ].map(([label, value]) => (
              <article key={String(label)} className="rounded-2xl border border-white/10 bg-white/5 p-4"><span className="text-xs text-slate-400">{label}</span><strong className="mt-2 block text-2xl font-black">{value}</strong></article>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {navigation.slice(1, 9).map((item) => {
          const Icon = item.icon;
          return <button key={item.id} onClick={() => openSection(item.id)} className="rounded-2xl border border-slate-200 bg-white p-5 text-right shadow-sm transition hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg"><span className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-500"><Icon size={20} /></span><strong className="mt-4 block text-lg font-black">{item.label}</strong><span className="mt-3 block text-sm text-slate-500">فتح وإدارة القسم</span></button>;
        })}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black">آخر الطلبات</h2><div className="mt-4 space-y-3">{orders.map((o) => <div key={o.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><div><strong>{o.id}</strong><p className="text-sm text-slate-500">{o.customer}</p></div><div className="text-left"><strong>{o.total} د.ل</strong><p className="text-xs text-rose-500">{o.status}</p></div></div>)}</div></article>
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-black">حالة النظام</h2><div className="mt-5 space-y-4">{["تسجيل الدخول والحماية", "نسخة الهاتف", "حفظ إعدادات اللوحة", "إدارة المحتوى"].map((x) => <div key={x} className="flex items-center gap-3"><CheckCircle2 className="text-emerald-500" size={20} /><span className="font-bold">{x}</span></div>)}</div></article>
      </section>
    </div>
  );

  const productsPage = (
    <div className="space-y-6">
      <Header title="إدارة الأصناف" subtitle="إضافة وتعديل وحذف وإخفاء الأصناف والأسعار." action={<button className={primaryButton} onClick={() => setProducts([...products, { id: Date.now(), name: "صنف جديد", price: 0, category: categories[0]?.name ?? "عام", available: true, featured: false }])}><Plus size={18} /> إضافة صنف</button>} />
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4"><Search size={18} /><input className="min-h-12 w-full bg-transparent outline-none" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث بالاسم أو التصنيف" /></div>
        <div className="mt-5 space-y-3">{filteredProducts.map((p) => <article key={p.id} className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_130px_140px_auto] md:items-center"><input className={fieldClass} value={p.name} onChange={(e) => setProducts(products.map((x) => x.id === p.id ? { ...x, name: e.target.value } : x))} /><input type="number" className={fieldClass} value={p.price} onChange={(e) => setProducts(products.map((x) => x.id === p.id ? { ...x, price: Number(e.target.value) } : x))} /><select className={fieldClass} value={p.category} onChange={(e) => setProducts(products.map((x) => x.id === p.id ? { ...x, category: e.target.value } : x))}>{categories.map((c) => <option key={c.id}>{c.name}</option>)}</select><div className="flex gap-2"><button onClick={() => setProducts(products.map((x) => x.id === p.id ? { ...x, available: !x.available } : x))} className={`rounded-xl px-3 py-2 text-sm font-bold ${p.available ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{p.available ? "متاح" : "مخفي"}</button><button onClick={() => setProducts(products.filter((x) => x.id !== p.id))} className="rounded-xl border border-rose-200 px-3 text-rose-500"><Trash2 size={17} /></button></div></article>)}</div>
        <button onClick={() => persist("تم حفظ الأصناف")} className={`${primaryButton} mt-6`}><Save size={18} /> حفظ الأصناف</button>
      </section>
    </div>
  );

  const categoriesPage = (
    <div className="space-y-6"><Header title="التصنيفات" subtitle="إنشاء أقسام المنيو والتحكم في ظهورها." action={<button className={primaryButton} onClick={() => setCategories([...categories, { id: Date.now(), name: "تصنيف جديد", active: true }])}><Plus size={18} /> إضافة تصنيف</button>} /><section className="space-y-3 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">{categories.map((c) => <article key={c.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center"><input className={`${fieldClass} flex-1`} value={c.name} onChange={(e) => setCategories(categories.map((x) => x.id === c.id ? { ...x, name: e.target.value } : x))} /><button onClick={() => setCategories(categories.map((x) => x.id === c.id ? { ...x, active: !x.active } : x))} className="rounded-xl border border-slate-200 px-4 py-3 font-bold">{c.active ? "ظاهر" : "مخفي"}</button><button onClick={() => setCategories(categories.filter((x) => x.id !== c.id))} className="rounded-xl border border-rose-200 px-4 py-3 text-rose-500"><Trash2 size={17} /></button></article>)}<button onClick={() => persist("تم حفظ التصنيفات")} className={primaryButton}><Save size={18} /> حفظ</button></section></div>
  );

  const ordersPage = (
    <div className="space-y-6"><Header title="الطلبات" subtitle="تابع الطلب من الاستلام حتى التسليم." /><section className="grid gap-4 lg:grid-cols-3">{orders.map((o) => <article key={o.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><strong>{o.id}</strong><span className="text-xs text-slate-400">{o.time}</span></div><h3 className="mt-4 text-lg font-black">{o.customer}</h3><p className="mt-1 text-2xl font-black text-rose-500">{o.total} د.ل</p><select className={`${fieldClass} mt-5`} value={o.status} onChange={(e) => setOrders(orders.map((x) => x.id === o.id ? { ...x, status: e.target.value } : x))}><option>جديد</option><option>قيد التحضير</option><option>جاهز</option><option>خرج للتوصيل</option><option>تم التسليم</option><option>ملغي</option></select></article>)}</section><button onClick={() => persist("تم تحديث الطلبات")} className={primaryButton}><Save size={18} /> حفظ حالات الطلبات</button></div>
  );

  const contentPage = (
    <div className="space-y-6"><Header title="محتوى الموقع" subtitle="عدل نصوص الصفحة الرئيسية دون لمس الكود." /><section className="grid gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">{[["اسم المطعم", "name"], ["عنوان الهيرو", "heroTitle"], ["النص القصير", "heroText"], ["قصة المطعم", "story"]].map(([label, key]) => <label key={key} className="grid gap-2"><span className="font-bold">{label}</span><textarea className={`${fieldClass} min-h-28 py-3`} value={restaurant[key as keyof typeof restaurant]} onChange={(e) => setRestaurant({ ...restaurant, [key]: e.target.value })} /></label>)}<button onClick={() => persist("تم حفظ المحتوى")} className={`${primaryButton} md:col-span-2`}><Save size={18} /> حفظ المحتوى</button></section></div>
  );

  const mediaPage = (
    <div className="space-y-6"><Header title="الصور والوسائط" subtitle="مكتبة موحدة لصور الواجهة والمعرض والمنتجات." action={<button className={primaryButton} onClick={() => persist("تم تجهيز زر رفع الصور") }><Upload size={18} /> رفع صورة</button>} /><section className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4,5,6,7,8].map((i) => <article key={i} className="overflow-hidden rounded-2xl border border-slate-200"><div className="aspect-video bg-gradient-to-br from-amber-200 via-orange-300 to-rose-400"/><div className="flex items-center justify-between p-3"><span className="text-sm font-bold">صورة {i}</span><button className="text-rose-500"><Trash2 size={17}/></button></div></article>)}</section></div>
  );

  const reviewsPage = (
    <div className="space-y-6"><Header title="التقييمات" subtitle="راجع آراء الزبائن قبل نشرها." /><section className="grid gap-4 lg:grid-cols-2">{["الخدمة ممتازة والطعم رائع", "أفضل بيتزا في طرابلس", "التوصيل سريع والطلب ساخن", "تجربة ممتازة وسأكررها"].map((text, i) => <article key={text} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="text-amber-400">★★★★★</div><p className="mt-3 leading-7 text-slate-600">{text}</p><div className="mt-5 flex gap-2"><button className="rounded-xl bg-emerald-50 px-4 py-2 font-bold text-emerald-700">اعتماد</button><button className="rounded-xl border border-rose-200 px-4 py-2 font-bold text-rose-500">حذف</button></div></article>)}</section></div>
  );

  const appearancePage = (
    <div className="space-y-6"><Header title="القوالب والمظهر" subtitle="اختيار قالب كامل بدون الاعتماد على أعمدة قاعدة البيانات القديمة." /><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{themes.map((t) => <button key={t.id} onClick={() => setTheme(t.id)} className={`rounded-[26px] border bg-white p-5 text-right shadow-sm ${theme === t.id ? "border-rose-500 ring-2 ring-rose-100" : "border-slate-200"}`}><div className="flex h-16 overflow-hidden rounded-xl">{t.colors.map((c) => <span key={c} className="flex-1" style={{ backgroundColor: c }} />)}</div><strong className="mt-4 block text-xl">{t.name}</strong><p className="mt-1 text-sm text-slate-500">قالب متكامل للواجهة والبطاقات.</p></button>)}</section><section className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-3"><label className="grid gap-2"><span className="font-bold">اللون الأساسي</span><input type="color" defaultValue="#ff174f" className="h-12 w-full rounded-xl" /></label><label className="grid gap-2"><span className="font-bold">خط العناوين</span><select className={fieldClass}><option>Cairo</option><option>Changa</option><option>Alexandria</option><option>Tajawal</option></select></label><label className="grid gap-2"><span className="font-bold">استدارة البطاقات</span><select className={fieldClass}><option>متوسطة</option><option>كبيرة</option><option>حادة</option></select></label><button onClick={() => persist("تم حفظ القالب والمظهر")} className={`${primaryButton} md:col-span-3`}><Save size={18} /> حفظ المظهر</button></section></div>
  );

  const deliveryPage = (
    <div className="space-y-6"><Header title="التوصيل" subtitle="الرسوم والحد الأدنى ومناطق التوصيل." /><section className="grid gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2"><label className="grid gap-2"><span className="font-bold">رسوم التوصيل</span><input className={fieldClass} value={restaurant.deliveryFee} onChange={(e) => setRestaurant({ ...restaurant, deliveryFee: e.target.value })} /></label><label className="grid gap-2"><span className="font-bold">الحد الأدنى للطلب</span><input className={fieldClass} value={restaurant.minimumOrder} onChange={(e) => setRestaurant({ ...restaurant, minimumOrder: e.target.value })} /></label><label className="grid gap-2 md:col-span-2"><span className="font-bold">مناطق التوصيل</span><textarea className={`${fieldClass} min-h-32 py-3`} defaultValue="طرابلس المركز، عين زارة، السدرة، صلاح الدين" /></label><button onClick={() => persist("تم حفظ إعدادات التوصيل")} className={`${primaryButton} md:col-span-2`}><Save size={18} /> حفظ التوصيل</button></section></div>
  );

  const usersPage = (
    <div className="space-y-6"><Header title="المستخدمون والصلاحيات" subtitle="مدير، موظف طلبات، محرر محتوى." action={<button className={primaryButton}><Plus size={18} /> إضافة مستخدم</button>} /><section className="space-y-3 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">{[["المدير الرئيسي", "مدير كامل"], ["موظف الطلبات", "إدارة الطلبات"], ["محرر المحتوى", "المحتوى والصور"]].map(([name, role]) => <article key={name} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"><div><strong>{name}</strong><p className="text-sm text-slate-500">{role}</p></div><button className="rounded-xl border border-slate-200 px-4 py-2 font-bold">تعديل</button></article>)}</section></div>
  );

  const settingsPage = (
    <div className="space-y-6"><Header title="الإعدادات العامة" subtitle="بيانات المطعم والتواصل وساعات العمل." /><section className="grid gap-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">{[["اسم المطعم", "name"], ["رقم الهاتف", "phone"], ["رقم واتساب", "whatsapp"], ["العنوان", "address"], ["ساعات العمل", "hours"]].map(([label, key]) => <label key={key} className="grid gap-2"><span className="font-bold">{label}</span><input className={fieldClass} value={restaurant[key as keyof typeof restaurant]} onChange={(e) => setRestaurant({ ...restaurant, [key]: e.target.value })} /></label>)}<label className="grid gap-2"><span className="font-bold">العملة</span><select className={fieldClass}><option>د.ل — الدينار الليبي</option></select></label><button onClick={() => persist("تم حفظ إعدادات المطعم")} className={`${primaryButton} md:col-span-2`}><Save size={18} /> حفظ الإعدادات</button></section></div>
  );

  const pages: Record<Section, React.ReactNode> = {
    dashboard,
    orders: ordersPage,
    products: productsPage,
    categories: categoriesPage,
    content: contentPage,
    media: mediaPage,
    reviews: reviewsPage,
    appearance: appearancePage,
    delivery: deliveryPage,
    users: usersPage,
    settings: settingsPage,
  };

  return (
    <div className="min-h-screen bg-[#f4f6fa] text-slate-950" dir="rtl">
      <div className="fixed inset-y-0 right-0 z-40 hidden lg:block"><Sidebar /></div>
      {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="إغلاق القائمة" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/55 backdrop-blur-sm"/><div className="absolute inset-y-0 right-0 shadow-2xl"><Sidebar /></div></div>}
      <div className="lg:pr-[292px]">
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><button onClick={() => setMobileOpen(true)} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 lg:hidden"><Menu size={21}/></button><div><p className="text-xs font-black text-rose-500">لوحة إدارة De Roma</p><h2 className="text-lg font-black">{navigation.find((n) => n.id === section)?.label}</h2></div></div>
          <div className="flex items-center gap-2"><button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600"><Bell size={18}/></button><Link href="/" target="_blank" className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold sm:inline-flex">معاينة الموقع</Link></div>
        </header>
        <main className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">{pages[section]}</main>
      </div>
      {notice && <div className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl"><span className="inline-flex items-center gap-2"><CheckCircle2 size={18} className="text-emerald-400" />{notice}</span></div>}
    </div>
  );
}
