"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Category, Product } from "@/lib/types";

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [openCat, setOpenCat] = useState<string | null>(null);

  async function load() {
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("products").select("*").order("sort_order"),
    ]);
    setCategories(cats ?? []);
    setProducts(prods ?? []);
    setLoading(false);
    if (cats && cats.length > 0 && !openCat) setOpenCat(cats[0].id);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await supabase
      .from("categories")
      .insert({ name_ar: newCatName.trim(), sort_order: categories.length });
    setNewCatName("");
    load();
  }

  async function removeCategory(id: string) {
    if (!confirm("حذف التصنيف يحذف كل أصنافه معه. متأكد؟")) return;
    await supabase.from("categories").delete().eq("id", id);
    load();
  }

  if (loading) return <p className="text-ink-soft">جارٍ التحميل...</p>;

  return (
    <div className="max-w-3xl">
      <h1
        className="mb-1 text-2xl font-extrabold text-ink"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        المنيو
      </h1>
      <p className="mb-7 text-ink-soft">أضف تصنيفات وأصناف وعدّل أسعارها.</p>

      <form
        onSubmit={addCategory}
        className="mb-7 flex gap-2.5 rounded-2xl bg-white p-3.5 card-shadow"
      >
        <input
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          placeholder="اسم تصنيف جديد (مثلاً: مشروبات)"
          className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-red"
        />
        <button className="inline-flex items-center gap-1.5 rounded-full bg-red px-5 py-2.5 text-sm font-bold text-white">
          <Plus size={16} /> إضافة
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="card-shadow rounded-2xl bg-white">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={() =>
                  setOpenCat(openCat === cat.id ? null : cat.id)
                }
                className="font-bold text-ink"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {cat.name_ar}{" "}
                <span className="text-xs font-normal text-ink-faint">
                  ({products.filter((p) => p.category_id === cat.id).length}{" "}
                  صنف)
                </span>
              </button>
              <button
                onClick={() => removeCategory(cat.id)}
                className="text-ink-faint hover:text-red-dark"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {openCat === cat.id && (
              <ProductsEditor
                categoryId={cat.id}
                products={products.filter((p) => p.category_id === cat.id)}
                onChange={load}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsEditor({
  categoryId,
  products,
  onChange,
}: {
  categoryId: string;
  products: Product[];
  onChange: () => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);

  async function addProduct() {
    await supabase.from("products").insert({
      category_id: categoryId,
      name_ar: "صنف جديد",
      price: 0,
      is_available: true,
      sort_order: products.length,
    });
    onChange();
  }

  return (
    <div className="border-t border-line p-4">
      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <ProductRow
            key={p.id}
            product={p}
            editing={editing === p.id}
            onEdit={() => setEditing(p.id)}
            onDone={() => {
              setEditing(null);
              onChange();
            }}
          />
        ))}
      </div>
      <button
        onClick={addProduct}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-red"
      >
        <Plus size={15} /> إضافة صنف
      </button>
    </div>
  );
}

function ProductRow({
  product,
  editing,
  onEdit,
  onDone,
}: {
  product: Product;
  editing: boolean;
  onEdit: () => void;
  onDone: () => void;
}) {
  const [name, setName] = useState(product.name_ar);
  const [desc, setDesc] = useState(product.description_ar ?? "");
  const [price, setPrice] = useState(product.price);
  const [available, setAvailable] = useState(product.is_available);
  const [featured, setFeatured] = useState(product.is_featured);
  const [image, setImage] = useState(product.image_url);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `menu/${product.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("site-assets")
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      setImage(data.publicUrl);
    }
    setUploading(false);
  }

  async function save() {
    await supabase
      .from("products")
      .update({
        name_ar: name,
        description_ar: desc || null,
        price,
        is_available: available,
        is_featured: featured,
        image_url: image,
      })
      .eq("id", product.id);
    onDone();
  }

  async function remove() {
    if (!confirm("حذف هذا الصنف؟")) return;
    await supabase.from("products").delete().eq("id", product.id);
    onDone();
  }

  if (!editing) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl bg-cream px-3.5 py-2.5">
        <div className="flex items-center gap-3">
          {product.image_url && (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={product.image_url}
                alt={product.name_ar}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-ink">
              {product.name_ar}{" "}
              {product.is_featured && (
                <span className="text-[11px] text-red-dark">★ مميز</span>
              )}
              {!product.is_available && (
                <span className="text-[11px] text-ink-faint"> (متوقف)</span>
              )}
            </p>
            <p className="text-xs text-ink-faint">{product.price} د.ل</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="rounded-full border border-line p-2 text-ink-soft hover:text-red"
        >
          <Pencil size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line p-3.5">
      <div className="mb-2.5 flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
          {image && (
            <Image src={image} alt="" fill className="object-cover" />
          )}
        </div>
        <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-red">
          <ImagePlus size={13} />
          {uploading ? "جارٍ الرفع..." : "صورة"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </label>
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اسم الصنف"
        className="mb-2 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-red"
      />
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="الوصف"
        rows={2}
        className="mb-2 w-full resize-none rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-red"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        placeholder="السعر"
        className="mb-2 w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-red"
      />
      <div className="mb-3 flex gap-4 text-xs font-semibold text-ink-soft">
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
          متاح
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          مميز بالرئيسية
        </label>
      </div>
      <div className="flex gap-2">
        <button
          onClick={save}
          className="rounded-full bg-red px-5 py-2 text-xs font-bold text-white"
        >
          حفظ
        </button>
        <button
          onClick={onDone}
          className="rounded-full border border-line px-5 py-2 text-xs font-bold text-ink-soft"
        >
          إلغاء
        </button>
        <button
          onClick={remove}
          className="mr-auto rounded-full px-4 py-2 text-xs font-bold text-red-dark"
        >
          حذف
        </button>
      </div>
    </div>
  );
}
