import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts } from "@/lib/queries";

export default async function FeaturedMenu() {
  const items = await getFeaturedProducts();

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
      <div className="mb-7 flex items-end justify-between">
        <h2
          className="text-2xl font-extrabold text-ink sm:text-[28px]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          الأكثر طلبًا
        </h2>
        <Link
          href="/menu"
          className="text-sm font-bold text-red"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          كل المنيو ←
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="card-shadow overflow-hidden rounded-2xl bg-white sm:rounded-[24px]"
          >
            <div className="relative aspect-square w-full">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name_ar}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 45vw, 30vw"
                />
              ) : (
                <div className="h-full w-full bg-red-tint" />
              )}
              <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-extrabold text-red shadow-md">
                +
              </span>
            </div>
            <div className="p-3.5 sm:p-4.5">
              <h3
                className="text-[15px] font-bold text-ink sm:text-base"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.name_ar}
              </h3>
              {item.description_ar && (
                <p
                  className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-ink-soft sm:text-[13px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {item.description_ar}
                </p>
              )}
              <p
                className="mt-2.5 font-extrabold text-red-dark"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.price}{" "}
                <span className="text-xs font-semibold text-ink-soft">د.ل</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
