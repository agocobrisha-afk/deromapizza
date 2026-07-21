import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TavolaStrip from "@/components/TavolaStrip";
import FeaturedMenu from "@/components/FeaturedMenu";
import About from "@/components/About";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TavolaStrip />
        <FeaturedMenu />
        <About />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
