import { CheckCircle2, Star, Trash2 } from "lucide-react";
import { getApprovedReviews } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminReviewsPage() {
  const reviews = await getApprovedReviews();
  return (
    <div className="space-y-6" dir="rtl">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="text-xs font-black text-rose-500">سمعة المطعم</span>
        <h1 className="mt-1 text-3xl font-black text-slate-950">التقييمات</h1>
        <p className="mt-2 text-sm text-slate-500">مراجعة آراء الزبائن وإدارة ما يظهر في الموقع.</p>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-sm font-bold text-slate-500">المعتمدة</span><strong className="mt-2 block text-3xl font-black">{reviews.length}</strong></article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-sm font-bold text-slate-500">متوسط التقييم</span><strong className="mt-2 block text-3xl font-black">4.9</strong></article>
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><span className="text-sm font-bold text-slate-500">الحالة</span><strong className="mt-2 block text-3xl font-black text-emerald-600">نشطة</strong></article>
      </section>
      <section className="space-y-4">
        {(reviews.length ? reviews : [
          { id: "demo-1", customer_name: "سارة محمد", rating: 5, comment: "الخدمة سريعة والطعم ممتاز.", is_approved: true, created_at: new Date().toISOString() },
          { id: "demo-2", customer_name: "أحمد الورفلي", rating: 5, comment: "تجربة ممتازة وجودة ثابتة.", is_approved: true, created_at: new Date().toISOString() },
        ]).map((review) => (
          <article key={review.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2"><strong className="text-lg text-slate-950">{review.customer_name}</strong><span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700"><Star size={14} fill="currentColor" /> {review.rating}</span></div>
                <p className="mt-3 leading-7 text-slate-600">{review.comment || "بدون تعليق مكتوب"}</p>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700"><CheckCircle2 size={16} /> معتمد</button>
                <button className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-black text-rose-600"><Trash2 size={16} /> حذف</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
