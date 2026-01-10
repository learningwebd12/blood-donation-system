const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
    },

    contact: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
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
      wardNo: {
        type: Number,
        required: true,
      },
      area: {
        type: String,
        required: true,
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    lastDonationDate: {
      type: Date,
    },

    totalDonations: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donor", donorSchema);
