import fs from "node:fs/promises";
import path from "node:path";

const API_KEY = "45082fc8506d6fdff11481b5f4975355d141a24d";
const DEVICE_TYPES = ["smartphone", "tablet", "laptop"];
const DEFAULT_ENDPOINT = process.env.MOBILE_API_ENDPOINT || "https://mobileapi.dev/api/v1/devices";
const PAGE_SIZE = Number(process.env.MOBILE_API_PAGE_SIZE || 100);
const OUTPUT_PATH = path.resolve(process.cwd(), "data", "devices.json");

const isDeviceDataFile = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  const isDataExt = [".json", ".db", ".sqlite", ".sqlite3", ".nedb", ".loki"].includes(ext);
  const hasDeviceHint = /(device|phone|tablet|laptop)/i.test(fileName);
  return isDataExt && hasDeviceHint;
};

const removeOldLocalFiles = async () => {
  const targets = [path.resolve(process.cwd(), "data"), process.cwd()];
  const removed = [];

  for (const dir of targets) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (!isDeviceDataFile(entry.name)) continue;

        const absolutePath = path.join(dir, entry.name);
        // Do not remove package-lock or unrelated project metadata.
        if (/package-lock\.json$/i.test(absolutePath)) continue;

        await fs.unlink(absolutePath);
        removed.push(absolutePath);
      }
    } catch {
      // Ignore missing directories.
    }
  }

  if (removed.length === 0) {
    console.log("No old local device files/databases found.");
    return;
  }

  console.log(`Removed ${removed.length} old local file(s):`);
  for (const file of removed) {
    console.log(`- ${file}`);
  }
};

const firstImageUrl = (device) => {
  if (typeof device?.image === "string" && device.image.trim()) return device.image.trim();

  const images = device?.images;
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      return first.url || first.src || first.image || "";
    }
  }

  if (typeof device?.image_url === "string") return device.image_url;
  if (typeof device?.thumbnail === "string") return device.thumbnail;
  return "";
};

const extractYear = (value) => {
  if (value === undefined || value === null) return null;

  const asText = String(value).trim();
  const asNumber = Number.parseInt(asText, 10);
  if (Number.isInteger(asNumber) && asNumber >= 1990 && asNumber <= 2100) return asNumber;

  const match = asText.match(/(19|20)\d{2}/);
  return match ? Number.parseInt(match[0], 10) : null;
};

const normalizeDevice = (raw, fallbackType) => {
  const deviceType = raw.device_type || raw.type || fallbackType;
  const brand = raw.brand || raw.manufacturer || raw.oem || "";
  const model = raw.model || raw.model_name || raw.device_name || raw.name || "";
  const releaseYear = extractYear(raw.release_year || raw.year || raw.announced || raw.release_date);
  const image = firstImageUrl(raw);

  if (!brand || !model) return null;

  return {
    device_type: String(deviceType || fallbackType),
    brand: String(brand).trim(),
    model: String(model).trim(),
    release_year: releaseYear,
    image: String(image || ""),
  };
};

const getItemsFromPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.devices)) return payload.devices;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const hasNextPage = (payload, currentPage, receivedCount) => {
  const page = payload?.pagination || payload?.meta || payload || {};

  if (typeof page?.next_page === "number") return page.next_page > currentPage;
  if (typeof page?.nextPage === "number") return page.nextPage > currentPage;
  if (typeof page?.next === "string" && page.next) return true;
  if (typeof page?.next === "number") return page.next > currentPage;
  if (typeof page?.has_next === "boolean") return page.has_next;
  if (typeof page?.hasNext === "boolean") return page.hasNext;

  const totalPages = page?.total_pages || page?.totalPages || page?.last_page || page?.pages;
  if (Number.isInteger(totalPages)) return currentPage < totalPages;

  // Fallback pagination heuristic: if page came back full, assume there may be more.
  return receivedCount >= PAGE_SIZE;
};

const fetchPage = async (endpoint, type, page) => {
  const url = new URL(endpoint);
  url.searchParams.set("type", type);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(PAGE_SIZE));

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "x-api-key": API_KEY,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status} for ${url} - ${bodyText.slice(0, 300)}`);
  }

  return response.json();
};

const fetchAllByType = async (type, endpoint) => {
  const all = [];
  let page = 1;

  while (true) {
    console.log(`[${type}] Fetching page ${page}...`);
    const payload = await fetchPage(endpoint, type, page);
    const items = getItemsFromPayload(payload);

    for (const raw of items) {
      const normalized = normalizeDevice(raw, type);
      if (normalized) all.push(normalized);
    }

    console.log(`[${type}] Page ${page} received ${items.length} item(s), kept ${all.length} total.`);

    if (!items.length || !hasNextPage(payload, page, items.length)) {
      break;
    }

    page += 1;
  }

  console.log(`[${type}] Completed with ${all.length} normalized device(s).`);
  return all;
};

const main = async () => {
  console.log("Starting MobileAPI device sync...");
  console.log(`Endpoint: ${DEFAULT_ENDPOINT}`);

  await removeOldLocalFiles();

  const combined = [];
  for (const type of DEVICE_TYPES) {
    const devices = await fetchAllByType(type, DEFAULT_ENDPOINT);
    combined.push(...devices);
  }

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(combined, null, 2)}\n`, "utf8");

  console.log(`Saved ${combined.length} device(s) to ${OUTPUT_PATH}`);
};

main().catch((error) => {
  console.error("Device sync failed:", error.message);
  process.exit(1);
});