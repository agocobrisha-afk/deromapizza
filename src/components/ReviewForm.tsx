"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setStatus("sending");
    const { error } = await supabase.from("reviews").insert({
      customer_name: name.trim(),
      rating,
      comment: comment.trim() || null,
    });
    setStatus(error ? "error" : "sent");
    if (!error) {
      setName("");
      setComment("");
      setRating(5);
    }
  }

  if (status === "sent") {
    return (
      <div
        className="card-shadow rounded-2xl bg-white p-6 text-center"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <p className="font-bold text-ink">شكرًا لك! 🎉</p>
        <p className="mt-1 text-sm text-ink-soft">
          تقييمك وصلنا وراح يظهر بعد المراجعة.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card-shadow rounded-2xl bg-white p-5 sm:p-6"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <p
        className="mb-4 font-extrabold text-ink"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        شاركنا رأيك
      </p>
      <div className="mb-3 flex gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            aria-label={`${n} نجوم`}
          >
            <Star
              size={26}
              className={n <= rating ? "fill-red text-red" : "text-line"}
            />
          </button>
        ))}
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اسمك"
        required
        className="mb-3 w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-red"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="اكتب تجربتك (اختياري)"
        rows={3}
        className="mb-4 w-full resize-none rounded-xl border border-line bg-cream px-4 py-3 text-sm outline-none focus:border-red"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-red py-3 text-sm font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {status === "sending" ? "جارٍ الإرسال..." : "إرسال التقييم"}
      </button>
      {status === "error" && (
        <p className="mt-2 text-center text-xs text-red-dark">
          صار خطأ، حاول مرة ثانية.
        </p>
      )}
    </form>
  );
}
