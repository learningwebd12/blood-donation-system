import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle changes and block numbers in the Name field
  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;

    if (name === "name") {
      // Remove any numeric characters immediately while typing
      const alphaValue = value.replace(/[0-9]/g, "");
      setForm({ ...form, name: alphaValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- VALIDATION LOGIC ---

    // 1. Name validation (Alpha only + length)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(form.name) || form.name.trim().length < 3) {
      setError("Please enter a valid Full Name (Letters only, min 3 chars).");
      return;
    }

    // 2. Phone validation (Nepali format: starts with 9, 10 digits)
    const phoneRegex = /^9\d{9}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Please enter a valid 10-digit phone number starting with 9.");
      return;
    }

    // 3. Password validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    // -------------------------

    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      alert("Registration Successful! Welcome to the community.");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span style={{ fontSize: "2rem" }}>📝</span>
          <h2 style={styles.title}>Join LifeStream</h2>
          <p style={styles.subtitle}>
            Help us bridge the gap between donors and patients.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              name="name"
              placeholder="John Doe"
              style={styles.input}
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              style={styles.input}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              name="phone"
              placeholder="98********"
              style={styles.input}
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              style={styles.input}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* --- ERROR MESSAGE DISPLAY --- */}
          {error && <span style={styles.errorText}>{error}</span>}

          <button
            type="submit"
            style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register as Donor"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} style={styles.link}>
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    width: "100%",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    margin: "10px 0",
    color: "#2d3436",
    fontSize: "1.8rem",
  },
  subtitle: {
    color: "#636e72",
    fontSize: "0.9rem",
    lineHeight: "1.4",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#444",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outlineColor: "#d32f2f",
  },
  btn: {
    padding: "14px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    transition: "background 0.3s",
  },
  footerText: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "0.9rem",
    color: "#636e72",
  },
  link: {
    color: "#d32f2f",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "underline",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: "0.85rem",
    textAlign: "center",
    fontWeight: "500",
    backgroundColor: "#fff5f5",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ffdada",
  },
};
