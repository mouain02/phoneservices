import { useState } from "react";
import { ChevronRight, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/ui/SearchBar";
import DeviceSelector from "@/components/ui/DeviceSelector";
import BrandSelector from "@/components/ui/BrandSelector";
import ModelSelector from "@/components/ModelSelector";
import RepairSelector, { repairOptions } from "@/components/ui/RepairSelector";
import { getBrands } from "@/components/data/phones";

const steps = [
  { num: 1, label: "Select device" },
  { num: 2, label: "Select brand" },
  { num: 3, label: "Select model" },
  { num: 4, label: "Finalize order" },
];

const QuoteSection = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [deviceType, setDeviceType] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [repairType, setRepairType] = useState(null);

  const getBrandName = (id) =>
    id ? getBrands().find((b) => b.id === id)?.name || id : "";

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
    <section id="quote" className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl font-black text-foreground mb-3">
            Get a <span className="text-primary">Free Quote</span>
          </h2>
          <p className="text-muted-foreground">
            Select your device and tell us what's wrong — we'll come to you!
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar onSelect={handleSearchSelect} deviceType={deviceType} />
        </div>

        <div className="max-w-3xl mx-auto bg-background rounded-3xl shadow-card p-6 md:p-10">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-center gap-2">
                <button
                  onClick={() => goTo(step.num)}
                  disabled={step.num > currentStep}
                  className="flex items-center gap-2 group"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
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
                    className={`h-0.5 w-8 md:w-12 rounded-full transition-colors ${
                      step.num < currentStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Breadcrumb */}
          {(deviceType || brandId || selectedModel) && (
            <div className="flex items-center gap-2 mb-6 flex-wrap text-sm">
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
          <div className="animate-scale-in">
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
          <div className="mt-6 flex justify-between items-center">
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
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold text-sm shadow-primary hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
