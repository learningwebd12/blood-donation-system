const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createRequest,
  getAllRequests,
} = require("../controllers/bloodRequestController");

// Receiver creates request
router.post("/create", auth, createRequest);

// Donor views requests (optionally filtered by profile province)
router.get("/all", auth, getAllRequests);

module.exports = router;
