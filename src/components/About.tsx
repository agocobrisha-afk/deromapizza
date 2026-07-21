import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="bg-char-950 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px]">
            <Image
              src="/images/pizza-slice-pull.jpg"
              alt="قطعة بيتزا دي روما بالجبنة الممطوطة"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="rule-gold absolute -bottom-6 right-8 left-8" />
        </div>

        <div className="order-1 lg:order-2">
          <p
            className="text-sm tracking-[0.2em] text-gold-500"
            style={{ fontFamily: "var(--font-body-ar)" }}
          >
            قصتنا
          </p>
          <h2
            className="mt-2 text-3xl leading-tight text-cream-100 sm:text-4xl"
            style={{ fontFamily: "var(--font-display-ar)", fontWeight: 600 }}
          >
            عجينة تُخمّر يوميًا، وجبنة موزاريلا لا تُساوم عليها
          </h2>
          <p
            className="mt-5 leading-loose text-cream-300"
            style={{ fontFamily: "var(--font-body-ar)" }}
          >
            في دي روما، كل بيتزا تتعجن وتُخبز من جديد لطلبك — مافيش تجهيز
            مسبق ومافيش تجميد. من المعجنات المحشوة للازانيا المشوية بالفرن،
            نحافظ على وصفة إيطالية بسيطة وطعم صادق، وسط أجواء تحسّها فعلاً
            رومانية من أول ما توصل لبابنا.
          </p>
          <div
            className="mt-8 grid grid-cols-3 gap-6 border-t border-char-700 pt-6"
            style={{ fontFamily: "var(--font-body-ar)" }}
          >
            <div>
              <p className="text-2xl text-gold-400" style={{ fontFamily: "var(--font-display-lat)" }}>
                100%
              </p>
              <p className="mt-1 text-sm text-cream-300">عجينة طازجة يوميًا</p>
            </div>
            <div>
              <p className="text-2xl text-gold-400" style={{ fontFamily: "var(--font-display-lat)" }}>
                20+
              </p>
              <p className="mt-1 text-sm text-cream-300">صنف بيتزا ومعجنات</p>
            </div>
            <div>
              <p className="text-2xl text-gold-400" style={{ fontFamily: "var(--font-display-lat)" }}>
                12h
              </p>
              <p className="mt-1 text-sm text-cream-300">فتح يوميًا للمساء</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
