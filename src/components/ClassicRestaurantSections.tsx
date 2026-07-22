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
  const orderItems = products.slice(0, 3);

  return (
    <div className="relative overflow-hidden bg-[#242424] text-[#f6f1e7]">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.15)_0_1px,transparent_1px),radial-gradient(circle_at_80%_60%,rgba(255,255,255,.08)_0_1px,transparent_1px)] [background-size:31px_31px,47px_47px]" />

      <section className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <SectionTitle eyebrow="WELCOME TO DE ROMA" title="مرحبًا بكم في De Roma" />
        <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-8 text-white/65 sm:text-base">
          بيتزا إيطالية بعجينة يومية وصلصة غنية ومكونات مختارة بعناية، تُحضّر عند الطلب وتصل إليك ساخنة.
        </p>
        <div className="mx-auto mt-8 flex w-fit items-center gap-3">
          <Link href="/menu" className="border border-[#d8a65a] px-5 py-2.5 text-xs font-bold text-[#e8c88c] transition hover:bg-[#d8a65a] hover:text-black">
            المزيد عنّا
          </Link>
        </div>
      </section>

      <Divider />

      <section className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <SectionTitle eyebrow="OUR PIZZA" title="بيتزتنا" />

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="relative mx-auto aspect-square w-full max-w-[500px]">
            <Image
              src={feature?.image_url || "/images/table-two-pizzas.jpg"}
              alt={feature?.name_ar || settings.restaurant_name}
              fill
              className="rounded-full object-cover drop-shadow-[0_35px_35px_rgba(0,0,0,.45)]"
              sizes="(max-width: 1024px) 90vw, 45vw"
            />
          </div>

          <div>
            <h3 className="text-3xl font-black sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              عجينة يومية، طعم واضح
            </h3>
            <p className="mt-5 text-sm leading-8 text-white/65 sm:text-base">
              نستخدم مكونات مختارة ونخبز كل بيتزا عند الطلب. الهدف بسيط: قوام متوازن، صلصة غنية وطعم ثابت في كل مرة.
            </p>

            <div className="mt-7 grid gap-x-8 gap-y-3 text-sm text-white/75 sm:grid-cols-2">
              <Info text="عجينة مخمّرة يوميًا" />
              <Info text="صلصة منزلية" />
              <Info text="خبز عند الطلب" />
              <Info text="توصيل داخل طرابلس" />
              <Info text="جبنة مختارة" />
              <Info text="تغليف يحافظ على الحرارة" />
            </div>

            <Link href="/menu" className="mt-8 inline-flex border border-[#d8a65a] px-5 py-2.5 text-xs font-bold text-[#e8c88c] transition hover:bg-[#d8a65a] hover:text-black">
              المزيد عن البيتزا
            </Link>
          </div>
        </div>
      </section>

      <Divider />

      <section className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <SectionTitle eyebrow="ORDER ONLINE" title="اطلب أونلاين" />

        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {orderItems.map((product) => (
            <article key={product.id} className="text-center">
              <div className="relative mx-auto aspect-square w-52 max-w-full sm:w-60">
                <Image
                  src={product.image_url || "/images/table-two-pizzas.jpg"}
                  alt={product.name_ar}
                  fill
                  className="rounded-full object-cover drop-shadow-[0_25px_30px_rgba(0,0,0,.45)]"
                  sizes="240px"
                />
              </div>
              <h3 className="mt-5 text-xl font-extrabold" style={{ fontFamily: "var(--font-heading)" }}>
                {product.name_ar}
              </h3>
              {product.description_ar && (
                <p className="mx-auto mt-3 max-w-xs text-xs leading-6 text-white/55">
                  {product.description_ar}
                </p>
              )}
              <div className="mx-auto mt-5 flex w-fit overflow-hidden border border-white/15">
                <span className="bg-[#ef7c2b] px-4 py-2 text-xs font-black text-white">
                  {product.price} د.ل
                </span>
                <Link href="/menu" className="px-4 py-2 text-xs font-bold text-white transition hover:bg-[#d8a65a] hover:text-black">
                  اطلب الآن
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Divider />

      <section className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <SectionTitle eyebrow="GALLERY" title="المعرض" />

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-2 md:grid-cols-3">
          {gallery.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className={`relative overflow-hidden border border-white/10 ${
                index === 0 ? "col-span-2 aspect-[2/1] md:col-span-2" : "aspect-square"
              }`}
            >
              <Image
                src={src}
                alt="معرض دي روما"
                fill
                className="object-cover transition duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 30vw"
              />
            </div>
          ))}
        </div>
      </section>

      <Divider />

      <section className="relative mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <SectionTitle eyebrow="CONTACT US" title="تواصل معنا" />

        <div className="mt-12 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="space-y-4 border border-white/10 bg-black/15 p-6">
            <ContactRow icon={<MapPin size={18} />} label="العنوان" value={settings.address} />
            <ContactRow icon={<Phone size={18} />} label="الهاتف" value={settings.phone} />
            <ContactRow icon={<Clock3 size={18} />} label="ساعات العمل" value={settings.hours} />
            <ContactRow icon={<UtensilsCrossed size={18} />} label="الخدمة" value="توصيل واستلام" />
          </div>

          <div className="relative min-h-[360px] border-[10px] border-[#6a4326] bg-[#ded5c4] shadow-[0_25px_50px_rgba(0,0,0,.35)]">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#c8bdaa_25%,transparent_25%),linear-gradient(-45deg,#c8bdaa_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#c8bdaa_75%),linear-gradient(-45deg,transparent_75%,#c8bdaa_75%)] bg-[length:44px_44px] bg-[position:0_0,0_22px,22px_-22px,-22px_0] opacity-25" />
            <div className="relative flex min-h-[340px] items-center justify-center p-8 text-center text-[#3b3127]">
              <div>
                <MapPin className="mx-auto" size={42} />
                <p className="mt-4 text-2xl font-black">{settings.restaurant_name}</p>
                <p className="mt-2 text-sm">{settings.address}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center">
      <p className="text-xs font-bold tracking-[.28em] text-[#d8a65a]">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-black sm:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
        {title}
      </h2>
      <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}

function Divider() {
  return <div className="mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-white/20 to-transparent" />;
}

function Info({ text }: { text: string }) {
  return <p className="border-b border-white/10 pb-3">• {text}</p>;
}

function ContactRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 border-b border-white/10 pb-4 last:border-0">
      <span className="mt-1 text-[#d8a65a]">{icon}</span>
      <div>
        <p className="text-xs font-bold text-[#d8a65a]">{label}</p>
        <p className="mt-1 text-sm leading-7 text-white/70">{value}</p>
      </div>
    </div>
  );
}
