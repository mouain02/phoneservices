import HeroSection from "@/components/ui/HeroSection";
import HowItWorks from "@/components/ui/HowItWorks";
import QuoteSection from "@/components/ui/QuoteSection";
import ReviewsSection from "@/components/ui/ReviewsSection";
import Newsletter from "@/components/ui/Newsletter";
import Footer from "@/components/ui/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <HowItWorks />
      <QuoteSection />
      <ReviewsSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
