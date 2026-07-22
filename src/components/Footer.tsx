import Link from "next/link";
import { MessageCircle, Phone, Clock, MapPin, ExternalLink } from "lucide-react";
import { getSiteSettings, getPublishedPages } from "@/lib/queries";

export default async function Footer() {
  const [s, pages] = await Promise.all([
    getSiteSettings(),
    getPublishedPages(),
  ]);

  return (
    <footer
      id="location"
      className="bg-dark-soft pb-8 pt-14 text-white sm:pt-16"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-3">
          <div>
            <p
              className="text-xl font-extrabold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {s.restaurant_name}
            </p>
            <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-dark-text-dim">
              {s.tagline}
            </p>
            {pages.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {pages.map((p) => (
                  <Link
                    key={p.id}
                    href={`/${p.slug}`}
                    className="text-sm text-dark-text-dim hover:text-white"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-3.5 text-[13px] font-bold text-[#ff8a7f]">
              تواصل واطلب
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-dark-text">
              <a
                href={`https://wa.me/${s.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white"
              >
                <MessageCircle size={16} /> واتساب: {s.phone}
              </a>
              <a
                href={`tel:${s.phone}`}
                className="flex items-center gap-2.5 hover:text-white"
              >
                <Phone size={16} /> اتصال: {s.phone}
              </a>
              {s.presto_url && (
                <a
                  href={s.presto_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-white"
                >
                  <ExternalLink size={16} /> اطلب عبر بريستو
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-3.5 text-[13px] font-bold text-[#ff8a7f]">
              الأوقات والموقع
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-dark-text">
              <p className="flex items-center gap-2.5">
                <Clock size={16} /> {s.hours}
              </p>
              <p className="flex items-center gap-2.5">
                <MapPin size={16} /> {s.address}
              </p>
            </div>
          </div>
        </div>

        <div className="my-9 h-px bg-white/10" />
        <p className="text-center text-xs text-dark-text-dim/70">
          © {new Date().getFullYear()} {s.restaurant_name} — كل الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}
