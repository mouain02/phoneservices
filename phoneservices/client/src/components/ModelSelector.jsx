import { useMemo, useState } from "react";
import { Check, Laptop, Smartphone, Tablet } from "lucide-react";
import { getModelsByBrandAndType } from "@/components/data/phones";

const fallbackToneByType = {
  smartphone: { bg: "#eff6ff", fg: "#1d4ed8", label: "Phone" },
  tablet: { bg: "#ecfeff", fg: "#0f766e", label: "Tablet" },
  laptop: { bg: "#f5f3ff", fg: "#6d28d9", label: "Laptop" },
};

const modelImageAliases = {
  "iphone-17-pro-max": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro-max.jpg",
  ],
  "iphone-17-pro": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17-pro.jpg",
  ],
  "iphone-17-air": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-air.jpg",
  ],
  "iphone-17": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-17.jpg",
  ],
  "iphone-16-pro-max": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro-max.jpg",
  ],
  "iphone-16-pro": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-pro.jpg",
  ],
  "iphone-16-plus": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16-plus.jpg",
  ],
  "iphone-16": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16.jpg",
  ],
  "iphone-16e": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-16e.jpg",
  ],
  "iphone-15-plus": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus.jpg",
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-15-plus-1.jpg",
    "https://fdn.gsmarena.com/vv/bigpic/apple-iphone-15-plus.jpg",
    "https://fdn.gsmarena.com/vv/bigpic/apple-iphone-15-plus-1.jpg",
  ],
  "iphone-14-pro-max": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max.jpg",
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max-.jpg",
    "https://fdn.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max.jpg",
    "https://fdn.gsmarena.com/vv/bigpic/apple-iphone-14-pro-max-.jpg",
  ],
  "iphone-11-pro-max": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11-pro-max-.jpg",
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-11-pro-max.jpg",
    "https://fdn.gsmarena.com/vv/bigpic/apple-iphone-11-pro-max-.jpg",
    "https://fdn.gsmarena.com/vv/bigpic/apple-iphone-11-pro-max.jpg",
  ],
  "iphone-se-3": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2022.jpg",
    "https://fdn.gsmarena.com/vv/bigpic/apple-iphone-se-2022.jpg",
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-3rd-gen.jpg",
    "https://fdn.gsmarena.com/vv/bigpic/apple-iphone-se-3rd-gen.jpg",
  ],
  "iphone-se-2": [
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2020.jpg",
    "https://fdn.gsmarena.com/vv/bigpic/apple-iphone-se-2020.jpg",
    "https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-se-2nd-gen.jpg",
    "https://fdn.gsmarena.com/vv/bigpic/apple-iphone-se-2nd-gen.jpg",
  ],
  "fairphone-5": [
    "https://fdn2.gsmarena.com/vv/bigpic/fairphone-5.jpg",
    "https://fdn2.gsmarena.com/vv/bigpic/fairphone5.jpg",
  ],
  "fairphone-4": [
    "https://fdn2.gsmarena.com/vv/bigpic/fairphone-4.jpg",
    "https://fdn2.gsmarena.com/vv/bigpic/fairphone4.jpg",
  ],
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/["']/g, "")
    .replace(/\+/g, " plus ")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const toDataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const buildInlineFallback = (model, deviceType) => {
  const tone = fallbackToneByType[deviceType] || fallbackToneByType.smartphone;
  const safeName = String(model?.name || tone.label).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeBrand = String(model?.brandId || "").toUpperCase().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const icon = deviceType === "tablet" ? "▭" : deviceType === "laptop" ? "▱" : "▯";

  return toDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="280" viewBox="0 0 420 280">
      <rect width="420" height="280" rx="24" fill="${tone.bg}"/>
      <text x="210" y="102" text-anchor="middle" fill="${tone.fg}" font-family="Arial, sans-serif" font-size="72" opacity="0.45">${icon}</text>
      <text x="210" y="188" text-anchor="middle" fill="#334155" font-family="Arial, sans-serif" font-size="24" font-weight="700">${safeName}</text>
      <text x="210" y="218" text-anchor="middle" fill="#64748b" font-family="Arial, sans-serif" font-size="16" letter-spacing="1">${safeBrand || tone.label}</text>
    </svg>`
  );
};

const buildImageCandidates = (model) => {
  const brand = slugify(model.brandId);
  const name = slugify(model.name);
  const id = slugify(model.id);
  const aliases = modelImageAliases[model.id] || [];

  const candidates = [
    model.imageUrl,
    ...aliases,
    `https://fdn2.gsmarena.com/vv/bigpic/${brand}-${name}.jpg`,
    `https://fdn2.gsmarena.com/vv/bigpic/${brand}-${name}-.jpg`,
    `https://fdn2.gsmarena.com/vv/bigpic/${brand}-${name}-1.jpg`,
    `https://fdn.gsmarena.com/vv/bigpic/${brand}-${name}.jpg`,
    `https://fdn.gsmarena.com/vv/bigpic/${brand}-${name}-.jpg`,
    `https://fdn.gsmarena.com/vv/bigpic/${brand}-${name}-1.jpg`,
    `https://fdn2.gsmarena.com/vv/bigpic/${brand}-${id}.jpg`,
    `https://fdn2.gsmarena.com/vv/bigpic/${brand}-${id}-.jpg`,
    `https://fdn2.gsmarena.com/vv/bigpic/${brand}-${id}-1.jpg`,
    `https://fdn.gsmarena.com/vv/bigpic/${brand}-${id}.jpg`,
    `https://fdn.gsmarena.com/vv/bigpic/${brand}-${id}-.jpg`,
    `https://fdn.gsmarena.com/vv/bigpic/${brand}-${id}-1.jpg`,
  ].filter(Boolean);

  return [...new Set(candidates)];
};

const ModelImage = ({ model, deviceType }) => {
  const candidates = useMemo(() => buildImageCandidates(model), [model]);
  const fallbackSrc = useMemo(() => buildInlineFallback(model, deviceType), [model, deviceType]);
  const [idx, setIdx] = useState(0);
  const [fallbackMode, setFallbackMode] = useState(false);

  const Icon =
    deviceType === "tablet" ? Tablet : deviceType === "laptop" ? Laptop : Smartphone;

  if (fallbackMode) {
    return (
      <div className="h-24 sm:h-28 w-full rounded-xl bg-muted flex items-center justify-center">
        <Icon className="h-9 w-9 text-muted-foreground" />
      </div>
    );
  }

  const src = candidates[idx] || fallbackSrc;

  return (
    <img
      src={src}
      alt={model.name}
      loading="lazy"
      className="h-24 sm:h-28 w-full rounded-xl bg-muted object-contain"
      onError={() => {
        if (idx < candidates.length - 1) {
          setIdx((prev) => prev + 1);
          return;
        }
        if (src !== fallbackSrc) {
          setIdx(candidates.length);
          return;
        }
        setFallbackMode(true);
      }}
    />
  );
};

const ModelSelector = ({ brandId, deviceType, selectedModel, onSelect }) => {
  const models = getModelsByBrandAndType(brandId, deviceType);

  if (models.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No models found for this selection.
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4 font-medium">
        <span className="text-primary">●</span> Select your <strong>model</strong>
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[30rem] overflow-y-auto pr-1">
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model)}
            className={`relative rounded-2xl border-2 p-3 text-left transition-all hover:border-primary hover:shadow-card ${
              selectedModel === model.id ? "border-primary bg-primary-light" : "border-border bg-background"
            }`}
          >
            <ModelImage model={model} deviceType={deviceType} />

            <div className="mt-3 min-w-0">
              <div className={`font-semibold text-sm truncate ${selectedModel === model.id ? "text-primary" : "text-foreground"}`}>
                {model.name}
              </div>
              {model.modelCode && (
                <div className="text-xs text-primary/80 truncate mt-0.5">{model.modelCode}</div>
              )}
              {model.year && (
                <div className="text-[11px] text-muted-foreground mt-1">{model.year}</div>
              )}
            </div>

            {selectedModel === model.id && (
              <div className="absolute right-2 top-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                <Check className="h-3 w-3" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
