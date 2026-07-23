"use client";

import { useMemo, useState } from "react";
import type { Category, Product, SiteSettings } from "@/lib/types";
import "../admin-v2.css";

type CategoryWithProducts = Category & { products: Product[] };

type Props = {
  restaurantName: string;
  settings: SiteSettings;
  categories: CategoryWithProducts[];
  sections: { id: string; label: string }[];
  productCount: number;
  children: React.ReactNode;
};

export default function AdminShell({
  restaurantName,
  settings,
  categories,
  sections,
  productCount,
  children,
}: Props) {
  const [activeSection, setActiveSection] = useState("overview");
  const [draft, setDraft] = useState({
    restaurantName: settings.restaurant_name,
    tagline: settings.tagline,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    address: settings.address,
    hours: settings.hours,
    primaryColor: settings.primary_color,
  });

  const activeLabel = useMemo(
    () => sections.find((section) => section.id === activeSection)?.label ?? "لوحة التحكم",
    [activeSection, sections],
  );

  const handleSidebarClick = (event: React.MouseEvent<HTMLElement>) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-admin-section-trigger]");
    if (!button) return;
    const id = button.dataset.adminSectionTrigger;
    if (!id) return;
    setActiveSection(id);
  };

  return (
    <main className="admin-v2" dir="rtl" style={{ "--admin-accent": draft.primaryColor } as React.CSSProperties}>
      <aside className="admin-v2-sidebar" onClick={handleSidebarClick}>
        {children}
      </aside>

      <section className="admin-v2-workspace">
        <header className="admin-v2-topbar">
          <div>
            <span>Restaurant CMS</span>
            <h1>{activeLabel}</h1>
          </div>
          <div className="admin-v2-topbar-actions">
            <button type="button" className="admin-v2-ghost">حفظ كمسودة</button>
            <button type="button" className="admin-v2-primary">نشر التغييرات</button>
          </div>
        </header>

        {activeSection === "overview" && (
          <section className="admin-v2-panel-grid">
            <article className="admin-v2-stat"><span>الأصناف</span><strong>{productCount}</strong><small>عنصر متاح في المنيو</small></article>
            <article className="admin-v2-stat"><span>التصنيفات</span><strong>{categories.length}</strong><small>قسم مرتب داخل المنيو</small></article>
            <article className="admin-v2-stat"><span>الحالة</span><strong>نشط</strong><small>الموقع متاح للزبائن</small></article>
            <article className="admin-v2-stat"><span>القالب</span><strong>{settings.theme_id}</strong><small>يمكن تغييره من المظهر</small></article>

            <article className="admin-v2-card admin-v2-span-2">
              <div className="admin-v2-card-head"><div><span>إدارة سريعة</span><h2>كل شيء من مكان واحد</h2></div></div>
              <div className="admin-v2-quick-grid">
                {sections.slice(1, 7).map((section) => (
                  <button key={section.id} type="button" onClick={() => setActiveSection(section.id)}>
                    <strong>{section.label}</strong>
                    <span>فتح القسم</span>
                  </button>
                ))}
              </div>
            </article>

            <article className="admin-v2-card">
              <div className="admin-v2-card-head"><div><span>معاينة الهوية</span><h2>{restaurantName}</h2></div></div>
              <div className="admin-v2-preview-card">
                <span className="admin-v2-preview-logo">DR</span>
                <h3>{draft.restaurantName}</h3>
                <p>{draft.tagline}</p>
                <button type="button">اطلب الآن</button>
              </div>
            </article>
          </section>
        )}

        {activeSection === "products" && (
          <section className="admin-v2-card">
            <div className="admin-v2-card-head"><div><span>المنيو</span><h2>إدارة الأصناف</h2></div><button className="admin-v2-primary" type="button">إضافة صنف</button></div>
            <div className="admin-v2-table">
              {categories.flatMap((category) => category.products.map((product) => (
                <div className="admin-v2-table-row" key={product.id}>
                  <div className="admin-v2-thumb" style={{ backgroundImage: product.image_url ? `url(${product.image_url})` : undefined }} />
                  <div><strong>{product.name_ar}</strong><span>{category.name_ar}</span></div>
                  <b>{product.price} د.ل</b>
                  <span className={product.is_available ? "is-live" : "is-off"}>{product.is_available ? "متاح" : "مخفي"}</span>
                  <button type="button">تعديل</button>
                </div>
              )))}
            </div>
          </section>
        )}

        {activeSection === "categories" && (
          <section className="admin-v2-card">
            <div className="admin-v2-card-head"><div><span>هيكلة المنيو</span><h2>التصنيفات والترتيب</h2></div><button className="admin-v2-primary" type="button">إضافة تصنيف</button></div>
            <div className="admin-v2-category-list">
              {categories.map((category, index) => (
                <article key={category.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{category.name_ar}</strong><small>{category.products.length} أصناف</small></div><button type="button">تعديل</button></article>
              ))}
            </div>
          </section>
        )}

        {activeSection === "content" && (
          <section className="admin-v2-form-grid">
            <article className="admin-v2-card admin-v2-span-2">
              <div className="admin-v2-card-head"><div><span>الهوية والمحتوى</span><h2>النصوص الأساسية</h2></div></div>
              <div className="admin-v2-fields">
                <label><span>اسم المطعم</span><input value={draft.restaurantName} onChange={(e) => setDraft({ ...draft, restaurantName: e.target.value })} /></label>
                <label className="admin-v2-field-wide"><span>الوصف المختصر</span><textarea value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} /></label>
                <label><span>رقم الهاتف</span><input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></label>
                <label><span>واتساب</span><input value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} /></label>
                <label className="admin-v2-field-wide"><span>العنوان</span><input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></label>
                <label className="admin-v2-field-wide"><span>ساعات العمل</span><input value={draft.hours} onChange={(e) => setDraft({ ...draft, hours: e.target.value })} /></label>
              </div>
            </article>
          </section>
        )}

        {activeSection === "media" && (
          <section className="admin-v2-card">
            <div className="admin-v2-card-head"><div><span>المكتبة</span><h2>الصور والمعرض</h2></div><button className="admin-v2-primary" type="button">رفع صور</button></div>
            <div className="admin-v2-media-grid">
              {categories.flatMap((category) => category.products).filter((product) => product.image_url).slice(0, 8).map((product) => (
                <article key={product.id}><div style={{ backgroundImage: `url(${product.image_url})` }} /><strong>{product.name_ar}</strong><button type="button">استبدال</button></article>
              ))}
            </div>
          </section>
        )}

        {activeSection === "appearance" && (
          <section className="admin-v2-form-grid">
            <article className="admin-v2-card">
              <div className="admin-v2-card-head"><div><span>الألوان</span><h2>الهوية البصرية</h2></div></div>
              <label className="admin-v2-color-field"><input type="color" value={draft.primaryColor} onChange={(e) => setDraft({ ...draft, primaryColor: e.target.value })} /><span>{draft.primaryColor}</span></label>
              <div className="admin-v2-theme-options"><button className="is-selected" type="button">Bold Red</button><button type="button">Italian Cream</button><button type="button">Dark Oven</button></div>
            </article>
            <article className="admin-v2-card">
              <div className="admin-v2-card-head"><div><span>العناصر</span><h2>ستايل البطاقات</h2></div></div>
              <div className="admin-v2-options"><button className="is-selected" type="button">ناعمة</button><button type="button">حادة</button><button type="button">زجاجية</button></div>
            </article>
          </section>
        )}

        {activeSection === "typography" && (
          <section className="admin-v2-form-grid">
            <article className="admin-v2-card admin-v2-span-2">
              <div className="admin-v2-card-head"><div><span>Typography</span><h2>الخطوط والأحجام</h2></div></div>
              <div className="admin-v2-fields">
                <label><span>خط النصوص</span><select defaultValue="Cairo"><option>Cairo</option><option>Tajawal</option><option>IBM Plex Sans Arabic</option></select></label>
                <label><span>خط العناوين</span><select defaultValue="Changa"><option>Changa</option><option>Reem Kufi</option><option>Noto Kufi Arabic</option></select></label>
                <label><span>حجم النص الأساسي</span><input type="range" min="14" max="20" defaultValue="16" /></label>
                <label><span>حجم العناوين</span><input type="range" min="36" max="96" defaultValue="64" /></label>
              </div>
            </article>
          </section>
        )}

        {!["overview", "products", "categories", "content", "media", "appearance", "typography"].includes(activeSection) && (
          <section className="admin-v2-empty-state">
            <span>{activeLabel}</span>
            <h2>سيتم بناء هذا القسم ضمن النسخة الجديدة</h2>
            <p>الهيكل الجديد جاهز لاستقبال الطلبات والتقييمات والإحصائيات والإعدادات المتقدمة بدون الرجوع إلى اللوحة القديمة.</p>
          </section>
        )}
      </section>
    </main>
  );
}
