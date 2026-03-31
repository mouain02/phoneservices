import mongoose from "mongoose";

const deviceTypeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    label: { type: String, required: true, trim: true },
    desc: { type: String, default: "" },
    iconUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const DeviceType = mongoose.model("DeviceType", deviceTypeSchema);
