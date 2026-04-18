import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/profile/me")
      .then((res) => {
        setUser(res.data.user);
        setEligibility(res.data.eligibility);
        if (!res.data.user.profileComplete) navigate("/complete-profile");
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
    <div style={styles.pageContainer}>
      {/* Banner / Header Section - Spans Full Width */}
      <div style={styles.fullBanner}>
        <div style={styles.avatarCircle}>
          {user.bloodType ? (
            <span style={styles.bloodSymbol}>{user.bloodType}</span>
          ) : (
            "👤"
          )}
        </div>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <h2 style={styles.name}>{user.name}</h2>
          <div style={styles.badge}>
            {user.userType?.includes("donor") ? "⭐ Active Donor" : "Receiver"}
          </div>
          <p style={styles.locationText}>
            📍 {user.location?.district}, {user.location?.province}
          </p>
        </div>

        {/* Info Grid - Adjusted for Full Width Scannability */}
        <div style={styles.statsGrid}>
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
            <span style={styles.value}>{user.healthInfo?.gender || "--"}</span>
          </div>
        </div>

        <div style={styles.sectionLayout}>
          {/* Left Column: Contact Details */}
          <div style={styles.column}>
            <h3 style={styles.sectionTitle}>Contact Information</h3>
            <div style={styles.contactCard}>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>📞</span>
                <span>{user.phone}</span>
              </div>
              <div style={styles.contactItem}>
                <span style={styles.contactIcon}>✉️</span>
                <span>{user.email || "Add email"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Donation Eligibility (Donors only) */}
          {user.userType?.includes("donor") && eligibility && (
            <div style={styles.column}>
              <h3 style={styles.sectionTitle}>Donation Status</h3>
              <div style={styles.donationContainer}>
                <div style={styles.donationGrid}>
                  <div style={styles.donationBox}>
                    <span style={styles.donationLabel}>TOTAL DONATIONS</span>
                    <span style={styles.donationValue}>
                      {eligibility.totalDonations || 0}
                    </span>
                  </div>
                  <div style={styles.donationBox}>
                    <span style={styles.donationLabel}>LAST DONATION</span>
                    <span style={styles.donationValue}>
                      {eligibility.lastDonationDate
                        ? new Date(
                            eligibility.lastDonationDate,
                          ).toLocaleDateString("en-GB")
                        : "Never"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    ...styles.eligibilityBanner,
                    background: eligibility.canDonate ? "#ecfdf5" : "#fff7ed",
                    color: eligibility.canDonate ? "#166534" : "#c2410c",
                    border: eligibility.canDonate
                      ? "1px solid #86efac"
                      : "1px solid #fdba74",
                  }}
                >
                  {eligibility.canDonate
                    ? "✅ You are eligible to donate now"
                    : `⏳ Eligible in ${eligibility.remainingDays} days`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={styles.footer}>
          <button
            style={styles.editBtn}
            onClick={() => navigate("/complete-profile")}
          >
            Edit Profile
          </button>
          <button
            style={styles.logoutBtn}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Log Out Account
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "#f8fafc",
    width: "100%",
  },
  fullBanner: {
    height: "160px",
    background: "linear-gradient(135deg, #d32f2f 0%, #7c0a18 100%)",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  avatarCircle: {
    width: "120px",
    height: "120px",
    background: "#fff",
    borderRadius: "50%",
    position: "absolute",
    bottom: "-60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "6px solid #f8fafc",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  bloodSymbol: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#d32f2f",
  },
  mainContent: {
    maxWidth: "1000px", // Limits content width for readability, but page is full width
    margin: "80px auto 0 auto",
    padding: "0 20px 40px 20px",
    textAlign: "center",
  },
  header: {
    marginBottom: "40px",
  },
  name: {
    fontSize: "2.2rem",
    margin: "0 0 10px 0",
    color: "#1e293b",
    fontWeight: "800",
  },
  badge: {
    display: "inline-block",
    padding: "6px 16px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "30px",
    fontSize: "0.9rem",
    fontWeight: "700",
    marginBottom: "10px",
  },
  locationText: {
    color: "#64748b",
    fontSize: "1.1rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "40px",
  },
  infoBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
    border: "1px solid #e2e8f0",
  },
  label: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    fontWeight: "800",
    display: "block",
    marginBottom: "5px",
  },
  value: {
    fontSize: "1.4rem",
    fontWeight: "800",
    color: "#0f172a",
  },
  sectionLayout: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    textAlign: "left",
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "1.2rem",
    color: "#334155",
    fontWeight: "700",
    marginBottom: "15px",
    paddingLeft: "5px",
  },
  contactCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
    fontSize: "1.1rem",
    color: "#475569",
  },
  contactIcon: { fontSize: "1.4rem" },
  donationContainer: {
    background: "#fff",
    padding: "25px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
  },
  donationGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginBottom: "20px",
  },
  donationBox: {
    background: "#f1f5f9",
    padding: "15px",
    borderRadius: "15px",
    textAlign: "center",
  },
  donationLabel: {
    fontSize: "0.7rem",
    fontWeight: "700",
    color: "#64748b",
    display: "block",
  },
  donationValue: {
    fontSize: "1.3rem",
    fontWeight: "800",
    color: "#b91c1c",
  },
  eligibilityBanner: {
    padding: "15px",
    borderRadius: "15px",
    textAlign: "center",
    fontWeight: "700",
  },
  footer: {
    borderTop: "1px solid #e2e8f0",
    paddingTop: "30px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  editBtn: {
    padding: "15px 40px",
    background: "#b91c1c",
    color: "#fff",
    border: "none",
    borderRadius: "15px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    maxWidth: "300px",
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: "1rem",
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
