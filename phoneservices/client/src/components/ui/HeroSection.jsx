import { useState, useEffect, useCallback } from "react";
import { ArrowDown, Smartphone, Laptop, Tablet, Wrench, Shield, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { catalogApi } from "@/lib/catalogApi";
import { defaultCarouselSlides } from "@/components/data/siteContent";

const FloatingIcon = ({ icon: Icon, className, style }) => (
  <div
    className={`absolute flex items-center justify-center rounded-2xl bg-white shadow-card border border-border pointer-events-none ${className}`}
    style={style}
  >
    <Icon className="text-primary" />
  </div>
);

const HeroSection = () => {
  const [slides, setSlides] = useState(defaultCarouselSlides);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    let mounted = true;
    catalogApi
      .getSiteContent()
      .then((payload) => {
        if (!mounted) return;
        const nextSlides = payload?.carouselSlides?.length ? payload.carouselSlides : defaultCarouselSlides;
        setSlides(nextSlides);
        setCurrent((prev) => (nextSlides.length > 0 ? Math.min(prev, nextSlides.length - 1) : 0));
      })
      .catch(() => {
        if (!mounted) return;
        setSlides(defaultCarouselSlides);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 350);
  }, [animating]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const scrollToQuote = () => {
    document.querySelector("#quote")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative pt-20 pb-20 overflow-hidden bg-background min-h-screen">
      {/* Animated background blobs */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-primary opacity-[0.06] pointer-events-none"
        style={{ animation: "blobFloat1 8s ease-in-out infinite" }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-primary opacity-[0.04] pointer-events-none"
        style={{ animation: "blobFloat2 10s ease-in-out infinite" }} />

      {/* Floating icons */}
      <FloatingIcon icon={Smartphone} className="w-14 h-14 top-28 left-[6%]" style={{ animation: "floatY 4s ease-in-out infinite" }} />
      <FloatingIcon icon={Laptop}     className="w-14 h-14 top-40 right-[6%]" style={{ animation: "floatY 5s ease-in-out infinite 0.8s" }} />
      <FloatingIcon icon={Tablet}     className="w-12 h-12 bottom-32 left-[12%]" style={{ animation: "floatY 4.5s ease-in-out infinite 1.2s" }} />
      <FloatingIcon icon={Wrench}     className="w-12 h-12 top-56 left-[18%]" style={{ animation: "floatY 3.8s ease-in-out infinite 0.4s" }} />
      <FloatingIcon icon={Shield}     className="w-12 h-12 bottom-40 right-[12%]" style={{ animation: "floatY 5.2s ease-in-out infinite 1.6s" }} />
      <FloatingIcon icon={Clock}      className="w-12 h-12 top-52 right-[20%]" style={{ animation: "floatY 4.2s ease-in-out infinite 0.6s" }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* ── CAROUSEL ── */}
        <div
          className="relative w-screen max-w-none ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] mb-12 rounded-none md:rounded-3xl overflow-hidden shadow-primary"
          style={{ animation: "fadeSlideUp 0.7s ease-out both" }}
        >
          {/* Slide image */}
          <div
            className={`transition-opacity duration-350 ${animating ? "opacity-0" : "opacity-100"}`}
            style={{ transition: "opacity 0.35s ease" }}
          >
            <img
              src={slides[current].imageUrl}
              alt={slides[current].title}
              className="w-full h-[55vh] min-h-[360px] md:h-[72vh] md:min-h-[520px] max-h-[860px] object-cover"
            />
          </div>

          {/* Overlay gradient + text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20 flex flex-col items-center justify-end text-center p-6 md:p-10">
            <div className="w-full max-w-2xl mx-auto">
              <h2
                className={`font-display text-red-500 text-2xl md:text-4xl font-black mb-1 transition-all duration-350 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
              >
                {slides[current].title}
              </h2>
              <p
                className={`text-white/80 text-sm md:text-base transition-all duration-350 delay-75 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}
              >
                {slides[current].sub}
              </p>
            </div>
          </div>

          {/* Prev / Next buttons */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all hover:scale-110"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all hover:scale-110"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-6" : "bg-white/60 w-2"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ── HERO TEXT ── */}
        <div className="text-center">
          <div className="inline-block bg-primary-light text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
            style={{ animation: "fadeSlideUp 0.6s ease-out 0.1s both" }}>
            🚀 Door-to-Door Repair Service
          </div>

          <h1
            className="font-display text-5xl md:text-7xl font-black text-foreground mb-6 leading-tight"
            style={{ animation: "fadeSlideUp 0.6s ease-out 0.2s both" }}
          >
            We Fix Your Device<br />
            <span className="text-primary inline-block" style={{ animation: "pulseScale 3s ease-in-out infinite 1s" }}>
              At Your Door
            </span>
          </h1>

          <p
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ animation: "fadeSlideUp 0.6s ease-out 0.3s both" }}
          >
            Professional smartphone, tablet &amp; laptop repairs delivered to you — no need to leave home.
            Fast, reliable, and affordable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animation: "fadeSlideUp 0.6s ease-out 0.4s both" }}>
            <button
              onClick={scrollToQuote}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-base shadow-primary hover:opacity-90 transition-all hover:scale-105"
              style={{ animation: "ctaPulse 2.5s ease-in-out infinite 2s" }}
            >
              Get a Free Quote
            </button>
            <a
              href="#how-it-works"
              onClick={(e) => { e.preventDefault(); document.querySelector("#how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
              className="border-2 border-primary text-primary px-8 py-4 rounded-full font-semibold text-base hover:bg-primary-light transition-all hover:scale-105"
            >
              How It Works
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            style={{ animation: "fadeSlideUp 0.6s ease-out 0.55s both" }}>
            {[
              { value: "5000+", label: "Repairs Done" },
              { value: "4.9★", label: "Average Rating" },
              { value: "2h",    label: "Avg. Repair Time" },
              { value: "100%",  label: "Satisfaction" },
            ].map((stat, i) => (
              <div key={stat.label}
                className="bg-muted rounded-2xl p-4 hover:shadow-card hover:-translate-y-1 transition-all duration-300"
                style={{ animation: `fadeSlideUp 0.5s ease-out ${0.65 + i * 0.1}s both` }}>
                <div className="font-display text-2xl font-black text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <button onClick={scrollToQuote}
            className="mt-12 text-muted-foreground flex items-center gap-2 mx-auto hover:text-primary transition-colors"
            style={{ animation: "bounceY 2s ease-in-out infinite 1.5s" }}>
            <ArrowDown className="h-5 w-5" />
            <span className="text-sm">Get your quote now</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blobFloat1 { 0%,100%{transform:translate(33%,-25%) scale(1)} 50%{transform:translate(30%,-28%) scale(1.08)} }
        @keyframes blobFloat2 { 0%,100%{transform:translate(-33%,25%) scale(1)} 50%{transform:translate(-30%,22%) scale(1.06)} }
        @keyframes floatY    { 0%,100%{transform:translateY(0px) rotate(-3deg)} 50%{transform:translateY(-16px) rotate(3deg)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseScale  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
        @keyframes ctaPulse    { 0%,100%{box-shadow:0 8px 32px -8px hsl(0 85% 50% / 0.35)} 50%{box-shadow:0 8px 48px 0px hsl(0 85% 50% / 0.55)} }
        @keyframes bounceY     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }
      `}</style>
    </section>
  );
};

export default HeroSection;
