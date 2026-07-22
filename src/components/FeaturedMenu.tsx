import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts, getSiteSettings } from "@/lib/queries";
import { getThemePreset } from "@/lib/theme-presets";

export default async function FeaturedMenu() {
  const [items, s] = await Promise.all([
    getFeaturedProducts(),
    getSiteSettings(),
  ]);
  const theme = getThemePreset(s.theme_id);

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

      {theme.cardStyle === "bento" && <BentoGrid items={items} />}
      {theme.cardStyle === "grid" && <SimpleGrid items={items} />}
      {theme.cardStyle === "list-editorial" && <ListEditorial items={items} />}
    </section>
  );
}

type Item = Awaited<ReturnType<typeof getFeaturedProducts>>[number];

function BentoGrid({ items }: { items: Item[] }) {
  const [big, ...rest] = items;
  if (!big) return null;
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4 sm:auto-rows-[180px]">
      <TileCard item={big} className="col-span-2 row-span-2 aspect-square sm:aspect-auto" large />
      {rest.slice(0, 4).map((item) => (
        <TileCard key={item.id} item={item} className="aspect-square sm:aspect-auto" />
      ))}
    </div>
  );
}

function TileCard({
  item,
  className = "",
  large = false,
}: {
  item: Item;
  className?: string;
  large?: boolean;
}) {
  return (
    <div className={`card-shadow relative overflow-hidden rounded-2xl ${className}`}>
      {item.image_url ? (
        <Image src={item.image_url} alt={item.name_ar} fill className="object-cover" sizes="400px" />
      ) : (
        <div className="h-full w-full bg-red-tint" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
        <p
          className={`font-extrabold text-white ${large ? "text-lg sm:text-xl" : "text-sm"}`}
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {item.name_ar}
        </p>
        <span
          className={`font-bold text-[var(--red)] ${large ? "text-base" : "text-xs"}`}
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {item.price} د.ل
        </span>
      </div>
    </div>
  );
}

function SimpleGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
      {items.slice(0, 6).map((item) => (
        <div key={item.id} className="card-shadow overflow-hidden rounded-2xl bg-white sm:rounded-[24px]">
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
              {item.price} <span className="text-xs font-semibold text-ink-soft">د.ل</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListEditorial({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[64px_1fr_auto] items-center gap-4 border-b border-line py-5 sm:grid-cols-[80px_1fr_auto]"
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md sm:h-20 sm:w-20">
            {item.image_url ? (
              <Image src={item.image_url} alt={item.name_ar} fill className="object-cover" sizes="80px" />
            ) : (
              <div className="h-full w-full bg-red-tint" />
            )}
          </div>
          <div>
            <h3
              className="text-[17px] font-bold text-ink"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {item.name_ar}
            </h3>
            {item.description_ar && (
              <p
                className="mt-1 max-w-md text-[13px] leading-relaxed text-ink-faint"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item.description_ar}
              </p>
            )}
          </div>
          <div
            className="whitespace-nowrap text-lg font-bold text-red-dark"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {item.price} <span className="text-xs text-ink-faint">د.ل</span>
          </div>
        </div>
      ))}
    </div>
  );
}
