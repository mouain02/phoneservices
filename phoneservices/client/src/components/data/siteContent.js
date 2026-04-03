import hero1 from "@/assets/hero1.jpg";
import hero2 from "@/assets/hero2.jpg";
import hero3 from "@/assets/hero3.jpg";

const clone = (value) => JSON.parse(JSON.stringify(value));

export const getDefaultSiteContent = () => ({
  carouselSlides: [
    {
      id: "slide-1",
      imageUrl: hero1,
      title: "Expert Screen Repairs",
      sub: "Cracked screen? We replace it on the spot - right at your door.",
    },
    {
      id: "slide-2",
      imageUrl: hero2,
      title: "We Come to You",
      sub: "Book online, open your door - our technician handles the rest.",
    },
    {
      id: "slide-3",
      imageUrl: hero3,
      title: "Precision Every Time",
      sub: "Professional-grade tools and certified parts for every device.",
    },
  ],
  customerFeedback: [
    {
      id: "review-1",
      name: "Sarah M.",
      rating: 5,
      text: "Incredible service! My iPhone screen was cracked and they fixed it in under an hour at my office. Professional and affordable!",
      device: "iPhone 14 Pro",
      date: "2 days ago",
      avatar: "SM",
    },
    {
      id: "review-2",
      name: "James K.",
      rating: 5,
      text: "The technician was so knowledgeable and polite. He replaced my Samsung battery at home while I worked. Saved me so much time!",
      device: "Samsung S23",
      date: "1 week ago",
      avatar: "JK",
    },
    {
      id: "review-3",
      name: "Amina B.",
      rating: 5,
      text: "Door to door service is exactly what busy people need. Quick diagnosis, quick fix, and the 90-day warranty gave me peace of mind.",
      device: "Xiaomi 13 Pro",
      date: "2 weeks ago",
      avatar: "AB",
    },
    {
      id: "review-4",
      name: "Carlos R.",
      rating: 4,
      text: "Fixed my MacBook charging port perfectly. Took about 90 minutes at my home. Will definitely use them again!",
      device: "MacBook Air M2",
      date: "3 weeks ago",
      avatar: "CR",
    },
    {
      id: "review-5",
      name: "Leila T.",
      rating: 5,
      text: "After water damage I thought my phone was gone. These guys saved it! Same day service, fair price. 10/10 recommend.",
      device: "OnePlus 11",
      date: "1 month ago",
      avatar: "LT",
    },
    {
      id: "review-6",
      name: "David P.",
      rating: 5,
      text: "Super fast booking, arrived on time, fixed my cracked iPad screen perfectly. The warranty seal says it all - top quality work.",
      device: "iPad Air 5",
      date: "1 month ago",
      avatar: "DP",
    },
  ],
});

export const normalizeSiteContent = (raw) => {
  const defaults = getDefaultSiteContent();
  if (!raw || typeof raw !== "object") return defaults;

  const carouselSlides = Array.isArray(raw.carouselSlides) ? raw.carouselSlides.filter((s) => s?.id) : defaults.carouselSlides;
  const customerFeedback = Array.isArray(raw.customerFeedback) ? raw.customerFeedback.filter((r) => r?.id) : defaults.customerFeedback;

  return {
    carouselSlides: carouselSlides.length > 0 ? carouselSlides : defaults.carouselSlides,
    customerFeedback: customerFeedback.length > 0 ? customerFeedback : defaults.customerFeedback,
  };
};

export const defaultCarouselSlides = getDefaultSiteContent().carouselSlides;
export const defaultCustomerFeedback = getDefaultSiteContent().customerFeedback;
