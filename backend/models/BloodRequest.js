const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    units: { type: Number, required: true },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    hospital: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    contactPhone: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "fulfilled"],
      default: "pending",
    },
    location: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
