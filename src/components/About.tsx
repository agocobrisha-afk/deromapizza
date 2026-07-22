import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3, Leaf, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/queries";

export default async function About() {
  const s = await getSiteSettings();

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#171717] py-20 text-white sm:py-28"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,.08) 0 1px, transparent 1px), radial-gradient(circle at 70% 50%, rgba(255,255,255,.05) 0 1px, transparent 1px)",
          backgroundSize: "28px 28px, 42px 42px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-bold tracking-[0.22em] text-[#d5aa68]">DE ROMA PIZZA</p>
          <h2
            className="mt-3 text-3xl font-black sm:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {s.about_title}
          </h2>
          <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-[#d5aa68] to-transparent" />
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[32px] border border-[#d5aa68]/25" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border-[10px] border-[#6c452a] bg-[#6c452a] shadow-2xl">
              <Image
                src="/images/pizza-slice-pull.jpg"
                alt={s.restaurant_name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
          </div>

          <div>
            <span
              className="inline-flex rounded-full border border-[#d5aa68]/30 bg-[#d5aa68]/10 px-4 py-2 text-sm font-bold text-[#e5c28b]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {s.about_badge}
            </span>
            <p
              className="mt-6 max-w-xl text-base leading-9 text-white/75 sm:text-lg"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {s.about_body}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Feature icon={<Leaf size={20} />} title="مكونات مختارة" text="نكهة واضحة وجودة ثابتة" />
              <Feature icon={<Clock3 size={20} />} title="تحضير يومي" text="العجينة والصلصات طازجة" />
              <Feature icon={<MapPin size={20} />} title="داخل طرابلس" text="توصيل واستلام سريع" />
            </div>

            <Link
              href="/menu"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#d5aa68] px-6 py-3 text-sm font-bold text-[#f2d29d] transition hover:bg-[#d5aa68] hover:text-[#171717]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              اكتشف المنيو
              <ArrowLeft size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d5aa68]/15 text-[#e5c28b]">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-extrabold text-white">{title}</h3>
      <p className="mt-1 text-xs leading-6 text-white/55">{text}</p>
    </div>
  );
}
