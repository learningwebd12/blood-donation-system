import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile/me")
      .then((res) => {
        const userData = res.data.user;
        setUser(userData);
        if (!userData.profileComplete) navigate("/complete-profile");
      })
      .catch(() => alert("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading)
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.spinner}></div>
        <p>Fetching your health profile...</p>
      </div>
    );

  if (!user)
    return (
      <div style={styles.wrapper}>
        <p>No profile data found</p>
      </div>
    );

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* Banner Section */}
        <div style={styles.banner}>
          <div style={styles.avatarCircle}>
            {user.bloodType ? (
              <span style={styles.bloodSymbol}>{user.bloodType}</span>
            ) : (
              "👤"
            )}
          </div>
        </div>

        <div style={styles.content}>
          <div style={styles.header}>
            <h2 style={styles.name}>{user.name}</h2>
            <div style={styles.badge}>
              {user.userType?.includes("donor")
                ? "⭐ Active Donor"
                : "Receiver"}
            </div>
            <p style={styles.locationText}>
              📍 {user.location?.district}, {user.location?.province}
            </p>
          </div>

          <div style={styles.grid}>
            <div style={styles.infoBox}>
              <span style={styles.label}>AGE</span>
              <span style={styles.value}>{user.healthInfo?.age || "--"}</span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.label}>WEIGHT</span>
              <span style={styles.value}>
                {user.healthInfo?.weight || "--"} <small>kg</small>
              </span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.label}>GENDER</span>
              <span style={styles.value}>
                {user.healthInfo?.gender || "--"}
              </span>
            </div>
          </div>

          <div style={styles.contactSection}>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>📞</span>
              <span>{user.phone}</span>
            </div>
            <div style={styles.contactItem}>
              <span style={styles.contactIcon}>✉️</span>
              <span>{user.email || "Add email"}</span>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              style={styles.editBtn}
              onClick={() => navigate("/complete-profile")}
            >
              Edit Details
            </button>
            <button
              style={styles.logoutBtn}
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "90vh",
    background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  },
  banner: {
    height: "100px",
    background: "linear-gradient(90deg, #d32f2f 0%, #b11226 100%)",
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  avatarCircle: {
    width: "90px",
    height: "90px",
    background: "#fff",
    borderRadius: "50%",
    position: "absolute",
    bottom: "-45px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid #fff",
    boxShadow: "0 8px 15px rgba(0,0,0,0.1)",
  },
  bloodSymbol: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#d32f2f",
  },
  content: {
    padding: "60px 25px 30px 25px",
    textAlign: "center",
  },
  header: {
    marginBottom: "25px",
  },
  name: {
    margin: "0 0 5px 0",
    fontSize: "1.6rem",
    color: "#2d3436",
  },
  badge: {
    display: "inline-block",
    padding: "4px 12px",
    background: "#fff5f5",
    color: "#d32f2f",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
    marginBottom: "8px",
  },
  locationText: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#636e72",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    marginBottom: "30px",
  },
  infoBox: {
    padding: "15px 5px",
    background: "#f8f9fa",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "0.65rem",
    color: "#95a5a6",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    marginBottom: "4px",
  },
  value: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#2d3436",
  },
  contactSection: {
    textAlign: "left",
    background: "#fdfdfd",
    border: "1px solid #f0f0f0",
    padding: "15px",
    borderRadius: "15px",
    marginBottom: "25px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
    fontSize: "0.95rem",
    color: "#444",
  },
  contactIcon: {
    fontSize: "1.1rem",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  editBtn: {
    padding: "12px",
    border: "none",
    borderRadius: "12px",
    background: "#d32f2f",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  logoutBtn: {
    padding: "10px",
    border: "none",
    background: "transparent",
    color: "#636e72",
    fontSize: "0.9rem",
    cursor: "pointer",
    textDecoration: "underline",
  },
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #d32f2f",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px",
  },
};
