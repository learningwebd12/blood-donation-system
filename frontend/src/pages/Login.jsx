import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Check if fields are empty
    if (!phone.trim() || !password.trim()) {
      setError("Phone number and password cannot be empty.");
      return;
    }

    // 2. Validate phone: Only digits, exactly 10 digits, starts with 9
    const phoneRegex = /^9\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError(
        "Please enter a valid 10-digit phone number (Numbers only, starting with 9).",
      );
      return;
    }

    // 3. Password length check
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", { phone, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconCircle}>❤️</div>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Log in to manage your donations</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="98********"
              style={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              // Prevent non-numeric typing
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
              onFocus={(e) => (e.target.style.borderColor = "#d32f2f")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.labelRow}>
              <label style={styles.label}>Password</label>
              <span style={styles.forgotPass}>Forgot?</span>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#d32f2f")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
          </div>

          {error && <div style={styles.errorText}>{error}</div>}

          <button
            type="submit"
            style={
              loading
                ? { ...styles.btn, opacity: 0.7, transform: "scale(0.98)" }
                : styles.btn
            }
            disabled={loading}
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <p style={styles.footerText}>
          New to LifeStream?{" "}
          <span onClick={() => navigate("/register")} style={styles.link}>
            Create an account
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
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  card: {
    background: "#ffffff",
    padding: "40px 30px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
    maxWidth: "420px",
    width: "100%",
    border: "1px solid rgba(0,0,0,0.03)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    backgroundColor: "#fff0f0",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    fontSize: "1.8rem",
    transform: "rotate(-10deg)",
  },
  title: {
    margin: "0 0 8px 0",
    color: "#1a1a1a",
    fontSize: "1.75rem",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#718096",
    fontSize: "0.9rem",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#4a5568",
    marginLeft: "4px",
  },
  forgotPass: {
    fontSize: "0.8rem",
    color: "#d32f2f",
    cursor: "pointer",
    fontWeight: "600",
  },
  input: {
    padding: "16px",
    borderRadius: "12px",
    border: "2px solid #edf2f7",
    fontSize: "0.95rem",
    fontFamily: "'Poppins', sans-serif",
    transition: "all 0.2s ease",
    outline: "none",
    background: "#f8fafc",
  },
  btn: {
    padding: "16px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 15px -3px rgba(211, 47, 47, 0.3)",
    fontFamily: "'Poppins', sans-serif",
  },
  footerText: {
    textAlign: "center",
    marginTop: "30px",
    fontSize: "0.9rem",
    color: "#718096",
  },
  link: {
    color: "#d32f2f",
    fontWeight: "700",
    cursor: "pointer",
    textDecoration: "none",
    marginLeft: "5px",
  },
  errorText: {
    color: "#e53e3e",
    fontSize: "0.8rem",
    textAlign: "center",
    fontWeight: "500",
    backgroundColor: "#fff5f5",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #feb2b2",
  },
};
