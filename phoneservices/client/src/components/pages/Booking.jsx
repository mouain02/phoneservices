import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, Smartphone } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const parsePrice = (price) => Number((price || "").replace(/[^0-9.]/g, "")) || 0;
const DAYS_PER_PAGE = 8;

const timeSlots = [
  "8:00 am - 10:00 am",
  "10:00 am - 12:00 pm",
  "12:00 pm - 2:00 pm",
  "2:00 pm - 4:00 pm",
  "4:00 pm - 6:00 pm",
];

const Booking = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const brandName = state?.brandName || "Apple";
  const modelName = state?.model?.name || "iPhone 17";
  const color = state?.color || "Mist Blue";
  const repairLabel = state?.repair?.label || "Ship My Device";
  const amount = useMemo(() => parsePrice(state?.repair?.price || "$440"), [state?.repair?.price]);

  const [serviceMethod, setServiceMethod] = useState("ship");
  const [customerType, setCustomerType] = useState("private");
  const [pageOffset, setPageOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("8:00 am - 10:00 am");

  const dateOptions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: DAYS_PER_PAGE }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + pageOffset + index);

      const iso = date.toISOString().slice(0, 10);
      return {
        key: iso,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: date.toLocaleDateString("en-US", { day: "2-digit" }),
        disabled: false,
      };
    });
  }, [pageOffset]);

  useEffect(() => {
    if (!dateOptions.some((d) => d.key === selectedDate)) {
      setSelectedDate(dateOptions[0]?.key || "");
    }
  }, [dateOptions, selectedDate]);

  return (
    <div className="min-h-screen bg-muted py-8 pt-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl rounded-3xl bg-background p-6 md:p-10 shadow-card">
          <div className="mb-10 flex items-center justify-center gap-3 text-center">
            <div className="h-10 w-10 rounded-full border-2 border-primary text-primary flex items-center justify-center">
              <Check className="h-5 w-5" />
            </div>
            <div className="h-1 w-20 bg-primary rounded-full" />
            <div className="h-10 w-10 rounded-full border-2 border-primary text-primary flex items-center justify-center">
              <Check className="h-5 w-5" />
            </div>
            <div className="h-1 w-20 bg-primary rounded-full" />
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center gap-3 rounded-xl bg-primary/10 px-4 py-2 text-foreground"
              >
                <ArrowLeft className="h-4 w-4 text-primary" />
                <span className="text-2xl font-light">Finalize <strong className="font-semibold">Booking</strong></span>
              </button>

              <h3 className="mb-4 text-2xl font-semibold text-foreground">Select Service Method</h3>

              <div className="space-y-4">
                <button
                  onClick={() => setServiceMethod("tampa")}
                  className="w-full rounded-2xl border border-border p-4 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xl font-semibold text-foreground">Tampa Bay Residents Only <span className="text-sm text-primary">FREE</span></p>
                      <p className="text-muted-foreground">Service at your location</p>

                      <div className="mt-4">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                          <p className="text-xl text-foreground">
                            Select <strong>date</strong>
                          </p>
                          <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="mb-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPageOffset((prev) => Math.max(0, prev - DAYS_PER_PAGE))}
                            disabled={pageOffset === 0}
                            className="rounded-full bg-primary/10 p-1 text-primary disabled:opacity-40"
                            aria-label="Previous date range"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <div className="grid flex-1 grid-cols-4 gap-2 sm:grid-cols-8">
                            {dateOptions.map((opt) => (
                              <button
                                type="button"
                                key={opt.key}
                                onClick={() => !opt.disabled && setSelectedDate(opt.key)}
                                disabled={opt.disabled}
                                className={`rounded-2xl border px-2 py-2 text-center transition-colors ${
                                  selectedDate === opt.key
                                    ? "border-primary text-foreground"
                                    : "border-transparent text-foreground/70"
                                } ${opt.disabled ? "cursor-not-allowed opacity-45" : "hover:border-primary/40"}`}
                              >
                                <p className="text-sm">{opt.dayName}</p>
                                <p className="text-3xl font-bold leading-tight">{opt.dayNumber}</p>
                              </button>
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={() => setPageOffset((prev) => prev + DAYS_PER_PAGE)}
                            className="rounded-full bg-primary/10 p-1 text-primary"
                            aria-label="Next date range"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mb-3 flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                          <p className="text-xl text-foreground">
                            Select <strong>time</strong>
                          </p>
                          <div className="h-px flex-1 bg-border" />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {timeSlots.map((slot) => (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => setSelectedTime(slot)}
                              className={`min-w-fit rounded-xl border px-4 py-2 text-lg font-semibold transition-colors ${
                                selectedTime === slot
                                  ? "border-primary text-foreground"
                                  : "border-border text-foreground/80 hover:border-primary/40"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-medium text-primary">Shop is closed for today!</p>
                    </div>
                    <span className={`h-7 w-7 rounded-md border-2 ${serviceMethod === "tampa" ? "border-primary bg-primary" : "border-primary"}`}>
                      {serviceMethod === "tampa" && <Check className="mx-auto mt-0.5 h-5 w-5 text-primary-foreground" />}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setServiceMethod("ship")}
                  className="w-full rounded-2xl border border-border p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-semibold text-foreground">Ship My Device <span className="text-sm text-primary">FREE</span></p>
                      <p className="text-muted-foreground">Repaired within 24 hours of arrival</p>
                    </div>
                    <span className={`h-7 w-7 rounded-md border-2 ${serviceMethod === "ship" ? "border-primary bg-primary" : "border-primary"}`}>
                      {serviceMethod === "ship" && <Check className="mx-auto mt-0.5 h-5 w-5 text-primary-foreground" />}
                    </span>
                  </div>
                </button>
              </div>

              <div className="mt-6 space-y-4 rounded-2xl border border-border p-4">
                <p className="text-lg font-semibold text-foreground">Your address</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input className="rounded-xl border border-border px-3 py-3" placeholder="HOUSE NUMBER *" />
                  <input className="rounded-xl border border-border px-3 py-3" placeholder="STREETNAME *" />
                  <input className="rounded-xl border border-border px-3 py-3" placeholder="CITY *" />
                  <input className="rounded-xl border border-border px-3 py-3" placeholder="ZIPCODE *" />
                </div>
                <button className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-3 text-left">
                  <span>United States (US)</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <div className="pt-4 text-foreground">
                  <p className="text-center text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    SEND YOUR DEVICE TO
                  </p>
                  <p className="mt-3 text-sm leading-6">
                    PO Box 530133
                    <br />
                    Saint Petersburg, FL 33747
                  </p>

                  <p className="mt-4 text-sm leading-6 text-foreground/90">
                    *Use this address exactly as shown, company name is not required.
                  </p>

                  <p className="mt-6 text-center text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    TERMS SENDING DEVICE
                  </p>

                  <div className="mt-3 space-y-3 text-sm leading-6 text-foreground/90">
                    <p>You'll be responsible for shipping costs each way.</p>
                    <p>We aim to repair each device and ship it back out the same day it arrives!</p>
                    <p>Pack your device as securely as possible to prevent further damage.</p>
                    <p>
                      If the frame (metal bezel between the screen and back glass) is bent, curved, or
                      cracked, please text us a video of the condition for accurate pricing 727.657.8390
                    </p>
                    <p>
                      Please be sure to send a tracking number for the shipment so that we can plan for
                      it's arrival.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-20 w-16 items-center justify-center rounded-xl bg-secondary">
                  <Smartphone className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-4xl font-bold text-foreground">{brandName} {modelName}</h3>
                  <p className="text-primary text-xl">repair</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border p-5">
                <div className="mb-3 flex items-start justify-between">
                  <p className="text-muted-foreground text-xl">{brandName} {modelName} {color}</p>
                  <p className="text-xl">{repairLabel}</p>
                </div>
                <div className="flex items-end justify-between border-t border-border pt-3">
                  <div>
                    <p className="text-5xl font-bold">Total</p>
                    <p className="text-muted-foreground text-xl">incl. 0% Tax</p>
                  </div>
                  <p className="text-5xl font-black">$ {amount.toFixed(2)}</p>
                </div>
                <button className="mx-auto mt-4 block rounded-xl bg-muted px-4 py-1 text-sm text-muted-foreground">view details</button>
              </div>

              <div className="mt-8 space-y-5 rounded-2xl border border-border p-4">
                <div className="flex gap-6">
                  <button
                    onClick={() => setCustomerType("private")}
                    className="inline-flex items-center gap-2 text-xl"
                  >
                    <span className={`h-7 w-7 rounded-md border-2 ${customerType === "private" ? "border-primary bg-primary" : "border-primary"}`}>
                      {customerType === "private" && <Check className="mx-auto mt-0.5 h-5 w-5 text-primary-foreground" />}
                    </span>
                    Private
                  </button>
                  <button
                    onClick={() => setCustomerType("business")}
                    className="inline-flex items-center gap-2 text-xl"
                  >
                    <span className={`h-7 w-7 rounded-md border-2 ${customerType === "business" ? "border-primary bg-primary" : "border-primary"}`}>
                      {customerType === "business" && <Check className="mx-auto mt-0.5 h-5 w-5 text-primary-foreground" />}
                    </span>
                    Business
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input className="rounded-xl border border-border px-3 py-3" placeholder="FIRST NAME *" />
                  <input className="rounded-xl border border-border px-3 py-3" placeholder="LAST NAME *" />
                  <input className="rounded-xl border border-border px-3 py-3" placeholder="PHONE * +298" />
                  <input className="rounded-xl border border-border px-3 py-3" placeholder="EMAIL *" />
                </div>
                <textarea className="h-28 w-full rounded-xl border border-border px-3 py-3" placeholder="NOTES" />

                <p className="text-right text-lg">Total <strong>$ {amount.toFixed(2)}</strong> incl. 0% Tax</p>

                <button className="w-full rounded-2xl bg-primary px-6 py-4 text-3xl font-bold text-primary-foreground">
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
