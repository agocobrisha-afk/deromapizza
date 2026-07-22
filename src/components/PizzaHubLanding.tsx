import Image from "next/image";
import Link from "next/link";
import { Pizza, Sandwich, Utensils, IceCreamBowl, CupSoda, ShoppingCart } from "lucide-react";
import { getFeaturedProducts, getSiteSettings } from "@/lib/queries";

const categories = [
  { label: "بيتزا", icon: Pizza },
  { label: "شرائح", icon: Sandwich },
  { label: "باستا", icon: Utensils },
  { label: "حلويات", icon: IceCreamBowl },
  { label: "مشروبات", icon: CupSoda },
];

const fallbackImages = [
  "/images/table-two-pizzas.jpg",
  "/images/pizza-slice-pull.jpg",
  "/images/table-two-pizzas.jpg",
  "/images/pizza-slice-pull.jpg",
];

export default async function PizzaHubLanding() {
  const [settings, products] = await Promise.all([getSiteSettings(), getFeaturedProducts()]);
  const hero = products[0];
  const deals = products.slice(0, 4);

  return (
    <div className="pizza-hub-shell">
      <header className="pizza-hub-topbar">
        <div className="pizza-hub-container pizza-hub-topbar-inner">
          <span>{settings.address}</span>
          <span>{settings.phone}</span>
        </div>
      </header>

      <nav className="pizza-hub-nav">
        <div className="pizza-hub-container pizza-hub-nav-inner">
          <Link href="/" className="pizza-hub-logo">De Roma</Link>
          <div className="pizza-hub-nav-links">
            <a href="#home">الرئيسية</a>
            <a href="#categories">الأصناف</a>
            <a href="#deals">العروض</a>
            <a href="#app">التطبيق</a>
          </div>
          <Link href="/menu" className="pizza-hub-cart"><ShoppingCart size={18} /> المنيو</Link>
        </div>
      </nav>

      <main>
        <section id="home" className="pizza-hub-hero pizza-hub-section">
          <div className="pizza-hub-container pizza-hub-hero-grid">
            <div className="pizza-hub-hero-copy">
              <span className="pizza-hub-kicker">NEW FESTIVE</span>
              <h1>نكهات تصنع الفرق</h1>
              <p>{settings.tagline || "بيتزا ومعجنات بطابع إيطالي ومذاق غني في كل طلب."}</p>
              <div className="pizza-hub-actions">
                <Link href="/menu" className="pizza-hub-btn pizza-hub-btn-primary">شاهد المنيو</Link>
                <a href={`https://wa.me/${settings.whatsapp}`} className="pizza-hub-btn pizza-hub-btn-outline">اطلب الآن</a>
              </div>
            </div>
            <div className="pizza-hub-hero-media">
              <Image src={hero?.image_url || "/images/table-two-pizzas.jpg"} alt={hero?.name_ar || settings.restaurant_name} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" />
            </div>
          </div>
        </section>

        <section id="categories" className="pizza-hub-category-strip">
          <div className="pizza-hub-container pizza-hub-category-grid">
            {categories.map(({ label, icon: Icon }) => (
              <div key={label} className="pizza-hub-category-card">
                <Icon size={34} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="deals" className="pizza-hub-section pizza-hub-deals-section">
          <div className="pizza-hub-container">
            <div className="pizza-hub-section-heading">
              <span>DEAL OF THE DAY</span>
              <h2>عروض اليوم</h2>
            </div>
            <div className="pizza-hub-deals-grid">
              {deals.map((product, index) => (
                <article key={product.id} className={`pizza-hub-deal-card ${index === 2 ? "pizza-hub-deal-card-large" : ""}`}>
                  <Image src={product.image_url || fallbackImages[index]} alt={product.name_ar} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="pizza-hub-deal-overlay" />
                  <div className="pizza-hub-deal-content">
                    <span>عرض {String(index + 1).padStart(2, "0")}</span>
                    <h3>{product.name_ar}</h3>
                    <p>{product.description_ar}</p>
                    <Link href="/menu" className="pizza-hub-mini-btn">أضف للطلب</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pizza-hub-section pizza-hub-subscribe">
          <div className="pizza-hub-container pizza-hub-subscribe-grid">
            <div>
              <span className="pizza-hub-kicker">SUBSCRIBE NOW</span>
              <h2>خليك أول واحد يعرف عروضنا</h2>
              <p>سجل رقمك أو بريدك واحصل على أحدث العروض والخصومات.</p>
              <div className="pizza-hub-subscribe-form">
                <input placeholder="البريد الإلكتروني" />
                <button>اشترك</button>
              </div>
            </div>
            <div className="pizza-hub-subscribe-media">
              <Image src="/images/pizza-slice-pull.jpg" alt="عرض بيتزا" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
            </div>
          </div>
        </section>

        <section id="app" className="pizza-hub-app-section">
          <div className="pizza-hub-container pizza-hub-app-grid">
            <div className="pizza-hub-phone-mockup">
              <div className="pizza-hub-phone-screen">De Roma</div>
            </div>
            <div>
              <span className="pizza-hub-kicker pizza-hub-kicker-light">DELIVERY HERO APP</span>
              <h2>اطلب أونلاين بسهولة</h2>
              <p>تجربة طلب سريعة وواضحة من الهاتف، من اختيار الصنف حتى تأكيد الطلب.</p>
              <div className="pizza-hub-store-row">
                <span>Google Play</span>
                <span>App Store</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pizza-hub-footer">
        <div className="pizza-hub-container pizza-hub-footer-grid">
          <div>
            <h3>{settings.restaurant_name}</h3>
            <p>{settings.tagline}</p>
          </div>
          <div>
            <h4>روابط</h4>
            <Link href="/menu">المنيو</Link>
            <a href="#deals">العروض</a>
          </div>
          <div>
            <h4>تواصل معنا</h4>
            <p>{settings.phone}</p>
            <p>{settings.hours}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
