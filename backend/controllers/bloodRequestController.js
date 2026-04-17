const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");
exports.createRequest = async (req, res) => {
  try {
    const {
      patientName,
      bloodType,
      units,
      hospital,
      province,
      district,
      contactPhone,
      urgency,
      location,
    } = req.body;

    if (
      !patientName ||
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
        message: "All fields including patient name and location are required",
      });
    }

    const request = await BloodRequest.create({
      requester: req.user.id,
      patientName,
      bloodType,
      units,
      hospital,
      province,
      district,
      contactPhone,
      urgency,
      location,
    });

    res.status(201).json({
      success: true,
      message: "Blood request created",
      request,
    });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getAllRequests = async (req, res) => {
  try {
    const { province } = req.query;
    const userId = req.user.id;

    const baseQuery = {
      $or: [
        { status: "pending" }, // सबै पेन्डिङ रिक्वेस्टहरू
        { status: "accepted" }, // स्विकार गरिएका तर पुरा नभएका रिक्वेस्टहरू
        { requester: userId }, // यदि यो मेरै रिक्वेस्ट हो भने जुनसुकै अवस्थामा पनि देखाउने
      ],
      // completed भएकालाई फिल्टर आउट गर्न (ताकि लिस्ट फोहोर नहोस्)
      status: { $ne: "completed" },
    };

    if (province) {
      baseQuery.province = province;
    }

    const requests = await BloodRequest.find(baseQuery)
      .populate("requester", "name phone district province")
      .sort({ createdAt: -1 });

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

exports.acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request already accepted or completed",
      });
    }

    // donor already has an active accepted request?
    const existingAcceptedRequest = await BloodRequest.findOne({
      acceptedBy: userId,
      status: "accepted",
    });

    if (existingAcceptedRequest) {
      return res.status(400).json({
        message: "You have already accepted one request. Complete it first.",
      });
    }

    request.status = "accepted";
    request.acceptedBy = userId;

    await request.save();

    res.json({
      success: true,
      message: "Request accepted successfully",
      request,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.completeRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (
      request.status !== "accepted" ||
      request.acceptedBy.toString() !== userId
    ) {
      return res.status(400).json({
        message: "You can only complete requests you accepted",
      });
    }

    request.status = "completed";
    await request.save();

    const donor = await User.findById(userId);

    if (donor) {
      donor.lastDonationDate = new Date();
      donor.totalDonations = (donor.totalDonations || 0) + 1;
      await donor.save();
    }

    res.json({
      success: true,
      message: "Request completed successfully",
      request,
      donor: donor
        ? {
            lastDonationDate: donor.lastDonationDate,
            totalDonations: donor.totalDonations,
            canDonate: donor.canDonate,
          }
        : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getMyAcceptedRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      acceptedBy: req.user.id,
      status: "completed",
    })
      .populate("requester", "name phone district province")
      .sort({ updatedAt: -1 });

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
