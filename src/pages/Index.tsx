import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import CraftSection from "@/components/CraftSection";
import OrderSection from "@/components/OrderSection";
import ReturnSection from "@/components/ReturnSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <ProductsSection />
    <CraftSection />
    <OrderSection />
    <ReturnSection />
    <Footer />
  </div>
);

export default Index;
