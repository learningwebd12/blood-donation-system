const User = require("../models/User");

// Complete Profile
exports.completeProfile = async (req, res) => {
  try {
    const {
      userType,
      bloodType,
      province,
      district,
      age,
      weight,
      gender,
      latitude,
      longitude,
    } = req.body;

    // Validation
    if (!userType || userType.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one user type",
      });
    }

    if (userType.includes("donor") && !bloodType) {
      return res.status(400).json({
        success: false,
        message: "Blood type is required for donors",
      });
    }

    if (!province || !district) {
      return res.status(400).json({
        success: false,
        message: "Province and district are required",
      });
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        userType,
        bloodType,
        "location.province": province,
        "location.district": district,
        ...(latitude && longitude
          ? {
              "location.coordinates.latitude": latitude,
              "location.coordinates.longitude": longitude,
            }
          : {}),
        "healthInfo.age": age,
        "healthInfo.weight": weight,
        "healthInfo.gender": gender,
        profileComplete: true,
      },
      { new: true },
    ).select("-password");

    res.json({
      success: true,
      message: "Profile completed successfully",
      user,
    });
  } catch (error) {
    console.error("Complete profile error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get Location Data
exports.getLocationData = async (req, res) => {
  try {
    const nepalLocations = {
      Koshi: [
        "Bhojpur",
        "Dhankuta",
        "Ilam",
        "Jhapa",
        "Khotang",
        "Morang",
        "Okhaldhunga",
        "Panchthar",
        "Sankhuwasabha",
        "Solukhumbu",
        "Sunsari",
        "Taplejung",
        "Terhathum",
        "Udayapur",
      ],
      Madhesh: [
        "Bara",
        "Parsa",
        "Rautahat",
        "Sarlahi",
        "Dhanusha",
        "Mahottari",
        "Saptari",
        "Siraha",
      ],
      Bagmati: [
        "Bhaktapur",
        "Chitwan",
        "Dhading",
        "Dolakha",
        "Kathmandu",
        "Kavrepalanchok",
        "Lalitpur",
        "Makwanpur",
        "Nuwakot",
        "Ramechhap",
        "Rasuwa",
        "Sindhuli",
        "Sindhupalchok",
      ],
      Gandaki: [
        "Baglung",
        "Gorkha",
        "Kaski",
        "Lamjung",
        "Manang",
        "Mustang",
        "Myagdi",
        "Nawalpur",
        "Parbat",
        "Syangja",
        "Tanahun",
      ],
      Lumbini: [
        "Arghakhanchi",
        "Banke",
        "Bardiya",
        "Dang",
        "Gulmi",
        "Kapilvastu",
        "Palpa",
        "Parasi",
        "Pyuthan",
        "Rolpa",
        "Rukum East",
        "Rupandehi",
      ],
      Karnali: [
        "Dailekh",
        "Dolpa",
        "Humla",
        "Jajarkot",
        "Jumla",
        "Kalikot",
        "Mugu",
        "Salyan",
        "Surkhet",
        "Rukum West",
      ],
      Sudurpashchim: [
        "Achham",
        "Baitadi",
        "Bajhang",
        "Bajura",
        "Dadeldhura",
        "Darchula",
        "Doti",
        "Kailali",
        "Kanchanpur",
      ],
    };

    res.json({
      success: true,
      provinces: Object.keys(nepalLocations),
      locations: nepalLocations,
    });
  } catch (error) {
    console.error("Get location data error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
