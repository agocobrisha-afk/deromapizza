import { MessageCircle, Phone, Clock, MapPin, ExternalLink } from "lucide-react";
import { restaurant } from "@/lib/menu-data";

export default function Footer() {
  return (
    <footer
      id="location"
      className="bg-char-950 border-t border-char-700/70 pt-16 pb-10"
      style={{ fontFamily: "var(--font-body-ar)" }}
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <span
              className="text-2xl text-gold-400"
              style={{ fontFamily: "var(--font-display-lat)" }}
            >
              DE ROMA
            </span>
            <p className="mt-3 max-w-xs leading-relaxed text-cream-300">
              {restaurant.tagline}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm tracking-[0.15em] text-gold-500">
              تواصل واطلب
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/${restaurant.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-cream-200 hover:text-gold-400 transition-colors"
              >
                <MessageCircle size={18} /> واتساب: {restaurant.phone1}
              </a>
              <a
                href={`tel:${restaurant.phone1}`}
                className="flex items-center gap-2.5 text-cream-200 hover:text-gold-400 transition-colors"
              >
                <Phone size={18} /> اتصال: {restaurant.phone1} / {restaurant.phone2}
              </a>
              <a
                href={restaurant.prestoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-cream-200 hover:text-gold-400 transition-colors"
              >
                <ExternalLink size={18} /> اطلب عبر بريستو
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm tracking-[0.15em] text-gold-500">
              الأوقات والموقع
            </h4>
            <div className="flex flex-col gap-3">
              <p className="flex items-center gap-2.5 text-cream-200">
                <Clock size={18} /> {restaurant.hours}
              </p>
              <p className="flex items-center gap-2.5 text-cream-200">
                <MapPin size={18} /> {restaurant.address}
              </p>
            </div>
          </div>
        </div>

        <div className="rule-gold my-10" />

        <p className="text-center text-xs text-cream-300/70">
          © {new Date().getFullYear()} De Roma — كل الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}
