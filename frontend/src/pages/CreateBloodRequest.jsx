import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../services/bloodRequestService";
import { getLocationData } from "../services/profileService";

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
  });

  const [locations, setLocations] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Load province & district data
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createRequest(form);
      alert("Blood request created successfully ✅");
      navigate("/requests"); // redirect to view requests
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "500px", margin: "auto" }}>
      <h2>Create Blood Request</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
        <select name="bloodType" onChange={handleChange} required>
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <input
          name="units"
          type="number"
          placeholder="Units needed"
          onChange={handleChange}
          required
        />

        <input
          name="hospital"
          placeholder="Hospital name"
          onChange={handleChange}
          required
        />

        <select name="province" onChange={handleChange} required>
          <option value="">Select Province</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select name="district" onChange={handleChange} required>
          <option value="">Select District</option>
          {locations[form.province]?.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <input
          name="contactPhone"
          placeholder="Contact Number"
          onChange={handleChange}
          required
        />

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
