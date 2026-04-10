import { useSyncExternalStore } from "react";
import { catalogApi } from "@/lib/catalogApi";

const STORAGE_KEY = "phoneservices.catalog.v1";

const fallbackDeviceTypes = [
  { id: "smartphone", label: "Smartphone", desc: "iPhone, Samsung, Xiaomi and more" },
  { id: "tablet", label: "Tablet", desc: "iPad, Galaxy Tab, Surface and more" },
  { id: "laptop", label: "Laptop", desc: "MacBook, Dell, HP and more" },
];

const fallbackBrands = [
  { id: "apple", name: "Apple", types: ["smartphone", "tablet", "laptop"] },
  { id: "samsung", name: "Samsung", types: ["smartphone", "tablet", "laptop"] },
  { id: "xiaomi", name: "Xiaomi", types: ["smartphone", "tablet"] },
  { id: "google", name: "Google", types: ["smartphone", "tablet"] },
];

const fallbackModels = [
  { id: "iphone-16-pro", brandId: "apple", name: "iPhone 16 Pro", modelCode: "A3293", type: "smartphone", year: 2024 },
  { id: "iphone-15", brandId: "apple", name: "iPhone 15", modelCode: "A3090", type: "smartphone", year: 2023 },
  { id: "galaxy-s24", brandId: "samsung", name: "Galaxy S24", modelCode: "SM-S921B", type: "smartphone", year: 2024 },
  { id: "galaxy-s23", brandId: "samsung", name: "Galaxy S23", modelCode: "SM-S911B", type: "smartphone", year: 2023 },
  { id: "pixel-8", brandId: "google", name: "Pixel 8", modelCode: "GKWS6", type: "smartphone", year: 2023 },
  { id: "xiaomi-14", brandId: "xiaomi", name: "Xiaomi 14", modelCode: "23127PN0CC", type: "smartphone", year: 2023 },
];

const clone = (value) => JSON.parse(JSON.stringify(value));

export const getDefaultCatalog = () => ({
  deviceTypes: clone(fallbackDeviceTypes),
  brands: clone(fallbackBrands),
  models: clone(fallbackModels),
});

const normalizeCatalog = (raw) => {
  const defaults = getDefaultCatalog();
  if (!raw || typeof raw !== "object") return defaults;

  return {
    deviceTypes: Array.isArray(raw.deviceTypes) ? raw.deviceTypes : defaults.deviceTypes,
    brands: Array.isArray(raw.brands) ? raw.brands : defaults.brands,
    models: Array.isArray(raw.models) ? raw.models : defaults.models,
  };
};

const readStoredCatalog = () => {
  if (typeof window === "undefined") return getDefaultCatalog();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultCatalog();
    return normalizeCatalog(JSON.parse(raw));
  } catch {
    return getDefaultCatalog();
  }
};

let catalogState = readStoredCatalog();
const listeners = new Set();
let catalogSyncPromise = null;
let catalogAutoSyncInterval = null;

const emitCatalogChange = () => {
  for (const listener of listeners) listener();
};

const persistCatalog = (catalog) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
  } catch {
    // Ignore storage quota or serialization failures and keep in-memory state.
  }
};

export const getCatalog = () => catalogState;

export const saveCatalog = (catalog) => {
  const normalized = normalizeCatalog(catalog);
  catalogState = normalized;
  persistCatalog(normalized);
  emitCatalogChange();
};

export const subscribeCatalog = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useCatalogData = () =>
  useSyncExternalStore(subscribeCatalog, getCatalog, getDefaultCatalog);

const syncCatalogFromApi = async () => {
  try {
    const remoteCatalog = await catalogApi.getCatalog();
    saveCatalog(remoteCatalog);
    return true;
  } catch {
    return false;
  }
};

export const preloadCatalogFromApi = () => {
  if (!catalogSyncPromise) {
    catalogSyncPromise = syncCatalogFromApi().finally(() => {
      catalogSyncPromise = null;
    });
  }

  return catalogSyncPromise;
};

export const startCatalogAutoSync = () => {
  if (typeof window === "undefined") return () => {};
  if (catalogAutoSyncInterval) return () => {};

  const resync = () => {
    preloadCatalogFromApi();
  };

  // Attempt hydration immediately, then keep syncing so imported datasets appear once API is reachable.
  resync();
  catalogAutoSyncInterval = window.setInterval(resync, 30000);
  window.addEventListener("focus", resync);
  window.addEventListener("online", resync);

  return () => {
    if (catalogAutoSyncInterval) {
      window.clearInterval(catalogAutoSyncInterval);
      catalogAutoSyncInterval = null;
    }
    window.removeEventListener("focus", resync);
    window.removeEventListener("online", resync);
  };
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    catalogState = readStoredCatalog();
    emitCatalogChange();
  });
}