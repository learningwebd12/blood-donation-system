import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllRequests,
  acceptRequest,
  completeRequest,
} from "../services/bloodRequestService";

// Distance calculator logic preserved
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
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <h1 style={{ ...styles.title, color: brandColor }}>
          🩸 Urgent Requests
        </h1>
        <p style={styles.subtitle}>
          Every drop counts. Find someone nearby who needs your help.
        </p>
      </motion.div>

      {loading ? (
        <div style={styles.loadingBox}>Searching for requests...</div>
      ) : requestsWithDistance.length === 0 ? (
        <div style={styles.emptyBox}>No active requests in {userProvince}.</div>
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
                      <span style={styles.groupLabel}>BLOOD TYPE</span>
                      <span style={{ ...styles.groupValue, color: brandColor }}>
                        {r.bloodType}
                      </span>
                    </div>
                    <span
                      style={{
                        ...styles.statusBadge,
                        background:
                          r.status === "pending"
                            ? "rgba(255, 152, 0, 0.1)"
                            : "rgba(34, 197, 94, 0.1)",
                        color: r.status === "pending" ? "#f59e0b" : "#22c55e",
                      }}
                    >
                      {r.status === "pending" ? "Seeking Donor" : "Accepted"}
                    </span>
                  </div>

                  <div style={styles.hospitalInfo}>
                    <h3 style={styles.hospitalName}>🏥 {r.hospital}</h3>
                    <p style={styles.locationSub}>
                      {r.district}, {r.province}
                    </p>
                    <p style={styles.postedBy}>
                      Posted by: <b>{r.requester?.name || "User"}</b>
                    </p>
                  </div>

                  <div style={styles.statsRow}>
                    <div style={styles.statItem}>
                      <span style={styles.statLabel}>UNITS NEEDED</span>
                      <span style={styles.statValue}>{r.units}</span>
                    </div>
                    <div style={styles.statItem}>
                      <span style={styles.statLabel}>PHONE</span>
                      <span style={styles.statValue}>{r.contactPhone}</span>
                    </div>
                  </div>

                  {r.distance && (
                    <div style={styles.distanceBadge}>
                      📍 {r.distance} km from your current location
                    </div>
                  )}

                  <div style={styles.actions}>
                    {currentUser.userType?.includes("donor") &&
                      r.status === "pending" && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          style={{ ...styles.btn, background: brandColor }}
                          onClick={() => handleAccept(r._id)}
                        >
                          Accept to Save Life
                        </motion.button>
                      )}

                    {r.status === "accepted" && isAcceptedByMe && (
                      <div style={styles.acceptedGrid}>
                        <a
                          href={`tel:${r.contactPhone}`}
                          style={{ ...styles.btn, background: "#2563eb" }}
                        >
                          📞 Call
                        </a>
                        <a
                          href={`https://wa.me/${r.contactPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ ...styles.btn, background: "#1faa59" }}
                        >
                          💬 Chat
                        </a>

                        {/* MAP BUTTON RE-ADDED & FIXED */}
                        {r.location?.lat && (
                          <a
                            href={`https://www.google.com/maps?q=${r.location.lat},${r.location.lon}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              ...styles.btn,
                              background: "#4285F4",
                              width: "100%",
                            }}
                          >
                            📍 View on Map
                          </a>
                        )}

                        <button
                          style={{
                            ...styles.btn,
                            background: "#1e293b",
                            width: "100%",
                          }}
                          onClick={() => handleComplete(r._id)}
                        >
                          Mark as Completed
                        </button>
                      </div>
                    )}
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
    background: "#fdfdfd",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "2.2rem", fontWeight: "800", marginBottom: "10px" },
  subtitle: { color: "#64748b", fontSize: "1.1rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    border: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bloodGroup: {
    background: "#fff5f5",
    padding: "8px 12px",
    borderRadius: "12px",
    textAlign: "center",
  },
  groupLabel: {
    display: "block",
    fontSize: "0.65rem",
    fontWeight: "700",
    color: "#94a3b8",
  },
  groupValue: { fontSize: "1.4rem", fontWeight: "800" },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
  },
  hospitalName: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  locationSub: { fontSize: "0.9rem", color: "#64748b", margin: "4px 0" },
  postedBy: { fontSize: "0.85rem", color: "#94a3b8", margin: 0 },
  statsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  statItem: {
    background: "#f8fafc",
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid #edf2f7",
  },
  statLabel: {
    display: "block",
    fontSize: "0.65rem",
    color: "#94a3b8",
    fontWeight: "700",
  },
  statValue: { fontSize: "0.95rem", fontWeight: "600", color: "#334155" },
  distanceBadge: {
    background: "rgba(177, 18, 38, 0.05)",
    color: "rgb(177, 18, 38)",
    padding: "10px",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
    textAlign: "center",
  },
  btn: {
    border: "none",
    borderRadius: "12px",
    padding: "12px",
    color: "#fff",
    fontWeight: "700",
    fontSize: "0.9rem",
    cursor: "pointer",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.3s ease",
  },
  acceptedGrid: { display: "flex", flexWrap: "wrap", gap: "10px" },
  loadingBox: { textAlign: "center", padding: "50px", color: "#64748b" },
  emptyBox: {
    textAlign: "center",
    padding: "50px",
    color: "#64748b",
    background: "#fff",
    borderRadius: "20px",
  },
};
