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
  const [hover, setHover] = useState(false);

  const districtCenters = {
    Kathmandu: [27.7172, 85.324],
    Lalitpur: [27.6644, 85.3188],
    Bhaktapur: [27.671, 85.4298],
  };

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
    if (!form.location.lat) return alert("Please select a location on the map");
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
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>Create Blood Request</h2>
            <p style={styles.subtitle}>
              Fill in the details to find nearby donors quickly.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Blood Group</label>
                <select
                  name="bloodType"
                  style={styles.input}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Units Needed</label>
                <input
                  name="units"
                  type="number"
                  placeholder="Qty"
                  style={styles.input}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Hospital Name</label>
              <input
                name="hospital"
                placeholder="Name of hospital"
                style={styles.input}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Province</label>
                <select
                  name="province"
                  style={styles.input}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>District</label>
                <select
                  name="district"
                  style={styles.input}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  {locations[form.province]?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {form.district && (
              <div style={styles.mapSection}>
                <button
                  type="button"
                  onClick={useMyLocation}
                  style={styles.locationBtn}
                >
                  📍 Use My Current Location
                </button>
                <div style={styles.mapWrapper}>
                  <MapPicker
                    center={districtCenters[form.district] || [27.7172, 85.324]}
                    onSelect={(pos) =>
                      setForm({
                        ...form,
                        location: { lat: pos.lat, lon: pos.lng },
                      })
                    }
                  />
                </div>
              </div>
            )}

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Contact Number</label>
                <input
                  name="contactPhone"
                  placeholder="98XXXXXXXX"
                  style={styles.input}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Urgency</label>
                <select
                  name="urgency"
                  style={{
                    ...styles.input,
                    backgroundColor:
                      form.urgency === "critical" ? "#fff5f5" : "#fff",
                  }}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                ...styles.submitBtn,
                transform: hover ? "translateY(-2px)" : "translateY(0)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Processing..." : "Submit Blood Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fcfcfc",
    padding: "60px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    maxWidth: "580px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
    padding: "40px",
    border: "1px solid #f0f0f0",
  },
  header: {
    textAlign: "center",
    marginBottom: "35px",
  },
  title: {
    fontSize: "1.8rem",
    color: "#2d3436",
    fontWeight: "800",
    margin: "0 0 10px 0",
  },
  subtitle: {
    color: "#636e72",
    fontSize: "0.95rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#b11226",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
    backgroundColor: "#f9f9f9",
  },
  mapSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
  },
  locationBtn: {
    background: "transparent",
    border: "1px solid #d32f2f",
    color: "#d32f2f",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  mapWrapper: {
    height: "250px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e0e0e0",
  },
  submitBtn: {
    marginTop: "10px",
    padding: "16px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 20px rgba(211, 47, 47, 0.2)",
  },
};
