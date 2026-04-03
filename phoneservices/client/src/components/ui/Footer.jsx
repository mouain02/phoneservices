import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";

const FooterLink = ({ href, children }) => (
  <a href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Phoneservice HOUBA" className="h-10 w-10 object-contain brightness-0 invert" />
              <div>
                <span className="font-display text-lg font-black text-primary-foreground">Phoneservice</span>
                <span className="font-display text-lg font-black text-primary"> HOUBA</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Professional door-to-door device repair service. Fast, reliable, and affordable repairs at your doorstep.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Youtube, href: "#", label: "YouTube" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="h-4 w-4 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">Services</h4>
            <div className="flex flex-col gap-2">
              {["Screen Repair", "Battery Replacement", "Charging Port Fix", "Camera Repair", "Water Damage Recovery", "Software Troubleshooting"].map((s) => (
                <FooterLink key={s} href="#">{s}</FooterLink>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {["Home", "Get A Quote", "Reviews", "FAQ", "Blog", "Privacy Policy", "Terms of Service"].map((l) => (
                <FooterLink key={l} href="#">{l}</FooterLink>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-4">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:+1234567890" className="text-sm text-primary-foreground hover:text-primary transition-colors">
                    +1 (234) 567-890
                  </a>
                  <p className="text-xs text-muted-foreground">Mon–Sat 8am–8pm</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:hello@phoneservicehouba.com" className="text-sm text-primary-foreground hover:text-primary transition-colors">
                  hello@phoneservicehouba.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  We come to you! Coverage: Entire city & suburbs
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Phoneservice HOUBA. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Cookie Policy</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
