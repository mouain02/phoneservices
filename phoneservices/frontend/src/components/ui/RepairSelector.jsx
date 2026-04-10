import { useCatalogData } from "@/components/data/phones";
import { repairOptions } from "@/components/data/repairOptions";

const RepairSelector = ({ model, selected, onSelect }) => {
  const catalog = useCatalogData();
  const brandName =
    (catalog.brands || []).find((brand) => brand.id === model.brandId)?.name || model.brandId;

  return (
    <div>
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-primary-light p-3 xs:p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground xs:h-10 xs:w-10 xs:text-lg">
          ✓
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground xs:text-base">
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

      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-4">
        {repairOptions.map((repair) => (
          <button
            key={repair.id}
            onClick={() => onSelect(repair.id)}
            className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 pt-8 text-center transition-all hover:border-primary hover:shadow-card xs:pt-9 ${
              selected === repair.id ? "border-primary bg-primary-light" : "border-border bg-background"
            }`}
          >
            <span className="absolute right-2 top-2 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary xs:text-[11px]">
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
