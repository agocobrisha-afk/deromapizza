import Link from "next/link";
import Image from "next/image";
import { Flame, MessageCircle, ArrowUpLeft, MapPin, Clock3 } from "lucide-react";
import { getSiteSettings, getPublishedPages } from "@/lib/queries";

export default async function Header() {
  const [settings, pages] = await Promise.all([
    getSiteSettings(),
    getPublishedPages(),
  ]);
  const navPages = pages.filter((p) => p.show_in_nav);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0b0c]/88 text-white backdrop-blur-xl">
      <div className="hidden border-b border-white/10 bg-black/40 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs text-white/65">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> طرابلس، ليبيا</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /> يوميًا من 11 صباحًا حتى 1 ليلًا</span>
          </div>
          <span>بيتزا ومعجنات إيطالية تُحضّر يوميًا</span>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          {settings.logo_url ? (
            <span className="relative block h-11 w-11 overflow-hidden rounded-2xl ring-1 ring-white/15">
              <Image
                src={settings.logo_url}
                alt={settings.restaurant_name}
                fill
                className="object-cover"
              />
            </span>
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#c99a3d] text-black shadow-[0_12px_30px_-10px_rgba(201,154,61,0.8)]">
              <Flame size={21} strokeWidth={2.5} />
            </span>
          )}
          <span className="leading-none">
            <span
              className="block text-[11px] font-semibold tracking-[0.35em] text-[#d8b66c]"
              style={{ fontFamily: "var(--font-body)" }}
            >
              DE ROMA
            </span>
            <span
              className="mt-1 block text-lg font-extrabold text-white sm:text-xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {settings.restaurant_name}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 text-[15px] font-semibold text-white/75 md:flex"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <Link href="/menu" className="transition-colors hover:text-[#d8b66c]">المنيو</Link>
          <Link href="/#about" className="transition-colors hover:text-[#d8b66c]">قصتنا</Link>
          <Link href="/#reviews" className="transition-colors hover:text-[#d8b66c]">آراء الزبائن</Link>
          {navPages.map((p) => (
            <Link
              key={p.id}
              href={`/${p.slug}`}
              className="transition-colors hover:text-[#d8b66c]"
            >
              {p.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:border-[#d8b66c]/70 hover:bg-[#d8b66c]/10 hover:text-[#d8b66c] sm:flex"
            aria-label="واتساب"
          >
            <MessageCircle size={19} />
          </a>
          <Link
            href="/menu"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#c99a3d] px-5 py-3 text-sm font-extrabold text-black shadow-[0_12px_30px_-12px_rgba(201,154,61,0.95)] transition-transform hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <span className="relative z-10">اطلب الآن</span>
            <ArrowUpLeft size={16} className="relative z-10" />
            <span className="absolute inset-0 scale-x-0 bg-[#e1bb68] transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        </div>
      </div>
    </header>
  );
}
