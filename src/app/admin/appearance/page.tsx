"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Eye, Palette, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ThemePreset = {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  card: string;
};

const presets: ThemePreset[] = [
  { id: "modern", name: "Modern", description: "أبيض نظيف مع أحمر قوي", primary: "#e11d48", secondary: "#111827", background: "#f8fafc", text: "#111827", card: "#ffffff" },
  { id: "luxury", name: "Luxury", description: "أسود وذهبي بطابع فاخر", primary: "#c28b36", secondary: "#0f0f0f", background: "#f7f2e8", text: "#171717", card: "#fffdf8" },
  { id: "minimal", name: "Minimal", description: "هادئ وبسيط ومساحات واسعة", primary: "#111827", secondary: "#6b7280", background: "#ffffff", text: "#111827", card: "#f9fafb" },
  { id: "dark", name: "Dark", description: "واجهة داكنة كاملة", primary: "#fb174f", secondary: "#0b1020", background: "#0f172a", text: "#f8fafc", card: "#111827" },
  { id: "italian", name: "Italian", description: "أخضر وأحمر وكريمي", primary: "#d61f2c", secondary: "#1b5e20", background: "#fff9ef", text: "#1f2937", card: "#ffffff" },
];

export default function AppearancePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState({
    theme_id: "modern",
    primary_color: "#e11d48",
    secondary_color: "#111827",
    background_color: "#f8fafc",
    text_color: "#111827",
    card_color: "#ffffff",
    header_style: "sticky",
    hero_style: "image",
    card_style: "soft",
    border_radius: 24,
    shadow_strength: 40,
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (data) {
        setSettings((current) => ({
          ...current,
          theme_id: data.theme_id ?? current.theme_id,
          primary_color: data.primary_color ?? current.primary_color,
          secondary_color: data.secondary_color ?? current.secondary_color,
          background_color: data.background_color ?? current.background_color,
          text_color: data.text_color ?? current.text_color,
          card_color: data.card_color ?? current.card_color,
          header_style: data.header_style ?? current.header_style,
          hero_style: data.hero_style ?? current.hero_style,
          card_style: data.card_style ?? current.card_style,
          border_radius: data.border_radius ?? current.border_radius,
          shadow_strength: data.shadow_strength ?? current.shadow_strength,
        }));
      }
      setLoading(false);
    };
    load();
  }, []);

  const activePreset = useMemo(() => presets.find((preset) => preset.id === settings.theme_id) ?? presets[0], [settings.theme_id]);

  const applyPreset = (preset: ThemePreset) => {
    setSettings((current) => ({
      ...current,
      theme_id: preset.id,
      primary_color: preset.primary,
      secondary_color: preset.secondary,
      background_color: preset.background,
      text_color: preset.text,
      card_color: preset.card,
    }));
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...settings });
    setMessage(error ? `تعذر الحفظ: ${error.message}` : "تم حفظ إعدادات المظهر بنجاح");
    setSaving(false);
  };

  if (loading) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">جارٍ تحميل إعدادات المظهر...</div>;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <section className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-black text-rose-500">التصميم والإعدادات</span>
          <h1 className="mt-1 text-3xl font-black text-slate-950">القوالب والمظهر</h1>
          <p className="mt-2 text-sm text-slate-500">اختر قالبًا ثم عدّل الألوان وشكل الهيدر والبطاقات واحفظ التغييرات.</p>
        </div>
        <button onClick={save} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white disabled:opacity-60">
          <Save size={18} /> {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </button>
      </section>

      {message && <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">{message}</div>}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {presets.map((preset) => (
          <button key={preset.id} type="button" onClick={() => applyPreset(preset)} className={`relative overflow-hidden rounded-3xl border p-4 text-right transition ${settings.theme_id === preset.id ? "border-rose-500 ring-2 ring-rose-100" : "border-slate-200 bg-white hover:border-rose-200"}`}>
            <div className="mb-4 grid grid-cols-5 overflow-hidden rounded-2xl border border-black/5">
              {[preset.primary, preset.secondary, preset.background, preset.text, preset.card].map((color) => <span key={color} className="h-12" style={{ background: color }} />)}
            </div>
            <div className="flex items-center justify-between gap-3">
              <div><strong className="block text-base font-black text-slate-950">{preset.name}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{preset.description}</span></div>
              {settings.theme_id === preset.id && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white"><Check size={16} /></span>}
            </div>
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3"><Palette className="text-rose-500" size={20} /><h2 className="text-xl font-black text-slate-950">الألوان والشكل العام</h2></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["primary_color", "اللون الأساسي"],
              ["secondary_color", "اللون الثانوي"],
              ["background_color", "لون الخلفية"],
              ["text_color", "لون النصوص"],
              ["card_color", "لون البطاقات"],
            ].map(([key, label]) => (
              <label key={key} className="grid gap-2 text-sm font-bold text-slate-700"><span>{label}</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3"><input type="color" value={settings[key as keyof typeof settings] as string} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} className="h-10 w-14 cursor-pointer border-0 bg-transparent" /><code className="text-xs text-slate-500">{settings[key as keyof typeof settings] as string}</code></div></label>
            ))}
            <label className="grid gap-2 text-sm font-bold text-slate-700"><span>شكل الهيدر</span><select value={settings.header_style} onChange={(event) => setSettings({ ...settings, header_style: event.target.value })} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4"><option value="sticky">ثابت</option><option value="transparent">شفاف</option><option value="glass">زجاجي</option></select></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700"><span>نوع الواجهة الرئيسية</span><select value={settings.hero_style} onChange={(event) => setSettings({ ...settings, hero_style: event.target.value })} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4"><option value="image">صورة</option><option value="slider">عارض صور</option><option value="video">فيديو</option><option value="parallax">بارالاكس</option></select></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700"><span>شكل البطاقات</span><select value={settings.card_style} onChange={(event) => setSettings({ ...settings, card_style: event.target.value })} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4"><option value="soft">ناعمة</option><option value="sharp">حادة</option><option value="glass">زجاجية</option></select></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700"><span>استدارة الحواف: {settings.border_radius}px</span><input type="range" min="0" max="40" value={settings.border_radius} onChange={(event) => setSettings({ ...settings, border_radius: Number(event.target.value) })} /></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700"><span>قوة الظلال: {settings.shadow_strength}%</span><input type="range" min="0" max="100" value={settings.shadow_strength} onChange={(event) => setSettings({ ...settings, shadow_strength: Number(event.target.value) })} /></label>
          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3"><Eye className="text-rose-500" size={20} /><h2 className="text-xl font-black text-slate-950">معاينة مباشرة</h2></div>
          <div className="overflow-hidden border" style={{ borderRadius: settings.border_radius, background: settings.background_color, color: settings.text_color, boxShadow: `0 24px 60px -36px rgba(0,0,0,${Math.max(0.08, settings.shadow_strength / 100)})` }}>
            <div className="p-5" style={{ background: settings.secondary_color, color: "#fff" }}><span className="text-xs opacity-70">{activePreset.name}</span><h3 className="mt-2 text-2xl font-black">De Roma</h3><p className="mt-2 text-sm opacity-80">بيتزا إيطالية طازجة توصل ساخنة إلى بابك.</p><button className="mt-4 rounded-xl px-4 py-2 text-sm font-black text-white" style={{ background: settings.primary_color }}>شاهد المنيو</button></div>
            <div className="grid gap-3 p-4 sm:grid-cols-2"><div className="p-4" style={{ background: settings.card_color, borderRadius: settings.border_radius }}><strong>كالازوني مفروم</strong><p className="mt-2 text-sm opacity-70">22 د.ل</p></div><div className="p-4" style={{ background: settings.card_color, borderRadius: settings.border_radius }}><strong>مشتعلة دجاج</strong><p className="mt-2 text-sm opacity-70">24 د.ل</p></div></div>
          </div>
        </article>
      </section>
    </div>
  );
}
