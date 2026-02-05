import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [hover, setHover] = useState(null);

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          Donate Blood, Save Lives <span style={{ color: "#ff4d4d" }}>❤️</span>
        </h1>
        <p style={styles.subtitle}>
          Connecting selfless donors with those in need across <b>Nepal</b>. One
          single donation can save up to three lives. Be the hero someone is
          waiting for today.
        </p>

        <div style={styles.actions}>
          <button
            onMouseEnter={() => setHover("find")}
            onMouseLeave={() => setHover(null)}
            onClick={() => navigate("/search")}
            style={{
              ...styles.btn,
              transform: hover === "find" ? "scale(1.05)" : "scale(1)",
            }}
          >
            Find Blood Now
          </button>

          {!token && (
            <button
              onMouseEnter={() => setHover("donor")}
              onMouseLeave={() => setHover(null)}
              onClick={() => navigate("/register")}
              style={{
                ...styles.btnOutline,
                transform: hover === "donor" ? "scale(1.05)" : "scale(1)",
              }}
            >
              Become a Donor
            </button>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <div style={styles.statsContainer}>
        {[
          { icon: "🩸", count: "8+", label: "Blood Groups" },
          { icon: "📍", count: "77", label: "Districts" },
          { icon: "❤️", count: "1000+", label: "Lives Saved" },
        ].map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statIcon}>{stat.icon}</div>
            <h3 style={styles.statCount}>{stat.count}</h3>
            <p style={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#fcfcfc",
  },
  hero: {
    padding: "100px 20px",
    textAlign: "center",
    background: "linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)",
  },
  title: {
    fontSize: "3rem",
    color: "#2d3436",
    marginBottom: "20px",
    fontWeight: "800",
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#636e72",
    maxWidth: "700px",
    margin: "0 auto 40px auto",
    lineHeight: "1.6",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  btn: {
    padding: "15px 35px",
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "50px",
    fontSize: "1.1rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(211, 47, 47, 0.3)",
  },
  btnOutline: {
    padding: "15px 35px",
    border: "2px solid #d32f2f",
    background: "transparent",
    color: "#d32f2f",
    cursor: "pointer",
    borderRadius: "50px",
    fontSize: "1.1rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "40px",
    padding: "40px 20px",
    marginTop: "-50px", // Pulls stats up into the hero area slightly
  },
  statCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "200px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    transition: "transform 0.3s ease",
  },
  statIcon: {
    fontSize: "2.5rem",
    marginBottom: "10px",
  },
  statCount: {
    fontSize: "1.8rem",
    margin: "5px 0",
    color: "#2d3436",
  },
  statLabel: {
    color: "#b11226",
    fontWeight: "600",
    margin: 0,
    textTransform: "uppercase",
    fontSize: "0.85rem",
    letterSpacing: "1px",
  },
};
