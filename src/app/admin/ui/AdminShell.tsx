"use client";

import { useMemo, useState } from "react";
import type { Category, Product, SiteSettings } from "@/lib/types";
import "../admin.css";

type CategoryWithProducts = Category & { products: Product[] };

type Props = {
  restaurantName: string;
  settings: SiteSettings;
  categories: CategoryWithProducts[];
  sections: { id: string; label: string }[];
  productCount: number;
  children: React.ReactNode;
};

type DraftSettings = {
  restaurantName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  cardColor: string;
  bodyFont: string;
  headingFont: string;
  bodyFontSize: number;
  headingScale: number;
  borderRadius: number;
  shadowStrength: number;
  themeId: string;
  headerStyle: string;
  heroStyle: string;
  cardStyle: string;
  heroImageUrl: string;
  galleryTitle: string;
  galleryDescription: string;
  footerText: string;
};

const textValue = (value: unknown, fallback = "") => typeof value === "string" ? value : fallback;
const numberValue = (value: unknown, fallback: number) => typeof value === "number" ? value : fallback;

export default function AdminShell({
  restaurantName,
  settings,
  categories,
  sections,
  productCount,
  children,
}: Props) {
  const extended = settings as SiteSettings & Record<string, unknown>;
  const [activeSection, setActiveSection] = useState("overview");
  const [draft, setDraft] = useState<DraftSettings>({
    restaurantName: settings.restaurant_name,
    tagline: settings.tagline,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    address: settings.address,
    hours: settings.hours,
    primaryColor: settings.primary_color,
    secondaryColor: textValue(extended.secondary_color, "#171717"),
    backgroundColor: textValue(extended.background_color, "#fffaf7"),
    textColor: textValue(extended.text_color, "#171717"),
    cardColor: textValue(extended.card_color, "#ffffff"),
    bodyFont: textValue(extended.body_font, "Cairo"),
    headingFont: textValue(extended.heading_font, "Changa"),
    bodyFontSize: numberValue(extended.body_font_size, 16),
    headingScale: numberValue(extended.heading_scale, 64),
    borderRadius: numberValue(extended.border_radius, 24),
    shadowStrength: numberValue(extended.shadow_strength, 40),
    themeId: settings.theme_id,
    headerStyle: textValue(extended.header_style, "sticky"),
    heroStyle: textValue(extended.hero_style, "image"),
    cardStyle: textValue(extended.card_style, "soft"),
    heroImageUrl: textValue(settings.hero_image_url, ""),
    galleryTitle: textValue(extended.gallery_title, "كل صورة تحكي طعمًا"),
    galleryDescription: textValue(extended.gallery_description, "صور مرتبة تعكس تجربة المطعم وأطباقه."),
    footerText: textValue(extended.footer_text, settings.tagline),
  });

  const activeLabel = useMemo(
    () => sections.find((section) => section.id === activeSection)?.label ?? "لوحة التحكم",
    [activeSection, sections],
  );

  const allProducts = useMemo(
    () => categories.flatMap((category) => category.products.map((product) => ({ product, category }))),
    [categories],
  );

  const handleSidebarClick = (event: React.MouseEvent<HTMLElement>) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-admin-section-trigger]");
    if (!button) return;
    const id = button.dataset.adminSectionTrigger;
    if (id) setActiveSection(id);
  };

  return (
    <main
      className="admin-v2"
      dir="rtl"
      style={{ "--admin-accent": draft.primaryColor } as React.CSSProperties}
    >
      <aside className="admin-v2-sidebar" onClick={handleSidebarClick}>{children}</aside>

      <section className="admin-v2-workspace">
        <header className="admin-v2-topbar">
          <div><span>Restaurant CMS</span><h1>{activeLabel}</h1></div>
          <div className="admin-v2-topbar-actions">
            <button type="button" className="admin-v2-ghost">حفظ كمسودة</button>
            <button type="button" className="admin-v2-primary">نشر التغييرات</button>
          </div>
        </header>

        {activeSection === "overview" && (
          <section className="admin-v2-panel-grid">
            <article className="admin-v2-stat"><span>الأصناف</span><strong>{productCount}</strong><small>عنصر ظاهر في المنيو</small></article>
            <article className="admin-v2-stat"><span>التصنيفات</span><strong>{categories.length}</strong><small>قسم منظم داخل المنيو</small></article>
            <article className="admin-v2-stat"><span>القالب الحالي</span><strong>{draft.themeId}</strong><small>يتغير من قسم المظهر</small></article>
            <article className="admin-v2-stat"><span>حالة الموقع</span><strong>نشط</strong><small>متاح للزبائن</small></article>

            <article className="admin-v2-card admin-v2-span-2">
              <div className="admin-v2-card-head"><div><span>إدارة سريعة</span><h2>الأقسام الأساسية</h2></div></div>
              <div className="admin-v2-quick-grid">
                {sections.slice(1, 7).map((section) => (
                  <button key={section.id} type="button" onClick={() => setActiveSection(section.id)}>
                    <strong>{section.label}</strong><span>فتح القسم</span>
                  </button>
                ))}
              </div>
            </article>

            <article className="admin-v2-card">
              <div className="admin-v2-card-head"><div><span>معاينة مباشرة</span><h2>{restaurantName}</h2></div></div>
              <div className="admin-v2-preview-card" style={{ background: draft.secondaryColor }}>
                <span className="admin-v2-preview-logo">DR</span>
                <h3 style={{ fontFamily: draft.headingFont }}>{draft.restaurantName}</h3>
                <p style={{ fontFamily: draft.bodyFont, fontSize: draft.bodyFontSize }}>{draft.tagline}</p>
                <button type="button">اطلب الآن</button>
              </div>
            </article>
          </section>
        )}

        {activeSection === "products" && (
          <section className="admin-v2-card">
            <div className="admin-v2-card-head"><div><span>المنيو</span><h2>إدارة الأصناف</h2></div><button className="admin-v2-primary" type="button">إضافة صنف</button></div>
            <div className="admin-v2-table">
              {allProducts.map(({ product, category }) => (
                <div className="admin-v2-table-row" key={product.id}>
                  <div className="admin-v2-thumb" style={{ backgroundImage: product.image_url ? `url(${product.image_url})` : undefined }} />
                  <div><strong>{product.name_ar}</strong><span>{category.name_ar}</span></div>
                  <b>{product.price} د.ل</b>
                  <span className={product.is_available ? "is-live" : "is-off"}>{product.is_available ? "متاح" : "مخفي"}</span>
                  <button type="button">تعديل</button>
                </div>
              ))}
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
              <div className="admin-v2-card-head"><div><span>المحتوى العام</span><h2>بيانات المطعم والنصوص</h2></div></div>
              <div className="admin-v2-fields">
                <label><span>اسم المطعم</span><input value={draft.restaurantName} onChange={(e) => setDraft({ ...draft, restaurantName: e.target.value })} /></label>
                <label className="admin-v2-field-wide"><span>الوصف المختصر</span><textarea value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} /></label>
                <label><span>الهاتف</span><input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></label>
                <label><span>واتساب</span><input value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} /></label>
                <label className="admin-v2-field-wide"><span>العنوان</span><input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></label>
                <label className="admin-v2-field-wide"><span>ساعات العمل</span><input value={draft.hours} onChange={(e) => setDraft({ ...draft, hours: e.target.value })} /></label>
                <label className="admin-v2-field-wide"><span>عنوان المعرض</span><input value={draft.galleryTitle} onChange={(e) => setDraft({ ...draft, galleryTitle: e.target.value })} /></label>
                <label className="admin-v2-field-wide"><span>وصف المعرض</span><textarea value={draft.galleryDescription} onChange={(e) => setDraft({ ...draft, galleryDescription: e.target.value })} /></label>
                <label className="admin-v2-field-wide"><span>نص الفوتر</span><textarea value={draft.footerText} onChange={(e) => setDraft({ ...draft, footerText: e.target.value })} /></label>
              </div>
            </article>
          </section>
        )}

        {activeSection === "media" && (
          <section className="admin-v2-form-grid">
            <article className="admin-v2-card admin-v2-span-2">
              <div className="admin-v2-card-head"><div><span>الصور</span><h2>الهوية البصرية والمعرض</h2></div><button className="admin-v2-primary" type="button">رفع صورة</button></div>
              <div className="admin-v2-fields">
                <label className="admin-v2-field-wide"><span>رابط صورة الهيرو</span><input value={draft.heroImageUrl} onChange={(e) => setDraft({ ...draft, heroImageUrl: e.target.value })} /></label>
              </div>
              <div className="admin-v2-media-grid">
                {allProducts.filter(({ product }) => product.image_url).slice(0, 8).map(({ product }) => (
                  <article key={product.id}><div style={{ backgroundImage: `url(${product.image_url})` }} /><strong>{product.name_ar}</strong><button type="button">استبدال</button></article>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeSection === "appearance" && (
          <section className="admin-v2-form-grid">
            <article className="admin-v2-card admin-v2-span-2">
              <div className="admin-v2-card-head"><div><span>Design System</span><h2>الألوان والقوالب والشكل العام</h2></div></div>
              <div className="admin-v2-fields">
                {[['primaryColor','اللون الأساسي'],['secondaryColor','اللون الثانوي'],['backgroundColor','لون الخلفية'],['textColor','لون النصوص'],['cardColor','لون البطاقات']].map(([key,label]) => (
                  <label key={key}><span>{label}</span><input type="color" value={draft[key as keyof DraftSettings] as string} onChange={(e) => setDraft({ ...draft, [key]: e.target.value })} /></label>
                ))}
                <label><span>القالب</span><select value={draft.themeId} onChange={(e) => setDraft({ ...draft, themeId: e.target.value })}><option value="modern">Modern</option><option value="luxury">Luxury</option><option value="minimal">Minimal</option><option value="dark">Dark</option><option value="italian">Italian</option></select></label>
                <label><span>شكل الهيدر</span><select value={draft.headerStyle} onChange={(e) => setDraft({ ...draft, headerStyle: e.target.value })}><option value="sticky">Sticky</option><option value="transparent">Transparent</option><option value="glass">Glass</option></select></label>
                <label><span>نوع الهيرو</span><select value={draft.heroStyle} onChange={(e) => setDraft({ ...draft, heroStyle: e.target.value })}><option value="image">Image</option><option value="slider">Slider</option><option value="video">Video</option><option value="parallax">Parallax</option></select></label>
                <label><span>ستايل البطاقات</span><select value={draft.cardStyle} onChange={(e) => setDraft({ ...draft, cardStyle: e.target.value })}><option value="soft">Soft</option><option value="sharp">Sharp</option><option value="glass">Glass</option></select></label>
                <label><span>استدارة الحواف: {draft.borderRadius}px</span><input type="range" min="0" max="40" value={draft.borderRadius} onChange={(e) => setDraft({ ...draft, borderRadius: Number(e.target.value) })} /></label>
                <label><span>قوة الظل: {draft.shadowStrength}%</span><input type="range" min="0" max="100" value={draft.shadowStrength} onChange={(e) => setDraft({ ...draft, shadowStrength: Number(e.target.value) })} /></label>
              </div>
            </article>
          </section>
        )}

        {activeSection === "typography" && (
          <section className="admin-v2-form-grid">
            <article className="admin-v2-card admin-v2-span-2">
              <div className="admin-v2-card-head"><div><span>Typography</span><h2>الخطوط والأحجام</h2></div></div>
              <div className="admin-v2-fields">
                <label><span>خط النصوص</span><select value={draft.bodyFont} onChange={(e) => setDraft({ ...draft, bodyFont: e.target.value })}><option>Cairo</option><option>Tajawal</option><option>Alexandria</option><option>IBM Plex Sans Arabic</option><option>Noto Kufi Arabic</option></select></label>
                <label><span>خط العناوين</span><select value={draft.headingFont} onChange={(e) => setDraft({ ...draft, headingFont: e.target.value })}><option>Changa</option><option>Reem Kufi</option><option>Aref Ruqaa</option><option>Noto Kufi Arabic</option><option>Alexandria</option></select></label>
                <label><span>حجم النص الأساسي: {draft.bodyFontSize}px</span><input type="range" min="13" max="22" value={draft.bodyFontSize} onChange={(e) => setDraft({ ...draft, bodyFontSize: Number(e.target.value) })} /></label>
                <label><span>مقياس العناوين: {draft.headingScale}px</span><input type="range" min="32" max="100" value={draft.headingScale} onChange={(e) => setDraft({ ...draft, headingScale: Number(e.target.value) })} /></label>
              </div>
            </article>
          </section>
        )}

        {!["overview", "products", "categories", "content", "media", "appearance", "typography"].includes(activeSection) && (
          <section className="admin-v2-empty-state">
            <span>{activeLabel}</span><h2>هذا القسم سيُبنى ضمن المرحلة التالية</h2><p>تم حذف القوائم القديمة والمتضاربة، وأصبح هذا المكان جاهزًا لبناء القسم الجديد على نفس النظام فقط.</p>
          </section>
        )}
      </section>
    </main>
  );
}
