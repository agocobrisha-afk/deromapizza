"use client";

import { useEffect, useState } from "react";
import { Star, Check, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Review } from "@/lib/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    setReviews(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
    load();
  }

  async function remove(id: string) {
    await supabase.from("reviews").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-ink-soft">جارٍ التحميل...</p>;

  return (
    <div className="max-w-2xl">
      <h1
        className="mb-1 text-2xl font-extrabold text-ink"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        التقييمات
      </h1>
      <p className="mb-7 text-ink-soft">
        وافق على التقييمات عشان تظهر بالموقع، أو احذف الغير مناسب.
      </p>

      <div className="flex flex-col gap-3">
        {reviews.map((r) => (
          <div key={r.id} className="card-shadow rounded-2xl bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < r.rating ? "fill-red text-red" : "text-line"
                      }
                    />
                  ))}
                </div>
                <p className="mt-1.5 text-sm font-bold text-ink">
                  {r.customer_name}
                </p>
                {r.comment && (
                  <p className="mt-1 text-sm text-ink-soft">{r.comment}</p>
                )}
                {!r.is_approved && (
                  <span className="mt-2 inline-block rounded-full bg-red-tint px-2.5 py-0.5 text-[11px] font-bold text-red-dark">
                    بانتظار الموافقة
                  </span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!r.is_approved && (
                  <button
                    onClick={() => approve(r.id)}
                    className="rounded-full bg-red p-2 text-white"
                    title="موافقة"
                  >
                    <Check size={15} />
                  </button>
                )}
                <button
                  onClick={() => remove(r.id)}
                  className="rounded-full border border-line p-2 text-ink-soft hover:text-red-dark"
                  title="حذف"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-ink-soft">ما فيه تقييمات بعد.</p>
        )}
      </div>
    </div>
  );
}
