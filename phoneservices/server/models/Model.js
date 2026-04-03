import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Brand" },
    name: { type: String, required: true, trim: true },
    modelCode: { type: String, default: "" },
    type: { type: String, required: true, trim: true },
    year: { type: Number },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

modelSchema.index({ brandId: 1, name: 1 });

export const Model = mongoose.model("Model", modelSchema);
