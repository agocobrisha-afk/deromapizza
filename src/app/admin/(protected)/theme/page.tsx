"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { themePresets } from "@/lib/theme-presets";

export default function AdminThemePage() {
  const [currentId, setCurrentId] = useState<string>("bold-red");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("theme_id")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.theme_id) setCurrentId(data.theme_id);
        setLoading(false);
      });
  }, []);

  async function selectTheme(id: string) {
    setApplying(id);
    await supabase.from("site_settings").update({ theme_id: id }).eq("id", 1);
    setCurrentId(id);
    setApplying(null);
  }

  return (
    <div className="max-w-4xl">
      <h1
        className="mb-1 text-2xl font-extrabold text-ink"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        معرض الثيمات
      </h1>
      <p className="mb-7 text-ink-soft">
        اختر الهوية البصرية للموقع — الألوان والخطوط وشكل الأقسام تتغير فورًا
        بكل الموقع.
      </p>

      {loading ? (
        <p className="text-ink-soft">جارٍ التحميل...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themePresets.map((t) => {
            const active = t.id === currentId;
            return (
              <button
                key={t.id}
                onClick={() => selectTheme(t.id)}
                disabled={applying !== null}
                className={`card-shadow overflow-hidden rounded-2xl bg-white text-right transition-transform hover:scale-[1.015] disabled:opacity-70 ${
                  active ? "ring-2 ring-offset-2" : ""
                }`}
                style={
                  active
                    ? ({ "--tw-ring-color": t.colors.accent } as React.CSSProperties)
                    : undefined
                }
              >
                <div
                  className="flex h-24 items-end gap-1.5 p-3"
                  style={{ background: t.colors.dark }}
                >
                  <span
                    className="h-8 w-8 rounded-lg"
                    style={{ background: t.colors.accent }}
                  />
                  <span
                    className="h-8 w-8 rounded-lg"
                    style={{ background: t.colors.surface }}
                  />
                  <span
                    className="h-8 w-8 rounded-lg"
                    style={{ background: t.colors.bg }}
                  />
                </div>
                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-bold text-ink">{t.name}</p>
                    {active && (
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full text-white"
                        style={{ background: t.colors.accent }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] leading-relaxed text-ink-soft">
                    {t.description}
                  </p>
                  {applying === t.id && (
                    <p className="mt-2 text-xs text-red">جارٍ التطبيق...</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
