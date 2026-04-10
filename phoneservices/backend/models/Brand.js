import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    types: [{ type: String, required: true }],
    logoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);
