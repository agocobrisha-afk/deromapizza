import Link from "next/link";
import {
  Pizza,
  Sandwich,
  Utensils,
  IceCreamBowl,
  CupSoda,
  ShoppingCart,
  MapPin,
  Phone,
  UserRound,
  Facebook,
  Instagram,
} from "lucide-react";
import { getFeaturedProducts, getSiteSettings } from "@/lib/queries";

const categories = [
  { label: "بيتزا", icon: Pizza },
  { label: "شرائح", icon: Sandwich },
  { label: "باستا", icon: Utensils },
  { label: "حلويات", icon: IceCreamBowl },
  { label: "مشروبات", icon: CupSoda },
];

const visualImages = [
  "/images/table-two-pizzas.jpg",
  "/images/pizza-slice-pull.jpg",
  "/images/table-two-pizzas.jpg",
  "/images/pizza-slice-pull.jpg",
];

export default async function PizzaHubLanding() {
  const [settings, products] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
  ]);

  const deals = products.slice(0, 4);
  const primaryImage = products[0]?.image_url || visualImages[0];

  return (
    <div className="fresh-pizza-shell">
      <div className="fresh-pizza-topline">
        <div className="fresh-pizza-container fresh-pizza-topline-inner">
          <div className="fresh-pizza-contact-mini">
            <span><MapPin size={13} /> {settings.address}</span>
            <span><Phone size={13} /> {settings.phone}</span>
          </div>
          <div className="fresh-pizza-social-mini">
            <Facebook size={13} />
            <Instagram size={13} />
            <span><UserRound size={13} /> حسابي</span>
          </div>
        </div>
      </div>

      <header className="fresh-pizza-header">
        <div className="fresh-pizza-container fresh-pizza-header-inner">
          <nav className="fresh-pizza-nav">
            <a href="#home">الرئيسية</a>
            <a href="#categories">الأصناف</a>
            <a href="#deals">العروض</a>
          </nav>

          <Link href="/" className="fresh-pizza-logo">
            <span className="fresh-pizza-logo-mark">DR</span>
            <span>{settings.restaurant_name}</span>
          </Link>

          <nav className="fresh-pizza-nav fresh-pizza-nav-end">
            <a href="#subscribe">اشترك</a>
            <a href="#app">التطبيق</a>
            <Link href="/menu" className="fresh-pizza-cart-link">
              <ShoppingCart size={16} /> الطلب
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="fresh-pizza-hero">
          <div className="fresh-pizza-container fresh-pizza-hero-inner">
            <div className="fresh-pizza-orbit fresh-pizza-orbit-left" aria-hidden="true">
              <div className="fresh-pizza-orbit-card fresh-pizza-orbit-large" style={{ backgroundImage: `url(${deals[1]?.image_url || visualImages[1]})` }} />
              <div className="fresh-pizza-orbit-card fresh-pizza-orbit-small" style={{ backgroundImage: `url(${deals[2]?.image_url || visualImages[2]})` }} />
            </div>

            <div className="fresh-pizza-hero-copy">
              <span>New Festive</span>
              <h1>نكهات<br />تصنع الفرق</h1>
              <p>{settings.tagline || "بيتزا ومعجنات بطابع إيطالي ومذاق غني في كل طلب."}</p>
              <div className="fresh-pizza-hero-actions">
                <Link href="/menu" className="fresh-pizza-primary-cta">شاهد المنيو</Link>
                <a href={`https://wa.me/${settings.whatsapp}`} className="fresh-pizza-secondary-cta">اطلب الآن</a>
              </div>
            </div>

            <div className="fresh-pizza-centerpiece">
              <div className="fresh-pizza-main-disc" style={{ backgroundImage: `url(${primaryImage})` }} />
              <div className="fresh-pizza-cola">COLA</div>
            </div>

            <div className="fresh-pizza-orbit fresh-pizza-orbit-right" aria-hidden="true">
              <div className="fresh-pizza-orbit-card fresh-pizza-orbit-large" style={{ backgroundImage: `url(${deals[0]?.image_url || visualImages[0]})` }} />
              <div className="fresh-pizza-fries">FRIES</div>
            </div>
          </div>
        </section>

        <section id="categories" className="fresh-pizza-category-band">
          <div className="fresh-pizza-container fresh-pizza-category-grid">
            {categories.map(({ label, icon: Icon }) => (
              <div key={label} className="fresh-pizza-category-item">
                <Icon size={35} strokeWidth={1.7} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="deals" className="fresh-pizza-deals-section">
          <div className="fresh-pizza-container">
            <div className="fresh-pizza-section-heading">
              <span>De Roma</span>
              <h2>عرض اليوم</h2>
            </div>

            <div className="fresh-pizza-deals-layout">
              <div className="fresh-pizza-deals-small-grid">
                {deals.map((product, index) => (
                  <article
                    key={product.id}
                    className="fresh-pizza-deal-card"
                    style={{ backgroundImage: `url(${product.image_url || visualImages[index]})` }}
                  >
                    <div className="fresh-pizza-deal-overlay" />
                    <div className="fresh-pizza-deal-copy">
                      <span>Deal {String(index + 1).padStart(2, "0")}</span>
                      <h3>{product.name_ar}</h3>
                      <p>{product.description_ar || "مكونات مختارة وطعم غني في كل طلب."}</p>
                      <Link href="/menu">أضف للطلب</Link>
                    </div>
                  </article>
                ))}
              </div>

              <article className="fresh-pizza-jumbo-deal" style={{ backgroundImage: `url(${primaryImage})` }}>
                <div className="fresh-pizza-deal-overlay fresh-pizza-deal-overlay-strong" />
                <div className="fresh-pizza-jumbo-copy">
                  <span>Jumbo Deal</span>
                  <h3>{deals[0]?.name_ar || "عرض البيتزا الكبير"}</h3>
                  <p>{deals[0]?.description_ar || "اختيار مثالي للعائلة والأصدقاء."}</p>
                  <Link href="/menu">اطلب الآن</Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="subscribe" className="fresh-pizza-subscribe">
          <div className="fresh-pizza-container fresh-pizza-subscribe-inner">
            <div className="fresh-pizza-subscribe-copy">
              <span>Subscribe</span>
              <h2>اشترك الآن</h2>
              <p>سجل بريدك واحصل على أحدث العروض والخصومات.</p>
              <div className="fresh-pizza-subscribe-form">
                <input type="email" placeholder="بريدك الإلكتروني" />
                <button type="button">اشترك</button>
              </div>
            </div>
            <div className="fresh-pizza-subscribe-art" aria-hidden="true">
              <div className="fresh-pizza-subscribe-disc" style={{ backgroundImage: `url(${primaryImage})` }} />
              <div className="fresh-pizza-subscribe-cup">COLA</div>
              <div className="fresh-pizza-tomato" />
            </div>
          </div>
        </section>

        <section id="app" className="fresh-pizza-app">
          <div className="fresh-pizza-container fresh-pizza-app-inner">
            <div className="fresh-pizza-phone">
              <div className="fresh-pizza-phone-notch" />
              <div className="fresh-pizza-phone-screen">
                <div className="fresh-pizza-phone-logo">DR</div>
                <div className="fresh-pizza-phone-card" style={{ backgroundImage: `url(${primaryImage})` }} />
              </div>
            </div>

            <div className="fresh-pizza-app-copy">
              <span>Delivery Hero</span>
              <h2>اطلب أونلاين</h2>
              <p>تجربة طلب سريعة وواضحة من الهاتف، من اختيار الصنف حتى تأكيد الطلب.</p>
              <div className="fresh-pizza-store-row">
                <span>Google Play</span>
                <span>App Store</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="fresh-pizza-footer">
        <div className="fresh-pizza-container fresh-pizza-footer-grid">
          <div>
            <h3>{settings.restaurant_name}</h3>
            <p>{settings.tagline}</p>
          </div>
          <div>
            <h4>عن المطعم</h4>
            <a href="#home">الرئيسية</a>
            <a href="#deals">العروض</a>
          </div>
          <div>
            <h4>خدمة الزبائن</h4>
            <Link href="/menu">المنيو</Link>
            <a href={`https://wa.me/${settings.whatsapp}`}>واتساب</a>
          </div>
          <div>
            <h4>تواصل معنا</h4>
            <p>{settings.phone}</p>
            <p>{settings.hours}</p>
          </div>
        </div>
        <div className="fresh-pizza-copyright">© {new Date().getFullYear()} {settings.restaurant_name}</div>
      </footer>
    </div>
  );
}
