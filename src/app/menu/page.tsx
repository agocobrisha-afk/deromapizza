import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import MenuBrowser from "@/components/MenuBrowser";
import { getCategoriesWithProducts, getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "المنيو | De Roma",
  description: "منيو دي روما الكامل — بيتزا، معجنات، لازانيا وإضافات.",
};

export default async function MenuPage() {
  const [categories, settings] = await Promise.all([
    getCategoriesWithProducts(),
    getSiteSettings(),
  ]);

  return (
    <div className="roma-shell" dir="rtl">
      <header className="roma-header">
        <div className="roma-container roma-header-inner">
          <Link href="/" className="roma-brand" aria-label={settings.restaurant_name}>
            <span className="roma-brand-mark">DR</span>
            <span className="roma-brand-copy"><strong>{settings.restaurant_name}</strong><small>Pizza · Pastry · Italian Taste</small></span>
          </Link>
          <nav className="roma-nav" aria-label="التنقل الرئيسي"><Link href="/">الرئيسية</Link><a href="#menu">المنيو</a><Link href="/cart">السلة</Link></nav>
          <div className="roma-header-actions"><Link href="/cart" className="roma-order-button"><ShoppingBag size={17} />السلة</Link></div>
        </div>
      </header>

      <main className="roma-menu-page">
        <section className="roma-menu-hero">
          <div className="roma-container roma-menu-hero-inner">
            <span>منيو De Roma</span>
            <h1>اختار اللي يعجبك وخلي الطلب علينا</h1>
            <p>كل الأصناف بنفس الهوية البصرية للصفحة الرئيسية، مع إضافة مباشرة للسلة وتعديل الكميات بسهولة.</p>
            <Link href="/" className="roma-secondary-cta roma-secondary-cta-menu">العودة للرئيسية <ArrowLeft size={17} /></Link>
          </div>
        </section>

        <section id="menu" className="roma-section roma-menu-section">
          <div className="roma-container">
            <MenuBrowser categories={categories} />
          </div>
        </section>
      </main>
    </div>
  );
}
