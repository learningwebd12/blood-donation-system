import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllRequests,
  acceptRequest,
  completeRequest,
} from "../services/bloodRequestService";

// Distance calculator
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(true);

  const brandColor = "rgb(177, 18, 38)";
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userProvince = localStorage.getItem("province") || "Bagmati";

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getAllRequests(undefined, undefined, userProvince);
        setRequests(res.data.requests || []);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMyLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
          fetchRequests();
        },
        () => fetchRequests(),
      );
    } else {
      fetchRequests();
    }
  }, [userProvince]);

  const requestsWithDistance = requests.map((r) => {
    if (myLocation.lat && r.location?.lat) {
      const distance = calculateDistance(
        myLocation.lat,
        myLocation.lon,
        r.location.lat,
        r.location.lon,
      );
      return { ...r, distance: distance.toFixed(1) };
    }
    return r;
  });

  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, status: "accepted", acceptedBy: currentUser._id }
            : r,
        ),
      );
      alert("Request Accepted ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeRequest(id);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      alert("Request Completed 🎯");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete request");
    }
  };

  return (
    <div style={styles.page}>
      <style>{`
        .action-button {
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          border: none;
          text-decoration: none;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          filter: brightness(1.1);
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <h1 style={{ ...styles.title, color: brandColor }}>
          🩸 Urgent Requests
        </h1>
        <p style={styles.subtitle}>
          Find people near you who need immediate help. Every drop counts.
        </p>
      </motion.div>

      {loading ? (
        <div style={styles.loadingBox}>
          <div className="spinner"></div>
          <p>Finding urgent requests...</p>
        </div>
      ) : requestsWithDistance.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.emptyBox}
        >
          <p style={{ fontSize: "1.2rem", color: "#64748b" }}>
            No active requests in {userProvince}.
          </p>
          <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
            Check back later or change your location settings.
          </p>
        </motion.div>
      ) : (
        <div style={styles.grid}>
          <AnimatePresence>
            {requestsWithDistance.map((r, index) => {
              const isAcceptedByMe =
                r.acceptedBy === currentUser._id ||
                r.acceptedBy?._id === currentUser._id;

              return (
                <motion.div
                  key={r._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  style={styles.card}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.bloodGroup}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          display: "block",
                          color: "#94a3b8",
                        }}
                      >
                        GROUP
                      </span>
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "800",
                          color: brandColor,
                        }}
                      >
                        {r.bloodType}
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background:
                            r.status === "pending"
                              ? "rgba(255, 152, 0, 0.1)"
                              : "rgba(177, 18, 38, 0.1)",
                          color:
                            r.status === "pending" ? "#f59e0b" : brandColor,
                        }}
                      >
                        {r.status === "pending"
                          ? "● Seeking Donor"
                          : "✓ Accepted"}
                      </span>
                    </div>
                  </div>

                  <div style={styles.hospitalRow}>
                    <h3 style={styles.hospitalName}>🏥 {r.hospital}</h3>
                    <p style={styles.locationSub}>
                      {r.district}, {r.province}
                    </p>
                  </div>

                  <div style={styles.statsGrid}>
                    <div style={styles.statBox}>
                      <span style={styles.statLabel}>UNITS</span>
                      <span style={styles.statValue}>{r.units}</span>
                    </div>
                    <div style={styles.statBox}>
                      <span style={styles.statLabel}>PATIENT</span>
                      <span style={styles.statValue}>
                        {r.patientName || "Confidential"}
                      </span>
                    </div>
                  </div>

                  {r.distance && (
                    <div
                      style={{
                        ...styles.distanceTag,
                        backgroundColor: "rgba(177, 18, 38, 0.05)",
                        color: brandColor,
                      }}
                    >
                      📍 {r.distance} km from your location
                    </div>
                  )}

                  <div style={styles.footer}>
                    <p style={styles.requestedBy}>
                      Posted by:{" "}
                      <span style={{ fontWeight: "600", color: "#334155" }}>
                        {r.requester?.name || "User"}
                      </span>
                    </p>

                    <div style={styles.buttonGroup}>
                      {currentUser.userType?.includes("donor") &&
                        r.status === "pending" && (
                          <button
                            className="action-button"
                            style={{
                              background: brandColor,
                              color: "white",
                              width: "100%",
                              padding: "12px",
                            }}
                            onClick={() => handleAccept(r._id)}
                          >
                            Accept to Save Life
                          </button>
                        )}

                      {r.status === "accepted" && isAcceptedByMe && (
                        <div style={styles.acceptedActions}>
                          <a
                            href={`tel:${r.contactPhone}`}
                            className="action-button"
                            style={{
                              background: "#2563eb",
                              color: "white",
                              flex: 1,
                              padding: "10px",
                            }}
                          >
                            📞 Call
                          </a>
                          <a
                            href={`https://wa.me/${r.contactPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="action-button"
                            style={{
                              background: "#22c55e",
                              color: "white",
                              flex: 1,
                              padding: "10px",
                            }}
                          >
                            💬 Chat
                          </a>
                          <button
                            className="action-button"
                            style={{
                              background: "#1e293b",
                              color: "white",
                              width: "100%",
                              padding: "12px",
                              marginTop: "8px",
                            }}
                            onClick={() => handleComplete(r._id)}
                          >
                            Mark as Completed
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    background:
      "linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #f8fafc 100%)",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "2.4rem", fontWeight: "800", marginBottom: "10px" },
  subtitle: { color: "#64748b", fontSize: "1.1rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "25px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  bloodGroup: {
    background: "rgba(177, 18, 38, 0.05)",
    padding: "10px 15px",
    borderRadius: "16px",
    textAlign: "center",
    minWidth: "70px",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  hospitalRow: { marginBottom: "18px" },
  hospitalName: {
    fontSize: "1.15rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  locationSub: { fontSize: "0.9rem", color: "#64748b", margin: 0 },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "18px",
  },
  statBox: {
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid #edf2f7",
  },
  statLabel: {
    display: "block",
    fontSize: "0.7rem",
    color: "#94a3b8",
    fontWeight: "700",
    marginBottom: "2px",
  },
  statValue: { fontSize: "0.95rem", fontWeight: "600", color: "#334155" },
  distanceTag: {
    padding: "10px",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "20px",
  },
  requestedBy: { fontSize: "0.85rem", color: "#94a3b8", marginBottom: "15px" },
  acceptedActions: { display: "flex", flexWrap: "wrap", gap: "8px" },
  loadingBox: { textAlign: "center", padding: "100px 0", color: "#64748b" },
  emptyBox: {
    background: "white",
    padding: "60px",
    borderRadius: "24px",
    textAlign: "center",
    maxWidth: "500px",
    margin: "0 auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
};
