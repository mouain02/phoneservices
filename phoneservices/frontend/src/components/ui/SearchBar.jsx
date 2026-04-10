import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useCatalogData } from "@/components/data/phones";

const SearchBar = ({ onSelect, deviceType }) => {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const catalog = useCatalogData();

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const brands = catalog.brands || [];
    const models = catalog.models || [];

    return models.filter((model) => {
      if (deviceType && model.type !== deviceType) return false;
      const brand = brands.find((item) => item.id === model.brandId);
      return (
        String(model.name || "").toLowerCase().includes(q) ||
        String(model.modelCode || "").toLowerCase().includes(q) ||
        String(brand?.name || "").toLowerCase().includes(q)
      );
    });
  }, [query, deviceType, catalog]);

  const getBrandName = (brandId) =>
    (catalog.brands || []).find((brand) => brand.id === brandId)?.name || brandId;

  const handleSelect = (model) => {
    setQuery(`${getBrandName(model.brandId)} ${model.name}`);
    setFocused(false);
    onSelect(model);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 bg-background border-2 border-border rounded-full px-5 py-3 shadow-card focus-within:border-primary transition-colors">
        <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Please enter your brand, model or model code"
          className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-primary transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => results[0] && handleSelect(results[0])}
          className="bg-primary text-primary-foreground h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-primary hover:opacity-90 transition-opacity"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      {focused && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-card z-50 max-h-64 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-muted-foreground text-sm text-center">
              No results found for "{query}"
            </div>
          ) : (
            results.slice(0, 10).map((model) => (
              <button
                key={model.id}
                onClick={() => handleSelect(model)}
                className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-primary-light transition-colors border-b border-border last:border-0"
              >
                <div>
                  <span className="font-medium text-sm text-foreground">
                    {getBrandName(model.brandId)} {model.name}
                  </span>
                  {model.modelCode && (
                    <span className="text-xs text-muted-foreground ml-2">{model.modelCode}</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground capitalize bg-muted px-2 py-1 rounded-full">
                  {model.type}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
