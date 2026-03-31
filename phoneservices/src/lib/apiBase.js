const normalizeApiBase = (value) => {
  if (!value) return "";
  return String(value).replace(/\/+$/, "");
};

// Prefer explicit environment config; default to same-origin /api.
export const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL) || "/api";
