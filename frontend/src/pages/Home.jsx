import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const brandColor = "rgb(177, 18, 38)";

  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={styles.heroContent}
        >
          <div style={styles.badge}>🇳🇵 Serving all 77 Districts</div>
          <h1 style={styles.title}>
            The Gift of Blood is the <br />
            <span style={{ color: brandColor }}>Gift of Life.</span>
          </h1>
          <p style={styles.subtitle}>
            Every drop counts. Join Nepal's most trusted network connecting
            thousands of voluntary donors with patients in urgent need.
          </p>

          <div style={styles.actions}>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 20px rgba(177, 18, 38, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/search")}
              style={{ ...styles.btn, background: brandColor }}
            >
              Find Blood Now
            </motion.button>

            {!token && (
              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(177, 18, 38, 0.05)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/register")}
                style={{
                  ...styles.btnOutline,
                  borderColor: brandColor,
                  color: brandColor,
                }}
              >
                Become a Donor
              </motion.button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Stats Section - Floating Overlap */}
      <div style={styles.statsContainer}>
        {[
          { icon: "🩸", count: "8+", label: "Blood Groups" },
          { icon: "🏢", count: "500+", label: "Hospitals" },
          { icon: "🤝", count: "10k+", label: "Donors" },
          { icon: "💖", count: "2500+", label: "Lives Saved" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            style={styles.statCard}
          >
            <div style={styles.statIcon}>{stat.icon}</div>
            <h3 style={styles.statCount}>{stat.count}</h3>
            <p style={styles.statLabel}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* NEW: How it Works Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How it Works</h2>
        <div style={styles.stepGrid}>
          {[
            {
              t: "Request",
              d: "Post a request with hospital details and required blood group.",
              i: "📝",
            },
            {
              t: "Connect",
              d: "Our system notifies eligible donors in your specific district.",
              i: "🔔",
            },
            {
              t: "Save",
              d: "A donor accepts, contacts you, and completes the donation.",
              i: "🎁",
            },
          ].map((step, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepIcon}>{step.i}</div>
              <h4 style={styles.stepTitle}>{step.t}</h4>
              <p style={styles.stepText}>{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: Emergency Banner */}
      <div style={{ ...styles.emergencyBanner, background: brandColor }}>
        <div style={styles.bannerContent}>
          <h3>Urgent Requirement?</h3>
          <p>
            Don't wait. Create a request and let our community help you
            immediately.
          </p>
        </div>
        <button onClick={() => navigate("/search")} style={styles.bannerBtn}>
          Create Request
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    backgroundColor: "#ffffff",
    overflowX: "hidden",
  },
  hero: {
    padding: "120px 20px 100px 20px",
    textAlign: "center",
    background: "radial-gradient(circle at top right, #fff5f5 0%, #ffffff 50%)",
    position: "relative",
  },
  heroContent: {
    maxWidth: "850px",
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    padding: "8px 16px",
    background: "rgba(177, 18, 38, 0.1)",
    color: "rgb(177, 18, 38)",
    borderRadius: "100px",
    fontSize: "0.9rem",
    fontWeight: "700",
    marginBottom: "20px",
  },
  title: {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    color: "#1a1a1a",
    marginBottom: "24px",
    fontWeight: "800",
    lineHeight: "1.1",
    letterSpacing: "-1px",
  },
  subtitle: {
    fontSize: "1.25rem",
    color: "#4b5563",
    maxWidth: "600px",
    margin: "0 auto 48px auto",
    lineHeight: "1.6",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  btn: {
    padding: "18px 40px",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "16px",
    fontSize: "1.1rem",
    fontWeight: "700",
    transition: "all 0.3s ease",
  },
  btnOutline: {
    padding: "18px 40px",
    border: "2px solid",
    background: "transparent",
    cursor: "pointer",
    borderRadius: "16px",
    fontSize: "1.1rem",
    fontWeight: "700",
    transition: "all 0.3s ease",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "-60px auto 0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 10,
  },
  statCard: {
    background: "#fff",
    padding: "40px 20px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
    border: "1px solid #f1f5f9",
  },
  statIcon: { fontSize: "2.5rem", marginBottom: "12px" },
  statCount: {
    fontSize: "2rem",
    margin: "8px 0",
    color: "#1a1a1a",
    fontWeight: "800",
  },
  statLabel: {
    color: "#64748b",
    fontWeight: "600",
    margin: 0,
    textTransform: "uppercase",
    fontSize: "0.8rem",
    letterSpacing: "1px",
  },

  section: { padding: "100px 20px", maxWidth: "1100px", margin: "0 auto" },
  sectionTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "60px",
    color: "#1a1a1a",
  },
  stepGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px",
  },
  stepCard: { textAlign: "center", padding: "20px" },
  stepIcon: { fontSize: "3rem", marginBottom: "20px" },
  stepTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "12px",
    color: "#1a1a1a",
  },
  stepText: { color: "#64748b", lineHeight: "1.6" },

  emergencyBanner: {
    margin: "40px 20px",
    borderRadius: "24px",
    padding: "40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "24px",
    maxWidth: "1100px",
    marginLeft: "auto",
    marginRight: "auto",
    color: "white",
  },
  bannerContent: { maxWidth: "600px" },
  bannerBtn: {
    padding: "14px 28px",
    background: "white",
    color: "rgb(177, 18, 38)",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "1rem",
  },
};
