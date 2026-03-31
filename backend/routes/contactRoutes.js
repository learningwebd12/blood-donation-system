const express = require("express");
const router = express.Router();

const {
  createContactMessage,
  getAllContactMessages,
  deleteContactMessage,
} = require("../controllers/contactController");

const auth = require("../middleware/auth");

router.post("/", createContactMessage);

// admin side if needed
router.get("/", auth, getAllContactMessages);
router.delete("/:id", auth, deleteContactMessage);

module.exports = router;
