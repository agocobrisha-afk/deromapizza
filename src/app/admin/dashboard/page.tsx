import Link from "next/link";
import {
  ArrowLeft,
  ClipboardList,
  Eye,
  Image as ImageIcon,
  PackageOpen,
  Palette,
  Settings,
  ShoppingBag,
  Star,
  Tags,
} from "lucide-react";
import { getCategoriesWithProducts, getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategoriesWithProducts(),
  ]);

  const products = categories.flatMap((category) => category.products);
  const availableProducts = products.filter((product) => product.is_available).length;
  const featuredProducts = products.filter((product) => product.is_featured).length;
  const completionChecks = [
    settings.restaurant_name,
    settings.phone,
    settings.whatsapp,
    settings.address,
    settings.hours,
    settings.tagline,
    settings.hero_image_url,
    products.length > 0 ? "products" : "",
  ];
  const completion = Math.round((completionChecks.filter(Boolean).length / completionChecks.length) * 100);

  const actions = [
    { href: "/admin/menu", label: "إدارة الأصناف", description: "إضافة وتعديل الأسعار والصور والتوفر", icon: PackageOpen },
    { href: "/admin/categories", label: "تنظيم التصنيفات", description: "ترتيب أقسام المنيو وإدارة ظهورها", icon: Tags },
    { href: "/admin/content", label: "تحرير محتوى الموقع", description: "العناوين والنصوص والأزرار والأقسام", icon: ClipboardList },
    { href: "/admin/media", label: "الصور والمعرض", description: "صورة الواجهة وصور الأقسام والمنتجات", icon: ImageIcon },
    { href: "/admin/appearance", label: "القوالب والمظهر", description: "الألوان وشكل الهيدر والبطاقات", icon: Palette },
    { href: "/admin/settings", label: "بيانات المطعم", description: "واتساب والهاتف والعنوان وساعات العمل", icon: Settings },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <section className="overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-xl shadow-slate-200/60">
        <div className="grid gap-8 px-6 py-7 sm:px-8 lg:grid-cols-[1.3fr_.7fr] lg:px-10 lg:py-10">
          <div>
            <span className="inline-flex rounded-full bg-rose-500/15 px-3 py-1 text-xs font-black text-rose-300">
              Restaurant CMS
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
              إدارة {settings.restaurant_name} من مكان واحد
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              لوحة نظيفة لإدارة المنيو والمحتوى والصور والقالب وبيانات التواصل بدون الرجوع إلى القوائم القديمة.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admin/menu" className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white hover:bg-rose-600">
                إدارة المنيو <ArrowLeft size={17} />
              </Link>
              <Link href="/" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-black text-white hover:bg-white/10">
                <Eye size={17} /> معاينة الموقع
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400">اكتمال إعداد الموقع</p>
                <strong className="mt-2 block text-4xl font-black">{completion}%</strong>
              </div>
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500 text-lg font-black">DR</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-rose-500" style={{ width: `${completion}%` }} />
            </div>
            <p className="mt-4 text-xs leading-6 text-slate-400">
              يعتمد المؤشر على اكتمال بيانات المطعم وصورة الواجهة ووجود أصناف داخل المنيو.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-500">كل الأصناف</span><PackageOpen size={20} className="text-rose-500" /></div>
          <strong className="mt-4 block text-3xl font-black text-slate-950">{products.length}</strong>
          <p className="mt-1 text-xs text-slate-500">صنف مسجل في المنيو</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-500">الأصناف المتاحة</span><ShoppingBag size={20} className="text-emerald-500" /></div>
          <strong className="mt-4 block text-3xl font-black text-slate-950">{availableProducts}</strong>
          <p className="mt-1 text-xs text-slate-500">ظاهرة حاليًا للزبائن</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-500">التصنيفات</span><Tags size={20} className="text-sky-500" /></div>
          <strong className="mt-4 block text-3xl font-black text-slate-950">{categories.length}</strong>
          <p className="mt-1 text-xs text-slate-500">قسم مرتب داخل المنيو</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-500">الأكثر تميزًا</span><Star size={20} className="text-amber-500" /></div>
          <strong className="mt-4 block text-3xl font-black text-slate-950">{featuredProducts}</strong>
          <p className="mt-1 text-xs text-slate-500">صنف مميز في الموقع</p>
        </article>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-black text-rose-500">إدارة سريعة</span>
            <h2 className="mt-1 text-2xl font-black text-slate-950">الأقسام الأساسية</h2>
          </div>
          <p className="text-sm text-slate-500">كل بطاقة تفتح قسمًا مستقلًا بدون قوائم قديمة أو إعدادات مكررة.</p>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-rose-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/70">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm"><Icon size={20} /></span>
                <strong className="mt-4 block text-lg font-black text-slate-950">{action.label}</strong>
                <p className="mt-2 text-sm leading-6 text-slate-500">{action.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-rose-500">فتح القسم <ArrowLeft size={16} className="transition group-hover:-translate-x-1" /></span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
