import Image from "next/image";
import { getSiteSettings } from "@/lib/queries";

export default async function About() {
  const s = await getSiteSettings();

  return (
    <section id="about" className="bg-dark py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-2 lg:gap-14">
        <div className="aspect-[16/11] w-full overflow-hidden rounded-3xl">
          <Image
            src="/images/pizza-slice-pull.jpg"
            alt={s.restaurant_name}
            width={800}
            height={550}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <span
            className="inline-flex rounded-full bg-red/15 px-4 py-1.5 text-[13px] font-semibold text-[var(--red)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {s.about_badge}
          </span>
          <h2
            className="mt-4 text-balance text-2xl font-extrabold leading-snug text-white sm:text-[2rem]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {s.about_title}
          </h2>
          <p
            className="mt-3.5 max-w-md leading-loose text-dark-text-dim"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {s.about_body}
          </p>
          <div
            className="mt-8 flex gap-9"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <div>
              <p className="text-2xl font-extrabold text-[var(--red)]">100%</p>
              <p className="mt-1 text-[13px] text-dark-text-dim">
                عجينة طازجة
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[var(--red)]">12h</p>
              <p className="mt-1 text-[13px] text-dark-text-dim">
                فتح يوميًا
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
