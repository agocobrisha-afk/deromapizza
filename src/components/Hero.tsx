import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { getSiteSettings } from "@/lib/queries";

export default async function Hero() {
  const s = await getSiteSettings();
  const heroImg = s.hero_image_url || "/images/table-two-pizzas.jpg";

  return (
    <section className="relative overflow-hidden bg-[#171717] px-4 pb-16 pt-8 text-white sm:px-6 sm:pb-20 sm:pt-10">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(255,255,255,.06) 0 1px, transparent 1px), radial-gradient(circle at 74% 54%, rgba(255,255,255,.04) 0 1px, transparent 1px), linear-gradient(rgba(255,255,255,.015),rgba(255,255,255,.015))",
          backgroundSize: "26px 26px, 44px 44px, 100% 100%",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="relative mx-auto max-w-5xl border-[10px] border-[#6d4529] bg-[#3d2718] p-2 shadow-[0_30px_80px_-35px_rgba(0,0,0,.95)] sm:border-[14px] sm:p-3">
          <span className="absolute -left-4 top-1/2 hidden -translate-y-1/2 text-white/65 md:block">
            <ChevronLeft size={28} />
          </span>
          <span className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-white/65 md:block">
            <ChevronRight size={28} />
          </span>

          <div className="relative grid min-h-[460px] overflow-hidden bg-[#111] lg:grid-cols-[.72fr_1.28fr]">
            <div className="relative z-10 flex flex-col justify-center border-b border-white/10 bg-black/80 p-7 text-center lg:border-b-0 lg:border-l lg:p-10 lg:text-right">
              <p className="text-sm font-bold tracking-[.2em] text-[#d9b578]">DE ROMA PIZZA</p>
              <h1
                className="mt-5 text-4xl font-black leading-[1.08] sm:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {s.hero_headline}
              </h1>
              <p className="mt-2 text-xl font-bold text-[#d9b578] sm:text-2xl">
                {s.hero_headline_accent}
              </p>
              <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/70 lg:mx-0">
                {s.hero_subheadline}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 border border-[#d9b578] bg-[#d9b578] px-6 py-3 text-sm font-extrabold text-[#15110c] transition hover:bg-transparent hover:text-[#f0d29f]"
                >
                  {s.cta_primary_label}
                  <ArrowLeft size={16} />
                </Link>
                <a
                  href={`https://wa.me/${s.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:border-[#d9b578] hover:text-[#d9b578]"
                >
                  {s.cta_secondary_label}
                </a>
              </div>
            </div>

            <div className="relative min-h-[360px] lg:min-h-full">
              <Image
                src={heroImg}
                alt={s.restaurant_name}
                fill
                priority
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 65vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
              <div className="absolute bottom-5 right-5 border border-white/15 bg-black/55 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs text-white/65">ابتداءً من</p>
                <p className="mt-1 text-2xl font-black text-[#f1d09a]">22 د.ل</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl text-center">
          <div className="mx-auto mb-4 h-px w-40 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <h2 className="text-3xl font-black sm:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
            مرحبًا بكم في {s.restaurant_name}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/65 sm:text-base">
            بيتزا إيطالية بطابع حرفي، عجينة تُحضّر يوميًا، ومكونات مختارة بعناية لتصل إليك بالنكهة التي تستحقها.
          </p>
        </div>
      </div>
    </section>
  );
}
