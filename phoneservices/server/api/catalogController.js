import { asyncHandler } from "../middleware/asyncHandler.js";
import { DeviceType } from "../models/DeviceType.js";
import { Brand } from "../models/Brand.js";
import { Model } from "../models/Model.js";
import { CarouselSlide } from "../models/CarouselSlide.js";
import { CustomerFeedback } from "../models/CustomerFeedback.js";
import {
  brands as defaultBrands,
  deviceTypes as defaultDeviceTypes,
  models as defaultModels,
} from "../../src/components/data/phones.js";

const defaultCarouselSlides = [
  {
    id: "slide-1",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80",
    title: "Expert Screen Repairs",
    sub: "Cracked screen? We replace it on the spot - right at your door.",
  },
  {
    id: "slide-2",
    imageUrl: "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?auto=format&fit=crop&w=1600&q=80",
    title: "We Come to You",
    sub: "Book online, open your door - our technician handles the rest.",
  },
  {
    id: "slide-3",
    imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1600&q=80",
    title: "Precision Every Time",
    sub: "Professional-grade tools and certified parts for every device.",
  },
];

const defaultCustomerFeedback = [
  {
    id: "review-1",
    name: "Sarah M.",
    rating: 5,
    text: "Incredible service! My iPhone screen was cracked and they fixed it in under an hour at my office. Professional and affordable!",
    device: "iPhone 14 Pro",
    date: "2 days ago",
    avatar: "SM",
  },
  {
    id: "review-2",
    name: "James K.",
    rating: 5,
    text: "The technician was so knowledgeable and polite. He replaced my Samsung battery at home while I worked. Saved me so much time!",
    device: "Samsung S23",
    date: "1 week ago",
    avatar: "JK",
  },
  {
    id: "review-3",
    name: "Amina B.",
    rating: 5,
    text: "Door to door service is exactly what busy people need. Quick diagnosis, quick fix, and the 90-day warranty gave me peace of mind.",
    device: "Xiaomi 13 Pro",
    date: "2 weeks ago",
    avatar: "AB",
  },
];

const cleanMongoFields = (doc) => {
  const raw = doc?.toObject ? doc.toObject() : doc;
  if (!raw) return raw;
  const { _id, __v, createdAt, updatedAt, ...rest } = raw;
  return rest;
};

const getCatalogPayload = async () => {
  const [deviceTypes, brands, models] = await Promise.all([
    DeviceType.find().sort({ label: 1 }),
    Brand.find().sort({ name: 1 }),
    Model.find().sort({ name: 1 }),
  ]);

  return {
    deviceTypes: deviceTypes.map(cleanMongoFields),
    brands: brands.map(cleanMongoFields),
    models: models.map(cleanMongoFields),
  };
};

export const getCatalog = asyncHandler(async (req, res) => {
  const payload = await getCatalogPayload();
  res.json(payload);
});

export const importCatalog = asyncHandler(async (req, res) => {
  const { deviceTypes = [], brands = [], models = [] } = req.body || {};

  await Promise.all([
    DeviceType.deleteMany({}),
    Brand.deleteMany({}),
    Model.deleteMany({}),
  ]);

  if (deviceTypes.length) await DeviceType.insertMany(deviceTypes, { ordered: false });
  if (brands.length) await Brand.insertMany(brands, { ordered: false });
  if (models.length) await Model.insertMany(models, { ordered: false });

  const payload = await getCatalogPayload();
  res.status(201).json(payload);
});

export const resetCatalog = asyncHandler(async (req, res) => {
  await Promise.all([
    DeviceType.deleteMany({}),
    Brand.deleteMany({}),
    Model.deleteMany({}),
  ]);

  await DeviceType.insertMany(defaultDeviceTypes, { ordered: false });
  await Brand.insertMany(defaultBrands, { ordered: false });
  await Model.insertMany(defaultModels, { ordered: false });

  const payload = await getCatalogPayload();
  res.json(payload);
});

export const createDeviceType = asyncHandler(async (req, res) => {
  const created = await DeviceType.create(req.body);
  res.status(201).json(cleanMongoFields(created));
});

export const updateDeviceTypeById = asyncHandler(async (req, res) => {
  const updated = await DeviceType.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    res.status(404);
    throw new Error("Device type not found");
  }
  res.json(cleanMongoFields(updated));
});

export const deleteDeviceTypeById = asyncHandler(async (req, res) => {
  const target = await DeviceType.findOne({ id: req.params.id });
  if (!target) {
    res.status(404);
    throw new Error("Device type not found");
  }

  await target.deleteOne();
  await Brand.updateMany({}, { $pull: { types: req.params.id } });
  await Model.deleteMany({ type: req.params.id });

  res.json({ success: true });
});

export const createBrand = asyncHandler(async (req, res) => {
  const created = await Brand.create(req.body);
  res.status(201).json(cleanMongoFields(created));
});

export const updateBrandById = asyncHandler(async (req, res) => {
  const updated = await Brand.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    res.status(404);
    throw new Error("Brand not found");
  }
  res.json(cleanMongoFields(updated));
});

export const deleteBrandById = asyncHandler(async (req, res) => {
  const target = await Brand.findOne({ id: req.params.id });
  if (!target) {
    res.status(404);
    throw new Error("Brand not found");
  }

  await target.deleteOne();
  await Model.deleteMany({ brandId: req.params.id });

  res.json({ success: true });
});

export const createModel = asyncHandler(async (req, res) => {
  const created = await Model.create(req.body);
  res.status(201).json(cleanMongoFields(created));
});

export const updateModelById = asyncHandler(async (req, res) => {
  const updated = await Model.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    res.status(404);
    throw new Error("Model not found");
  }
  res.json(cleanMongoFields(updated));
});

export const deleteModelById = asyncHandler(async (req, res) => {
  const target = await Model.findOne({ id: req.params.id });
  if (!target) {
    res.status(404);
    throw new Error("Model not found");
  }
  await target.deleteOne();
  res.json({ success: true });
});

const getSiteContentPayload = async () => {
  const [carouselSlides, customerFeedback] = await Promise.all([
    CarouselSlide.find().sort({ createdAt: 1 }),
    CustomerFeedback.find().sort({ createdAt: 1 }),
  ]);

  return {
    carouselSlides: (carouselSlides.length > 0 ? carouselSlides : defaultCarouselSlides).map(cleanMongoFields),
    customerFeedback: (customerFeedback.length > 0 ? customerFeedback : defaultCustomerFeedback).map(cleanMongoFields),
  };
};

export const getSiteContent = asyncHandler(async (req, res) => {
  const payload = await getSiteContentPayload();
  res.json(payload);
});

export const resetSiteContent = asyncHandler(async (req, res) => {
  await Promise.all([CarouselSlide.deleteMany({}), CustomerFeedback.deleteMany({})]);
  await CarouselSlide.insertMany(defaultCarouselSlides, { ordered: false });
  await CustomerFeedback.insertMany(defaultCustomerFeedback, { ordered: false });
  const payload = await getSiteContentPayload();
  res.json(payload);
});

export const createCarouselSlide = asyncHandler(async (req, res) => {
  const created = await CarouselSlide.create(req.body);
  res.status(201).json(cleanMongoFields(created));
});

export const updateCarouselSlideById = asyncHandler(async (req, res) => {
  const updated = await CarouselSlide.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    res.status(404);
    throw new Error("Carousel slide not found");
  }
  res.json(cleanMongoFields(updated));
});

export const deleteCarouselSlideById = asyncHandler(async (req, res) => {
  const target = await CarouselSlide.findOne({ id: req.params.id });
  if (!target) {
    res.status(404);
    throw new Error("Carousel slide not found");
  }
  await target.deleteOne();
  res.json({ success: true });
});

export const createCustomerFeedback = asyncHandler(async (req, res) => {
  const created = await CustomerFeedback.create(req.body);
  res.status(201).json(cleanMongoFields(created));
});

export const updateCustomerFeedbackById = asyncHandler(async (req, res) => {
  const updated = await CustomerFeedback.findOneAndUpdate({ id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) {
    res.status(404);
    throw new Error("Customer feedback not found");
  }
  res.json(cleanMongoFields(updated));
});

export const deleteCustomerFeedbackById = asyncHandler(async (req, res) => {
  const target = await CustomerFeedback.findOne({ id: req.params.id });
  if (!target) {
    res.status(404);
    throw new Error("Customer feedback not found");
  }
  await target.deleteOne();
  res.json({ success: true });
});
