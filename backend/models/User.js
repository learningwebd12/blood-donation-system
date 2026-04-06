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
      name: "Admin",
      email: "admin@gmail.com",
      role: "admin",
    },

    profileComplete: {
      type: Boolean,
      default: false,
    },

    userType: {
      type: [String],
      enum: ["donor", "receiver"],
      default: ["donor"],
    },

    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

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

    healthInfo: {
      age: Number,
      weight: Number,
      gender: {
        type: String,
        enum: ["male", "Male", "female", "other"],
        lowercase: true,
      },
      medicalConditions: [String],
      isEligible: {
        type: Boolean,
        default: true,
      },
    },

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

    avatar: {
      type: String,
      default: null,
    },

    fcmToken: {
      type: String,
      default: null,
    },

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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("canDonate").get(function () {
  if (!this.lastDonationDate) return true;

  const lastDate = new Date(this.lastDonationDate).getTime();
  const now = Date.now();
  const days = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

  return days >= 90;
});

module.exports = mongoose.model("User", userSchema);
