const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllRequestsAdmin,
  deleteRequest,
} = require("../controllers/adminController");

const auth = require("../middleware/auth");

router.get("/dashboard", auth, getDashboardStats);
router.get("/users", auth, getAllUsers);
router.delete("/users/:id", auth, deleteUser);
router.get("/requests", auth, getAllRequestsAdmin);
router.delete("/requests/:id", auth, deleteRequest);

module.exports = router;
