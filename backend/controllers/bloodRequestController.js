const BloodRequest = require("../models/BloodRequest");
const User = require("../models/User");

// Create request
exports.createRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (
      user.userType?.includes("donor") &&
      !user.userType?.includes("receiver")
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access Denied: Donors are not allowed to create blood requests.",
      });
    }

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
      location?.lat === undefined ||
      location?.lon === undefined
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
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
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

// Get all active requests
exports.getAllRequests = async (req, res) => {
  try {
    const { province } = req.query;
    const userId = req.user.id;
    await BloodRequest.updateMany(
      {
        status: "pending",
        expiresAt: { $lt: new Date() },
      },
      {
        $set: { status: "expired" },
      },
    );

    const baseQuery = {
      $or: [
        { status: "pending" },
        { status: "accepted" },
        { status: "waiting_confirmation" },
        { requester: userId },
      ],
      status: { $ne: "completed" },
    };

    if (province) {
      baseQuery.province = province;
    }

    const requests = await BloodRequest.find(baseQuery)
      .populate("requester", "name phone district province")
      .populate("acceptedBy", "name phone")
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

// Donor accepts request
// Donor accepts request
exports.acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    // 1. Check if Donor is eligible (90 Days Lock Logic)
    const donor = await User.findById(userId);

    if (donor?.lastDonationDate) {
      const lastDonation = new Date(donor.lastDonationDate);
      const nextDate = new Date(lastDonation);
      nextDate.setDate(nextDate.getDate() + 90); // 90 days gap

      const today = new Date();

      if (today < nextDate) {
        const diffMs = nextDate - today;
        const remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        return res.status(400).json({
          success: false,
          message: `You donated recently. You can accept the next blood request after ${remainingDays} day(s).`,
        });
      }
    }

    // 2. Find the request
    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    // 3. Prevent self-acceptance
    if (request.requester.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot accept your own request",
      });
    }

    // 4. expire
    if (request.status === "expired") {
      return res.status(400).json({
        success: false,
        message: "This request has expired",
      });
    }

    //check pending

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Request already accepted or processed",
      });
    }

    // 5. Prevent multiple active donations
    const existingActiveRequest = await BloodRequest.findOne({
      acceptedBy: userId,
      status: { $in: ["accepted", "waiting_confirmation"] },
    });

    if (existingActiveRequest) {
      return res.status(400).json({
        success: false,
        message:
          "You already have one active donation request. Finish it first.",
      });
    }

    // 6. Update Status
    request.status = "accepted";
    request.acceptedBy = userId;
    await request.save();

    const updatedRequest = await BloodRequest.findById(request._id)
      .populate("requester", "name phone district province")
      .populate("acceptedBy", "name phone");

    res.json({
      success: true,
      message: "Request accepted successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Accept request error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Donor marks donated
exports.markAsDonated = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (!request.acceptedBy || request.acceptedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only the donor who accepted this request can mark as donated",
      });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Only accepted requests can be marked as donated",
      });
    }

    request.status = "waiting_confirmation";
    await request.save();

    const updatedRequest = await BloodRequest.findById(request._id)
      .populate("requester", "name phone district province")
      .populate("acceptedBy", "name phone");

    res.json({
      success: true,
      message: "Marked as donated. Waiting for requester confirmation.",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Mark donated error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Requester confirms blood received
exports.confirmBloodReceived = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.id;

    const request = await BloodRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.requester.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only requester can confirm blood received",
      });
    }

    if (request.status !== "waiting_confirmation") {
      return res.status(400).json({
        success: false,
        message: "This request is not waiting for confirmation",
      });
    }

    request.status = "completed";
    await request.save();

    if (request.acceptedBy) {
      const donor = await User.findById(request.acceptedBy);
      if (donor) {
        donor.lastDonationDate = new Date();
        donor.totalDonations = (donor.totalDonations || 0) + 1;
        await donor.save();
      }
    }

    const updatedRequest = await BloodRequest.findById(request._id)
      .populate("requester", "name phone district province")
      .populate("acceptedBy", "name phone");

    res.json({
      success: true,
      message: "Blood received confirmed. Request completed successfully.",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Confirm blood received error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Donor completed history
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

// Requester own requests
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await BloodRequest.find({
      requester: req.user.id,
    })
      .populate("acceptedBy", "name phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Get my requests error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
