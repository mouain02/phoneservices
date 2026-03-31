import { API_BASE } from "@/lib/apiBase";

const getToken = () => window.localStorage.getItem("phoneservices.admin.accessToken") || "";
const getRefreshToken = () => window.localStorage.getItem("phoneservices.admin.refreshToken") || "";
const setTokens = (token, refreshToken) => {
  if (token) window.localStorage.setItem("phoneservices.admin.accessToken", token);
  if (refreshToken) window.localStorage.setItem("phoneservices.admin.refreshToken", refreshToken);
};
const clearTokens = () => {
  window.localStorage.removeItem("phoneservices.admin.accessToken");
  window.localStorage.removeItem("phoneservices.admin.refreshToken");
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    return false;
  }

  const data = await res.json();
  setTokens(data.token, data.refreshToken);
  return true;
};

const request = async (path, options = {}, retried = false) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (res.status === 401 && !retried) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request(path, options, true);
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const error = new Error(data.message || `Request failed: ${res.status}`);
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const catalogApi = {
  getCatalog: () => request("/catalog"),
  getSiteContent: () => request("/site-content"),
  importCatalog: (catalog) => request("/catalog/import", { method: "POST", body: JSON.stringify(catalog) }),
  resetCatalog: () => request("/catalog/reset", { method: "POST" }),
  resetSiteContent: () => request("/site-content/reset", { method: "POST" }),

  createDeviceType: (payload) => request("/device-types", { method: "POST", body: JSON.stringify(payload) }),
  updateDeviceType: (id, payload) => request(`/device-types/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteDeviceType: (id) => request(`/device-types/${id}`, { method: "DELETE" }),

  createBrand: (payload) => request("/brands", { method: "POST", body: JSON.stringify(payload) }),
  updateBrand: (id, payload) => request(`/brands/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteBrand: (id) => request(`/brands/${id}`, { method: "DELETE" }),

  createModel: (payload) => request("/models", { method: "POST", body: JSON.stringify(payload) }),
  updateModel: (id, payload) => request(`/models/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteModel: (id) => request(`/models/${id}`, { method: "DELETE" }),

  createCarouselSlide: (payload) => request("/site-content/carousel", { method: "POST", body: JSON.stringify(payload) }),
  updateCarouselSlide: (id, payload) => request(`/site-content/carousel/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteCarouselSlide: (id) => request(`/site-content/carousel/${id}`, { method: "DELETE" }),

  createCustomerFeedback: (payload) => request("/site-content/feedback", { method: "POST", body: JSON.stringify(payload) }),
  updateCustomerFeedback: (id, payload) => request(`/site-content/feedback/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteCustomerFeedback: (id) => request(`/site-content/feedback/${id}`, { method: "DELETE" }),

  getAdminUsers: () => request("/auth/users"),
  createAdminUser: (payload) => request("/auth/users", { method: "POST", body: JSON.stringify(payload) }),
  updateAdminUser: (email, payload) => request(`/auth/users/${encodeURIComponent(email)}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteAdminUser: (email) => request(`/auth/users/${encodeURIComponent(email)}`, { method: "DELETE" }),

  uploadImage: (dataUrl, folder = "phoneservices") =>
    request("/uploads/image", {
      method: "POST",
      body: JSON.stringify({ dataUrl, folder }),
    }),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    }).finally(clearTokens),
};
