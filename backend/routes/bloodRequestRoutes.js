const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createRequest,
  getAllRequests,
  acceptRequest,
  markAsDonated,
  confirmBloodReceived,
  getMyAcceptedRequests,
  getMyRequests,
} = require("../controllers/bloodRequestController");

// Receiver creates new request
router.post("/create", auth, createRequest);

// All visible requests
router.get("/all", auth, getAllRequests);

// Donor accepts request
router.patch("/accept/:id", auth, acceptRequest);

// Donor marks donated
router.patch("/mark-donated/:id", auth, markAsDonated);

// Requester confirms received
router.patch("/confirm-received/:id", auth, confirmBloodReceived);

// Donor completed donation history
router.get("/my-accepted", auth, getMyAcceptedRequests);

// Requester own requests
router.get("/my-requests", auth, getMyRequests);

module.exports = router;
