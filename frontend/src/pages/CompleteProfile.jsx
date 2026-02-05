import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile, getLocationData } from "../services/profileService";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    userType: [],
    bloodType: "",
    province: "",
    district: "",
    age: "",
    weight: "",
    gender: "",
  });

  useEffect(() => {
    getLocationData().then((res) => {
      setProvinces(res.data.provinces);
      setLocations(res.data.locations);
    });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUserTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      userType: prev.userType.includes(type)
        ? prev.userType.filter((t) => t !== type)
        : [...prev.userType, type],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await completeProfile(form);
      alert("Profile completed successfully ✅");
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Finish Your Setup</h2>
          <p style={styles.subtitle}>
            Tell us a bit more to help you connect with the right people.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* USER TYPE CHIPS */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>I want to be a:</label>
            <div style={styles.chipGroup}>
              {["donor", "receiver"].map((type) => (
                <div
                  key={type}
                  onClick={() => handleUserTypeChange(type)}
                  style={{
                    ...styles.chip,
                    backgroundColor: form.userType.includes(type)
                      ? "#d32f2f"
                      : "#f0f0f0",
                    color: form.userType.includes(type) ? "#fff" : "#444",
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
              ))}
            </div>
          </div>

          {/* BLOOD TYPE (Conditional) */}
          {form.userType.includes("donor") && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Blood Group</label>
              <select
                name="bloodType"
                style={styles.select}
                onChange={handleChange}
                required
              >
                <option value="">Select Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          {/* LOCATION ROW */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Province</label>
              <select
                name="province"
                style={styles.select}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {provinces.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>District</label>
              <select
                name="district"
                style={styles.select}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {locations[form.province]?.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* HEALTH STATS ROW */}
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Age</label>
              <input
                name="age"
                type="number"
                placeholder="yrs"
                style={styles.input}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Weight</label>
              <input
                name="weight"
                type="number"
                placeholder="kg"
                style={styles.input}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Gender</label>
              <select
                name="gender"
                style={styles.select}
                onChange={handleChange}
              >
                <option value="">--</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Saving..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
  },
  card: {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  header: { textAlign: "center", marginBottom: "30px" },
  title: { margin: "0 0 10px 0", color: "#2d3436" },
  subtitle: { fontSize: "0.9rem", color: "#636e72" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  row: { display: "flex", gap: "15px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#444" },
  chipGroup: { display: "flex", gap: "10px" },
  chip: {
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "0.95rem",
  },
  select: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    fontSize: "0.95rem",
  },
  btn: {
    marginTop: "10px",
    padding: "14px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(211, 47, 47, 0.2)",
  },
};
