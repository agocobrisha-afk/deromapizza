import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { restaurant } from "@/lib/menu-data";

export default function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden">
      <Image
        src="/images/storefront-night.jpg"
        alt="واجهة مطعم دي روما ليلاً"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-char-950 via-char-950/70 to-char-950/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-char-950/50 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-40 sm:pb-20">
        <p
          className="mb-3 text-sm tracking-[0.25em] text-gold-400"
          style={{ fontFamily: "var(--font-body-ar)" }}
        >
          بيتزا حجر · إيطالي أصيل · بنغازي
        </p>
        <h1
          className="max-w-2xl text-[2.6rem] leading-[1.15] text-cream-100 sm:text-6xl sm:leading-[1.1]"
          style={{ fontFamily: "var(--font-display-ar)", fontWeight: 600 }}
        >
          كل قطعة تخرج من الفرن،
          <br />
          <span className="text-pomodoro-400">مش من الفريزر.</span>
        </h1>
        <p
          className="mt-5 max-w-md text-lg text-cream-300"
          style={{ fontFamily: "var(--font-body-ar)" }}
        >
          {restaurant.tagline} — اطلب أونلاين واستلمها ساخنة، أو خلّها توصلك.
        </p>

        <div
          className="mt-8 flex flex-wrap items-center gap-4"
          style={{ fontFamily: "var(--font-body-ar)" }}
        >
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2 rounded-full bg-pomodoro-500 px-7 py-3.5 text-base font-semibold text-cream-100 shadow-[0_8px_28px_-6px_rgba(193,67,43,0.65)] transition-all hover:bg-pomodoro-400 hover:shadow-[0_10px_32px_-4px_rgba(193,67,43,0.8)]"
          >
            شاهد المنيو واطلب
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
          </Link>
          <a
            href={`https://wa.me/${restaurant.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/50 px-6 py-3.5 text-base text-gold-300 transition-colors hover:bg-gold-500/10"
          >
            اطلب عبر واتساب
          </a>
        </div>
      </div>
    </section>
  );
}
