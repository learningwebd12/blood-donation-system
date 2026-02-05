const express = require("express");
const router = express.Router();
const {
  completeProfile,
  getProfile,
  getLocationData,
} = require("../controllers/profileController");
const auth = require("../middleware/auth"); // ✅ ADD THIS LINE

router.post("/complete", auth, completeProfile);
router.get("/me", auth, getProfile);
router.get("/locations", getLocationData); // No auth needed for public data

module.exports = router;
