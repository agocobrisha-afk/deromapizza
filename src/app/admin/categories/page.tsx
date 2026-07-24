import Link from "next/link";
import { ArrowLeft, CirclePlus, GripVertical, Layers3, Pencil, PackageOpen } from "lucide-react";
import { getCategoriesWithProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithProducts();
  const totalProducts = categories.reduce((sum, category) => sum + category.products.length, 0);

  return (
    <div className="space-y-6" dir="rtl">
      <section className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <span className="text-xs font-black text-rose-500">هيكلة المنيو</span>
          <h1 className="mt-1 text-3xl font-black text-slate-950">التصنيفات والترتيب</h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">رتب أقسام المنيو وحدد التصنيف الذي يظهر أولًا للزبائن.</p>
        </div>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-black text-white hover:bg-rose-600">
          <CirclePlus size={17} /> إضافة تصنيف
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-500">عدد التصنيفات</span><Layers3 size={20} className="text-rose-500" /></div>
          <strong className="mt-4 block text-3xl font-black text-slate-950">{categories.length}</strong>
          <p className="mt-1 text-xs text-slate-500">قسم منظم داخل المنيو</p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between"><span className="text-sm font-bold text-slate-500">الأصناف المرتبطة</span><PackageOpen size={20} className="text-sky-500" /></div>
          <strong className="mt-4 block text-3xl font-black text-slate-950">{totalProducts}</strong>
          <p className="mt-1 text-xs text-slate-500">صنف موزع على التصنيفات</p>
        </article>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div>
          <span className="text-xs font-black text-rose-500">الترتيب الحالي</span>
          <h2 className="mt-1 text-2xl font-black text-slate-950">أقسام المنيو</h2>
        </div>

        <div className="mt-6 grid gap-3">
          {categories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center">
              <Layers3 className="mx-auto text-slate-400" size={34} />
              <h3 className="mt-3 text-lg font-black text-slate-800">لا توجد تصنيفات بعد</h3>
              <p className="mt-1 text-sm text-slate-500">أضف أول تصنيف ثم اربط به الأصناف.</p>
            </div>
          ) : categories.map((category, index) => (
            <article key={category.id} className="grid gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-rose-200 sm:grid-cols-[auto_auto_minmax(0,1fr)_auto] sm:items-center">
              <GripVertical size={20} className="hidden text-slate-300 sm:block" />
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-sm font-black text-rose-600">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-lg font-black text-slate-950">{category.name_ar}</h3>
                <p className="mt-1 text-sm text-slate-500">{category.subtitle_ar || "بدون وصف فرعي"}</p>
                <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">{category.products.length} أصناف</span>
              </div>
              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 hover:border-rose-200 hover:text-rose-600">
                <Pencil size={16} /> تعديل
              </button>
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
