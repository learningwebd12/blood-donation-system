const User = require("../models/User");
const BloodRequest = require("../models/BloodRequest");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await User.countDocuments({ userType: "donor" });
    const totalReceivers = await User.countDocuments({ userType: "receiver" });

    const totalRequests = await BloodRequest.countDocuments();
    const pendingRequests = await BloodRequest.countDocuments({
      status: "pending",
    });
    const acceptedRequests = await BloodRequest.countDocuments({
      status: "accepted",
    });
    const completedRequests = await BloodRequest.countDocuments({
      status: "completed",
    });
    const criticalRequests = await BloodRequest.countDocuments({
      urgency: "critical",
    });

    const recentRequests = await BloodRequest.find()
      .populate("requester", "name phone")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email userType province district phone createdAt");

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDonors,
        totalReceivers,
        totalRequests,
        pendingRequests,
        acceptedRequests,
        completedRequests,
        criticalRequests,
      },
      recentRequests,
      recentUsers,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;

    let query = {};

    if (role) {
      query.userType = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("name email phone userType bloodType province district createdAt")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load users",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};

exports.getAllRequestsAdmin = async (req, res) => {
  try {
    const { status, urgency, bloodType, search } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (urgency) {
      query.urgency = urgency;
    }

    if (bloodType) {
      query.bloodType = bloodType;
    }

    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: "i" } },
        { hospital: { $regex: search, $options: "i" } },
      ];
    }

    const requests = await BloodRequest.find(query)
      .populate("requester", "name phone")
      .populate("acceptedBy", "name phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get admin requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load requests",
    });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    await BloodRequest.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    console.error("Delete request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete request",
    });
  }
};
