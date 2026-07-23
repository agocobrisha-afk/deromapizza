import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Flame,
  Heart,
  MapPin,
  Menu,
  Phone,
  ShoppingBag,
  Sparkles,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { getFeaturedProducts, getSiteSettings } from "@/lib/queries";

const showcaseImages = [
  "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1600&q=85",
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=85",
];

const testimonials = [
  {
    name: "سارة محمد",
    role: "عميلة دائمة",
    quote: "العجينة خفيفة والطعم ثابت في كل مرة. الطلب يوصل مرتب وساخن فعلًا.",
  },
  {
    name: "أحمد الورفلي",
    role: "تقييم Google",
    quote: "من أفضل تجارب البيتزا في طرابلس. المكونات واضحة والخدمة سريعة ومحترمة.",
  },
  {
    name: "مريم علي",
    role: "طلب عائلي",
    quote: "التغليف ممتاز والبيتزا وصلت كأنها طالعة توًا من الفرن. تجربة تستحق التكرار.",
  },
];

export default async function PizzaHubLanding() {
  const [settings, products] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
  ]);

  const featured = products.slice(0, 4);
  const imageAt = (index: number) => showcaseImages[index % showcaseImages.length];
  const primaryImage = imageAt(0);
  const secondaryImage = imageAt(1);
  const thirdImage = imageAt(2);

  return (
    <div className="roma-shell">
      <header className="roma-header">
        <div className="roma-container roma-header-inner">
          <Link href="/" className="roma-brand" aria-label={settings.restaurant_name}>
            <span className="roma-brand-mark">DR</span>
            <span className="roma-brand-copy">
              <strong>{settings.restaurant_name}</strong>
              <small>Pizza · Pastry · Italian Taste</small>
            </span>
          </Link>

          <nav className="roma-nav" aria-label="التنقل الرئيسي">
            <a href="#home">الرئيسية</a>
            <a href="#bestsellers">الأكثر طلبًا</a>
            <a href="#story">قصتنا</a>
            <a href="#gallery">المعرض</a>
          </nav>

          <div className="roma-header-actions">
            <a href={`tel:${settings.phone}`} className="roma-icon-link" aria-label="اتصل بنا"><Phone size={18} /></a>
            <Link href="/menu" className="roma-order-button"><ShoppingBag size={17} />اطلب الآن</Link>
            <button type="button" className="roma-menu-button" aria-label="فتح القائمة"><Menu size={20} /></button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="roma-hero">
          <div className="roma-hero-bg" style={{ backgroundImage: `url(${primaryImage})` }} />
          <div className="roma-hero-shade" />
          <div className="roma-container roma-hero-grid">
            <div className="roma-hero-copy">
              <span className="roma-kicker"><Sparkles size={16} /> طعم إيطالي حقيقي في قلب طرابلس</span>
              <h1>بيتزا تُخبز بحب، وتصل ساخنة إلى بابك</h1>
              <p>{settings.tagline || "عجينة يومية، مكونات مختارة، وطعم يخلّي كل طلب تجربة تستحق التكرار."}</p>
              <div className="roma-hero-actions">
                <Link href="/menu" className="roma-primary-cta">شاهد المنيو <ArrowLeft size={18} /></Link>
                <a href={`https://wa.me/${settings.whatsapp}`} className="roma-secondary-cta">اطلب عبر واتساب</a>
              </div>
              <div className="roma-hero-meta">
                <span><Clock3 size={16} /> تحضير يومي</span>
                <span><MapPin size={16} /> داخل طرابلس</span>
                <span><Flame size={16} /> تصل ساخنة</span>
              </div>
            </div>

            <div className="roma-hero-showcase" aria-hidden="true">
              <div className="roma-hero-orbit roma-hero-orbit-one" style={{ backgroundImage: `url(${secondaryImage})` }} />
              <div className="roma-hero-orbit roma-hero-orbit-two" style={{ backgroundImage: `url(${thirdImage})` }} />
              <div className="roma-hero-main-plate" style={{ backgroundImage: `url(${imageAt(5)})` }} />
              <div className="roma-hero-badge"><Star size={18} fill="currentColor" /><strong>4.9</strong><span>تقييم الزبائن</span></div>
            </div>
          </div>
        </section>

        <section className="roma-trust-bar">
          <div className="roma-container roma-trust-grid">
            <div><Flame size={22} /><span><strong>مكونات طازجة</strong><small>يوميًا بدون اختصارات</small></span></div>
            <div><Clock3 size={22} /><span><strong>تحضير سريع</strong><small>من الفرن مباشرة</small></span></div>
            <div><Heart size={22} /><span><strong>طعم ثابت</strong><small>في كل طلب</small></span></div>
            <div><UtensilsCrossed size={22} /><span><strong>وصفات خاصة</strong><small>بهوية De Roma</small></span></div>
          </div>
        </section>

        <section id="bestsellers" className="roma-section roma-bestsellers">
          <div className="roma-container">
            <div className="roma-section-head">
              <div><span>الأكثر طلبًا</span><h2>اختيارات الزبائن</h2></div>
              <Link href="/menu" className="roma-text-link">شاهد المنيو كاملًا <ArrowLeft size={16} /></Link>
            </div>
            <div className="roma-product-grid">
              {featured.map((product, index) => (
                <article className="roma-product-card" key={product.id}>
                  <div className="roma-product-image" style={{ backgroundImage: `url(${imageAt(index + 1)})` }}>
                    <span className="roma-product-tag">مميز</span>
                    <button type="button" aria-label="إضافة للمفضلة"><Heart size={17} /></button>
                  </div>
                  <div className="roma-product-body">
                    <h3>{product.name_ar}</h3>
                    <p>{product.description_ar || "مكونات مختارة بعناية وطعم غني في كل لقمة."}</p>
                    <div><strong>{product.price ? `${product.price} د.ل` : "السعر عند الطلب"}</strong><Link href="/menu" className="roma-card-cta">أضف للطلب <ArrowLeft size={14} /></Link></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="story" className="roma-story">
          <div className="roma-container roma-story-grid">
            <div className="roma-story-visual">
              <div className="roma-story-number roma-story-number-one">01</div>
              <div className="roma-story-number roma-story-number-two">03</div>
              <div className="roma-story-image roma-story-image-main" style={{ backgroundImage: `url(${imageAt(2)})` }} />
              <div className="roma-story-image roma-story-image-small" style={{ backgroundImage: `url(${imageAt(4)})` }} />
              <div className="roma-story-seal">من الفرن<br />إلى بابك</div>
            </div>
            <div className="roma-story-copy">
              <span>قصتنا</span>
              <h2>نخبز كل قطعة وكأنها أول طلب في اليوم</h2>
              <p>في De Roma نهتم بالعجينة قبل كل شيء، ونختار المكونات بعناية، ونحافظ على نفس الجودة في كل مرة. الهدف بسيط: بيتزا بطعم واضح، جبنة حقيقية، وخدمة تستحق الثقة.</p>
              <div className="roma-story-points">
                <div><strong>01</strong><span>عجينة تُحضّر يوميًا</span></div>
                <div><strong>02</strong><span>مكونات مختارة</span></div>
                <div><strong>03</strong><span>توصيل داخل طرابلس</span></div>
              </div>
              <Link href="/menu" className="roma-primary-cta">اكتشف منيو De Roma <ArrowLeft size={18} /></Link>
            </div>
          </div>
        </section>

        <section id="gallery" className="roma-section roma-gallery">
          <div className="roma-container">
            <div className="roma-section-head roma-section-head-centered"><div><span>من أجوائنا</span><h2>كل صورة تحكي طعمًا</h2></div></div>
            <div className="roma-gallery-grid">
              <div className="roma-gallery-item roma-gallery-wide" style={{ backgroundImage: `url(${imageAt(0)})` }} />
              <div className="roma-gallery-item roma-gallery-tall" style={{ backgroundImage: `url(${imageAt(1)})` }} />
              <div className="roma-gallery-item" style={{ backgroundImage: `url(${imageAt(2)})` }} />
              <div className="roma-gallery-item" style={{ backgroundImage: `url(${imageAt(3)})` }} />
              <div className="roma-gallery-item roma-gallery-tall" style={{ backgroundImage: `url(${imageAt(4)})` }} />
              <div className="roma-gallery-item" style={{ backgroundImage: `url(${imageAt(5)})` }} />
            </div>
          </div>
        </section>

        <section className="roma-section roma-testimonials">
          <div className="roma-container">
            <div className="roma-section-head roma-section-head-centered"><div><span>آراء العملاء</span><h2>تجربة يحبوا يرجعوا لها</h2></div></div>
            <div className="roma-review-summary">
              <div><Star size={22} fill="currentColor" /><strong>4.9</strong><span>من 5</span></div>
              <p>تقييم ممتاز مبني على جودة ثابتة، توصيل سريع، وطعم يتكرر بنفس المستوى.</p>
            </div>
            <div className="roma-testimonial-grid">
              {testimonials.map((item) => (
                <article className="roma-testimonial-card" key={item.name}>
                  <div className="roma-testimonial-stars">★★★★★</div>
                  <p>“{item.quote}”</p>
                  <div><strong>{item.name}</strong><span>{item.role}</span></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="roma-cta">
          <div className="roma-cta-bg" style={{ backgroundImage: `url(${imageAt(5)})` }} />
          <div className="roma-cta-shade" />
          <div className="roma-container roma-cta-content">
            <span>جاهز للطلب؟</span><h2>خلي عشا اليوم من De Roma</h2><p>اختر اللي يعجبك، أرسل الطلب، وخلي الباقي علينا.</p>
            <div className="roma-hero-actions"><Link href="/menu" className="roma-primary-cta">اطلب من المنيو <ArrowLeft size={18} /></Link><a href={`https://wa.me/${settings.whatsapp}`} className="roma-secondary-cta roma-secondary-cta-light">واتساب</a></div>
          </div>
        </section>
      </main>

      <footer className="roma-footer">
        <div className="roma-container roma-footer-top">
          <div className="roma-footer-brand-block">
            <Link href="/" className="roma-brand roma-brand-footer"><span className="roma-brand-mark">DR</span><span className="roma-brand-copy"><strong>{settings.restaurant_name}</strong><small>Italian Pizza & Pastry</small></span></Link>
            <p>{settings.tagline}</p>
            <div className="roma-footer-socials"><a href="#">Instagram</a><a href="#">Facebook</a><a href={`https://wa.me/${settings.whatsapp}`}>WhatsApp</a></div>
          </div>
          <div className="roma-footer-grid">
            <div><h4>روابط سريعة</h4><a href="#home">الرئيسية</a><a href="#bestsellers">الأكثر طلبًا</a><a href="#story">قصتنا</a><a href="#gallery">المعرض</a></div>
            <div><h4>ساعات العمل</h4><p>{settings.hours}</p><p>خدمة الطلب يوميًا</p></div>
            <div><h4>تواصل معنا</h4><p>{settings.phone}</p><p>{settings.address}</p></div>
          </div>
          <div className="roma-footer-newsletter">
            <span>كن أول من يعرف عروضنا</span>
            <h4>أحدث العروض مباشرة</h4>
            <p>سجل بريدك أو رقمك للحصول على العروض الجديدة.</p>
            <form><input type="email" placeholder="البريد الإلكتروني" aria-label="البريد الإلكتروني" /><button type="submit">اشتراك</button></form>
          </div>
        </div>
        <div className="roma-footer-bottom">© {new Date().getFullYear()} {settings.restaurant_name}. جميع الحقوق محفوظة.</div>
      </footer>
    </div>
  );
}
