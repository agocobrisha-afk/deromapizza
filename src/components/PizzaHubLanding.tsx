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
} from "lucide-react";
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
  const [settings, products] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
  ]);

  const deals = products.slice(0, 4);
  const imageAt = (index: number) => deals[index]?.image_url || fallbackImages[index % fallbackImages.length];
  const primaryImage = imageAt(0);

  return (
    <div className="fresh-pizza-shell">
      <div className="fresh-pizza-topline">
        <div className="fresh-pizza-container fresh-pizza-topline-inner">
          <div className="fresh-pizza-contact-mini">
            <span><MapPin size={13} /> {settings.address}</span>
            <span><Phone size={13} /> {settings.phone}</span>
          </div>
          <div className="fresh-pizza-social-mini">
            <span className="fresh-pizza-social-dot" aria-hidden="true">f</span>
            <span className="fresh-pizza-social-dot" aria-hidden="true">◎</span>
            <span><UserRound size={13} /> حسابي</span>
          </div>
        </div>
      </div>

      <header className="fresh-pizza-header">
        <div className="fresh-pizza-container fresh-pizza-header-inner">
          <nav className="fresh-pizza-nav fresh-pizza-nav-main">
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
        <section id="home" className="fresh-pizza-hero fresh-pizza-hero-poster">
          <div className="fresh-pizza-container fresh-pizza-hero-poster-inner">
            <div className="fresh-pizza-floating-plate fresh-pizza-floating-plate-one" style={{ backgroundImage: `url(${imageAt(1)})` }} />
            <div className="fresh-pizza-floating-plate fresh-pizza-floating-plate-two" style={{ backgroundImage: `url(${imageAt(2)})` }} />
            <div className="fresh-pizza-floating-fries" aria-hidden="true"><span>FRIES</span></div>
            <div className="fresh-pizza-floating-cola" aria-hidden="true"><span>COLA</span></div>

            <div className="fresh-pizza-hero-stage">
              <div className="fresh-pizza-hero-copy fresh-pizza-hero-copy-poster">
                <span>New Festive</span>
                <h1>نكهات تصنع الفرق</h1>
                <p>{settings.tagline || "بيتزا ومعجنات بطابع إيطالي ومذاق غني في كل طلب."}</p>
                <div className="fresh-pizza-hero-actions">
                  <Link href="/menu" className="fresh-pizza-primary-cta">شاهد المنيو</Link>
                  <a href={`https://wa.me/${settings.whatsapp}`} className="fresh-pizza-secondary-cta">اطلب الآن</a>
                </div>
              </div>

              <div className="fresh-pizza-main-disc fresh-pizza-main-disc-poster" style={{ backgroundImage: `url(${primaryImage})` }} />
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

        <section id="deals" className="fresh-pizza-deals-section fresh-pizza-deals-poster">
          <div className="fresh-pizza-container">
            <div className="fresh-pizza-section-heading">
              <span>De Roma</span>
              <h2>عرض اليوم</h2>
            </div>

            <div className="fresh-pizza-deals-layout fresh-pizza-deals-layout-poster">
              <div className="fresh-pizza-deals-small-grid">
                {deals.map((product, index) => (
                  <article
                    key={product.id}
                    className="fresh-pizza-deal-card fresh-pizza-deal-card-poster"
                    style={{ backgroundImage: `url(${product.image_url || fallbackImages[index]})` }}
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

              <article className="fresh-pizza-jumbo-deal fresh-pizza-jumbo-deal-poster" style={{ backgroundImage: `url(${primaryImage})` }}>
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

        <section id="subscribe" className="fresh-pizza-subscribe fresh-pizza-subscribe-poster">
          <div className="fresh-pizza-container fresh-pizza-subscribe-inner fresh-pizza-subscribe-inner-poster">
            <div className="fresh-pizza-subscribe-copy">
              <span>Subscribe</span>
              <h2>اشترك الآن</h2>
              <p>سجل بريدك واحصل على أحدث العروض والخصومات.</p>
              <div className="fresh-pizza-subscribe-form">
                <input type="email" placeholder="بريدك الإلكتروني" />
                <button type="button">اشترك</button>
              </div>
            </div>
            <div className="fresh-pizza-subscribe-art fresh-pizza-subscribe-art-poster" aria-hidden="true">
              <div className="fresh-pizza-subscribe-disc fresh-pizza-subscribe-disc-poster" style={{ backgroundImage: `url(${primaryImage})` }} />
              <div className="fresh-pizza-subscribe-cup">COLA</div>
              <div className="fresh-pizza-tomato" />
            </div>
          </div>
        </section>

        <section id="app" className="fresh-pizza-app fresh-pizza-app-poster">
          <div className="fresh-pizza-container fresh-pizza-app-inner fresh-pizza-app-inner-poster">
            <div className="fresh-pizza-phone fresh-pizza-phone-poster">
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

      <footer className="fresh-pizza-footer fresh-pizza-footer-poster">
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
