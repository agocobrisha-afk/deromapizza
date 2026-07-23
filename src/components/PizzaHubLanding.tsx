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
                    <div><strong>{product.price ? `${product.price} د.ل` : "السعر عند الطلب"}</strong><Link href="/menu">أضف للطلب</Link></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="story" className="roma-story">
          <div className="roma-container roma-story-grid">
            <div className="roma-story-visual">
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
              <div className="roma-gallery-item" style={{ backgroundImage: `url(${imageAt(1)})` }} />
              <div className="roma-gallery-item" style={{ backgroundImage: `url(${imageAt(2)})` }} />
              <div className="roma-gallery-item" style={{ backgroundImage: `url(${imageAt(3)})` }} />
              <div className="roma-gallery-item roma-gallery-tall" style={{ backgroundImage: `url(${imageAt(4)})` }} />
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
        <div className="roma-container roma-footer-grid">
          <div><Link href="/" className="roma-brand roma-brand-footer"><span className="roma-brand-mark">DR</span><span className="roma-brand-copy"><strong>{settings.restaurant_name}</strong><small>Italian Pizza & Pastry</small></span></Link><p>{settings.tagline}</p></div>
          <div><h4>روابط سريعة</h4><a href="#home">الرئيسية</a><a href="#bestsellers">الأكثر طلبًا</a><a href="#story">قصتنا</a></div>
          <div><h4>تواصل معنا</h4><p>{settings.phone}</p><p>{settings.address}</p><p>{settings.hours}</p></div>
          <div><h4>اطلب الآن</h4><Link href="/menu">المنيو</Link><a href={`https://wa.me/${settings.whatsapp}`}>واتساب</a></div>
        </div>
        <div className="roma-footer-bottom">© {new Date().getFullYear()} {settings.restaurant_name}. جميع الحقوق محفوظة.</div>
      </footer>

      <style>{`
        .roma-product-card,.roma-gallery-item,.roma-story-image{transition:transform .35s ease,box-shadow .35s ease}
        .roma-product-card:hover{transform:translateY(-6px);box-shadow:0 28px 64px -36px rgba(0,0,0,.48)}
        .roma-gallery-item:hover,.roma-story-image:hover{transform:scale(1.015)}
        @media (max-width:980px){
          .roma-hero-grid{padding:54px 0 46px;gap:8px}
          .roma-hero-copy{max-width:720px}.roma-hero-showcase{min-height:430px}.roma-story-grid{gap:36px}
        }
        @media (max-width:720px){
          .roma-container{width:calc(100% - 24px)}
          .roma-header-inner{min-height:66px;grid-template-columns:auto 1fr auto;gap:8px}
          .roma-brand-copy{display:grid}.roma-brand-copy small{display:none}.roma-brand-mark{width:40px;height:40px;font-size:13px}
          .roma-header-actions{gap:7px}.roma-order-button{min-height:38px;padding:0 12px;font-size:11px}.roma-menu-button{width:38px;height:38px}
          .roma-hero{min-height:auto}.roma-hero-grid{display:block;min-height:auto;padding:42px 0 26px}.roma-hero-copy{text-align:center;margin:auto}
          .roma-kicker{font-size:10px;justify-content:center}.roma-hero-copy h1{font-size:clamp(2.45rem,10.8vw,3.5rem);line-height:1.02;margin-top:12px}
          .roma-hero-copy p{font-size:13px;line-height:1.75;margin:14px auto 0}.roma-hero-actions,.roma-hero-meta{justify-content:center}.roma-hero-actions{margin-top:18px}.roma-hero-meta{margin-top:16px;gap:10px;font-size:10px}
          .roma-hero-showcase{min-height:300px;margin-top:10px}.roma-hero-main-plate{width:min(270px,72vw);border-width:8px}
          .roma-hero-orbit-one{width:76px;height:76px;left:2px;top:36px;border-width:4px}.roma-hero-orbit-two{width:64px;height:64px;right:4px;bottom:38px;border-width:4px}
          .roma-hero-badge{left:6px;bottom:24px;min-width:96px;padding:8px 9px;border-radius:14px;font-size:11px}
          .roma-trust-grid{grid-template-columns:repeat(2,1fr)}.roma-trust-grid>div{min-height:82px;padding:10px 6px;gap:7px}.roma-trust-grid strong{font-size:14px}.roma-trust-grid small{font-size:9px}
          .roma-section{padding:50px 0}.roma-section-head{margin-bottom:22px;gap:10px}.roma-section-head h2,.roma-story-copy h2,.roma-cta-content h2{font-size:clamp(2.25rem,9vw,3.2rem)}
          .roma-product-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.roma-product-card{border-radius:16px}.roma-product-image{height:150px}.roma-product-body{padding:14px}.roma-product-body h3{font-size:18px}
          .roma-product-body p{min-height:44px;font-size:10px;line-height:1.55;margin-top:7px}.roma-product-body>div{margin-top:12px;font-size:11px}.roma-product-tag{top:9px;right:9px;padding:5px 8px;font-size:9px}.roma-product-image button{top:9px;left:9px;width:31px;height:31px}
          .roma-story{padding:52px 0}.roma-story-grid{display:flex;flex-direction:column;gap:24px}.roma-story-visual{width:100%;min-height:320px}.roma-story-image-main{width:88%;height:270px;right:0;top:10px}.roma-story-image-small{width:43%;height:145px;left:0;bottom:0;border-width:5px}
          .roma-story-seal{width:76px;height:76px;font-size:12px;left:18%;top:0}.roma-story-copy{text-align:center}.roma-story-copy p{font-size:12px;line-height:1.8}.roma-story-points{margin:20px 0}.roma-story-points>div{justify-content:center;padding-bottom:9px}
          .roma-gallery-grid{grid-template-columns:repeat(2,1fr);grid-auto-rows:120px;gap:8px}.roma-gallery-wide{grid-column:span 2}.roma-gallery-tall{grid-row:span 2}.roma-gallery-item{border-radius:14px}
          .roma-cta{min-height:370px;padding:42px 0}.roma-cta-content p{font-size:12px}.roma-footer{padding-top:38px}.roma-footer-grid{grid-template-columns:repeat(2,1fr);gap:22px 12px}.roma-footer-grid>div:first-child{grid-column:1/-1;text-align:center}.roma-brand-footer{justify-content:center}
        }
        @media (max-width:420px){.roma-product-grid{grid-template-columns:1fr}.roma-product-image{height:210px}.roma-brand-copy{display:none}}
      `}</style>
    </div>
  );
}
