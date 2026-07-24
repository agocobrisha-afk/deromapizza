import { FileText, Heading1, AlignRight, MousePointerClick } from "lucide-react";
import { getSiteSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminContentPage() {
  const settings = await getSiteSettings();

  const sections = [
    { title: "الواجهة الرئيسية", description: "العنوان الرئيسي والوصف وأزرار الطلب.", icon: Heading1 },
    { title: "قسم القصة", description: "عنوان القصة والنص التعريفي ومميزات المطعم.", icon: AlignRight },
    { title: "المعرض والتقييمات", description: "عناوين الأقسام والوصف المرافق لها.", icon: FileText },
    { title: "الأزرار والدعوات", description: "تعديل نصوص أزرار المنيو وواتساب والطلب.", icon: MousePointerClick },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="text-xs font-black text-rose-500">محتوى الموقع</span>
        <h1 className="mt-2 text-3xl font-black text-slate-950">النصوص والصفحات</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
          كل النصوص الأساسية مجمعة هنا بدون قوائم قديمة أو حقول مكررة.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {sections.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500"><Icon size={20} /></span>
            <h2 className="mt-4 text-lg font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-800">اسم المطعم</span>
            <input defaultValue={settings.restaurant_name} className="min-h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-rose-400" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-black text-slate-800">الوصف المختصر</span>
            <input defaultValue={settings.tagline} className="min-h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-rose-400" />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="text-sm font-black text-slate-800">عنوان الواجهة الرئيسية</span>
            <input defaultValue={settings.hero_headline} className="min-h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-rose-400" />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="text-sm font-black text-slate-800">النص المميز داخل العنوان</span>
            <input defaultValue={settings.hero_headline_accent} className="min-h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-rose-400" />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="text-sm font-black text-slate-800">وصف الواجهة الرئيسية</span>
            <textarea defaultValue={settings.hero_subheadline} className="min-h-32 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400" />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="text-sm font-black text-slate-800">عنوان قسم القصة</span>
            <input defaultValue={settings.about_title} className="min-h-12 rounded-2xl border border-slate-200 px-4 outline-none focus:border-rose-400" />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="text-sm font-black text-slate-800">نص القصة</span>
            <textarea defaultValue={settings.about_body} className="min-h-36 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400" />
          </label>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="button" className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white">حفظ المحتوى</button>
        </div>
      </section>
    </div>
  );
}
