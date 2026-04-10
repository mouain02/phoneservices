import ReviewsSection from "@/components/ui/ReviewsSection";
import Newsletter from "@/components/ui/Newsletter";
import Footer from "@/components/ui/Footer";

const Reviews = () => {
  return (
    <div className="min-h-screen bg-background pt-16 xs:pt-20">
      <ReviewsSection />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Reviews;