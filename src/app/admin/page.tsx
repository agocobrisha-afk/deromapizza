import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  LayoutDashboard,
  PackageOpen,
  Palette,
  Settings,
  Tags,
  Type,
} from "lucide-react";
import { getCategoriesWithProducts, getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategoriesWithProducts(),
  ]);

  const products = categories.flatMap((category) => category.products);
  const availableProducts = products.filter((product) => product.is_available).length;

  const sections = [
    {
      href: "/admin/menu",
      title: "إدارة الأصناف",
      description: "إضافة الأصناف وتعديل الأسعار والصور وحالة التوفر.",
      icon: PackageOpen,
    },
    {
      href: "/admin/categories",
      title: "التصنيفات",
      description: "تنظيم أقسام المنيو وترتيب ظهورها للزبائن.",
      icon: Tags,
    },
    {
      href: "/admin/content",
      title: "محتوى الموقع",
      description: "تعديل العناوين والنصوص والأزرار والأقسام الرئيسية.",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/media",
      title: "الصور والمعرض",
      description: "إدارة صورة الواجهة وصور الأقسام والمنتجات.",
      icon: ImageIcon,
    },
    {
      href: "/admin/appearance",
      title: "القوالب والمظهر",
      description: "اختيار القالب والألوان وأسلوب البطاقات والهيدر.",
      icon: Palette,
    },
    {
      href: "/admin/typography",
      title: "الخطوط والأحجام",
      description: "اختيار الخطوط والتحكم في أحجام النصوص والعناوين.",
      icon: Type,
    },
    {
      href: "/admin/settings",
      title: "بيانات المطعم",
      description: "الهاتف وواتساب والعنوان وساعات العمل والبيانات العامة.",
      icon: Settings,
    },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-[#f4f6fa] px-4 py-6 text-slate-950 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-xl shadow-slate-300/40">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.35fr_.65fr] lg:p-10">
            <div>
              <span className="inline-flex rounded-full bg-rose-500/15 px-3 py-1 text-xs font-black text-rose-300">
                RESTAURANT CMS
              </span>
              <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
                لوحة إدارة {settings.restaurant_name}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                بدأنا إعادة البناء من الصفر. هذه الصفحة هي الأساس الجديد، بدون القوائم القديمة أو الأقسام المتداخلة.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/admin/menu" className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black hover:bg-rose-600">
                  إدارة الأصناف <ArrowLeft size={17} />
                </Link>
                <Link href="/" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-black hover:bg-white/10">
                  معاينة الموقع
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 self-start">
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="text-xs font-bold text-slate-400">كل الأصناف</span>
                <strong className="mt-2 block text-3xl font-black">{products.length}</strong>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="text-xs font-bold text-slate-400">المتاحة</span>
                <strong className="mt-2 block text-3xl font-black">{availableProducts}</strong>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="text-xs font-bold text-slate-400">التصنيفات</span>
                <strong className="mt-2 block text-3xl font-black">{categories.length}</strong>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="text-xs font-bold text-slate-400">الحالة</span>
                <strong className="mt-2 block text-lg font-black text-emerald-300">جاهز للبناء</strong>
              </article>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div>
            <span className="text-xs font-black text-rose-500">الهيكل الجديد</span>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">ابدأ من الأقسام الأساسية</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              كل قسم مستقل وواضح، وسيتم تطويره وربطه فعليًا بدون الرجوع لأي كود قديم.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-rose-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/70"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
                    <Icon size={20} />
                  </span>
                  <strong className="mt-4 block text-lg font-black">{section.title}</strong>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{section.description}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-rose-500">
                    فتح القسم <ArrowLeft size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
