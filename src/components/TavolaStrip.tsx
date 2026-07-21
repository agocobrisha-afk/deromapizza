import Image from "next/image";

const photos = [
  { src: "/images/pizza-tomato-olive.jpg", rotate: "-rotate-2", label: "مارجيتا" },
  { src: "/images/pizza-veggie-corn.jpg", rotate: "rotate-3", label: "خضروات" },
  { src: "/images/pizza-chicken-sauce.jpg", rotate: "-rotate-3", label: "موجة حارة" },
  { src: "/images/lasagna-cheesepull.jpg", rotate: "rotate-2", label: "لازانيا" },
  { src: "/images/pizza-olives-pepper.jpg", rotate: "-rotate-1", label: "فونقي" },
];

export default function TavolaStrip() {
  return (
    <section className="relative bg-char-800 texture-linen py-14 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5">
        <p
          className="text-sm tracking-[0.2em] text-gold-400"
          style={{ fontFamily: "var(--font-body-ar)" }}
        >
          طازجة اليوم
        </p>
        <h2
          className="mt-1 text-2xl text-cream-100 sm:text-3xl"
          style={{ fontFamily: "var(--font-display-ar)", fontWeight: 600 }}
        >
          من فرننا، لطاولتك
        </h2>
      </div>

      <div className="mt-10 flex gap-6 overflow-x-auto px-5 pb-6 sm:justify-center sm:overflow-visible sm:px-0">
        {photos.map((p) => (
          <div
            key={p.src}
            className={`relative shrink-0 ${p.rotate} transition-transform duration-300 hover:rotate-0 hover:scale-[1.03]`}
          >
            <div className="rounded-[10px] bg-cream-100 p-2.5 pb-8 shadow-[0_18px_35px_-12px_rgba(0,0,0,0.55)]">
              <div className="relative h-40 w-32 overflow-hidden rounded-[4px] sm:h-48 sm:w-40">
                <Image
                  src={p.src}
                  alt={p.label}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <p
                className="absolute bottom-2 left-0 right-0 text-center text-[13px] text-char-800"
                style={{ fontFamily: "var(--font-display-ar)" }}
              >
                {p.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
