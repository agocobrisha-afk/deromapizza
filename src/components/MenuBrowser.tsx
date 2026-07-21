"use client";

import { useState } from "react";
import Image from "next/image";
import { menu } from "@/lib/menu-data";

export default function MenuBrowser() {
  const [activeId, setActiveId] = useState(menu[0].id);
  const active = menu.find((c) => c.id === activeId)!;

  return (
    <div>
      <div className="sticky top-[72px] z-30 -mx-5 bg-char-900/95 px-5 py-4 backdrop-blur-md sm:top-[76px]">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {menu.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveId(cat.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                cat.id === activeId
                  ? "border-pomodoro-500 bg-pomodoro-500 text-cream-100"
                  : "border-char-600 text-cream-300 hover:border-gold-500/60 hover:text-gold-300"
              }`}
              style={{ fontFamily: "var(--font-body-ar)" }}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {active.subtitle && (
          <p
            className="mb-6 text-cream-300"
            style={{ fontFamily: "var(--font-body-ar)" }}
          >
            {active.subtitle}
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {active.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-[16px] border border-char-700/70 bg-char-800 p-4"
            >
              {item.image && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[10px]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="text-lg text-cream-100"
                    style={{ fontFamily: "var(--font-display-ar)", fontWeight: 600 }}
                  >
                    {item.name}
                  </h3>
                  <span className="tag-price shrink-0 rounded-full bg-pomodoro-500/15 px-3 py-1 text-sm font-bold text-pomodoro-400">
                    {item.price} د.ل
                  </span>
                </div>
                {item.description && (
                  <p
                    className="mt-1.5 text-sm leading-relaxed text-cream-300"
                    style={{ fontFamily: "var(--font-body-ar)" }}
                  >
                    {item.description}
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
