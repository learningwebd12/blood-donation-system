// models/BloodRequest.js
const mongoose = require("mongoose");

const BloodRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bloodType: { type: String, required: true },
    units: { type: Number, required: true },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"], // added 'high'
      default: "medium",
    },

    hospital: { type: String },
    district: { type: String },
    province: { type: String },
    contactPhone: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed"],
      default: "pending",
    },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ new field
    location: {
      lat: Number,
      lon: Number,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BloodRequest", BloodRequestSchema);
