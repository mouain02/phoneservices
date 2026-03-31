import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    brandId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    modelCode: { type: String, default: "" },
    type: { type: String, required: true, trim: true },
    year: { type: Number },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Model = mongoose.model("Model", modelSchema);
