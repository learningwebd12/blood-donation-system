const BloodRequest = require("../models/BloodRequest");
const calculateDistance = require("../utils/calculateDistance");

exports.createRequest = async (req, res) => {
  try {
    const {
      bloodType,
      units,
      hospital,
      province,
      district,
      contactPhone,
      urgency,
      location, // lat & lon
    } = req.body;

    if (
      !bloodType ||
      !units ||
      !hospital ||
      !province ||
      !district ||
      !contactPhone ||
      !location?.lat ||
      !location?.lon
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields including location are required",
      });
    }

    const request = await BloodRequest.create({
      requester: req.user.id,
      bloodType,
      units,
      hospital,
      province,
      district,
      contactPhone,
      urgency,
      location,
    });

    res
      .status(201)
      .json({ success: true, message: "Blood request created", request });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const { province } = req.query;
    const userId = req.user.id; // current logged-in donor

    let baseQuery = {
      $or: [{ status: "pending" }, { status: "accepted", acceptedBy: userId }],
    };

    if (province) {
      baseQuery.province = province;
    }

    const requests = await BloodRequest.find(baseQuery)
      .populate("requester", "name phone district province")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Accept a request
exports.acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id; // logged-in user from auth middleware

    const request = await BloodRequest.findById(requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending")
      return res
        .status(400)
        .json({ message: "Request already accepted or completed" });

    request.status = "accepted";
    request.acceptedBy = userId;

    await request.save();

    res.json({ message: "Request accepted successfully", request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Complete a request
exports.completeRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const request = await BloodRequest.findById(requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (
      request.status !== "accepted" ||
      request.acceptedBy.toString() !== userId
    )
      return res
        .status(400)
        .json({ message: "You can only complete requests you accepted" });

    request.status = "completed";
    await request.save();

    res.json({ message: "Request completed successfully", request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyAcceptedRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      acceptedBy: req.user.id,
      status: "accepted",
    }).populate("user acceptedBy", "name phone");

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
