import Link from "next/link";
import Image from "next/image";
import { Flame, MessageCircle, ArrowUpLeft } from "lucide-react";
import { getSiteSettings, getPublishedPages } from "@/lib/queries";

export default async function Header() {
  const [settings, pages] = await Promise.all([
    getSiteSettings(),
    getPublishedPages(),
  ]);
  const navPages = pages.filter((p) => p.show_in_nav);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          {settings.logo_url ? (
            <span className="relative block h-10 w-10 overflow-hidden rounded-xl">
              <Image
                src={settings.logo_url}
                alt={settings.restaurant_name}
                fill
                className="object-cover"
              />
            </span>
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red text-cream">
              <Flame size={20} strokeWidth={2.4} />
            </span>
          )}
          <span
            className="text-xl font-extrabold text-ink"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {settings.restaurant_name}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 text-[15px] font-semibold text-ink-soft md:flex"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <Link href="/menu" className="transition-colors hover:text-red">
            المنيو
          </Link>
          <Link href="/#about" className="transition-colors hover:text-red">
            القصة
          </Link>
          <Link href="/#reviews" className="transition-colors hover:text-red">
            آراء الزبائن
          </Link>
          {navPages.map((p) => (
            <Link
              key={p.id}
              href={`/${p.slug}`}
              className="transition-colors hover:text-red"
            >
              {p.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-red hover:text-red sm:flex"
            aria-label="واتساب"
          >
            <MessageCircle size={19} />
          </a>
          <Link
            href="/menu"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-red px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(230,60,47,0.55)] transition-all hover:shadow-[0_12px_28px_-6px_rgba(230,60,47,0.7)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <span className="relative z-10">اطلب الآن</span>
            <ArrowUpLeft
              size={16}
              className="relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
            />
            <span className="absolute inset-0 -z-0 origin-left scale-x-0 bg-red-dark transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        </div>
      </div>
    </header>
  );
}
