import Image from "next/image";
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
  Twitter,
  ChevronLeft,
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

  const hero = products[0];
  const deals = products.slice(0, 4);
  const heroImage = hero?.image_url || "/images/table-two-pizzas.jpg";

  return (
    <div className="pizza-ref-shell">
      <div className="pizza-ref-topline">
        <div className="pizza-ref-container pizza-ref-topline-inner">
          <div className="pizza-ref-contact-mini">
            <span><MapPin size={13} /> {settings.address}</span>
            <span><Phone size={13} /> {settings.phone}</span>
          </div>
          <div className="pizza-ref-social-mini">
            <Facebook size={13} />
            <Twitter size={13} />
            <Instagram size={13} />
            <span><UserRound size={13} /> حسابي</span>
          </div>
        </div>
      </div>

      <header className="pizza-ref-header">
        <div className="pizza-ref-container pizza-ref-header-inner">
          <nav className="pizza-ref-nav pizza-ref-nav-start">
            <a href="#home">الرئيسية</a>
            <a href="#categories">الأصناف</a>
            <a href="#deals">العروض</a>
          </nav>

          <Link href="/" className="pizza-ref-logo">
            <span className="pizza-ref-logo-mark">DR</span>
            <span>{settings.restaurant_name}</span>
          </Link>

          <nav className="pizza-ref-nav pizza-ref-nav-end">
            <a href="#subscribe">اشترك</a>
            <a href="#app">التطبيق</a>
            <Link href="/menu" className="pizza-ref-cart-link">
              <ShoppingCart size={16} /> الطلب
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section id="home" className="pizza-ref-hero">
          <div className="pizza-ref-container pizza-ref-hero-inner">
            <div className="pizza-ref-floating pizza-ref-floating-left" aria-hidden="true">
              <div className="pizza-ref-floating-card pizza-ref-floating-pizza pizza-ref-floating-pizza-left">
                <Image src={deals[1]?.image_url || fallbackImages[1]} alt="بيتزا جانبية" fill className="object-cover" sizes="220px" />
              </div>
              <div className="pizza-ref-floating-card pizza-ref-floating-small">
                <Image src={deals[2]?.image_url || fallbackImages[2]} alt="طبق جانبي" fill className="object-cover" sizes="130px" />
              </div>
            </div>

            <div className="pizza-ref-hero-copy">
              <span className="pizza-ref-script-small">New Festive</span>
              <h1>نكهات<br />تصنع الفرق</h1>
              <p>{settings.tagline || "بيتزا ومعجنات بطابع إيطالي ومذاق غني في كل طلب."}</p>
              <div className="pizza-ref-hero-actions">
                <Link href="/menu" className="pizza-ref-round-arrow" aria-label="عرض المنيو"><ChevronLeft size={20} /></Link>
                <Link href="/menu" className="pizza-ref-primary-cta">شاهد المنيو</Link>
              </div>
            </div>

            <div className="pizza-ref-hero-centerpiece">
              <div className="pizza-ref-pizza-disc">
                <Image src={heroImage} alt={hero?.name_ar || settings.restaurant_name} fill priority className="object-cover" sizes="(max-width: 900px) 88vw, 560px" />
              </div>
              <div className="pizza-ref-cup"><span>COLA</span></div>
            </div>

            <div className="pizza-ref-floating pizza-ref-floating-right" aria-hidden="true">
              <div className="pizza-ref-floating-card pizza-ref-floating-pizza pizza-ref-floating-pizza-right">
                <Image src={deals[0]?.image_url || fallbackImages[0]} alt="بيتزا جانبية" fill className="object-cover" sizes="220px" />
              </div>
              <div className="pizza-ref-floating-card pizza-ref-floating-fries"><span>FRIES</span></div>
            </div>
          </div>
        </section>

        <section id="categories" className="pizza-ref-category-band">
          <div className="pizza-ref-container pizza-ref-category-grid">
            {categories.map(({ label, icon: Icon }) => (
              <div key={label} className="pizza-ref-category-item">
                <Icon size={35} strokeWidth={1.7} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="deals" className="pizza-ref-deals-section">
          <div className="pizza-ref-decor pizza-ref-decor-sauce" aria-hidden="true" />
          <div className="pizza-ref-decor pizza-ref-decor-basil" aria-hidden="true" />
          <div className="pizza-ref-container">
            <div className="pizza-ref-deals-heading">
              <span>De Roma</span>
              <h2>عرض اليوم</h2>
            </div>

            <div className="pizza-ref-deals-layout">
              <div className="pizza-ref-deals-small-grid">
                {deals.slice(0, 4).map((product, index) => (
                  <article key={product.id} className="pizza-ref-deal-card">
                    <Image src={product.image_url || fallbackImages[index]} alt={product.name_ar} fill className="object-cover" sizes="(max-width: 900px) 100vw, 270px" />
                    <div className="pizza-ref-deal-shade" />
                    <div className="pizza-ref-deal-text">
                      <span>Deal {String(index + 1).padStart(2, "0")}</span>
                      <h3>{product.name_ar}</h3>
                      <p>{product.description_ar || "مكونات مختارة وطعم غني في كل طلب."}</p>
                      <Link href="/menu">أضف للطلب</Link>
                    </div>
                  </article>
                ))}
              </div>

              <article className="pizza-ref-jumbo-deal">
                <Image src={deals[0]?.image_url || heroImage} alt={deals[0]?.name_ar || "عرض بيتزا"} fill className="object-cover" sizes="(max-width: 900px) 100vw, 540px" />
                <div className="pizza-ref-deal-shade pizza-ref-deal-shade-strong" />
                <div className="pizza-ref-jumbo-copy">
                  <span>Jumbo Deal</span>
                  <h3>{deals[0]?.name_ar || "عرض البيتزا الكبير"}</h3>
                  <p>{deals[0]?.description_ar || "اختيار مثالي للعائلة والأصدقاء."}</p>
                  <Link href="/menu">اطلب الآن</Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="subscribe" className="pizza-ref-subscribe">
          <div className="pizza-ref-container pizza-ref-subscribe-inner">
            <div className="pizza-ref-subscribe-copy">
              <span>Subscribe</span>
              <h2>اشترك الآن</h2>
              <p>سجل بريدك واحصل على أحدث العروض والخصومات.</p>
              <div className="pizza-ref-subscribe-form">
                <input type="email" placeholder="بريدك الإلكتروني" />
                <button type="button">اشترك</button>
              </div>
            </div>
            <div className="pizza-ref-subscribe-art" aria-hidden="true">
              <div className="pizza-ref-subscribe-pizza">
                <Image src={heroImage} alt="بيتزا ومشروب" fill className="object-cover" sizes="420px" />
              </div>
              <div className="pizza-ref-subscribe-cup"><span>COLA</span></div>
              <div className="pizza-ref-tomato">●</div>
            </div>
          </div>
        </section>

        <section id="app" className="pizza-ref-app">
          <div className="pizza-ref-container pizza-ref-app-inner">
            <div className="pizza-ref-phone">
              <div className="pizza-ref-phone-notch" />
              <div className="pizza-ref-phone-screen">
                <div className="pizza-ref-phone-logo">DR</div>
                <div className="pizza-ref-phone-preview">
                  <div className="pizza-ref-phone-preview-img">
                    <Image src={heroImage} alt="معاينة التطبيق" fill className="object-cover" sizes="180px" />
                  </div>
                  <span>{settings.restaurant_name}</span>
                </div>
              </div>
            </div>

            <div className="pizza-ref-app-copy">
              <span>Delivery Hero</span>
              <h2>اطلب أونلاين</h2>
              <p>تجربة طلب سريعة وواضحة من الهاتف، من اختيار الصنف حتى تأكيد الطلب.</p>
              <div className="pizza-ref-store-row">
                <span>Google Play</span>
                <span>App Store</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="pizza-ref-footer">
        <div className="pizza-ref-container pizza-ref-footer-grid">
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
        <div className="pizza-ref-copyright">© {new Date().getFullYear()} {settings.restaurant_name}</div>
      </footer>
    </div>
  );
}
