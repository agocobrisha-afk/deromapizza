import { MessageCircle } from "lucide-react";
import { getSiteSettings } from "@/lib/queries";

export default async function WhatsAppFloat() {
  const s = await getSiteSettings();
  return (
    <a
      href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(
        `اهلا، حاب اطلب من ${s.restaurant_name}`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="اطلب عبر واتساب"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-6px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <MessageCircle size={26} fill="white" className="text-[#25D366]" />
    </a>
  );
}
