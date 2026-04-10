import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Get A Quote", href: "#quote" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact Us", href: "#contact" },
  { label: "Admin", href: "/admin", external: true },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    if (!href.startsWith("#")) {
      navigate(href);
      return;
    }

    if (location.pathname === "/") {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    navigate(`/${href}`);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background shadow-md" : "bg-background/95 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-3 py-3 xs:px-4">
        <button type="button" onClick={() => navigate("/")} className="flex min-w-0 items-center gap-2 xs:gap-3">
          <img src={logo} alt="Phoneservice HOUBA" className="h-9 w-9 object-contain xs:h-10 xs:w-10" />
          <div>
            <span className="font-display text-base font-900 tracking-tight text-foreground xs:text-xl">
              Phoneservice
            </span>
            <span className="font-display text-base font-900 tracking-tight text-primary xs:text-xl"> HOUBA</span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                className="font-medium text-sm text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`font-medium text-sm transition-colors hover:text-primary ${
                  link.label === "Get A Quote" ? "text-primary font-semibold" : "text-foreground"
                }`}
              >
                {link.label}
              </button>
            )
          ))}
          <a
            href="tel:+1234567890"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-primary hover:opacity-90 transition-opacity"
          >
            <Phone className="h-4 w-4" />
            Call Us
          </a>
        </nav>

        <button
          className="rounded-lg p-1 text-foreground transition-colors hover:bg-muted md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-background border-t border-border shadow-lg animate-fade-up">
          <div className="container mx-auto py-4 flex flex-col gap-3 px-4">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-left font-medium py-2.5 text-sm text-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-left font-medium py-2.5 text-sm transition-colors hover:text-primary ${
                    link.label === "Get A Quote" ? "text-primary font-semibold" : "text-foreground"
                  }`}
                >
                  {link.label}
                </button>
              )
            ))}
            <a
              href="tel:+1234567890"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-primary hover:opacity-90"
            >
              <Phone className="h-4 w-4" />
              Call Us
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
