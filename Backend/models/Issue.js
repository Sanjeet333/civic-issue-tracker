import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    default: "Uncategorized" 
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  priority: {
    type: String,
    enum: ["High", "Low"],
    default: "Low",
  },
  aiSummary: {
    type: String,
    default: "",
    trim: true,
  },
  mediaUrl: {
    type: String,
    default: "", 
  },
  mediaType: {
    type: String,
    enum: ["image", "video", "none"],
    default: "none",
  },
  status: {
    type: String,
    enum: ["Pending", "Investigating", "Resolved", "Invalid", "Withdrawn"],
    default: "Pending",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
  }, 
});

export const Issue = mongoose.model("Issue", issueSchema);