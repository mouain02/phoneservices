import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { catalogApi } from "@/lib/catalogApi";
import { defaultCustomerFeedback } from "@/components/data/siteContent";

const avatarColors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-teal-500"];

const ReviewsSection = () => {
  const [reviews, setReviews] = useState(defaultCustomerFeedback);

  useEffect(() => {
    let mounted = true;
    catalogApi
      .getSiteContent()
      .then((payload) => {
        if (!mounted) return;
        setReviews(payload?.customerFeedback?.length ? payload.customerFeedback : defaultCustomerFeedback);
      })
      .catch(() => {
        if (!mounted) return;
        setReviews(defaultCustomerFeedback);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="reviews" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-black text-foreground mb-3">
            What Our <span className="text-primary">Customers Say</span>
          </h2>
          <p className="text-muted-foreground">Trusted by thousands of happy customers</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-5 w-5 fill-primary text-primary" />
            ))}
            <span className="font-bold text-foreground ml-2">4.9</span>
            <span className="text-muted-foreground text-sm">(2,400+ reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={review.name}
              className="bg-background rounded-2xl p-6 shadow-card border border-border hover:border-primary transition-all hover:shadow-primary group"
            >
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= review.rating ? "fill-primary text-primary" : "text-border"}`} />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-5">"{review.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${avatarColors[i % avatarColors.length]} text-white w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}>
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{review.name}</div>
                    <div className="text-xs text-muted-foreground">{review.device}</div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
