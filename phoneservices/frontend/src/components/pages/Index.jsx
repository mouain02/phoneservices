import HeroSection from "@/components/ui/HeroSection";
import HowItWorks from "@/components/ui/HowItWorks";
import QuoteSection from "@/components/ui/QuoteSection";
import Newsletter from "@/components/ui/Newsletter";
import Footer from "@/components/ui/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <QuoteSection />
      <HowItWorks />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
