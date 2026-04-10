export const parsePrice = (price) => Number(String(price || "").replace(/[^0-9.]/g, "")) || 0;
