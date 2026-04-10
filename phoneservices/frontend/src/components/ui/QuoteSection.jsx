import { useState } from "react";
import { ChevronRight, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/ui/SearchBar";
import DeviceSelector from "@/components/ui/DeviceSelector";
import BrandSelector from "@/components/ui/BrandSelector";
import ModelSelector from "@/components/ModelSelector";
import RepairSelector from "@/components/ui/RepairSelector";
import { repairOptions } from "@/components/data/repairOptions";
import { useCatalogData } from "@/components/data/phones";

const steps = [
  { num: 1, label: "Select device" },
  { num: 2, label: "Select brand" },
  { num: 3, label: "Select model" },
  { num: 4, label: "Finalize order" },
];

const QuoteSection = () => {
  const navigate = useNavigate();
  const catalog = useCatalogData();
  const brands = catalog.brands || [];
  const [currentStep, setCurrentStep] = useState(1);
  const [deviceType, setDeviceType] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [repairType, setRepairType] = useState(null);

  const getBrandName = (id) =>
    id ? brands.find((brand) => brand.id === id)?.name || id : "";

  const handleDeviceSelect = (type) => {
    setDeviceType(type);
    setBrandId(null);
    setSelectedModel(null);
    setRepairType(null);
    setCurrentStep(2);
  };

  const handleBrandSelect = (id) => {
    setBrandId(id);
    setSelectedModel(null);
    setRepairType(null);
    setCurrentStep(3);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setRepairType(null);
    setCurrentStep(4);
  };

  const handleSearchSelect = (model) => {
    setDeviceType(model.type);
    setBrandId(model.brandId);
    setSelectedModel(model);
    setRepairType(null);
    setCurrentStep(4);
  };

  const goTo = (step) => {
    if (step < currentStep) setCurrentStep(step);
  };

  const selectedRepair = repairOptions.find((r) => r.id === repairType);

  const handleBookRepair = () => {
    if (!selectedModel || !selectedRepair) return;
    const selectedBrandName = getBrandName(selectedModel.brandId);
    navigate("/book", {
      state: {
        model: selectedModel,
        brandName: selectedBrandName,
        repair: selectedRepair,
        color: "Mist Blue",
      },
    });
  };

  return (
    <section id="quote" className="bg-muted py-12 xs:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center xs:mb-10">
          <h2 className="mb-3 font-display text-3xl font-black text-foreground xs:text-4xl">
            Get a <span className="text-primary">Free Quote</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground xs:text-base">
            Select your device and tell us what's wrong — we'll come to you!
          </p>
        </div>

        <div className="mx-auto mb-6 max-w-2xl xs:mb-8">
          <SearchBar onSelect={handleSearchSelect} deviceType={deviceType} />
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl bg-background p-4 shadow-card xs:rounded-3xl xs:p-6 md:p-10">
          {/* Step indicator */}
          <div className="mb-6 flex items-center justify-start gap-1 overflow-x-auto pb-2 xs:mb-8 xs:justify-center xs:gap-2">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center gap-2">
                <button
                  onClick={() => goTo(step.num)}
                  disabled={step.num > currentStep}
                  className="group flex items-center gap-2"
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all xs:h-8 xs:w-8 xs:text-sm ${
                      step.num < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.num === currentStep
                        ? "bg-primary text-primary-foreground shadow-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.num}
                  </div>
                  <span
                    className={`text-xs font-medium whitespace-nowrap hidden sm:block ${
                      step.num === currentStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-5 rounded-full transition-colors xs:w-8 md:w-12 ${
                      step.num < currentStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Breadcrumb */}
          {(deviceType || brandId || selectedModel) && (
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs xs:text-sm">
              {deviceType && (
                <span className="bg-primary-light text-primary px-3 py-1 rounded-full font-medium capitalize">
                  {deviceType}
                </span>
              )}
              {deviceType && brandId && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              {brandId && (
                <span className="bg-primary-light text-primary px-3 py-1 rounded-full font-medium">
                  {getBrandName(brandId)}
                </span>
              )}
              {brandId && selectedModel && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              {selectedModel && (
                <span className="bg-primary-light text-primary px-3 py-1 rounded-full font-medium">
                  {selectedModel.name}
                </span>
              )}
            </div>
          )}

          {/* Step content */}
          <div className="animate-fade-up">
            {currentStep === 1 && (
              <DeviceSelector selected={deviceType} onSelect={handleDeviceSelect} />
            )}
            {currentStep === 2 && deviceType && (
              <BrandSelector deviceType={deviceType} selectedBrand={brandId} onSelect={handleBrandSelect} />
            )}
            {currentStep === 3 && deviceType && brandId && (
              <ModelSelector
                brandId={brandId}
                deviceType={deviceType}
                selectedModel={selectedModel?.id || null}
                onSelect={handleModelSelect}
              />
            )}
            {currentStep === 4 && selectedModel && (
              <RepairSelector model={selectedModel} onSelect={setRepairType} selected={repairType} />
            )}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentStep((s) => Math.max(s - 1, 1))}
              disabled={currentStep === 1}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
            >
              ← Back
            </button>

            {currentStep === 4 ? (
              <button
                onClick={handleBookRepair}
                disabled={!repairType}
                className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-primary transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 xs:px-6"
              >
                <Wrench className="h-4 w-4" />
                Book Repair
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
