import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OrderBenefits from "@/components/OrderBenefits";
import FeaturedMenu from "@/components/FeaturedMenu";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#111111]">
        <Hero />
        <OrderBenefits />
        <FeaturedMenu />
        <About />
        <Reviews />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
