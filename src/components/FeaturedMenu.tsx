import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { getFeaturedProducts } from "@/lib/queries";

export default async function FeaturedMenu() {
  const items = await getFeaturedProducts();

  return (
    <section className="relative overflow-hidden bg-[#111111] py-20 text-white sm:py-28">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,.08) 0 1px, transparent 1px), radial-gradient(circle at 70% 50%, rgba(255,255,255,.05) 0 1px, transparent 1px)",
          backgroundSize: "28px 28px, 42px 42px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-black tracking-[.3em] text-[#d5aa68]">ORDER ONLINE</p>
          <h2 className="mt-3 text-3xl font-black sm:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
            الأكثر طلبًا
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/60 sm:text-base">
            أصناف مختارة من منيو دي روما، تُحضّر يوميًا وتصل إليك ساخنة.
          </p>
          <div className="mx-auto mt-5 h-px w-28 bg-gradient-to-r from-transparent via-[#d5aa68] to-transparent" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((item, index) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#191919] shadow-[0_24px_70px_-38px_rgba(0,0,0,.95)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#2a2a2a]">
                <Image
                  src={item.image_url || "/images/table-two-pizzas.jpg"}
                  alt={item.name_ar}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <span className="absolute right-4 top-4 rounded-full border border-[#d5aa68]/40 bg-black/55 px-3 py-1.5 text-xs font-bold text-[#f0ce94] backdrop-blur-md">
                  #{String(index + 1).padStart(2, "0")}
                </span>
                <span className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#d5aa68] text-black shadow-lg">
                  <Plus size={19} />
                </span>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                      {item.name_ar}
                    </h3>
                    {item.description_ar && (
                      <p className="mt-2 line-clamp-2 text-sm leading-7 text-white/55">
                        {item.description_ar}
                      </p>
                    )}
                  </div>
                  <p className="shrink-0 text-lg font-black text-[#e4b968]">
                    {item.price} <span className="text-xs">د.ل</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full border border-[#d5aa68] px-7 py-3.5 text-sm font-extrabold text-[#f2d29d] transition hover:bg-[#d5aa68] hover:text-black"
          >
            شاهد المنيو كاملًا
            <ArrowLeft size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
