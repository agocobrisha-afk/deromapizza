"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronLeft,
  CircleDollarSign,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageOpen,
  Palette,
  Pizza,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShoppingBag,
  Star,
  Tags,
  X,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Section =
  | "overview"
  | "orders"
  | "products"
  | "categories"
  | "reviews"
  | "appearance"
  | "settings";

type Product = {
  id: string;
  name_ar: string;
  price: number;
  category_id: string | null;
  is_available: boolean | null;
  is_featured: boolean | null;
  is_visible: boolean;
};

type Category = {
  id: string;
  name_ar: string;
  is_visible: boolean;
  sort_order: number | null;
};

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  total: number;
  status: string | null;
  created_at: string | null;
};

type Review = {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_approved: boolean | null;
};

type SettingsRow = {
  id: number;
  restaurant_name: string | null;
  tagline: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  hours: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
};

type NavItem = {
  id: Section;
  label: string;
  icon: LucideIcon;
};

type StatCard = {
  label: string;
  value: string | number;
  icon: LucideIcon;
};

const navigation: NavItem[] = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "orders", label: "الطلبات", icon: ShoppingBag },
  { id: "products", label: "الأصناف", icon: PackageOpen },
  { id: "categories", label: "التصنيفات", icon: Tags },
  { id: "reviews", label: "التقييمات", icon: Star },
  { id: "appearance", label: "الهوية والمظهر", icon: Palette },
  { id: "settings", label: "إعدادات المطعم", icon: Settings },
];

const statusLabel: Record<string, string> = {
  pending: "جديد",
  preparing: "قيد التحضير",
  ready: "جاهز",
  delivery: "خرج للتوصيل",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export default function ReshaDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SettingsRow>({
    id: 1,
    restaurant_name: "De Roma",
    tagline: "",
    phone: "",
    whatsapp: "",
    address: "",
    hours: "",
    primary_color: "#f43f5e",
    secondary_color: "#0f172a",
  });

  const flash = (text: string) => {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const loadData = useCallback(async () => {
    setLoading(true);

    if (!isSupabaseConfigured) {
      flash("إعدادات Supabase غير مكتملة");
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.replace("/resha/login");
      return;
    }

    const { data: allowed } = await supabase.rpc("is_admin");
    if (!allowed) {
      await supabase.auth.signOut();
      router.replace("/resha/login");
      return;
    }

    const [productsResult, categoriesResult, ordersResult, reviewsResult, settingsResult] =
      await Promise.all([
        supabase
          .from("products")
          .select("id,name_ar,price,category_id,is_available,is_featured,is_visible")
          .order("sort_order"),
        supabase
          .from("categories")
          .select("id,name_ar,is_visible,sort_order")
          .order("sort_order"),
        supabase
          .from("orders")
          .select("id,customer_name,phone,total,status,created_at")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("reviews")
          .select("id,customer_name,rating,comment,is_approved")
          .order("created_at", { ascending: false }),
        supabase
          .from("site_settings")
          .select(
            "id,restaurant_name,tagline,phone,whatsapp,address,hours,primary_color,secondary_color",
          )
          .eq("id", 1)
          .maybeSingle(),
      ]);

    setProducts((productsResult.data ?? []) as Product[]);
    setCategories((categoriesResult.data ?? []) as Category[]);
    setOrders((ordersResult.data ?? []) as Order[]);
    setReviews((reviewsResult.data ?? []) as Review[]);
    if (settingsResult.data) setSettings(settingsResult.data as SettingsRow);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredProducts = useMemo(
    () =>
      products.filter((item) =>
        item.name_ar.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, search],
  );

  const revenue = useMemo(
    () =>
      orders
        .filter((order) => order.status !== "cancelled")
        .reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders],
  );

  const activeOrders = orders.filter(
    (order) => !["delivered", "cancelled"].includes(order.status ?? "pending"),
  ).length;

  const approvedReviews = reviews.filter((review) => review.is_approved).length;

  const statCards: StatCard[] = [
    {
      label: "إجمالي المبيعات",
      value: `${revenue.toFixed(2)} د.ل`,
      icon: CircleDollarSign,
    },
    { label: "الطلبات", value: orders.length, icon: ShoppingBag },
    { label: "الأصناف", value: products.length, icon: PackageOpen },
    { label: "التقييمات المنشورة", value: approvedReviews, icon: Star },
  ];

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/resha/login");
  }

  async function updateOrder(id: string, status: string) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) {
      setOrders((current) =>
        current.map((order) => (order.id === id ? { ...order, status } : order)),
      );
    }
    flash(error ? "تعذر تحديث الطلب" : "تم تحديث حالة الطلب");
  }

  async function saveProduct(item: Product) {
    const { error } = await supabase
      .from("products")
      .update({
        name_ar: item.name_ar,
        price: item.price,
        category_id: item.category_id,
        is_available: item.is_available,
        is_featured: item.is_featured,
        is_visible: item.is_visible,
      })
      .eq("id", item.id);
    flash(error ? "تعذر حفظ الصنف" : "تم حفظ الصنف");
  }

  async function saveCategory(item: Category) {
    const { error } = await supabase
      .from("categories")
      .update({
        name_ar: item.name_ar,
        is_visible: item.is_visible,
        sort_order: item.sort_order,
      })
      .eq("id", item.id);
    flash(error ? "تعذر حفظ التصنيف" : "تم حفظ التصنيف");
  }

  async function toggleReview(item: Review) {
    const next = !item.is_approved;
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: next })
      .eq("id", item.id);
    if (!error) {
      setReviews((current) =>
        current.map((review) =>
          review.id === item.id ? { ...review, is_approved: next } : review,
        ),
      );
    }
    flash(error ? "تعذر تحديث التقييم" : "تم تحديث التقييم");
  }

  async function saveSettings() {
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .upsert({ ...settings, id: 1 });
    setSaving(false);
    flash(error ? "تعذر حفظ الإعدادات" : "تم حفظ إعدادات المطعم");
  }

  const field =
    "min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100";

  function Sidebar() {
    return (
      <aside className="flex h-full w-[286px] flex-col bg-[#07111f] text-white">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 shadow-lg">
              <Pizza />
            </span>
            <div>
              <p className="text-[10px] font-black tracking-[.22em] text-rose-300">
                RESHA RESTAURANT OS
              </p>
              <h1 className="text-xl font-black">
                {settings.restaurant_name || "المطعم"}
              </h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSection(item.id);
                  setMobileOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition ${
                  section === item.id
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-950/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                <ChevronLeft size={15} className="opacity-50" />
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-slate-300 hover:bg-white/10"
          >
            <ExternalLink size={16} /> معاينة الموقع
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center justify-center gap-2 py-3 text-sm font-bold text-slate-400 hover:text-white"
          >
            <LogOut size={16} /> تسجيل الخروج
          </button>
        </div>
      </aside>
    );
  }

  if (loading) {
    return (
      <main
        className="grid min-h-screen place-items-center bg-slate-100"
        dir="rtl"
      >
        <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold shadow">
          <RefreshCw className="animate-spin" size={18} /> جارٍ تشغيل نظام المطعم...
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-950" dir="rtl">
      <div className="fixed inset-y-0 right-0 z-40 hidden lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="absolute inset-y-0 right-0">
            <Sidebar />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white"
          >
            <X />
          </button>
        </div>
      )}

      <main className="lg:mr-[286px]">
        <header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="grid h-11 w-11 place-items-center rounded-xl border lg:hidden"
            >
              <Menu />
            </button>
            <div>
              <p className="text-xs font-black text-rose-500">نظام إدارة المطعم</p>
              <h2 className="text-lg font-black">
                {navigation.find((item) => item.id === section)?.label}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative grid h-11 w-11 place-items-center rounded-xl border bg-white">
              <Bell size={18} />
              <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-rose-500" />
            </button>
            <button
              onClick={() => void loadData()}
              className="grid h-11 w-11 place-items-center rounded-xl border bg-white"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-7">
          {section === "overview" && (
            <>
              <section className="overflow-hidden rounded-[30px] bg-gradient-to-l from-[#07111f] via-slate-900 to-slate-800 p-7 text-white shadow-xl sm:p-10">
                <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <span className="inline-flex rounded-full bg-rose-500/15 px-3 py-1 text-xs font-black text-rose-300">
                      RESTAURANT BUSINESS CENTER
                    </span>
                    <h1 className="mt-4 text-3xl font-black sm:text-5xl">
                      كل مطعمك في شاشة واحدة
                    </h1>
                    <p className="mt-4 max-w-2xl leading-8 text-slate-300">
                      تابع الطلبات والمبيعات والأصناف والسمعة الرقمية، وغيّر شكل الموقع بدون لمس الكود.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="text-xs text-slate-400">حالة المتجر</span>
                      <strong className="mt-2 flex items-center gap-2 text-emerald-300">
                        <CheckCircle2 size={17} /> يعمل الآن
                      </strong>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="text-xs text-slate-400">طلبات نشطة</span>
                      <strong className="mt-2 block text-2xl">{activeOrders}</strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article
                      key={card.label}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">{card.label}</span>
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-500">
                          <Icon size={19} />
                        </span>
                      </div>
                      <strong className="mt-4 block text-3xl font-black">
                        {card.value}
                      </strong>
                    </article>
                  );
                })}
              </section>

              <section className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
                <div className="rounded-[26px] border bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black">أحدث الطلبات</h3>
                      <p className="text-sm text-slate-500">آخر حركة داخل المطعم</p>
                    </div>
                    <BarChart3 className="text-rose-500" />
                  </div>
                  <div className="mt-5 space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                      >
                        <div>
                          <strong>{order.customer_name}</strong>
                          <p className="text-xs text-slate-500">
                            #{order.id.slice(0, 8)} · {statusLabel[order.status ?? "pending"]}
                          </p>
                        </div>
                        <strong className="text-rose-500">{order.total} د.ل</strong>
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <p className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                        لا توجد طلبات حتى الآن
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-[26px] border bg-white p-5 shadow-sm">
                  <h3 className="text-xl font-black">أدوات سريعة</h3>
                  <div className="mt-5 grid gap-3">
                    {[
                      { label: "إدارة الطلبات", id: "orders" as Section, icon: ShoppingBag },
                      { label: "تحديث المنيو", id: "products" as Section, icon: Pizza },
                      { label: "تخصيص الهوية", id: "appearance" as Section, icon: Palette },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSection(item.id)}
                          className="flex items-center justify-between rounded-2xl border p-4 text-right hover:border-rose-200 hover:bg-rose-50"
                        >
                          <span className="flex items-center gap-3 font-bold">
                            <Icon size={18} className="text-rose-500" />
                            {item.label}
                          </span>
                          <ChevronLeft size={16} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>
            </>
          )}

          {section === "orders" && (
            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-black">إدارة الطلبات</h2>
                <p className="text-sm text-slate-500">
                  متابعة الطلب من الاستلام حتى التسليم.
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-2xl border bg-white p-5 shadow-sm"
                  >
                    <div className="flex justify-between">
                      <strong>#{order.id.slice(0, 8)}</strong>
                      <span className="text-xs text-slate-400">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString("ar-LY")
                          : ""}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-black">{order.customer_name}</h3>
                    <p className="text-sm text-slate-500">{order.phone}</p>
                    <strong className="mt-3 block text-2xl text-rose-500">
                      {order.total} د.ل
                    </strong>
                    <select
                      value={order.status ?? "pending"}
                      onChange={(event) =>
                        void updateOrder(order.id, event.target.value)
                      }
                      className={`${field} mt-4`}
                    >
                      {Object.entries(statusLabel).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </article>
                ))}
              </div>
            </section>
          )}

          {section === "products" && (
            <section className="rounded-[28px] border bg-white p-5 shadow-sm sm:p-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black">الأصناف والمنيو</h2>
                  <p className="text-sm text-slate-500">
                    تعديل الأسعار والتوفر والتصنيف.
                  </p>
                </div>
                <div className="relative">
                  <Search
                    className="absolute right-3 top-3 text-slate-400"
                    size={17}
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="ابحث عن صنف"
                    className={`${field} pr-10`}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="grid gap-3 rounded-2xl border p-4 xl:grid-cols-[1fr_130px_190px_auto]"
                  >
                    <input
                      className={field}
                      value={product.name_ar}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((item) =>
                            item.id === product.id
                              ? { ...item, name_ar: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                    <input
                      className={field}
                      type="number"
                      value={product.price}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((item) =>
                            item.id === product.id
                              ? { ...item, price: Number(event.target.value) }
                              : item,
                          ),
                        )
                      }
                    />
                    <select
                      className={field}
                      value={product.category_id ?? ""}
                      onChange={(event) =>
                        setProducts((current) =>
                          current.map((item) =>
                            item.id === product.id
                              ? {
                                  ...item,
                                  category_id: event.target.value || null,
                                }
                              : item,
                          ),
                        )
                      }
                    >
                      <option value="">بدون تصنيف</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name_ar}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setProducts((current) =>
                            current.map((item) =>
                              item.id === product.id
                                ? { ...item, is_available: !item.is_available }
                                : item,
                            ),
                          )
                        }
                        className={`rounded-xl border px-3 text-sm font-bold ${
                          product.is_available
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-50 text-slate-500"
                        }`}
                      >
                        {product.is_available ? "متاح" : "متوقف"}
                      </button>
                      <button
                        onClick={() => void saveProduct(product)}
                        className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white"
                      >
                        <Save size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {section === "categories" && (
            <section className="rounded-[28px] border bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-2xl font-black">التصنيفات</h2>
              <p className="text-sm text-slate-500">
                رتّب أقسام المنيو وحدد الظاهر منها.
              </p>
              <div className="mt-6 space-y-3">
                {categories.map((category) => (
                  <article
                    key={category.id}
                    className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row"
                  >
                    <input
                      className={`${field} flex-1`}
                      value={category.name_ar}
                      onChange={(event) =>
                        setCategories((current) =>
                          current.map((item) =>
                            item.id === category.id
                              ? { ...item, name_ar: event.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                    <button
                      onClick={() =>
                        setCategories((current) =>
                          current.map((item) =>
                            item.id === category.id
                              ? { ...item, is_visible: !item.is_visible }
                              : item,
                          ),
                        )
                      }
                      className="rounded-xl border px-4 font-bold"
                    >
                      {category.is_visible ? "ظاهر" : "مخفي"}
                    </button>
                    <button
                      onClick={() => void saveCategory(category)}
                      className="rounded-xl bg-slate-950 px-4 text-white"
                    >
                      <Save size={16} />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {section === "reviews" && (
            <section>
              <div className="mb-5">
                <h2 className="text-2xl font-black">سمعة المطعم</h2>
                <p className="text-sm text-slate-500">
                  اعتماد أو إخفاء تقييمات العملاء.
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-2xl border bg-white p-5 shadow-sm"
                  >
                    <div className="text-amber-400">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(Math.max(0, 5 - review.rating))}
                    </div>
                    <h3 className="mt-3 font-black">{review.customer_name}</h3>
                    <p className="mt-2 leading-7 text-slate-600">
                      {review.comment || "بدون تعليق"}
                    </p>
                    <button
                      onClick={() => void toggleReview(review)}
                      className={`mt-5 rounded-xl px-4 py-2 font-bold ${
                        review.is_approved
                          ? "bg-slate-100"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {review.is_approved ? "إخفاء التقييم" : "اعتماد التقييم"}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {section === "appearance" && (
            <section className="grid gap-5 xl:grid-cols-[1fr_.75fr]">
              <div className="rounded-[28px] border bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-black">الهوية والمظهر</h2>
                <p className="text-sm text-slate-500">
                  عدّل الألوان الرئيسية للسكربت.
                </p>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="font-bold">اللون الأساسي</span>
                    <input
                      type="color"
                      value={settings.primary_color || "#f43f5e"}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          primary_color: event.target.value,
                        })
                      }
                      className="h-14 w-full rounded-xl border p-2"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="font-bold">اللون الثانوي</span>
                    <input
                      type="color"
                      value={settings.secondary_color || "#0f172a"}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          secondary_color: event.target.value,
                        })
                      }
                      className="h-14 w-full rounded-xl border p-2"
                    />
                  </label>
                </div>
                <button
                  onClick={() => void saveSettings()}
                  disabled={saving}
                  className="mt-6 rounded-xl bg-slate-950 px-5 py-3 font-black text-white"
                >
                  {saving ? "جارٍ الحفظ..." : "حفظ الهوية"}
                </button>
              </div>

              <div
                className="overflow-hidden rounded-[28px] p-6 text-white shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${
                    settings.secondary_color || "#0f172a"
                  }, ${settings.primary_color || "#f43f5e"})`,
                }}
              >
                <p className="text-xs font-black tracking-[.2em] text-white/70">
                  LIVE PREVIEW
                </p>
                <h3 className="mt-4 text-3xl font-black">
                  {settings.restaurant_name || "اسم المطعم"}
                </h3>
                <p className="mt-3 text-white/75">
                  {settings.tagline || "أفضل تجربة طلب رقمية لعملائك"}
                </p>
                <button className="mt-8 rounded-full bg-white px-5 py-3 font-black text-slate-950">
                  اطلب الآن
                </button>
              </div>
            </section>
          )}

          {section === "settings" && (
            <section className="rounded-[28px] border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">إعدادات المطعم</h2>
              <p className="text-sm text-slate-500">
                بيانات الاتصال التي تظهر للعميل.
              </p>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {[
                  ["اسم المطعم", "restaurant_name"],
                  ["الوصف القصير", "tagline"],
                  ["الهاتف", "phone"],
                  ["واتساب", "whatsapp"],
                  ["العنوان", "address"],
                  ["ساعات العمل", "hours"],
                ].map(([label, key]) => (
                  <label key={key} className="grid gap-2">
                    <span className="font-bold">{label}</span>
                    <input
                      className={field}
                      value={String(settings[key as keyof SettingsRow] ?? "")}
                      onChange={(event) =>
                        setSettings({
                          ...settings,
                          [key]: event.target.value,
                        })
                      }
                    />
                  </label>
                ))}
              </div>
              <button
                onClick={() => void saveSettings()}
                disabled={saving}
                className="mt-6 rounded-xl bg-rose-500 px-5 py-3 font-black text-white"
              >
                {saving ? "جارٍ الحفظ..." : "حفظ إعدادات المطعم"}
              </button>
            </section>
          )}
        </div>
      </main>

      {notice && (
        <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-2xl">
          {notice}
        </div>
      )}
    </div>
  );
}
