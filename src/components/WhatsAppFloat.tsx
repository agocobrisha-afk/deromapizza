import { MessageCircle } from "lucide-react";
import { restaurant } from "@/lib/menu-data";

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(
        "اهلا، حاب اطلب من دي روما"
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="اطلب عبر واتساب"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-basil-500 text-cream-100 shadow-[0_10px_30px_-6px_rgba(0,0,0,0.6)] transition-transform hover:scale-105"
    >
      <MessageCircle size={26} />
    </a>
  );
}
