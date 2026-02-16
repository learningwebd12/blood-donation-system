const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createRequest,
  getAllRequests,
  acceptRequest,
  completeRequest,
  getMyAcceptedRequests,
} = require("../controllers/bloodRequestController");

// Receiver creates a new request
router.post("/create", auth, createRequest);

// Donor or receiver fetches requests (optional: filter by province)
router.get("/all", auth, getAllRequests);

// Donor accepts a request
router.patch("/accept/:id", auth, acceptRequest);

// Donor completes a request
router.patch("/complete/:id", auth, completeRequest);
router.get("/my-accepted", auth, getMyAcceptedRequests);

module.exports = router;
