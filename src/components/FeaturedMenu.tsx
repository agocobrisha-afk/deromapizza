import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getFeaturedItems } from "@/lib/menu-data";

export default function FeaturedMenu() {
  const items = getFeaturedItems();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="flex items-end justify-between">
        <div>
          <p
            className="text-sm tracking-[0.2em] text-gold-500"
            style={{ fontFamily: "var(--font-body-ar)" }}
          >
            الأكثر طلبًا
          </p>
          <h2
            className="mt-1 text-2xl text-cream-100 sm:text-3xl"
            style={{ fontFamily: "var(--font-display-ar)", fontWeight: 600 }}
          >
            أصناف تستاهل التجربة
          </h2>
        </div>
        <Link
          href="/menu"
          className="hidden items-center gap-1.5 text-sm text-cream-300 hover:text-gold-400 transition-colors sm:flex"
          style={{ fontFamily: "var(--font-body-ar)" }}
        >
          كل المنيو
          <ArrowLeft size={15} />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-[18px] bg-char-800 border border-char-700/70"
          >
            <div className="relative h-52 w-full overflow-hidden">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              ) : (
                <div className="h-full w-full bg-char-700" />
              )}
              <div className="absolute top-3 left-3 rounded-full bg-pomodoro-500 px-3 py-1 text-sm font-bold text-cream-100 tag-price shadow-lg">
                {item.price} د.ل
              </div>
            </div>
            <div className="p-5">
              <h3
                className="text-lg text-cream-100"
                style={{ fontFamily: "var(--font-display-ar)", fontWeight: 600 }}
              >
                {item.name}
              </h3>
              {item.description && (
                <p
                  className="mt-1.5 text-sm leading-relaxed text-cream-300"
                  style={{ fontFamily: "var(--font-body-ar)" }}
                >
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center sm:hidden">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/50 px-6 py-3 text-sm text-gold-300"
          style={{ fontFamily: "var(--font-body-ar)" }}
        >
          كل المنيو
          <ArrowLeft size={15} />
        </Link>
      </div>
    </section>
  );
}
