import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../services/bloodRequestService";
import { getLocationData } from "../services/profileService";
import MapPicker from "../components/MapPicker";

const districtCenters = {
  // Koshi
  Bhojpur: [27.17, 87.04],
  Dhankuta: [26.98, 87.33],
  Ilam: [26.91, 87.92],
  Jhapa: [26.63, 87.99],
  Khotang: [27.18, 86.79],
  Morang: [26.67, 87.33],
  Okhaldhunga: [27.31, 86.5],
  Panchthar: [27.2, 87.85],
  Sankhuwasabha: [27.58, 87.21],
  Solukhumbu: [27.51, 86.7],
  Sunsari: [26.65, 87.16],
  Taplejung: [27.35, 87.67],
  Terhathum: [27.15, 87.54],
  Udayapur: [26.9, 86.52],
  // Madhesh
  Bara: [27.0, 85.0],
  Dhanusha: [26.73, 85.92],
  Mahottari: [26.83, 85.78],
  Parsa: [27.01, 84.87],
  Rautahat: [26.91, 85.33],
  Saptari: [26.59, 86.75],
  Sarlahi: [26.97, 85.55],
  Siraha: [26.65, 86.21],
  // Bagmati
  Bhaktapur: [27.67, 85.43],
  Chitwan: [27.56, 84.49],
  Dhading: [27.85, 84.91],
  Dolakha: [27.7, 86.17],
  Kathmandu: [27.7172, 85.324],
  Kavrepalanchok: [27.62, 85.55],
  Lalitpur: [27.66, 85.32],
  Makwanpur: [27.42, 85.03],
  Nuwakot: [27.91, 85.16],
  Ramechhap: [27.32, 86.08],
  Rasuwa: [28.14, 85.29],
  Sindhuli: [27.24, 85.92],
  Sindhupalchok: [27.93, 85.69],
  // Gandaki
  Baglung: [28.27, 83.59],
  Gorkha: [28.0, 84.63],
  Kaski: [28.2, 83.98],
  Lamjung: [28.24, 84.38],
  Manang: [28.66, 84.14],
  Mustang: [28.81, 83.87],
  Myagdi: [28.34, 83.56],
  Nawalpur: [27.64, 84.16],
  Parbat: [28.22, 83.67],
  Syangja: [28.1, 83.87],
  Tanahu: [27.91, 84.28],
  // Lumbini
  Arghakhanchi: [27.98, 83.08],
  Banke: [28.16, 81.68],
  Bardiya: [28.32, 81.35],
  Dang: [28.02, 82.38],
  Gulmi: [28.1, 83.25],
  Kapilvastu: [27.6, 83.0],
  Parasi: [27.53, 83.67],
  Palpa: [27.86, 83.54],
  Pyuthan: [28.11, 82.9],
  Rolpa: [28.31, 82.65],
  RukumEast: [28.62, 82.72],
  Rupandehi: [27.5, 83.45],
  // Karnali
  Dailekh: [28.84, 81.71],
  Dolpa: [29.03, 82.91],
  Humla: [29.96, 81.82],
  Jajarkot: [28.76, 82.2],
  Jumla: [29.27, 82.18],
  Kalikot: [29.13, 81.61],
  Mugu: [29.53, 82.16],
  Salyan: [28.37, 82.16],
  Surkhet: [28.59, 81.63],
  RukumWest: [28.63, 82.47],
  // Sudurpashchim
  Achham: [29.11, 81.3],
  Baitadi: [29.54, 80.52],
  Bajhang: [29.56, 81.2],
  Bajura: [29.5, 81.56],
  Dadeldhura: [29.3, 80.58],
  Darchula: [29.85, 80.53],
  Doti: [29.26, 80.93],
  Kailali: [28.71, 80.59],
  Kanchanpur: [28.91, 80.33],
};

export default function CreateBloodRequest() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patientName: "",
    bloodType: "",
    units: "",
    hospital: "",
    province: "",
    district: "",
    contactPhone: "",
    urgency: "medium",
    location: { lat: null, lon: null },
  });

  useEffect(() => {
    getLocationData().then((res) => {
      setProvinces(res.data.provinces);
      setLocations(res.data.locations);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setError("");

    if (type === "number" && value < 0) return;

    if (name === "district") {
      setForm({ ...form, district: value, location: { lat: null, lon: null } });
      return;
    }

    if (name === "patientName") {
      setForm({ ...form, [name]: value.replace(/[0-9]/g, "") });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({
        ...prev,
        location: { lat: pos.coords.latitude, lon: pos.coords.longitude },
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location.lat)
      return setError("Please pin the hospital location on the map.");
    setLoading(true);
    try {
      await createRequest(form);
      alert("Blood request created successfully ✅");
      navigate("/view-requests");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create request");
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
              Find nearby donors by providing accurate details.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Patient Name Section */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Patient Name</label>
              <input
                name="patientName"
                placeholder="Enter Full Name"
                style={styles.input}
                value={form.patientName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Blood Type and Units Row */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Blood Group</label>
                <select
                  name="bloodType"
                  style={styles.input}
                  value={form.bloodType}
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
                <label style={styles.label}>Units (Pint)</label>
                <input
                  name="units"
                  type="number"
                  min="1"
                  placeholder="Qty"
                  style={styles.input}
                  value={form.units}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Hospital Section */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Hospital Name</label>
              <input
                name="hospital"
                placeholder="Hospital/Lab Name"
                style={styles.input}
                value={form.hospital}
                onChange={handleChange}
                required
              />
            </div>

            {/* Province and District Row */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Province</label>
                <select
                  name="province"
                  style={styles.input}
                  value={form.province}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Province</option>
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
                  value={form.district}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select District</option>
                  {locations[form.province]?.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Map Section */}
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
                    center={
                      form.location.lat
                        ? [form.location.lat, form.location.lon]
                        : districtCenters[form.district] || [27.7172, 85.324]
                    }
                    onSelect={(pos) =>
                      setForm((prev) => ({
                        ...prev,
                        location: { lat: pos.lat, lon: pos.lng },
                      }))
                    }
                  />
                </div>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: form.location.lat ? "green" : "#b11226",
                    textAlign: "center",
                  }}
                >
                  {form.location.lat
                    ? "✅ Location pinned"
                    : "⚠️ Click map to pin hospital location"}
                </p>
              </div>
            )}

            {/* Contact and Urgency Row */}
            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Contact Phone</label>
                <input
                  name="contactPhone"
                  placeholder="98XXXXXXXX"
                  style={styles.input}
                  value={form.contactPhone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Urgency Level</label>
                <select
                  name="urgency"
                  style={{
                    ...styles.input,
                    backgroundColor:
                      form.urgency === "critical" ? "#fff0f0" : "#f9f9f9",
                  }}
                  value={form.urgency}
                  onChange={handleChange}
                >
                  <option value="low">Low (Normal)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Urgent)</option>
                  <option value="critical">Critical (Emergency)</option>
                </select>
              </div>
            </div>

            {error && <div style={styles.errorBanner}>{error}</div>}

            <button type="submit" disabled={loading} style={styles.submitBtn}>
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
    padding: "40px 20px",
  },
  container: { maxWidth: "600px", margin: "0 auto" },
  card: {
    backgroundColor: "#fff",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  },
  header: { textAlign: "center", marginBottom: "30px" },
  title: {
    fontSize: "1.8rem",
    color: "#b11226",
    fontWeight: "850",
    margin: "0",
  },
  subtitle: { color: "#636e72", fontSize: "0.95rem", marginTop: "5px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#444",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
    backgroundColor: "#fdfdfd",
  },
  mapSection: {
    marginTop: "5px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  locationBtn: {
    padding: "10px",
    border: "1.5px solid #b11226",
    color: "#b11226",
    background: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
  mapWrapper: {
    height: "260px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #ddd",
  },
  submitBtn: {
    padding: "16px",
    backgroundColor: "#b11226",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s",
  },
  errorBanner: {
    color: "#b11226",
    backgroundColor: "#fff5f5",
    padding: "12px",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "0.9rem",
    border: "1px solid #ffdada",
  },
};
