import Link from "next/link";
import { ArrowLeft, CirclePlus, Eye, PackageOpen, Pencil, Search, Star, Tags } from "lucide-react";
import { getCategoriesWithProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminMenuPage() {
  const categories = await getCategoriesWithProducts();
  const products = categories.flatMap((category) =>
    category.products.map((product) => ({ product, category })),
  );
  const available = products.filter(({ product }) => product.is_available).length;
  const featured = products.filter(({ product }) => product.is_featured).length;

  return (
    <div className="space-y-6" dir="rtl">
      <section className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <span className="text-xs font-black text-rose-500">إدارة المنيو</span>
          <h1 className="mt-1 text-3xl font-black text-slate-950">الأصناف والمنتجات</h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">تحكم في أسماء الأصناف والصور والأسعار وحالة الظهور من مكان واحد.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/menu" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:border-rose-200 hover:text-rose-600">
            <Eye size={17} /> معاينة المنيو
          </Link>
          <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-black text-white hover:bg-rose-600">
            <CirclePlus size={17} /> إضافة صنف
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-500">كل الأصناف</span><PackageOpen size={20} className="text-rose-500" /></div>
          <strong className="mt-4 block text-3xl font-black text-slate-950">{products.length}</strong>
          <p className="mt-1 text-xs text-slate-500">صنف مسجل في النظام</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-500">المتاح حاليًا</span><Tags size={20} className="text-emerald-500" /></div>
          <strong className="mt-4 block text-3xl font-black text-slate-950">{available}</strong>
          <p className="mt-1 text-xs text-slate-500">ظاهر للزبائن داخل المنيو</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-500">الأصناف المميزة</span><Star size={20} className="text-amber-500" /></div>
          <strong className="mt-4 block text-3xl font-black text-slate-950">{featured}</strong>
          <p className="mt-1 text-xs text-slate-500">تظهر في أقسام الترشيحات</p>
        </article>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-black text-rose-500">قائمة الأصناف</span>
            <h2 className="mt-1 text-2xl font-black text-slate-950">كل منتجات المطعم</h2>
          </div>
          <label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500 sm:min-w-[280px]">
            <Search size={17} />
            <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="ابحث عن صنف..." />
          </label>
        </div>

        <div className="mt-5 grid gap-3">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
              <PackageOpen className="mx-auto text-slate-400" size={34} />
              <h3 className="mt-3 text-lg font-black text-slate-800">لا توجد أصناف بعد</h3>
              <p className="mt-1 text-sm text-slate-500">ابدأ بإضافة أول صنف إلى المنيو.</p>
            </div>
          ) : products.map(({ product, category }) => (
            <article key={product.id} className="grid gap-4 rounded-2xl border border-slate-200 p-3 transition hover:border-rose-200 hover:shadow-md sm:grid-cols-[92px_minmax(0,1fr)_auto] sm:items-center">
              <div className="h-24 rounded-2xl bg-slate-100 bg-cover bg-center" style={{ backgroundImage: product.image_url ? `url(${product.image_url})` : undefined }} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-black text-slate-950">{product.name_ar}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${product.is_available ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>{product.is_available ? "متاح" : "مخفي"}</span>
                  {product.is_featured && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-black text-amber-700">مميز</span>}
                </div>
                <p className="mt-1 text-xs font-bold text-rose-500">{category.name_ar}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{product.description_ar || "لا يوجد وصف لهذا الصنف حتى الآن."}</p>
              </div>
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                <strong className="text-lg font-black text-slate-950">{product.price} د.ل</strong>
                <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 hover:border-rose-200 hover:text-rose-600">
                  <Pencil size={16} /> تعديل
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-black text-rose-500">
        العودة إلى لوحة التحكم <ArrowLeft size={16} />
      </Link>
    </div>
  );
}
