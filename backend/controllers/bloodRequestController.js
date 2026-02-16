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
    const { province } = req.query; // frontend bata province pathaune

    let query = { status: "pending" };
    if (province) query.province = province;

    const requests = await BloodRequest.find(query)
      .populate("requester", "name phone district province")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
