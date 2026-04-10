import mongoose from "mongoose";

const carouselSlideSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    sub: { type: String, default: "", trim: true },
    imageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const CarouselSlide = mongoose.model("CarouselSlide", carouselSlideSchema);
