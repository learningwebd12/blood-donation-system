import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../services/bloodRequestService";
import { getLocationData } from "../services/profileService";
import MapPicker from "../components/MapPicker";

export default function CreateBloodRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bloodType: "",
    units: "",
    hospital: "",
    province: "",
    district: "",
    contactPhone: "",
    urgency: "medium",
    location: { lat: null, lon: null },
  });

  const [locations, setLocations] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);

  // District map centers
  const districtCenters = {
    Kathmandu: [27.7172, 85.324],
    Lalitpur: [27.6644, 85.3188],
    Bhaktapur: [27.671, 85.4298],
    // Add other districts as needed
  };

  // Load province & district data
  useEffect(() => {
    getLocationData()
      .then((res) => {
        setProvinces(res.data.provinces);
        setLocations(res.data.locations);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          location: { lat: pos.coords.latitude, lon: pos.coords.longitude },
        });
      },
      () => alert("Location permission denied"),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.location.lat || !form.location.lon) {
      return alert("Please select location on map or use my location");
    }

    setLoading(true);
    try {
      await createRequest(form);
      alert("Blood request created ✅");
      navigate("/requests");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "520px", margin: "auto" }}>
      <h2>Create Blood Request</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
        {/* Blood Group */}
        <select name="bloodType" onChange={handleChange} required>
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Units */}
        <input
          name="units"
          type="number"
          placeholder="Units needed"
          onChange={handleChange}
          required
        />

        {/* Hospital */}
        <input
          name="hospital"
          placeholder="Hospital name"
          onChange={handleChange}
          required
        />

        {/* Province */}
        <select name="province" onChange={handleChange} required>
          <option value="">Select Province</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* District */}
        <select name="district" onChange={handleChange} required>
          <option value="">Select District</option>
          {locations[form.province]?.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Map Picker */}
        {form.district && (
          <>
            <button type="button" onClick={useMyLocation}>
              📍 Use My Current Location
            </button>

            <MapPicker
              center={districtCenters[form.district] || [27.7172, 85.324]}
              onSelect={(pos) =>
                setForm({
                  ...form,
                  location: { lat: pos.lat, lon: pos.lng },
                })
              }
            />
          </>
        )}

        {/* Contact */}
        <input
          name="contactPhone"
          placeholder="Contact Number"
          onChange={handleChange}
          required
        />

        {/* Urgency */}
        <select name="urgency" onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Request"}
        </button>
      </form>
    </div>
  );
}
