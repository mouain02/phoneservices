import { useState } from "react";
import { Mail } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-xl mx-auto">
          <Mail className="h-10 w-10 text-primary-foreground opacity-80 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-black text-primary-foreground mb-3">
            Stay in the Loop
          </h2>
          <p className="text-primary-foreground opacity-80 mb-8 text-sm">
            Get exclusive repair tips, special offers, and updates delivered to your inbox.
          </p>

          {submitted ? (
            <div className="bg-primary-foreground text-primary rounded-2xl px-6 py-4 font-semibold">
              🎉 Thanks! You're now subscribed.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-primary-foreground text-foreground placeholder:text-muted-foreground rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-foreground/50"
              />
              <button
                type="submit"
                className="bg-foreground text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity flex-shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
