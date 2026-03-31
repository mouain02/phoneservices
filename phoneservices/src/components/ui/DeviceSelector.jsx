import { Smartphone, Tablet, Laptop } from "lucide-react";
import { getDeviceTypes } from "@/components/data/phones";

const iconByType = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
};

const DeviceSelector = ({ selected, onSelect }) => {
  const devices = getDeviceTypes();

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4 font-medium">
        <span className="text-primary">●</span> Or select your <strong>type</strong>
      </p>
      <div className="grid grid-cols-3 gap-4">
        {devices.map((device) => {
          const type = device.id;
          const label = device.label || device.id;
          const desc = device.desc || "";
          const Icon = iconByType[type] || Smartphone;
          return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border-2 transition-all hover:border-primary hover:shadow-card ${
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
                <img src={device.iconUrl} alt={label} className="h-7 w-7 object-contain" />
              ) : (
                <Icon className="h-7 w-7" />
              )}
            </div>
            <div className="text-center">
              <div className={`font-semibold text-sm uppercase tracking-wide ${selected === type ? "text-primary" : "text-foreground"}`}>
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
