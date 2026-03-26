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
