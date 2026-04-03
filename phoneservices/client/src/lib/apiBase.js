const normalizeApiBase = (value) => {
  if (!value) return "";
  const trimmed = String(value).replace(/\/+$/, "");
  if (trimmed.endsWith("/api")) return trimmed;
  return `${trimmed}/api`;
};

// Prefer explicit environment config; default to same-origin /api.
export const API_BASE =
  normalizeApiBase(import.meta.env.REACT_APP_API_URL || import.meta.env.VITE_API_BASE_URL) || "/api";
