export const brands = [
  { id: "apple", name: "Apple", types: ["smartphone", "tablet", "laptop"] },
  { id: "samsung", name: "Samsung", types: ["smartphone", "tablet", "laptop"] },
  { id: "huawei", name: "Huawei", types: ["smartphone", "tablet", "laptop"] },
  { id: "xiaomi", name: "Xiaomi", types: ["smartphone", "tablet", "laptop"] },
  { id: "oneplus", name: "OnePlus", types: ["smartphone"] },
  { id: "google", name: "Google", types: ["smartphone", "tablet"] },
  { id: "sony", name: "Sony", types: ["smartphone", "tablet"] },
  { id: "lg", name: "LG", types: ["smartphone", "tablet"] },
  { id: "motorola", name: "Motorola", types: ["smartphone"] },
  { id: "nokia", name: "Nokia", types: ["smartphone", "tablet"] },
  { id: "oppo", name: "OPPO", types: ["smartphone", "tablet"] },
  { id: "vivo", name: "Vivo", types: ["smartphone"] },
  { id: "realme", name: "Realme", types: ["smartphone"] },
  { id: "asus", name: "Asus", types: ["smartphone", "tablet", "laptop"] },
  { id: "lenovo", name: "Lenovo", types: ["smartphone", "tablet", "laptop"] },
  { id: "hp", name: "HP", types: ["laptop", "tablet"] },
  { id: "dell", name: "Dell", types: ["laptop"] },
  { id: "microsoft", name: "Microsoft", types: ["tablet", "laptop"] },
  { id: "amazon", name: "Amazon", types: ["tablet"] },
  { id: "tcl", name: "TCL", types: ["smartphone", "tablet"] },
  { id: "zte", name: "ZTE", types: ["smartphone"] },
  { id: "infinix", name: "Infinix", types: ["smartphone"] },
  { id: "tecno", name: "Tecno", types: ["smartphone"] },
  { id: "itel", name: "iTel", types: ["smartphone"] },
  { id: "meizu", name: "Meizu", types: ["smartphone"] },
  { id: "poco", name: "POCO", types: ["smartphone"] },
  { id: "honor", name: "Honor", types: ["smartphone", "tablet"] },
  { id: "nothing", name: "Nothing", types: ["smartphone"] },
  { id: "fairphone", name: "Fairphone", types: ["smartphone"] },
  { id: "blackberry", name: "BlackBerry", types: ["smartphone"] },
];

export const deviceTypes = [
  { id: "smartphone", label: "Smartphone", desc: "iPhone, Samsung, Xiaomi & more" },
  { id: "tablet", label: "Tablet", desc: "iPad, Galaxy Tab, Surface & more" },
  { id: "laptop", label: "Laptop", desc: "MacBook, Dell, HP & more" },
];

export const models = [
  // Apple iPhones
  { id: "iphone-17-pro-max", brandId: "apple", name: "iPhone 17 Pro Max", modelCode: "A3526", type: "smartphone", year: 2025 },
  { id: "iphone-17-pro", brandId: "apple", name: "iPhone 17 Pro", modelCode: "A3523", type: "smartphone", year: 2025 },
  { id: "iphone-17-air", brandId: "apple", name: "iPhone 17 Air", modelCode: "A3517", type: "smartphone", year: 2025 },
  { id: "iphone-17", brandId: "apple", name: "iPhone 17", modelCode: "A3520", type: "smartphone", year: 2025 },
  { id: "iphone-16-pro-max", brandId: "apple", name: "iPhone 16 Pro Max", modelCode: "A3296", type: "smartphone", year: 2024 },
  { id: "iphone-16-pro", brandId: "apple", name: "iPhone 16 Pro", modelCode: "A3293", type: "smartphone", year: 2024 },
  { id: "iphone-16-plus", brandId: "apple", name: "iPhone 16 Plus", modelCode: "A3290", type: "smartphone", year: 2024 },
  { id: "iphone-16", brandId: "apple", name: "iPhone 16", modelCode: "A3287", type: "smartphone", year: 2024 },
  { id: "iphone-16e", brandId: "apple", name: "iPhone 16e", modelCode: "A3212", type: "smartphone", year: 2025 },
  { id: "iphone-15-pro-max", brandId: "apple", name: "iPhone 15 Pro Max", modelCode: "A3105", type: "smartphone", year: 2023 },
  { id: "iphone-15-pro", brandId: "apple", name: "iPhone 15 Pro", modelCode: "A3102", type: "smartphone", year: 2023 },
  { id: "iphone-15-plus", brandId: "apple", name: "iPhone 15 Plus", modelCode: "A3094", type: "smartphone", year: 2023 },
  { id: "iphone-15", brandId: "apple", name: "iPhone 15", modelCode: "A3090", type: "smartphone", year: 2023 },
  { id: "iphone-14-pro-max", brandId: "apple", name: "iPhone 14 Pro Max", modelCode: "A2894", type: "smartphone", year: 2022 },
  { id: "iphone-14-pro", brandId: "apple", name: "iPhone 14 Pro", modelCode: "A2890", type: "smartphone", year: 2022 },
  { id: "iphone-14-plus", brandId: "apple", name: "iPhone 14 Plus", modelCode: "A2886", type: "smartphone", year: 2022 },
  { id: "iphone-14", brandId: "apple", name: "iPhone 14", modelCode: "A2882", type: "smartphone", year: 2022 },
  { id: "iphone-13-pro-max", brandId: "apple", name: "iPhone 13 Pro Max", modelCode: "A2643", type: "smartphone", year: 2021 },
  { id: "iphone-13-pro", brandId: "apple", name: "iPhone 13 Pro", modelCode: "A2639", type: "smartphone", year: 2021 },
  { id: "iphone-13", brandId: "apple", name: "iPhone 13", modelCode: "A2633", type: "smartphone", year: 2021 },
  { id: "iphone-13-mini", brandId: "apple", name: "iPhone 13 Mini", modelCode: "A2628", type: "smartphone", year: 2021 },
  { id: "iphone-12-pro-max", brandId: "apple", name: "iPhone 12 Pro Max", modelCode: "A2342", type: "smartphone", year: 2020 },
  { id: "iphone-12-pro", brandId: "apple", name: "iPhone 12 Pro", modelCode: "A2341", type: "smartphone", year: 2020 },
  { id: "iphone-12", brandId: "apple", name: "iPhone 12", modelCode: "A2172", type: "smartphone", year: 2020 },
  { id: "iphone-12-mini", brandId: "apple", name: "iPhone 12 Mini", modelCode: "A2176", type: "smartphone", year: 2020 },
  { id: "iphone-11-pro-max", brandId: "apple", name: "iPhone 11 Pro Max", modelCode: "A2218", type: "smartphone", year: 2019 },
  { id: "iphone-11-pro", brandId: "apple", name: "iPhone 11 Pro", modelCode: "A2160", type: "smartphone", year: 2019 },
  { id: "iphone-11", brandId: "apple", name: "iPhone 11", modelCode: "A2111", type: "smartphone", year: 2019 },
  { id: "iphone-xs-max", brandId: "apple", name: "iPhone XS Max", modelCode: "A2101", type: "smartphone", year: 2018 },
  { id: "iphone-xs", brandId: "apple", name: "iPhone XS", modelCode: "A2097", type: "smartphone", year: 2018 },
  { id: "iphone-xr", brandId: "apple", name: "iPhone XR", modelCode: "A2105", type: "smartphone", year: 2018 },
  { id: "iphone-x", brandId: "apple", name: "iPhone X", modelCode: "A1901", type: "smartphone", year: 2017 },
  { id: "iphone-8-plus", brandId: "apple", name: "iPhone 8 Plus", modelCode: "A1897", type: "smartphone", year: 2017 },
  { id: "iphone-8", brandId: "apple", name: "iPhone 8", modelCode: "A1905", type: "smartphone", year: 2017 },
  { id: "iphone-se-3", brandId: "apple", name: "iPhone SE (3rd gen)", modelCode: "A2595", type: "smartphone", year: 2022 },
  { id: "iphone-se-2", brandId: "apple", name: "iPhone SE (2nd gen)", modelCode: "A2275", type: "smartphone", year: 2020 },
  // Apple iPads
  { id: "ipad-pro-12-9-2022", brandId: "apple", name: 'iPad Pro 12.9" (2022)', modelCode: "A2764", type: "tablet", year: 2022 },
  { id: "ipad-pro-11-2022", brandId: "apple", name: 'iPad Pro 11" (2022)', modelCode: "A2759", type: "tablet", year: 2022 },
  { id: "ipad-air-5", brandId: "apple", name: "iPad Air 5th gen", modelCode: "A2588", type: "tablet", year: 2022 },
  { id: "ipad-10", brandId: "apple", name: "iPad 10th gen", modelCode: "A2696", type: "tablet", year: 2022 },
  { id: "ipad-mini-6", brandId: "apple", name: "iPad Mini 6th gen", modelCode: "A2567", type: "tablet", year: 2021 },
  // Apple Macs
  { id: "macbook-pro-14-2023", brandId: "apple", name: 'MacBook Pro 14" (2023)', modelCode: "A2779", type: "laptop", year: 2023 },
  { id: "macbook-pro-16-2023", brandId: "apple", name: 'MacBook Pro 16" (2023)', modelCode: "A2780", type: "laptop", year: 2023 },
  { id: "macbook-air-m2", brandId: "apple", name: "MacBook Air M2", modelCode: "A2681", type: "laptop", year: 2022 },
  { id: "macbook-air-m1", brandId: "apple", name: "MacBook Air M1", modelCode: "A2337", type: "laptop", year: 2020 },

  // Samsung Smartphones
  { id: "s24-ultra", brandId: "samsung", name: "Galaxy S24 Ultra", modelCode: "SM-S928B", type: "smartphone", year: 2024 },
  { id: "s24-plus", brandId: "samsung", name: "Galaxy S24+", modelCode: "SM-S926B", type: "smartphone", year: 2024 },
  { id: "s24", brandId: "samsung", name: "Galaxy S24", modelCode: "SM-S921B", type: "smartphone", year: 2024 },
  { id: "s23-ultra", brandId: "samsung", name: "Galaxy S23 Ultra", modelCode: "SM-S918B", type: "smartphone", year: 2023 },
  { id: "s23-plus", brandId: "samsung", name: "Galaxy S23+", modelCode: "SM-S916B", type: "smartphone", year: 2023 },
  { id: "s23", brandId: "samsung", name: "Galaxy S23", modelCode: "SM-S911B", type: "smartphone", year: 2023 },
  { id: "s22-ultra", brandId: "samsung", name: "Galaxy S22 Ultra", modelCode: "SM-S908B", type: "smartphone", year: 2022 },
  { id: "s22-plus", brandId: "samsung", name: "Galaxy S22+", modelCode: "SM-S906B", type: "smartphone", year: 2022 },
  { id: "s22", brandId: "samsung", name: "Galaxy S22", modelCode: "SM-S901B", type: "smartphone", year: 2022 },
  { id: "s21-ultra", brandId: "samsung", name: "Galaxy S21 Ultra", modelCode: "SM-G998B", type: "smartphone", year: 2021 },
  { id: "s21-fe", brandId: "samsung", name: "Galaxy S21 FE", modelCode: "SM-G990B", type: "smartphone", year: 2022 },
  { id: "z-fold-5", brandId: "samsung", name: "Galaxy Z Fold 5", modelCode: "SM-F946B", type: "smartphone", year: 2023 },
  { id: "z-flip-5", brandId: "samsung", name: "Galaxy Z Flip 5", modelCode: "SM-F731B", type: "smartphone", year: 2023 },
  { id: "z-fold-4", brandId: "samsung", name: "Galaxy Z Fold 4", modelCode: "SM-F936B", type: "smartphone", year: 2022 },
  { id: "z-flip-4", brandId: "samsung", name: "Galaxy Z Flip 4", modelCode: "SM-F721B", type: "smartphone", year: 2022 },
  { id: "a54", brandId: "samsung", name: "Galaxy A54", modelCode: "SM-A546B", type: "smartphone", year: 2023 },
  { id: "a53", brandId: "samsung", name: "Galaxy A53", modelCode: "SM-A536B", type: "smartphone", year: 2022 },
  { id: "a34", brandId: "samsung", name: "Galaxy A34", modelCode: "SM-A346B", type: "smartphone", year: 2023 },
  { id: "a14", brandId: "samsung", name: "Galaxy A14", modelCode: "SM-A145R", type: "smartphone", year: 2023 },
  { id: "m54", brandId: "samsung", name: "Galaxy M54", modelCode: "SM-M546B", type: "smartphone", year: 2023 },
  // Samsung tablets
  { id: "tab-s9-ultra", brandId: "samsung", name: "Galaxy Tab S9 Ultra", modelCode: "SM-X916B", type: "tablet", year: 2023 },
  { id: "tab-s9-plus", brandId: "samsung", name: "Galaxy Tab S9+", modelCode: "SM-X816B", type: "tablet", year: 2023 },
  { id: "tab-s9", brandId: "samsung", name: "Galaxy Tab S9", modelCode: "SM-X710", type: "tablet", year: 2023 },
  { id: "tab-s8-ultra", brandId: "samsung", name: "Galaxy Tab S8 Ultra", modelCode: "SM-X900", type: "tablet", year: 2022 },
  { id: "tab-a8", brandId: "samsung", name: "Galaxy Tab A8", modelCode: "SM-X200", type: "tablet", year: 2022 },
  // Samsung laptops
  { id: "galaxy-book3-pro", brandId: "samsung", name: "Galaxy Book3 Pro", modelCode: "NP960XFG", type: "laptop", year: 2023 },
  { id: "galaxy-book3-360", brandId: "samsung", name: "Galaxy Book3 360", modelCode: "NP730QFG", type: "laptop", year: 2023 },

  // Xiaomi Smartphones
  { id: "xiaomi-14-ultra", brandId: "xiaomi", name: "Xiaomi 14 Ultra", modelCode: "2401099C", type: "smartphone", year: 2024 },
  { id: "xiaomi-14-pro", brandId: "xiaomi", name: "Xiaomi 14 Pro", modelCode: "23116PN5BC", type: "smartphone", year: 2023 },
  { id: "xiaomi-14", brandId: "xiaomi", name: "Xiaomi 14", modelCode: "23127PN0CC", type: "smartphone", year: 2023 },
  { id: "xiaomi-13-ultra", brandId: "xiaomi", name: "Xiaomi 13 Ultra", modelCode: "2304FPN6DC", type: "smartphone", year: 2023 },
  { id: "xiaomi-13-pro", brandId: "xiaomi", name: "Xiaomi 13 Pro", modelCode: "2210132C", type: "smartphone", year: 2023 },
  { id: "xiaomi-13", brandId: "xiaomi", name: "Xiaomi 13", modelCode: "2211133C", type: "smartphone", year: 2023 },
  { id: "redmi-note-13-pro", brandId: "xiaomi", name: "Redmi Note 13 Pro+", modelCode: "23090RA98G", type: "smartphone", year: 2023 },
  { id: "redmi-note-13", brandId: "xiaomi", name: "Redmi Note 13", modelCode: "23090RA98C", type: "smartphone", year: 2023 },
  { id: "redmi-12", brandId: "xiaomi", name: "Redmi 12", modelCode: "23053RN02Y", type: "smartphone", year: 2023 },
  { id: "xiaomi-12t-pro", brandId: "xiaomi", name: "Xiaomi 12T Pro", modelCode: "22081212UG", type: "smartphone", year: 2022 },

  // Huawei
  { id: "p60-pro", brandId: "huawei", name: "P60 Pro", modelCode: "MNA-AL00", type: "smartphone", year: 2023 },
  { id: "p50-pro", brandId: "huawei", name: "P50 Pro", modelCode: "JAD-AL50", type: "smartphone", year: 2021 },
  { id: "mate-60-pro", brandId: "huawei", name: "Mate 60 Pro", modelCode: "BRA-AL00", type: "smartphone", year: 2023 },
  { id: "nova-11-pro", brandId: "huawei", name: "Nova 11 Pro", modelCode: "GOA-AL80", type: "smartphone", year: 2023 },
  { id: "matepad-pro-13", brandId: "huawei", name: "MatePad Pro 13.2", modelCode: "PCE-W30", type: "tablet", year: 2023 },
  { id: "matebook-x-pro", brandId: "huawei", name: "MateBook X Pro", modelCode: "MRGF-X", type: "laptop", year: 2023 },

  // OnePlus
  { id: "op-12", brandId: "oneplus", name: "OnePlus 12", modelCode: "CPH2581", type: "smartphone", year: 2024 },
  { id: "op-12r", brandId: "oneplus", name: "OnePlus 12R", modelCode: "CPH2609", type: "smartphone", year: 2024 },
  { id: "op-11", brandId: "oneplus", name: "OnePlus 11", modelCode: "CPH2449", type: "smartphone", year: 2023 },
  { id: "op-nord-3", brandId: "oneplus", name: "OnePlus Nord 3", modelCode: "CPH2493", type: "smartphone", year: 2023 },
  { id: "op-nord-ce3", brandId: "oneplus", name: "OnePlus Nord CE 3", modelCode: "CPH2533", type: "smartphone", year: 2023 },
  { id: "op-open", brandId: "oneplus", name: "OnePlus Open", modelCode: "CPH2551", type: "smartphone", year: 2023 },

  // Google
  { id: "pixel-8-pro", brandId: "google", name: "Pixel 8 Pro", modelCode: "GC3VE", type: "smartphone", year: 2023 },
  { id: "pixel-8", brandId: "google", name: "Pixel 8", modelCode: "GKWS6", type: "smartphone", year: 2023 },
  { id: "pixel-7a", brandId: "google", name: "Pixel 7a", modelCode: "GWKK3", type: "smartphone", year: 2023 },
  { id: "pixel-7-pro", brandId: "google", name: "Pixel 7 Pro", modelCode: "GE2AE", type: "smartphone", year: 2022 },
  { id: "pixel-7", brandId: "google", name: "Pixel 7", modelCode: "GVU6C", type: "smartphone", year: 2022 },
  { id: "pixel-6a", brandId: "google", name: "Pixel 6a", modelCode: "GX7AS", type: "smartphone", year: 2022 },
  { id: "pixel-tablet", brandId: "google", name: "Pixel Tablet", modelCode: "G0B8X", type: "tablet", year: 2023 },

  // Sony
  { id: "xperia-1-v", brandId: "sony", name: "Xperia 1 V", modelCode: "XQ-DQ54", type: "smartphone", year: 2023 },
  { id: "xperia-5-v", brandId: "sony", name: "Xperia 5 V", modelCode: "XQ-DE54", type: "smartphone", year: 2023 },
  { id: "xperia-10-v", brandId: "sony", name: "Xperia 10 V", modelCode: "XQ-DC54", type: "smartphone", year: 2023 },
  { id: "xperia-1-iv", brandId: "sony", name: "Xperia 1 IV", modelCode: "XQ-CT54", type: "smartphone", year: 2022 },

  // LG
  { id: "lg-wing", brandId: "lg", name: "LG Wing", modelCode: "LM-F100N", type: "smartphone", year: 2020 },
  { id: "lg-velvet", brandId: "lg", name: "LG Velvet", modelCode: "LM-G900", type: "smartphone", year: 2020 },
  { id: "lg-v60", brandId: "lg", name: "LG V60 ThinQ", modelCode: "LM-V600", type: "smartphone", year: 2020 },

  // Motorola
  { id: "moto-edge-40-pro", brandId: "motorola", name: "Edge 40 Pro", modelCode: "XT2301-5", type: "smartphone", year: 2023 },
  { id: "moto-edge-40", brandId: "motorola", name: "Edge 40", modelCode: "XT2303-2", type: "smartphone", year: 2023 },
  { id: "moto-g84", brandId: "motorola", name: "Moto G84", modelCode: "XT2347-1", type: "smartphone", year: 2023 },
  { id: "moto-g73", brandId: "motorola", name: "Moto G73", modelCode: "XT2237-2", type: "smartphone", year: 2023 },
  { id: "razr-40-ultra", brandId: "motorola", name: "Razr 40 Ultra", modelCode: "XT2321-1", type: "smartphone", year: 2023 },

  // Nokia
  { id: "nokia-g60", brandId: "nokia", name: "Nokia G60 5G", modelCode: "TA-1492", type: "smartphone", year: 2022 },
  { id: "nokia-x30", brandId: "nokia", name: "Nokia X30", modelCode: "TA-1450", type: "smartphone", year: 2022 },
  { id: "nokia-g22", brandId: "nokia", name: "Nokia G22", modelCode: "TA-1528", type: "smartphone", year: 2023 },
  { id: "nokia-c32", brandId: "nokia", name: "Nokia C32", modelCode: "TA-1534", type: "smartphone", year: 2023 },

  // OPPO
  { id: "oppo-find-x6-pro", brandId: "oppo", name: "Find X6 Pro", modelCode: "PGEM10", type: "smartphone", year: 2023 },
  { id: "oppo-reno10-pro", brandId: "oppo", name: "Reno 10 Pro+", modelCode: "CPH2525", type: "smartphone", year: 2023 },
  { id: "oppo-reno10", brandId: "oppo", name: "Reno 10", modelCode: "CPH2531", type: "smartphone", year: 2023 },
  { id: "oppo-a98", brandId: "oppo", name: "Oppo A98", modelCode: "CPH2529", type: "smartphone", year: 2023 },

  // Vivo
  { id: "vivo-x90-pro", brandId: "vivo", name: "Vivo X90 Pro", modelCode: "V2241A", type: "smartphone", year: 2023 },
  { id: "vivo-v29-pro", brandId: "vivo", name: "Vivo V29 Pro", modelCode: "V2250", type: "smartphone", year: 2023 },
  { id: "vivo-y100", brandId: "vivo", name: "Vivo Y100", modelCode: "V2309", type: "smartphone", year: 2023 },

  // Realme
  { id: "realme-11-pro", brandId: "realme", name: "Realme 11 Pro+", modelCode: "RMX3741", type: "smartphone", year: 2023 },
  { id: "realme-gt5", brandId: "realme", name: "Realme GT5", modelCode: "RMX3706", type: "smartphone", year: 2023 },
  { id: "realme-narzo-60-pro", brandId: "realme", name: "Narzo 60 Pro", modelCode: "RMX3762", type: "smartphone", year: 2023 },

  // POCO
  { id: "poco-x5-pro", brandId: "poco", name: "POCO X5 Pro", modelCode: "22101320G", type: "smartphone", year: 2023 },
  { id: "poco-f5-pro", brandId: "poco", name: "POCO F5 Pro", modelCode: "23013PC75G", type: "smartphone", year: 2023 },
  { id: "poco-m5", brandId: "poco", name: "POCO M5", modelCode: "22071219CG", type: "smartphone", year: 2022 },

  // Honor
  { id: "honor-magic6-pro", brandId: "honor", name: "Honor Magic6 Pro", modelCode: "ALT-AN00", type: "smartphone", year: 2024 },
  { id: "honor-90-pro", brandId: "honor", name: "Honor 90 Pro", modelCode: "REP-AN00", type: "smartphone", year: 2023 },
  { id: "honor-x8b", brandId: "honor", name: "Honor X8b", modelCode: "ALI-NX1", type: "smartphone", year: 2023 },

  // Nothing
  { id: "nothing-phone-2", brandId: "nothing", name: "Nothing Phone (2)", modelCode: "A065", type: "smartphone", year: 2023 },
  { id: "nothing-phone-1", brandId: "nothing", name: "Nothing Phone (1)", modelCode: "A063", type: "smartphone", year: 2022 },

  // Asus
  { id: "rog-phone-7-ultimate", brandId: "asus", name: "ROG Phone 7 Ultimate", modelCode: "AI2205", type: "smartphone", year: 2023 },
  { id: "zenfone-10", brandId: "asus", name: "Zenfone 10", modelCode: "AI2302", type: "smartphone", year: 2023 },
  { id: "rog-phone-8-pro", brandId: "asus", name: "ROG Phone 8 Pro", modelCode: "AI2401", type: "smartphone", year: 2024 },
  { id: "zenpad-3s", brandId: "asus", name: "ZenPad 3S 10", modelCode: "Z500M", type: "tablet", year: 2016 },
  { id: "vivobook-s14", brandId: "asus", name: "VivoBook S14", modelCode: "S3402ZA", type: "laptop", year: 2022 },
  { id: "zenbook-pro", brandId: "asus", name: "ZenBook Pro 14", modelCode: "UX6404VI", type: "laptop", year: 2023 },

  // Lenovo
  { id: "legion-phone-duel-2", brandId: "lenovo", name: "Legion Phone Duel 2", modelCode: "L70081", type: "smartphone", year: 2021 },
  { id: "tab-p12-pro", brandId: "lenovo", name: "Tab P12 Pro", modelCode: "TB-Q706F", type: "tablet", year: 2022 },
  { id: "tab-extreme", brandId: "lenovo", name: "Tab Extreme", modelCode: "TB-X705F", type: "tablet", year: 2023 },
  { id: "thinkpad-x1-carbon", brandId: "lenovo", name: "ThinkPad X1 Carbon Gen 11", modelCode: "21HM000B", type: "laptop", year: 2023 },
  { id: "ideapad-5-pro", brandId: "lenovo", name: "IdeaPad 5 Pro", modelCode: "82SN", type: "laptop", year: 2022 },

  // HP
  { id: "hp-spectre-x360", brandId: "hp", name: "Spectre x360 14", modelCode: "14-ef2013dx", type: "laptop", year: 2023 },
  { id: "hp-envy-x360", brandId: "hp", name: "Envy x360 15", modelCode: "15-fe0013dx", type: "laptop", year: 2023 },
  { id: "hp-pavilion-15", brandId: "hp", name: "Pavilion 15", modelCode: "15-eh3047nr", type: "laptop", year: 2023 },
  { id: "hp-elitebook-840", brandId: "hp", name: "EliteBook 840 G10", modelCode: "6T1A4EA", type: "laptop", year: 2023 },

  // Dell
  { id: "dell-xps-15", brandId: "dell", name: "XPS 15", modelCode: "9530", type: "laptop", year: 2023 },
  { id: "dell-xps-13", brandId: "dell", name: "XPS 13 Plus", modelCode: "9320", type: "laptop", year: 2023 },
  { id: "dell-inspiron-15", brandId: "dell", name: "Inspiron 15", modelCode: "3530", type: "laptop", year: 2023 },
  { id: "dell-latitude-5540", brandId: "dell", name: "Latitude 5540", modelCode: "5540", type: "laptop", year: 2023 },

  // Microsoft
  { id: "surface-pro-9", brandId: "microsoft", name: "Surface Pro 9", modelCode: "QIL-00001", type: "tablet", year: 2022 },
  { id: "surface-laptop-5", brandId: "microsoft", name: "Surface Laptop 5", modelCode: "RBH-00001", type: "laptop", year: 2022 },
  { id: "surface-go-3", brandId: "microsoft", name: "Surface Go 3", modelCode: "8V6-00001", type: "tablet", year: 2021 },

  // Amazon
  { id: "fire-hd-10", brandId: "amazon", name: "Fire HD 10", modelCode: "B08BX7FV5L", type: "tablet", year: 2021 },
  { id: "fire-hd-8", brandId: "amazon", name: "Fire HD 8", modelCode: "B099Z8LPLM", type: "tablet", year: 2022 },
  { id: "fire-max-11", brandId: "amazon", name: "Fire Max 11", modelCode: "B0BL5M5C4X", type: "tablet", year: 2023 },

  // TCL
  { id: "tcl-20-pro", brandId: "tcl", name: "TCL 20 Pro 5G", modelCode: "T781H", type: "smartphone", year: 2021 },
  { id: "tcl-40-se", brandId: "tcl", name: "TCL 40 SE", modelCode: "T610K", type: "smartphone", year: 2023 },

  // ZTE
  { id: "zte-axon-40", brandId: "zte", name: "Axon 40 Ultra", modelCode: "A2023P", type: "smartphone", year: 2022 },
  { id: "zte-blade-v40", brandId: "zte", name: "Blade V40 Pro", modelCode: "V40Pro", type: "smartphone", year: 2022 },

  // Infinix
  { id: "infinix-zero-30", brandId: "infinix", name: "Zero 30 5G", modelCode: "X6731B", type: "smartphone", year: 2023 },
  { id: "infinix-hot-30", brandId: "infinix", name: "Hot 30 Play", modelCode: "X6835B", type: "smartphone", year: 2023 },

  // Tecno
  { id: "tecno-phantom-x2", brandId: "tecno", name: "Phantom X2 Pro", modelCode: "AD10Pro", type: "smartphone", year: 2023 },
  { id: "tecno-camon-20", brandId: "tecno", name: "Camon 20 Pro", modelCode: "CK7n", type: "smartphone", year: 2023 },

  // Fairphone
  { id: "fairphone-5", brandId: "fairphone", name: "Fairphone 5", modelCode: "FP5", type: "smartphone", year: 2023 },
  { id: "fairphone-4", brandId: "fairphone", name: "Fairphone 4", modelCode: "FP4", type: "smartphone", year: 2021 },

  // BlackBerry
  { id: "bb-key2", brandId: "blackberry", name: "BlackBerry KEY2", modelCode: "BBF100-2", type: "smartphone", year: 2018 },
];

const STORAGE_KEY = "phoneservices.catalog.v1";

const clone = (value) => JSON.parse(JSON.stringify(value));

const getDefaultCatalog = () => ({
  deviceTypes: clone(deviceTypes),
  brands: clone(brands),
  models: clone(models),
});

const normalizeCatalog = (raw) => {
  if (!raw || typeof raw !== "object") return getDefaultCatalog();
  const defaults = getDefaultCatalog();
  return {
    deviceTypes: Array.isArray(raw.deviceTypes) ? raw.deviceTypes : defaults.deviceTypes,
    brands: Array.isArray(raw.brands) ? raw.brands : defaults.brands,
    models: Array.isArray(raw.models) ? raw.models : defaults.models,
  };
};

export const getCatalog = () => {
  if (typeof window === "undefined") return getDefaultCatalog();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultCatalog();
    return normalizeCatalog(JSON.parse(raw));
  } catch {
    return getDefaultCatalog();
  }
};

export const saveCatalog = (catalog) => {
  if (typeof window === "undefined") return;
  const normalized = normalizeCatalog(catalog);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent("catalog-updated"));
};

export const resetCatalog = () => {
  saveCatalog(getDefaultCatalog());
};

export const getDeviceTypes = () => getCatalog().deviceTypes;
export const getBrands = () => getCatalog().brands;
export const getModels = () => getCatalog().models;

export const addDeviceType = (device) => {
  const catalog = getCatalog();
  catalog.deviceTypes.push(device);
  saveCatalog(catalog);
};

export const updateDeviceType = (id, updates) => {
  const catalog = getCatalog();
  catalog.deviceTypes = catalog.deviceTypes.map((d) => (d.id === id ? { ...d, ...updates } : d));
  saveCatalog(catalog);
};

export const deleteDeviceType = (id) => {
  const catalog = getCatalog();
  catalog.deviceTypes = catalog.deviceTypes.filter((d) => d.id !== id);
  catalog.brands = catalog.brands.map((b) => ({ ...b, types: (b.types || []).filter((t) => t !== id) }));
  catalog.models = catalog.models.filter((m) => m.type !== id);
  saveCatalog(catalog);
};

export const addBrand = (brand) => {
  const catalog = getCatalog();
  catalog.brands.push(brand);
  saveCatalog(catalog);
};

export const updateBrand = (id, updates) => {
  const catalog = getCatalog();
  catalog.brands = catalog.brands.map((b) => (b.id === id ? { ...b, ...updates } : b));
  saveCatalog(catalog);
};

export const deleteBrand = (id) => {
  const catalog = getCatalog();
  catalog.brands = catalog.brands.filter((b) => b.id !== id);
  catalog.models = catalog.models.filter((m) => m.brandId !== id);
  saveCatalog(catalog);
};

export const addModel = (model) => {
  const catalog = getCatalog();
  catalog.models.push(model);
  saveCatalog(catalog);
};

export const updateModel = (id, updates) => {
  const catalog = getCatalog();
  catalog.models = catalog.models.map((m) => (m.id === id ? { ...m, ...updates } : m));
  saveCatalog(catalog);
};

export const deleteModel = (id) => {
  const catalog = getCatalog();
  catalog.models = catalog.models.filter((m) => m.id !== id);
  saveCatalog(catalog);
};

export const getBrandsByType = (deviceType) =>
  getBrands().filter((b) => (b.types || []).includes(deviceType));

export const getModelsByBrandAndType = (brandId, deviceType) =>
  getModels().filter((m) => m.brandId === brandId && m.type === deviceType);

export const searchModels = (query) => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const allModels = getModels();
  const allBrands = getBrands();
  return allModels.filter((m) => {
    const brand = allBrands.find((b) => b.id === m.brandId);
    return (
      m.name.toLowerCase().includes(q) ||
      (m.modelCode && m.modelCode.toLowerCase().includes(q)) ||
      (brand && brand.name.toLowerCase().includes(q))
    );
  });
};
