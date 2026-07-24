"use client";

import { useEffect, useState } from "react";
import { Save, Type } from "lucide-react";
import { supabase } from "@/lib/supabase";

const bodyFonts = ["Cairo", "Tajawal", "IBM Plex Sans Arabic", "Alexandria", "Noto Kufi Arabic"];
const headingFonts = ["Changa", "Reem Kufi", "Noto Kufi Arabic", "Alexandria", "Aref Ruqaa"];

export default function TypographyPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState({
    body_font: "Cairo",
    heading_font: "Changa",
    body_font_size: 16,
    heading_scale: 64,
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("site_settings").select("body_font,heading_font,body_font_size,heading_scale").eq("id", 1).maybeSingle();
      if (data) {
        setSettings({
          body_font: data.body_font ?? "Cairo",
          heading_font: data.heading_font ?? "Changa",
          body_font_size: data.body_font_size ?? 16,
          heading_scale: data.heading_scale ?? 64,
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage("");
    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...settings });
    setMessage(error ? `تعذر الحفظ: ${error.message}` : "تم حفظ إعدادات الخطوط بنجاح");
    setSaving(false);
  };

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-500">جارٍ تحميل إعدادات الخطوط...</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <section className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div><span className="text-xs font-black text-rose-500">التصميم والإعدادات</span><h1 className="mt-1 text-3xl font-black text-slate-950">الخطوط والأحجام</h1><p className="mt-2 text-sm text-slate-500">غيّر خطوط الموقع وأحجام النصوص مع معاينة فورية.</p></div>
        <button onClick={save} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white disabled:opacity-60"><Save size={18} />{saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}</button>
      </section>
      {message && <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">{message}</div>}
      <section className="grid gap-6 xl:grid-cols-[1fr_.9fr]">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3"><Type className="text-rose-500" size={20} /><h2 className="text-xl font-black text-slate-950">الإعدادات</h2></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700"><span>خط النصوص</span><select value={settings.body_font} onChange={(e) => setSettings({ ...settings, body_font: e.target.value })} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4">{bodyFonts.map((font) => <option key={font}>{font}</option>)}</select></label>
            <label className="grid gap-2 text-sm font-bold text-slate-700"><span>خط العناوين</span><select value={settings.heading_font} onChange={(e) => setSettings({ ...settings, heading_font: e.target.value })} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4">{headingFonts.map((font) => <option key={font}>{font}</option>)}</select></label>
            <label className="grid gap-3 text-sm font-bold text-slate-700"><span>حجم النص الأساسي: {settings.body_font_size}px</span><input type="range" min="14" max="22" value={settings.body_font_size} onChange={(e) => setSettings({ ...settings, body_font_size: Number(e.target.value) })} /></label>
            <label className="grid gap-3 text-sm font-bold text-slate-700"><span>حجم العناوين: {settings.heading_scale}px</span><input type="range" min="36" max="96" value={settings.heading_scale} onChange={(e) => setSettings({ ...settings, heading_scale: Number(e.target.value) })} /></label>
          </div>
        </article>
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <span className="text-xs font-black text-rose-500">معاينة مباشرة</span>
          <h2 className="mt-3 leading-tight text-slate-950" style={{ fontFamily: settings.heading_font, fontSize: `clamp(34px, 6vw, ${settings.heading_scale}px)` }}>بيتزا تُخبز بحب وتصل ساخنة</h2>
          <p className="mt-4 leading-8 text-slate-600" style={{ fontFamily: settings.body_font, fontSize: settings.body_font_size }}>مطعم De Roma يقدم لك أشهى أصناف البيتزا واللازانيا بعجينة طازجة ومكونات مختارة يوميًا.</p>
          <button className="mt-5 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white" style={{ fontFamily: settings.body_font }}>اطلب الآن</button>
        </article>
      </section>
    </div>
  );
}
