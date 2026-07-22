import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedMenu from "@/components/FeaturedMenu";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedMenu />
        <About />
        <Reviews />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
