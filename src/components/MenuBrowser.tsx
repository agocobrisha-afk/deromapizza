"use client";

import { useState } from "react";
import Image from "next/image";
import { Category, Product } from "@/lib/types";

type CategoryWithProducts = Category & { products: Product[] };

export default function MenuBrowser({
  categories,
}: {
  categories: CategoryWithProducts[];
}) {
  const [activeId, setActiveId] = useState(categories[0]?.id);
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  if (!active) return null;

  return (
    <div>
      <div className="sticky top-[73px] z-30 -mx-5 bg-cream/95 px-5 py-3.5 backdrop-blur-md sm:top-[77px]">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-colors ${
                cat.id === activeId
                  ? "border-red bg-red text-white"
                  : "border-line bg-white text-ink-soft hover:border-red/50 hover:text-red"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {cat.name_ar}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {active.subtitle_ar && (
          <p
            className="mb-5 text-ink-soft"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {active.subtitle_ar}
          </p>
        )}

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {active.products.map((item) => (
            <div
              key={item.id}
              className="card-shadow flex gap-4 rounded-2xl bg-white p-3.5 sm:p-4"
            >
              {item.image_url && (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                  <Image
                    src={item.image_url}
                    alt={item.name_ar}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-[15px] font-bold text-ink sm:text-base"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.name_ar}
                  </h3>
                  <span
                    className="shrink-0 rounded-full bg-red-tint px-2.5 py-1 text-[13px] font-extrabold text-red-dark"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.price} د.ل
                  </span>
                </div>
                {item.description_ar && (
                  <p
                    className="mt-1 text-[13px] leading-relaxed text-ink-soft"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {item.description_ar}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
