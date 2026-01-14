const express = require("express");
const router = express.Router();
const {
  completeProfile,
  getProfile,
  // getLocationData  // ❌ Comment this out for now
} = require("../controllers/profileController");
const auth = require("../middleware/authMiddleware");

router.post("/complete", auth, completeProfile);
router.get("/me", auth, getProfile);
// router.get("/locations", getLocationData);  // ❌ Comment this out too

module.exports = router;
