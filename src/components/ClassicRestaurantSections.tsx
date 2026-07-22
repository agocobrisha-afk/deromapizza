import Image from "next/image";
import Link from "next/link";
import { Clock3, MapPin, Phone, UtensilsCrossed } from "lucide-react";
import { getFeaturedProducts, getSiteSettings } from "@/lib/queries";

const gallery = [
  "/images/table-two-pizzas.jpg",
  "/images/pizza-slice-pull.jpg",
  "/images/table-two-pizzas.jpg",
  "/images/pizza-slice-pull.jpg",
  "/images/table-two-pizzas.jpg",
  "/images/pizza-slice-pull.jpg",
];

export default async function ClassicRestaurantSections() {
  const [settings, products] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
  ]);
  const feature = products[0];

  return (
    <div className="relative overflow-hidden bg-[#171717] text-white">
      <section className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_.95fr]">
          <div className="relative mx-auto aspect-square w-full max-w-[480px]">
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <Image
              src={feature?.image_url || "/images/table-two-pizzas.jpg"}
              alt={feature?.name_ar || settings.restaurant_name}
              fill
              className="rounded-full object-cover drop-shadow-2xl"
              sizes="(max-width: 1024px) 90vw, 45vw"
            />
          </div>
          <div>
            <p className="text-sm font-bold tracking-[.25em] text-[#d7a94a]">OUR PIZZA</p>
            <h2 className="mt-4 text-4xl font-black sm:text-6xl" style={{ fontFamily: "var(--font-heading)" }}>
              بيتزا تُحضّر بشغف
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
              عجينة يومية، صلصة غنية ومكونات مختارة بعناية لنقدّم لك بيتزا بطابع إيطالي واضح وطعم ثابت في كل طلب.
            </p>
            <div className="mt-7 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
              <Info text="عجينة مخمّرة يوميًا" />
              <Info text="مكونات مختارة" />
              <Info text="خبز عند الطلب" />
              <Info text="توصيل داخل طرابلس" />
            </div>
            <Link href="/menu" className="mt-8 inline-flex items-center gap-2 border border-[#d7a94a] px-6 py-3 text-sm font-bold text-[#f2d28a] transition hover:bg-[#d7a94a] hover:text-black">
              المزيد عن البيتزا
            </Link>
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/10 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="text-sm font-bold tracking-[.25em] text-[#d7a94a]">ORDER ONLINE</p>
            <h2 className="mt-3 text-4xl font-black sm:text-6xl" style={{ fontFamily: "var(--font-heading)" }}>
              اطلب الآن
            </h2>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <article key={product.id} className="text-center">
                <div className="relative mx-auto aspect-square w-56 max-w-full">
                  <Image src={product.image_url || "/images/table-two-pizzas.jpg"} alt={product.name_ar} fill className="rounded-full object-cover shadow-2xl" sizes="224px" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold" style={{ fontFamily: "var(--font-heading)" }}>{product.name_ar}</h3>
                {product.description_ar && <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-white/55">{product.description_ar}</p>}
                <div className="mt-5 flex items-center justify-center gap-2">
                  <span className="bg-[#e57f2f] px-4 py-2 text-sm font-black text-white">{product.price} د.ل</span>
                  <Link href="/menu" className="border border-white/20 px-4 py-2 text-sm font-bold text-white hover:border-[#d7a94a] hover:text-[#f2d28a]">اطلب</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[.25em] text-[#d7a94a]">GALLERY</p>
          <h2 className="mt-3 text-4xl font-black sm:text-6xl" style={{ fontFamily: "var(--font-heading)" }}>
            من أجواء De Roma
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-3">
          {gallery.map((src, index) => (
            <div key={`${src}-${index}`} className={`relative overflow-hidden border border-white/10 ${index === 0 ? "col-span-2 aspect-[2/1] md:col-span-2" : "aspect-square"}`}>
              <Image src={src} alt="معرض دي روما" fill className="object-cover transition duration-500 hover:scale-105" sizes="(max-width: 768px) 50vw, 30vw" />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="text-sm font-bold tracking-[.25em] text-[#d7a94a]">CONTACT US</p>
            <h2 className="mt-3 text-4xl font-black sm:text-6xl" style={{ fontFamily: "var(--font-heading)" }}>
              تواصل معنا
            </h2>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <div className="space-y-4 border border-white/10 bg-white/[.03] p-6">
              <ContactRow icon={<MapPin size={18} />} label="العنوان" value={settings.address} />
              <ContactRow icon={<Phone size={18} />} label="الهاتف" value={settings.phone} />
              <ContactRow icon={<Clock3 size={18} />} label="ساعات العمل" value={settings.hours} />
              <ContactRow icon={<UtensilsCrossed size={18} />} label="الخدمة" value="توصيل واستلام" />
            </div>
            <div className="relative min-h-[360px] overflow-hidden border-[10px] border-[#6b4428] bg-[#ece4d4] shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,#d8d0c1_25%,transparent_25%),linear-gradient(-45deg,#d8d0c1_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#d8d0c1_75%),linear-gradient(-45deg,transparent_75%,#d8d0c1_75%)] bg-[length:44px_44px] bg-[position:0_0,0_22px,22px_-22px,-22px_0] opacity-30" />
              <div className="relative flex h-full min-h-[340px] items-center justify-center p-8 text-center text-[#3b3127]">
                <div>
                  <MapPin className="mx-auto" size={42} />
                  <p className="mt-4 text-2xl font-black">{settings.restaurant_name}</p>
                  <p className="mt-2 text-sm">{settings.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Info({ text }: { text: string }) {
  return <p className="border-b border-white/10 pb-3">• {text}</p>;
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 border-b border-white/10 pb-4 last:border-0">
      <span className="mt-1 text-[#d7a94a]">{icon}</span>
      <div>
        <p className="text-xs font-bold text-[#d7a94a]">{label}</p>
        <p className="mt-1 text-sm leading-7 text-white/70">{value}</p>
      </div>
    </div>
  );
}
