const mongoose = require("mongoose");
const bloodRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "o+", "o-", "AB+", "AB-"],
      required: true,
    },
    unitsRequired: {
      type: Number,
      required: true,
      min: 1,
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    patientName: {
      type: String,
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },

    location: {
      district: {
        type: String,
        required: true,
      },

      municipality: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "fulfilled", "cancelled"],
      default: "pending",
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
    },
    neededBy: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
