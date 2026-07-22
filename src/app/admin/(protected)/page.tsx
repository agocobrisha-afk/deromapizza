import Link from "next/link";
import { Settings, FileText, Star, UtensilsCrossed, Palette } from "lucide-react";

const cards = [
  {
    href: "/admin/theme",
    title: "معرض الثيمات",
    desc: "اختر من 10 هويات بصرية مختلفة — تتغير فورًا بكل الموقع",
    icon: Palette,
  },
  {
    href: "/admin/settings",
    title: "إعدادات الموقع",
    desc: "الشعار، صورة الهيرو، الألوان، النصوص، بيانات التواصل",
    icon: Settings,
  },
  {
    href: "/admin/menu",
    title: "المنيو",
    desc: "إضافة وتعديل الأصناف والتصنيفات والأسعار",
    icon: UtensilsCrossed,
  },
  {
    href: "/admin/pages",
    title: "الصفحات الفرعية",
    desc: "أنشئ صفحات جديدة (من نحن، الوظائف...) في أي وقت",
    icon: FileText,
  },
  {
    href: "/admin/reviews",
    title: "التقييمات",
    desc: "راجع ووافق على تقييمات الزبائن قبل نشرها",
    icon: Star,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1
        className="mb-1 text-2xl font-extrabold text-ink"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        أهلًا بك 👋
      </h1>
      <p className="mb-8 text-ink-soft">تحكم كامل بموقعك من هنا.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="card-shadow flex items-start gap-4 rounded-2xl bg-white p-5 transition-transform hover:scale-[1.01]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-tint text-red-dark">
              <c.icon size={20} />
            </span>
            <div>
              <p
                className="font-bold text-ink"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {c.title}
              </p>
              <p className="mt-1 text-sm text-ink-soft">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
