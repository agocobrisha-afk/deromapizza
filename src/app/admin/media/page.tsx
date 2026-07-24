import { Image as ImageIcon, Upload, ExternalLink } from "lucide-react";
import Link from "next/link";
import { getCategoriesWithProducts, getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminMediaPage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getCategoriesWithProducts(),
  ]);

  const products = categories.flatMap((category) => category.products);
  const images = products.filter((product) => product.image_url).slice(0, 12);

  return (
    <div className="space-y-6" dir="rtl">
      <section className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="text-xs font-black text-rose-500">مكتبة الوسائط</span>
          <h1 className="mt-2 text-3xl font-black text-slate-950">الصور والمعرض</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">إدارة صورة الواجهة وصور المنتجات والمعرض من مكان واحد.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white"><Upload size={17} /> رفع صورة</button>
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700"><ExternalLink size={17} /> معاينة الموقع</Link>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-800">رابط صورة الواجهة الرئيسية</span>
            <input defaultValue={settings.hero_image_url ?? ""} className="min-h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-rose-400" />
          </label>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
            <div className="aspect-[16/7] bg-cover bg-center" style={{ backgroundImage: settings.hero_image_url ? `url(${settings.hero_image_url})` : undefined }} />
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black text-rose-500">صور المنتجات</span>
            <h2 className="mt-1 text-2xl font-black text-slate-950">المكتبة الحالية</h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{images.length} صورة</span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {images.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
              <div className="aspect-[4/3] bg-slate-100 bg-cover bg-center" style={{ backgroundImage: `url(${product.image_url})` }} />
              <div className="p-4">
                <div className="flex items-center gap-2 text-rose-500"><ImageIcon size={16} /><span className="text-xs font-black">صورة منتج</span></div>
                <strong className="mt-2 block text-base font-black text-slate-950">{product.name_ar}</strong>
                <button type="button" className="mt-4 text-sm font-black text-rose-500">استبدال الصورة</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
