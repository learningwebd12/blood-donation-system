const BloodRequest = require("../models/BloodRequest");

// Create a blood request (receiver)
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
    } = req.body;

    if (
      !bloodType ||
      !units ||
      !hospital ||
      !province ||
      !district ||
      !contactPhone
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
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
    });

    res
      .status(201)
      .json({ success: true, message: "Blood request created", request });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all requests (donor view)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({ status: "pending" })
      .populate("requester", "name phone district province")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
