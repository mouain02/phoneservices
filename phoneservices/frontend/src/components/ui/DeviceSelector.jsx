import { Smartphone, Tablet, Laptop } from "lucide-react";
import { useCatalogData } from "@/components/data/phones";

const iconByType = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
};

const DeviceSelector = ({ selected, onSelect }) => {
  const catalog = useCatalogData();
  const devices = catalog.deviceTypes || [];

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4 font-medium">
        <span className="text-primary">●</span> Or select your <strong>type</strong>
      </p>
      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-3 sm:gap-4">
        {devices.map((device) => {
          const type = device.id;
          const label = device.label || device.id;
          const desc = device.desc || "";
          const Icon = iconByType[type] || Smartphone;
          return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 transition-all hover:border-primary hover:shadow-card xs:gap-3 xs:p-5 ${
              selected === type
                ? "border-primary bg-primary-light shadow-primary"
                : "border-border bg-background"
            }`}
          >
            <div
              className={`p-3 rounded-xl transition-colors ${
                selected === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
              }`}
            >
              {device.iconUrl ? (
                <img src={device.iconUrl} alt={label} className="h-6 w-6 object-contain xs:h-7 xs:w-7" />
              ) : (
                <Icon className="h-6 w-6 xs:h-7 xs:w-7" />
              )}
            </div>
            <div className="text-center">
              <div className={`text-xs font-semibold uppercase tracking-wide xs:text-sm ${selected === type ? "text-primary" : "text-foreground"}`}>
                {label}
              </div>
              <div className="text-xs text-muted-foreground mt-1 hidden md:block">{desc}</div>
            </div>
          </button>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceSelector;
