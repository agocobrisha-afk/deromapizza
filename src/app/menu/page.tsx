import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MenuBrowser from "@/components/MenuBrowser";
import { restaurant } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: "المنيو | De Roma",
  description: "منيو دي روما الكامل — بيتزا، معجنات، لازانيا وإضافات.",
};

export default function MenuPage() {
  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen max-w-4xl px-5 pt-28 pb-24">
        <p
          className="text-sm tracking-[0.2em] text-gold-500"
          style={{ fontFamily: "var(--font-body-ar)" }}
        >
          المنيو الكامل
        </p>
        <h1
          className="mt-1 text-3xl text-cream-100 sm:text-4xl"
          style={{ fontFamily: "var(--font-display-ar)", fontWeight: 600 }}
        >
          كل أصناف {restaurant.nameAr}
        </h1>
        <p
          className="mt-3 text-cream-300"
          style={{ fontFamily: "var(--font-body-ar)" }}
        >
          الطلب المباشر من الموقع قريبًا — لحد ذلك اطلب مباشرة عبر واتساب أو
          اتصال وحدد أصنافك من هنا.
        </p>

        <div className="mt-8">
          <MenuBrowser />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
