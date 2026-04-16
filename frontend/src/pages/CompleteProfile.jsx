import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { completeProfile, getLocationData } from "../services/profileService";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const brandColor = "rgb(177, 18, 38)";

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
      setProvinces(res.data.provinces || []);
      setLocations(res.data.locations || {});
    });
  }, []);

  // Blocks '-' and 'e' keys and shows error
  const blockInvalidChar = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "+") {
      e.preventDefault();
      setError("Negative values or special characters are not allowed.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setError("");

    // Safety check for manual typing or pasting
    if (type === "number" && value.includes("-")) {
      setError("Negative values are not allowed.");
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleUserTypeChange = (type) => {
    setError("");
    setForm((prev) => ({
      ...prev,
      userType: [type],
      bloodType: type === "donor" ? prev.bloodType : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.userType.length === 0) {
      setError("Please select whether you are a Donor or a Receiver.");
      return;
    }

    if (form.age && (form.age <= 0 || form.age > 120)) {
      setError("Please enter a valid age.");
      return;
    }

    if (form.weight && (form.weight <= 0 || form.weight > 500)) {
      setError("Please enter a valid weight.");
      return;
    }

    setLoading(true);
    try {
      await completeProfile(form);
      alert("Profile completed successfully ✅");
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={styles.card}
      >
        <div style={styles.header}>
          <div style={{ ...styles.iconCircle, color: brandColor }}>🩸</div>
          <h2 style={styles.title}>Complete Your Setup</h2>
          <p style={styles.subtitle}>
            Join the LifeStream network and start saving lives today.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>I want to register as a:</label>
            <div style={styles.chipGroup}>
              {["donor", "receiver"].map((type) => {
                const isActive = form.userType.includes(type);
                return (
                  <motion.div
                    key={type}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleUserTypeChange(type)}
                    style={{
                      ...styles.chip,
                      backgroundColor: isActive ? brandColor : "#fff",
                      color: isActive ? "#fff" : "#64748b",
                      border: `2px solid ${isActive ? brandColor : "#e2e8f0"}`,
                      boxShadow: isActive
                        ? `0 8px 20px rgba(177, 18, 38, 0.2)`
                        : "none",
                    }}
                  >
                    {type === "donor" ? "🙋‍♂️ Donor" : "🏥 Receiver"}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {form.userType.includes("donor") && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Blood Group</label>
                  <select
                    name="bloodType"
                    style={styles.select}
                    value={form.bloodType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Province</label>
              <select
                name="province"
                style={styles.select}
                value={form.province}
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
                style={styles.select}
                value={form.district}
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

          <div style={styles.statsRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Age</label>
              <input
                name="age"
                type="number"
                min="1"
                placeholder="Yrs"
                style={styles.input}
                value={form.age}
                onKeyDown={blockInvalidChar}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Weight</label>
              <input
                name="weight"
                type="number"
                min="1"
                placeholder="kg"
                style={styles.input}
                value={form.weight}
                onKeyDown={blockInvalidChar}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Gender</label>
              <select
                name="gender"
                style={styles.select}
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">--</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {error && <span style={styles.errorText}>{error}</span>}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            style={{ ...styles.btn, backgroundColor: brandColor }}
          >
            {loading ? "Processing..." : "Complete Registration"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "50px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #fffafa 0%, #fdf2f2 100%)",
    minHeight: "100vh",
  },
  card: {
    width: "80%",
    backgroundColor: "#ffffff",
    padding: "45px",
    borderRadius: "15px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f1f5f9",
  },
  header: { textAlign: "center", marginBottom: "35px" },
  iconCircle: {
    fontSize: "2.2rem",
    background: "#fff5f5",
    width: "70px",
    height: "70px",
    borderRadius: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  title: {
    margin: "0 0 10px 0",
    color: "#0f172a",
    fontSize: "1.8rem",
    fontWeight: "850",
  },
  subtitle: { fontSize: "1rem", color: "#64748b", lineHeight: "1.6" },
  form: { display: "flex", flexDirection: "column", gap: "24px" },
  row: { display: "flex", gap: "20px" },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "15px",
  },
  inputGroup: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontSize: "0.9rem", fontWeight: "700", color: "#334155" },
  chipGroup: { display: "flex", gap: "15px" },
  chip: {
    flex: 1,
    padding: "16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "700",
    textAlign: "center",
  },
  input: {
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    fontSize: "1rem",
    outline: "none",
    backgroundColor: "#f8fafc",
  },
  select: {
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    fontSize: "1rem",
    outline: "none",
    cursor: "pointer",
  },
  btn: {
    marginTop: "10px",
    padding: "18px",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "1.1rem",
    cursor: "pointer",
  },
  errorText: {
    color: "rgb(177, 18, 38)",
    fontSize: "0.85rem",
    textAlign: "center",
    fontWeight: "500",
    backgroundColor: "#fff5f5",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ffdada",
  },
};
