"use client";

import { useState } from "react";
import { Save, Store, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage({ initialSettings }: { initialSettings?: SiteSettings }) {
  const [form, setForm] = useState({
    restaurant_name: initialSettings?.restaurant_name ?? "De Roma",
    phone: initialSettings?.phone ?? "0944400150",
    whatsapp: initialSettings?.whatsapp ?? "218944400150",
    address: initialSettings?.address ?? "طرابلس، ليبيا",
    hours: initialSettings?.hours ?? "يوميًا · 1:00 ظهرًا — 1:00 صباحًا",
    tagline: initialSettings?.tagline ?? "بيتزا إيطالية طازجة وخدمة طلب سريعة",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const save = async () => {
    setSaving(true);
    setMessage("");
    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...form });
    setMessage(error ? "تعذر حفظ البيانات" : "تم حفظ بيانات المطعم");
    setSaving(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-black text-rose-500">إعدادات أساسية</span>
            <h1 className="mt-1 text-3xl font-black text-slate-950">بيانات المطعم</h1>
            <p className="mt-2 text-sm text-slate-500">كل المعلومات التي تظهر في الهيدر والفوتر وأزرار التواصل.</p>
          </div>
          <button onClick={save} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-black text-white disabled:opacity-60">
            <Save size={17} /> {saving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>

        <div className="mt-7 grid gap-5 lg:grid-cols-2">
          <Field icon={Store} label="اسم المطعم"><input value={form.restaurant_name} onChange={(e) => setForm({ ...form, restaurant_name: e.target.value })} /></Field>
          <Field icon={Phone} label="رقم الهاتف"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field icon={MessageCircle} label="رقم واتساب"><input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} /></Field>
          <Field icon={Clock} label="ساعات العمل"><input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></Field>
          <Field icon={MapPin} label="العنوان" wide><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></Field>
          <Field icon={Store} label="الوصف المختصر" wide><textarea value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></Field>
        </div>
        {message && <p className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">{message}</p>}
      </section>
    </div>
  );
}

function Field({ icon: Icon, label, wide, children }: { icon: any; label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <label className={`grid gap-2 ${wide ? "lg:col-span-2" : ""}`}>
      <span className="flex items-center gap-2 text-sm font-black text-slate-700"><Icon size={17} className="text-rose-500" />{label}</span>
      <div className="[&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-slate-200 [&_input]:px-4 [&_input]:py-3 [&_textarea]:min-h-28 [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:border-slate-200 [&_textarea]:px-4 [&_textarea]:py-3">{children}</div>
    </label>
  );
}
