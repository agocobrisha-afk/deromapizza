import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FeaturedMenu from "@/components/FeaturedMenu";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-[#171717] text-white">
        <Header />
        <main>
          <Hero />
          <About />
          <FeaturedMenu />
          <Reviews />
        </main>
        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
}
