"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SitePage } from "@/lib/types";

export default function AdminPagesPage() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  async function load() {
    const { data } = await supabase
      .from("pages")
      .select("*")
      .order("sort_order", { ascending: true });
    setPages(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;
    setCreating(true);
    await supabase.from("pages").insert({
      title: title.trim(),
      slug: slug.trim().replace(/\s+/g, "-"),
      content,
      is_published: true,
      show_in_nav: true,
    });
    setTitle("");
    setSlug("");
    setContent("");
    setCreating(false);
    load();
  }

  async function togglePublish(page: SitePage) {
    await supabase
      .from("pages")
      .update({ is_published: !page.is_published })
      .eq("id", page.id);
    load();
  }

  async function remove(id: string) {
    if (!confirm("متأكد تحذف هذه الصفحة؟")) return;
    await supabase.from("pages").delete().eq("id", id);
    load();
  }

  return (
    <div className="max-w-2xl">
      <h1
        className="mb-1 text-2xl font-extrabold text-ink"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        الصفحات الفرعية
      </h1>
      <p className="mb-7 text-ink-soft">
        أنشئ صفحة جديدة (من نحن، الوظائف، الشروط...) وتظهر مباشرة في قائمة
        الموقع.
      </p>

      <form
        onSubmit={handleCreate}
        className="card-shadow mb-8 rounded-2xl bg-white p-5"
      >
        <p
          className="mb-4 font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          صفحة جديدة
        </p>
        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="العنوان (مثلاً: من نحن)"
            required
            className="rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-red"
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="الرابط (مثلاً: about-us)"
            required
            dir="ltr"
            className="rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-red"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="محتوى الصفحة"
          rows={4}
          className="mb-3 w-full resize-none rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-red"
        />
        <button
          disabled={creating}
          className="inline-flex items-center gap-2 rounded-full bg-red px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          <Plus size={16} /> {creating ? "جارٍ الإضافة..." : "إضافة صفحة"}
        </button>
      </form>

      {loading ? (
        <p className="text-ink-soft">جارٍ التحميل...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {pages.map((p) => (
            <div
              key={p.id}
              className="card-shadow flex items-center justify-between rounded-2xl bg-white p-4"
            >
              <div>
                <p className="font-bold text-ink">{p.title}</p>
                <p className="text-xs text-ink-faint" dir="ltr">
                  /{p.slug}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublish(p)}
                  className="rounded-full border border-line p-2 text-ink-soft hover:text-red"
                  title={p.is_published ? "إخفاء" : "نشر"}
                >
                  {p.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="rounded-full border border-line p-2 text-ink-soft hover:text-red-dark"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {pages.length === 0 && (
            <p className="text-ink-soft">ما فيه صفحات بعد.</p>
          )}
        </div>
      )}
    </div>
  );
}
