import { getBrands } from "@/components/data/phones";

export const repairOptions = [
  { id: "screen", label: "Screen Repair", icon: "📱", desc: "Cracked or broken display", price: "$440" },
  { id: "battery", label: "Battery Replacement", icon: "🔋", desc: "Battery won't charge or drains fast", price: "$200" },
  { id: "charging", label: "Charging Port", icon: "🔌", desc: "Won't charge or loose connection", price: "$90" },
  { id: "camera", label: "Camera Repair", icon: "📷", desc: "Blurry or broken camera", price: "$265" },
  { id: "speaker", label: "Speaker / Mic", icon: "🔊", desc: "No sound or distorted audio", price: "$120" },
  { id: "water", label: "Water Damage", icon: "💧", desc: "Liquid exposure repair", price: "$180" },
  { id: "button", label: "Button Repair", icon: "🔘", desc: "Stuck or unresponsive buttons", price: "$85" },
  { id: "software", label: "Software Fix", icon: "⚙️", desc: "System issues, resets, unlocks", price: "$70" },
];

const RepairSelector = ({ model, selected, onSelect }) => {
  const brandName = getBrands().find((b) => b.id === model.brandId)?.name || model.brandId;

  return (
    <div>
      <div className="bg-primary-light rounded-2xl p-4 mb-5 flex items-center gap-3">
        <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
          ✓
        </div>
        <div>
          <div className="font-semibold text-foreground">
            {brandName} {model.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {model.modelCode && `Model: ${model.modelCode} · `}
            {model.year && `Year: ${model.year}`}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 font-medium">
        <span className="text-primary">●</span> What needs to be <strong>repaired</strong>?
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {repairOptions.map((repair) => (
          <button
            key={repair.id}
            onClick={() => onSelect(repair.id)}
            className={`relative flex flex-col items-center gap-2 p-3 pt-9 rounded-xl border-2 text-center transition-all hover:border-primary hover:shadow-card ${
              selected === repair.id ? "border-primary bg-primary-light" : "border-border bg-background"
            }`}
          >
            <span className="absolute right-2 top-2 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
              {repair.price}
            </span>
            <span className="text-2xl">{repair.icon}</span>
            <div>
              <div className={`text-xs font-semibold leading-tight ${selected === repair.id ? "text-primary" : "text-foreground"}`}>
                {repair.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 hidden sm:block leading-tight">
                {repair.desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RepairSelector;
