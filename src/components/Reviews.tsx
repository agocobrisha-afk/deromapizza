import { Star } from "lucide-react";
import { getApprovedReviews } from "@/lib/queries";
import ReviewForm from "./ReviewForm";

export default async function Reviews() {
  const reviews = await getApprovedReviews();

  return (
    <section id="reviews" className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <h2
        className="mb-7 text-2xl font-extrabold text-ink sm:text-[28px]"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        آراء زبائننا
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {reviews.length === 0 && (
            <p
              className="text-ink-soft sm:col-span-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              كن أول من يشاركنا رأيه!
            </p>
          )}
          {reviews.map((r) => (
            <div
              key={r.id}
              className="card-shadow rounded-2xl bg-white p-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={
                      i < r.rating ? "fill-red text-red" : "text-line"
                    }
                  />
                ))}
              </div>
              {r.comment && (
                <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                  {r.comment}
                </p>
              )}
              <p
                className="mt-3 text-xs font-bold text-ink"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {r.customer_name}
              </p>
            </div>
          ))}
        </div>

        <ReviewForm />
      </div>
    </section>
  );
}
