import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSiteSettings } from "@/lib/queries";

export default async function Hero() {
  const s = await getSiteSettings();
  const heroImg = s.hero_image_url || "/images/table-two-pizzas.jpg";

  return (
    <section className="mx-auto max-w-6xl px-5 pb-8 pt-10 sm:pt-16">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <span
            className="inline-flex items-center rounded-full bg-red-tint px-4 py-1.5 text-[13px] font-semibold text-red-dark"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {s.hero_badge}
          </span>

          <h1
            className="mt-5 text-balance text-[2.1rem] font-extrabold leading-[1.15] text-ink sm:text-5xl lg:text-[3.4rem] lg:leading-[1.12]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {s.hero_headline}
            <br />
            <span className="text-red">{s.hero_headline_accent}</span>
          </h1>

          <p
            className="mt-4 max-w-md text-[17px] leading-relaxed text-ink-soft sm:text-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {s.hero_subheadline}
          </p>

          <div
            className="mt-7 flex flex-wrap items-center gap-3.5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-red px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_10px_24px_-8px_rgba(230,60,47,0.55)] transition-transform hover:scale-[1.02]"
            >
              {s.cta_primary_label}
              <ArrowLeft size={17} />
            </Link>
            <a
              href={`https://wa.me/${s.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink px-6 py-3.5 text-[15px] font-bold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              {s.cta_secondary_label}
            </a>
          </div>

          <div
            className="mt-9 flex flex-wrap gap-7 sm:gap-9"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Stat value="4.8 ★" label="تقييم الزبائن" />
            <Stat value="30 د" label="متوسط التوصيل" />
            <Stat value="20+" label="صنف بالمنيو" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="absolute -inset-4 -z-10 rounded-[32px] bg-red/10 sm:-inset-6" />
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] shadow-[0_30px_60px_-20px_rgba(24,22,20,0.35)]">
            <Image
              src={heroImg}
              alt={s.restaurant_name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p
        className="text-xl font-extrabold text-ink sm:text-2xl"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {value}
      </p>
      <p className="mt-0.5 text-[13px] text-ink-soft">{label}</p>
    </div>
  );
}
