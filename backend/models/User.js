const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ✅ PROFILE COMPLETION
    profileComplete: {
      type: Boolean,
      default: false,
    },

    // ✅ USER TYPE (can be both donor and receiver)
    userType: {
      type: [String],
      enum: ["donor", "receiver"],
      default: [],
    },

    // ✅ BLOOD TYPE (required for donors)
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    // ✅ NEPAL LOCATION STRUCTURE
    location: {
      province: {
        type: String,
        enum: [
          "Koshi",
          "Madhesh",
          "Bagmati",
          "Gandaki",
          "Lumbini",
          "Karnali",
          "Sudurpashchim",
        ],
      },
      district: {
        type: String,
        // You can add enum with all 77 districts if needed
      },
      municipality: {
        type: String,
        // e.g., "Kathmandu Metropolitan City", "Lalitpur Metropolitan City"
      },
      municipalityType: {
        type: String,
        enum: [
          "Metropolitan",
          "Sub-Metropolitan",
          "Municipality",
          "Rural Municipality",
        ],
      },
      ward: {
        type: Number,
        min: 1,
        max: 35, // Some municipalities have up to 32-35 wards
      },
      tole: {
        type: String, // Optional: specific locality/tole name
      },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },

    // ✅ HEALTH INFO (for donors)
    healthInfo: {
      age: { type: Number },
      weight: { type: Number }, // in kg
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },
      medicalConditions: [String],
      isEligible: { type: Boolean, default: true },
    },

    // ✅ DONOR STATUS
    isAvailable: {
      type: Boolean,
      default: true,
    },
    lastDonationDate: {
      type: Date,
      default: null,
    },
    totalDonations: {
      type: Number,
      default: 0,
    },

    // ✅ PROFILE
    avatar: {
      type: String,
      default: null,
    },

    // ✅ NOTIFICATION SETTINGS
    notificationSettings: {
      pushEnabled: { type: Boolean, default: true },
      urgentRequests: { type: Boolean, default: true },
      nearbyRequests: { type: Boolean, default: true },
    },

    fcmToken: {
      type: String,
      default: null,
    },

    // ✅ ACCOUNT STATUS
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for eligibility (can donate after 90 days)
userSchema.virtual("canDonate").get(function () {
  if (!this.lastDonationDate) return true;
  const daysSinceLastDonation = Math.floor(
    (Date.now() - this.lastDonationDate) / (1000 * 60 * 60 * 24)
  );
  return daysSinceLastDonation >= 90;
});

module.exports = mongoose.model("User", userSchema);
