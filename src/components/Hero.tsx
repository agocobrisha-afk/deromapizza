import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3, MapPin, Sparkles, Star } from "lucide-react";
import { getSiteSettings } from "@/lib/queries";
import { getThemePreset } from "@/lib/theme-presets";

export default async function Hero() {
  const s = await getSiteSettings();
  const theme = getThemePreset(s.theme_id);
  const heroImg = s.hero_image_url || "/images/table-two-pizzas.jpg";

  if (theme.id === "midnight-luxe" || theme.id === "sleek-black") {
    return <LuxuryHero s={s} heroImg={heroImg} />;
  }

  if (theme.id === "artisan-brown" || theme.id === "fresh-green") {
    return <ClassicHero s={s} heroImg={heroImg} />;
  }

  return <ModernHero s={s} heroImg={heroImg} />;
}

type Settings = Awaited<ReturnType<typeof getSiteSettings>>;

function LuxuryHero({ s, heroImg }: { s: Settings; heroImg: string }) {
  return (
    <section className="relative isolate min-h-[760px] overflow-hidden bg-[#090909] text-white lg:min-h-[840px]">
      <Image src={heroImg} alt={s.restaurant_name} fill priority className="object-cover opacity-70" sizes="100vw" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.96)_0%,rgba(0,0,0,.78)_42%,rgba(0,0,0,.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_34%,rgba(200,155,60,.18),transparent_32%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

      <div className="relative z-10 mx-auto grid min-h-[760px] max-w-7xl items-end gap-12 px-5 pb-14 pt-28 lg:min-h-[840px] lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:px-8 lg:pb-20">
        <div className="max-w-3xl">
          <div className="mb-7 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#c89b3c]/40 bg-[#c89b3c]/10 px-4 py-2 text-sm font-bold text-[#e3c274]">
              <Sparkles size={15} /> {s.hero_badge}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur-md">
              <MapPin size={15} /> طرابلس
            </span>
          </div>

          <p className="mb-4 text-sm font-bold tracking-[.28em] text-[#c89b3c]">DE ROMA PIZZA</p>
          <h1 className="max-w-4xl text-balance text-[2.7rem] font-black leading-[1.05] sm:text-6xl lg:text-[5.2rem]" style={{ fontFamily: "var(--font-heading)" }}>
            {s.hero_headline}
            <span className="mt-2 block text-[#d2a94d]">{s.hero_headline_accent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70 sm:text-xl">{s.hero_subheadline}</p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/menu" className="inline-flex min-h-14 items-center gap-3 rounded-full bg-[#c89b3c] px-7 font-extrabold text-black shadow-[0_20px_50px_-18px_rgba(200,155,60,.9)] transition hover:-translate-y-1 hover:bg-[#deb75d]">
              {s.cta_primary_label}<ArrowLeft size={18} />
            </Link>
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center rounded-full border border-white/25 bg-white/5 px-7 font-bold text-white backdrop-blur-md transition hover:bg-white/10">
              {s.cta_secondary_label}
            </a>
          </div>

          <div className="mt-11 grid max-w-2xl grid-cols-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] backdrop-blur-xl">
            <Metric value="4.8" label="تقييم الزبائن" icon={<Star size={16} />} />
            <Metric value="30 د" label="متوسط التوصيل" icon={<Clock3 size={16} />} />
            <Metric value="20+" label="صنف إيطالي" icon={<Sparkles size={16} />} />
          </div>
        </div>

        <div className="hidden justify-end lg:flex">
          <div className="relative h-[470px] w-[340px] rounded-[180px_180px_32px_32px] border border-[#c89b3c]/35 bg-black/30 p-3 shadow-[0_50px_100px_-35px_rgba(0,0,0,.9)] backdrop-blur-sm">
            <div className="relative h-full w-full overflow-hidden rounded-[170px_170px_24px_24px]">
              <Image src={heroImg} alt={s.restaurant_name} fill className="object-cover" sizes="340px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur-lg">
                <p className="text-sm text-white/60">محضّرة يوميًا</p>
                <p className="mt-1 text-lg font-extrabold">عجينة إيطالية ومكونات مختارة</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClassicHero({ s, heroImg }: { s: Settings; heroImg: string }) {
  return (
    <section className="overflow-hidden bg-[#f4eadb] px-5 py-10 sm:py-14 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[36px] border border-[#6f2f2f]/15 bg-[#fffaf1] shadow-[0_35px_100px_-55px_rgba(75,40,20,.5)] lg:grid-cols-[.95fr_1.05fr]">
        <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
          <span className="mb-6 inline-flex w-fit items-center rounded-full bg-[#6f2f2f] px-4 py-2 text-sm font-bold text-white">{s.hero_badge}</span>
          <p className="text-sm font-black tracking-[.22em] text-[#5f6f3a]">TRADIZIONE ITALIANA</p>
          <h1 className="mt-4 text-balance text-[2.5rem] font-black leading-[1.08] text-[#2d2018] sm:text-6xl" style={{ fontFamily: "var(--font-heading)" }}>
            {s.hero_headline}
            <span className="mt-2 block text-[#7b3232]">{s.hero_headline_accent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-[#6d5a49]">{s.hero_subheadline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="inline-flex items-center gap-2 rounded-full bg-[#6f2f2f] px-7 py-4 font-extrabold text-white transition hover:bg-[#552222]">{s.cta_primary_label}<ArrowLeft size={18} /></Link>
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-[#6f2f2f]/25 px-7 py-4 font-bold text-[#6f2f2f] transition hover:bg-[#6f2f2f] hover:text-white">{s.cta_secondary_label}</a>
          </div>
        </div>
        <div className="relative min-h-[430px] lg:min-h-[650px]">
          <Image src={heroImg} alt={s.restaurant_name} fill priority className="object-cover" sizes="(max-width:1024px) 100vw,55vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2d2018]/65 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 rounded-2xl bg-[#fffaf1]/92 p-4 text-center shadow-xl backdrop-blur-md">
            <ClassicStat value="طازجة" label="يوميًا" />
            <ClassicStat value="إيطالية" label="الوصفة" />
            <ClassicStat value="طرابلس" label="التوصيل" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ModernHero({ s, heroImg }: { s: Settings; heroImg: string }) {
  return (
    <section className="relative overflow-hidden bg-[var(--cream)] px-5 pb-12 pt-10 sm:pb-16 sm:pt-16 lg:px-8">
      <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-red/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-tint px-4 py-2 text-sm font-bold text-red-dark"><Sparkles size={15} />{s.hero_badge}</span>
          <h1 className="mt-6 text-balance text-[2.6rem] font-black leading-[1.08] text-ink sm:text-6xl lg:text-[4.6rem]" style={{ fontFamily: "var(--font-heading)" }}>
            {s.hero_headline}<span className="block text-red">{s.hero_headline_accent}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-ink-soft">{s.hero_subheadline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-red px-7 font-extrabold text-white shadow-[0_18px_40px_-18px_rgba(230,60,47,.8)] transition hover:-translate-y-1">{s.cta_primary_label}<ArrowLeft size={18} /></Link>
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center rounded-2xl border border-line bg-white px-7 font-bold text-ink transition hover:border-red hover:text-red">{s.cta_secondary_label}</a>
          </div>
          <div className="mt-8 flex flex-wrap gap-5 text-sm font-semibold text-ink-soft">
            <span className="inline-flex items-center gap-2"><Clock3 size={16} className="text-red" />توصيل سريع</span>
            <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-red" />داخل طرابلس</span>
            <span className="inline-flex items-center gap-2"><Star size={16} className="text-red" />جودة ثابتة</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <div className="absolute -inset-5 rotate-3 rounded-[42px] bg-red/10" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[36px] bg-white p-3 shadow-[0_35px_80px_-35px_rgba(0,0,0,.4)]">
            <div className="relative h-full overflow-hidden rounded-[28px]">
              <Image src={heroImg} alt={s.restaurant_name} fill priority className="object-cover" sizes="(max-width:1024px) 100vw,55vw" />
            </div>
          </div>
          <div className="absolute -bottom-5 right-4 rounded-2xl bg-white px-5 py-4 shadow-xl sm:right-8">
            <p className="text-xs text-ink-faint">جاهز للاستلام</p>
            <p className="mt-1 text-lg font-extrabold text-ink">اطلب واستلم بدون انتظار</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return <div className="border-l border-white/10 px-4 py-4 last:border-l-0 sm:px-6"><div className="flex items-center gap-2 text-[#d2a94d]">{icon}<strong className="text-xl text-white">{value}</strong></div><p className="mt-1 text-xs text-white/55 sm:text-sm">{label}</p></div>;
}

function ClassicStat({ value, label }: { value: string; label: string }) {
  return <div className="border-l border-[#6f2f2f]/15 px-2 last:border-l-0"><p className="font-extrabold text-[#6f2f2f]">{value}</p><p className="mt-1 text-xs text-[#7a6959]">{label}</p></div>;
}
