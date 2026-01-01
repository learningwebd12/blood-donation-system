const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
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
    require: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    unique: true,
    minLength: 6,
  },
  role: {
    type: String,
    enum: ["donor", "patient", "admin"],
    default: "donor",
  },

  timestamps: true,
});
