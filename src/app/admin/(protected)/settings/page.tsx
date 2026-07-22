"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { defaultSettings } from "@/lib/default-settings";
import { SiteSettings } from "@/lib/types";

const fields: {
  key: keyof SiteSettings;
  label: string;
  type?: "text" | "textarea";
}[] = [
  { key: "restaurant_name", label: "اسم المطعم" },
  { key: "tagline", label: "وصف قصير (يظهر بالفوتر)" },
  { key: "hero_badge", label: "شارة أعلى الهيرو" },
  { key: "hero_headline", label: "عنوان الهيرو (السطر الأول)" },
  { key: "hero_headline_accent", label: "عنوان الهيرو (الجزء الملون)" },
  { key: "hero_subheadline", label: "وصف الهيرو", type: "textarea" },
  { key: "cta_primary_label", label: "زر الطلب الرئيسي" },
  { key: "cta_secondary_label", label: "زر واتساب" },
  { key: "about_badge", label: "شارة قسم القصة" },
  { key: "about_title", label: "عنوان القصة" },
  { key: "about_body", label: "نص القصة", type: "textarea" },
  { key: "phone", label: "رقم الهاتف" },
  { key: "whatsapp", label: "رقم واتساب (بصيغة دولية بدون +)" },
  { key: "address", label: "العنوان" },
  { key: "hours", label: "أوقات العمل" },
  { key: "presto_url", label: "رابط بريستو (اختياري)" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings({ ...defaultSettings, ...data });
        setLoading(false);
      });
  }, []);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleImageUpload(
    file: File,
    field: "logo_url" | "hero_image_url"
  ) {
    const setUploading =
      field === "logo_url" ? setUploadingLogo : setUploadingHero;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${field}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      update(field, data.publicUrl);
    }
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    const payload: Record<string, unknown> = { ...settings, id: 1 };
    const { error } = await supabase.from("site_settings").upsert(payload);
    setSaving(false);
    if (!error) setSaved(true);
  }

  if (loading) return <p className="text-ink-soft">جارٍ التحميل...</p>;

  return (
    <div className="max-w-2xl">
      <h1
        className="mb-1 text-2xl font-extrabold text-ink"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        إعدادات الموقع
      </h1>
      <p className="mb-7 text-ink-soft">
        أي شيء تغيّره هنا يظهر فورًا على الموقع.
      </p>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-bold text-ink">
            الشعار (Logo)
          </label>
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white">
              {settings.logo_url ? (
                <Image
                  src={settings.logo_url}
                  alt="logo"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-ink-faint">لا يوجد</span>
              )}
            </div>
            <label className="cursor-pointer rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:border-red hover:text-red">
              {uploadingLogo ? "جارٍ الرفع..." : "رفع صورة"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleImageUpload(e.target.files[0], "logo_url")
                }
              />
            </label>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-ink">
            صورة الهيرو الرئيسية
          </label>
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white">
              {settings.hero_image_url && (
                <Image
                  src={settings.hero_image_url}
                  alt="hero"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <label className="cursor-pointer rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:border-red hover:text-red">
              {uploadingHero ? "جارٍ الرفع..." : "رفع صورة"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  handleImageUpload(e.target.files[0], "hero_image_url")
                }
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              {f.label}
            </label>
            {f.type === "textarea" ? (
              <textarea
                value={(settings[f.key] as string) ?? ""}
                onChange={(e) => update(f.key, e.target.value as never)}
                rows={3}
                className="w-full resize-none rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-red"
              />
            ) : (
              <input
                value={(settings[f.key] as string) ?? ""}
                onChange={(e) => update(f.key, e.target.value as never)}
                className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-red"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-7 rounded-full bg-red px-8 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {saving ? "جارٍ الحفظ..." : saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
      </button>
    </div>
  );
}
