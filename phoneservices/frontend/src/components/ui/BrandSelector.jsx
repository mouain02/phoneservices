import { useCatalogData } from "@/components/data/phones";

// Maps internal brand ids to Simple Icons slugs.
const brandLogoSlug = {
  amazon: "amazon",
  apple: "apple",
  asus: "asus",
  blackberry: "blackberry",
  dell: "dell",
  fairphone: "fairphone",
  google: "google",
  honor: "honor",
  hp: "hp",
  huawei: "huawei",
  infinix: "infinix",
  itel: "itel",
  lenovo: "lenovo",
  lg: "lg",
  meizu: "meizu",
  microsoft: "microsoft",
  motorola: "motorola",
  nokia: "nokia",
  nothing: "nothing",
  oneplus: "oneplus",
  oppo: "oppo",
  poco: "poco",
  realme: "realme",
  samsung: "samsung",
  sony: "sony",
  tcl: "tcl",
  tecno: "tecno",
  vivo: "vivo",
  xiaomi: "xiaomi",
  zte: "zte",
};

const brandLogoDomain = {
  amazon: "amazon.com",
  apple: "apple.com",
  asus: "asus.com",
  blackberry: "blackberry.com",
  dell: "dell.com",
  fairphone: "fairphone.com",
  google: "google.com",
  honor: "honor.com",
  hp: "hp.com",
  huawei: "huawei.com",
  infinix: "infinixmobility.com",
  itel: "itel-mobile.com",
  lenovo: "lenovo.com",
  lg: "lg.com",
  meizu: "meizu.com",
  microsoft: "microsoft.com",
  motorola: "motorola.com",
  nokia: "nokia.com",
  nothing: "nothing.tech",
  oneplus: "oneplus.com",
  oppo: "oppo.com",
  poco: "po.co",
  realme: "realme.com",
  samsung: "samsung.com",
  sony: "sony.com",
  tcl: "tcl.com",
  tecno: "tecno-mobile.com",
  vivo: "vivo.com",
  xiaomi: "xiaomi.com",
  zte: "zte.com.cn",
};

// Brandfetch works reliably for these brands where other providers may fail.
const brandLogoDirectUrl = {
  sony: "https://cdn.brandfetch.io/sony.com/w/400/h/400/logo",
  realme: "https://cdn.brandfetch.io/realme.com/w/400/h/400/logo",
  tcl: "https://cdn.brandfetch.io/tcl.com/w/400/h/400/logo",
  zte: "https://cdn.brandfetch.io/zte.com.cn/w/400/h/400/logo",
  infinix: "https://cdn.brandfetch.io/infinixmobility.com/w/400/h/400/logo",
  tecno: "https://cdn.brandfetch.io/tecno-mobile.com/w/400/h/400/logo",
  itel: "https://cdn.brandfetch.io/itel-mobile.com/w/400/h/400/logo",
  poco: "https://cdn.brandfetch.io/po.co/w/400/h/400/logo",
  nothing: "https://cdn.brandfetch.io/nothing.tech/w/400/h/400/logo",
};

const getBrandLogoUrl = (brand) => {
  if (brand?.logoUrl) return brand.logoUrl;
  const brandId = brand?.id;
  if (brandLogoDirectUrl[brandId]) return brandLogoDirectUrl[brandId];
  const domain = brandLogoDomain[brandId];
  return domain ? `https://logo.clearbit.com/${domain}` : null;
};

const getBrandLogoFallbackUrl = (brandId) => {
  const slug = brandLogoSlug[brandId];
  return slug ? `https://cdn.simpleicons.org/${slug}` : null;
};

const BrandSelector = ({ deviceType, selectedBrand, onSelect }) => {
  const catalog = useCatalogData();
  const filteredBrands = (catalog.brands || []).filter((brand) =>
    (brand.types || []).includes(deviceType)
  );

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4 font-medium">
        <span className="text-primary">●</span> Select your <strong>brand</strong>
      </p>
      <div className="grid grid-cols-2 gap-3 xs:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {filteredBrands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => onSelect(brand.id)}
            className={`group h-24 rounded-2xl border bg-secondary/50 transition-all duration-200 xs:h-28 sm:h-32 ${
              selectedBrand === brand.id
                ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
                : "border-transparent hover:border-primary/40"
            }`}
          >
            <div className="flex h-full w-full items-center justify-center px-3">
              {getBrandLogoUrl(brand) ? (
                <img
                  src={getBrandLogoUrl(brand)}
                  data-fallback={getBrandLogoFallbackUrl(brand.id) || ""}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                  className={`mx-auto h-8 sm:h-10 w-auto object-contain opacity-80 transition-all ${
                    selectedBrand === brand.id ? "opacity-100" : "group-hover:opacity-100"
                  }`}
                  onError={(e) => {
                    const fallbackUrl = e.currentTarget.dataset.fallback;
                    if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
                      e.currentTarget.src = fallbackUrl;
                      return;
                    }
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}
              <span
                style={{ display: getBrandLogoUrl(brand) ? "none" : "flex" }}
                className={`h-full w-full items-center justify-center text-center whitespace-nowrap leading-none text-[#7f8185] transition-colors text-xl sm:text-2xl tracking-tight font-semibold ${
                  selectedBrand === brand.id ? "text-[#6e6f73]" : "group-hover:text-[#6e6f73]"
                }`}
              >
                {brand.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BrandSelector;
