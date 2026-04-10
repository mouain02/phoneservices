import mongoose from "mongoose";

const customerFeedbackSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
    device: { type: String, default: "", trim: true },
    date: { type: String, default: "recent", trim: true },
    avatar: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export const CustomerFeedback = mongoose.model("CustomerFeedback", customerFeedbackSchema);
