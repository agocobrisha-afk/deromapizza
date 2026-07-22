import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MenuBrowser from "@/components/MenuBrowser";
import { getCategoriesWithProducts, getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "المنيو | De Roma",
  description: "منيو دي روما الكامل — بيتزا، معجنات، لازانيا وإضافات.",
};

export default async function MenuPage() {
  const [categories, s] = await Promise.all([
    getCategoriesWithProducts(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto min-h-screen max-w-4xl px-5 pb-20 pt-8 sm:pt-10">
        <h1
          className="text-2xl font-extrabold text-ink sm:text-[32px]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          كل أصناف {s.restaurant_name}
        </h1>
        <p
          className="mt-2 text-ink-soft"
          style={{ fontFamily: "var(--font-body)" }}
        >
          الطلب المباشر من الموقع قريبًا — لحد ذلك اطلب مباشرة عبر واتساب أو
          اتصال.
        </p>

        <div className="mt-6">
          <MenuBrowser categories={categories} />
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
