const User = require("../models/User");

exports.completeProfile = async (req, res) => {
  try {
    const {
      userType,
      bloodType,
      province,
      district,
      municipality,
      municipalityType,
      ward,
      tole,
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

    if (!province || !district || !municipality || !ward) {
      return res.status(400).json({
        success: false,
        message: "Complete address is required",
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
        "location.municipality": municipality,
        "location.municipalityType": municipalityType,
        "location.ward": ward,
        "location.tole": tole,
        "location.coordinates.latitude": latitude,
        "location.coordinates.longitude": longitude,
        "healthInfo.age": age,
        "healthInfo.weight": weight,
        "healthInfo.gender": gender,
        profileComplete: true,
      },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile completed successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ ADD THIS FUNCTION
exports.getLocationData = async (req, res) => {
  try {
    const nepalLocations = {
      Koshi: {
        districts: [
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
      },
      Madhesh: {
        districts: [
          "Bara",
          "Parsa",
          "Rautahat",
          "Sarlahi",
          "Dhanusha",
          "Mahottari",
          "Saptari",
          "Siraha",
        ],
      },
      Bagmati: {
        districts: [
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
      },
      Gandaki: {
        districts: [
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
      },
      Lumbini: {
        districts: [
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
      },
      Karnali: {
        districts: [
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
      },
      Sudurpashchim: {
        districts: [
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
      },
    };

    const majorMunicipalities = {
      Kathmandu: [
        {
          name: "Kathmandu Metropolitan City",
          type: "Metropolitan",
          wards: 32,
        },
        {
          name: "Budhanilkantha Municipality",
          type: "Municipality",
          wards: 13,
        },
        { name: "Chandragiri Municipality", type: "Municipality", wards: 15 },
        { name: "Dakshinkali Municipality", type: "Municipality", wards: 9 },
        { name: "Gokarneshwor Municipality", type: "Municipality", wards: 9 },
        {
          name: "Kageshwori Manohara Municipality",
          type: "Municipality",
          wards: 9,
        },
        { name: "Kirtipur Municipality", type: "Municipality", wards: 10 },
        { name: "Nagarjun Municipality", type: "Municipality", wards: 10 },
        { name: "Shankharapur Municipality", type: "Municipality", wards: 9 },
        { name: "Tarakeshwar Municipality", type: "Municipality", wards: 11 },
        { name: "Tokha Municipality", type: "Municipality", wards: 11 },
      ],
      Lalitpur: [
        { name: "Lalitpur Metropolitan City", type: "Metropolitan", wards: 29 },
        { name: "Godawari Municipality", type: "Municipality", wards: 14 },
        { name: "Mahalaxmi Municipality", type: "Municipality", wards: 10 },
      ],
      Bhaktapur: [
        { name: "Bhaktapur Municipality", type: "Municipality", wards: 10 },
        { name: "Changunarayan Municipality", type: "Municipality", wards: 9 },
        {
          name: "Madhyapur Thimi Municipality",
          type: "Municipality",
          wards: 9,
        },
        { name: "Suryabinayak Municipality", type: "Municipality", wards: 10 },
      ],
    };

    res.json({
      success: true,
      provinces: Object.keys(nepalLocations),
      locations: nepalLocations,
      municipalities: majorMunicipalities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
