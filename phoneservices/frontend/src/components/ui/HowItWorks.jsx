import { MapPin, Clock, Shield, Star } from "lucide-react";

const steps = [
  { icon: "📱", title: "Select Your Device", desc: "Choose your device type, brand and model from our extensive list.", step: "01" },
  { icon: "📍", title: "Share Your Location", desc: "Tell us your address. We'll come to you — at home, work, or anywhere.", step: "02" },
  { icon: "🔧", title: "Expert Repairs", desc: "Our certified technicians fix your device on-site, usually within 2 hours.", step: "03" },
  { icon: "✅", title: "Back to Normal", desc: "Device returned fully repaired with a 90-day warranty on all parts.", step: "04" },
];

const highlights = [
  { icon: MapPin, label: "Door-to-Door", desc: "We come to you anywhere in the city" },
  { icon: Clock, label: "Same Day Repair", desc: "Most repairs done in under 2 hours" },
  { icon: Shield, label: "90-Day Warranty", desc: "All repairs guaranteed" },
  { icon: Star, label: "Certified Techs", desc: "Trained & background-checked" },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {highlights.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center p-5 rounded-2xl bg-muted">
              <div className="bg-primary text-primary-foreground p-3 rounded-xl mb-3">
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-semibold text-sm text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground mt-1">{desc}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="font-display text-4xl font-black text-foreground mb-3">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground">4 simple steps to get your device repaired</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-border z-0 -translate-x-1/2" />
              )}
              <div className="relative bg-background border-2 border-border rounded-3xl p-6 text-center hover:border-primary hover:shadow-card transition-all group">
                <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                  {step.step}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-display font-bold text-base text-foreground mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
