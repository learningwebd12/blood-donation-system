const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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

    // ✅ USER TYPE (DONOR by default)
    userType: {
      type: [String],
      enum: ["donor", "receiver"],
      default: ["donor"],
    },

    // ✅ BLOOD TYPE (needed for donors)
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    // ✅ LOCATION
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
      },
    },

    // ✅ HEALTH INFO (for donors)
    healthInfo: {
      age: Number,
      weight: Number,
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },
      medicalConditions: [String],
      isEligible: {
        type: Boolean,
        default: true,
      },
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
  { timestamps: true },
);

// ✅ VIRTUAL FIELD
userSchema.virtual("canDonate").get(function () {
  if (!this.lastDonationDate) return true;

  const days = Math.floor(
    (Date.now() - this.lastDonationDate) / (1000 * 60 * 60 * 24),
  );
  return days >= 90;
});

module.exports = mongoose.model("User", userSchema);
