import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { phone, password });
      localStorage.setItem("token", res.data.token);
      alert("Welcome back!");
      navigate("/"); // Send them home after login
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
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
          <p style={styles.subtitle}>
            Log in to manage your donations or find help.
          </p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="text"
              placeholder="98********"
              style={styles.input}
              onChange={(e) => setPhone(e.target.value)}
              required
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            style={loading ? { ...styles.btn, opacity: 0.7 } : styles.btn}
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
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "#fcfcfc",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
    maxWidth: "400px",
    width: "100%",
    border: "1px solid #eee",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  iconCircle: {
    width: "60px",
    height: "60px",
    backgroundColor: "#fff5f5",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "1.5rem",
    color: "#d32f2f",
  },
  title: {
    margin: "0 0 8px 0",
    color: "#2d3436",
    fontSize: "1.8rem",
    fontWeight: "700",
  },
  subtitle: {
    color: "#636e72",
    fontSize: "0.95rem",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
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
    color: "#444",
  },
  forgotPass: {
    fontSize: "0.8rem",
    color: "#d32f2f",
    cursor: "pointer",
    fontWeight: "500",
  },
  input: {
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #e0e0e0",
    fontSize: "1rem",
    transition: "border-color 0.2s",
    outline: "none",
    background: "#fdfdfd",
  },
  btn: {
    padding: "14px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    transition: "transform 0.1s ease, background 0.2s ease",
    boxShadow: "0 4px 12px rgba(211, 47, 47, 0.25)",
  },
  footerText: {
    textAlign: "center",
    marginTop: "25px",
    fontSize: "0.9rem",
    color: "#636e72",
  },
  link: {
    color: "#d32f2f",
    fontWeight: "bold",
    cursor: "pointer",
    textDecoration: "none",
  },
};
