import { Bike, ChefHat, PackageCheck, TimerReset } from "lucide-react";

const benefits = [
  {
    icon: ChefHat,
    title: "تحضير طازج",
    text: "كل طلب يبدأ بعد تأكيده مباشرة بمكونات مختارة يوميًا.",
  },
  {
    icon: TimerReset,
    title: "طلبك جاهز",
    text: "اطلب مسبقًا واستلم طلبك في الوقت المناسب بدون انتظار.",
  },
  {
    icon: Bike,
    title: "توصيل داخل طرابلس",
    text: "خدمة توصيل مرتبة مع متابعة واضحة حتى وصول الطلب.",
  },
  {
    icon: PackageCheck,
    title: "تغليف يحافظ على الجودة",
    text: "تغليف عملي يحافظ على الحرارة والطعم أثناء التوصيل.",
  },
];

export default function OrderBenefits() {
  return (
    <section className="border-y border-line bg-white/70 py-8 backdrop-blur-sm sm:py-10">
      <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {benefits.map(({ icon: Icon, title, text }) => (
          <article key={title} className="group rounded-2xl border border-line bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-red/30 hover:shadow-[0_18px_45px_-28px_rgba(0,0,0,.35)]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-red-tint text-red transition group-hover:bg-red group-hover:text-white">
              <Icon size={21} />
            </div>
            <h2 className="text-base font-extrabold text-ink" style={{ fontFamily: "var(--font-heading)" }}>{title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-soft">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
