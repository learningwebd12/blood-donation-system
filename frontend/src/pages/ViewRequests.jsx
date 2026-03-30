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
            ? {
                ...r,
                status: "accepted",
                acceptedBy: currentUser._id,
              }
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
        transition={{ duration: 0.6 }}
        style={styles.header}
      >
        <h1 style={styles.title}>🩸 Available Blood Requests</h1>
        <p style={styles.subtitle}>
          Help save lives by accepting nearby urgent blood requests.
        </p>
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.loadingBox}
        >
          Loading requests...
        </motion.div>
      ) : requestsWithDistance.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.emptyBox}
        >
          No blood requests found in your province.
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
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  style={styles.card}
                >
                  <div style={styles.cardTop}>
                    <div>
                      <h3 style={styles.hospital}>🏥 {r.hospital}</h3>
                      <p style={styles.requester}>
                        Requested By:{" "}
                        <span style={styles.highlight}>
                          {r.requester?.name || "Unknown User"}
                        </span>
                      </p>
                    </div>

                    <span
                      style={{
                        ...styles.statusBadge,
                        background:
                          r.status === "pending"
                            ? "rgba(255, 152, 0, 0.15)"
                            : "rgba(76, 175, 80, 0.15)",
                        color: r.status === "pending" ? "#ff9800" : "#4caf50",
                      }}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span style={styles.label}>Blood Group</span>
                      <span style={styles.value}>{r.bloodType}</span>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.label}>Units</span>
                      <span style={styles.value}>{r.units}</span>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.label}>Location</span>
                      <span style={styles.value}>
                        {r.district}, {r.province}
                      </span>
                    </div>

                    <div style={styles.infoItem}>
                      <span style={styles.label}>Contact</span>
                      <span style={styles.value}>{r.contactPhone}</span>
                    </div>
                  </div>

                  {r.distance && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={styles.distance}
                    >
                      🚗 {r.distance} km away from you
                    </motion.div>
                  )}

                  <div style={styles.actions}>
                    {currentUser.userType?.includes("donor") &&
                      r.status === "pending" && (
                        <motion.button
                          whileHover={{ scale: 1.06 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ ...styles.button, ...styles.acceptBtn }}
                          onClick={() => handleAccept(r._id)}
                        >
                          Accept Request
                        </motion.button>
                      )}

                    {currentUser.userType?.includes("donor") &&
                      r.status === "accepted" &&
                      isAcceptedByMe && (
                        <>
                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={`tel:${r.contactPhone}`}
                            style={{ ...styles.button, ...styles.callBtn }}
                          >
                            📞 Call
                          </motion.a>

                          <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={`https://wa.me/${r.contactPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ ...styles.button, ...styles.whatsappBtn }}
                          >
                            💬 WhatsApp
                          </motion.a>

                          {r.location?.lat && (
                            <motion.a
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              href={`http://maps.google.com/?q=${r.location.lat},${r.location.lon}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ ...styles.button, ...styles.mapBtn }}
                            >
                              📍 Map
                            </motion.a>
                          )}

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ ...styles.button, ...styles.completeBtn }}
                            onClick={() => handleComplete(r._id)}
                          >
                            ✅ Complete
                          </motion.button>
                        </>
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
    padding: "30px 20px",
    background:
      "linear-gradient(135deg, #ffe6e6 0%, #ffffff 40%, #fff0f6 100%)",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "2.2rem",
    marginBottom: "8px",
    color: "#b71c1c",
    fontWeight: "700",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "1rem",
  },

  loadingBox: {
    textAlign: "center",
    padding: "40px",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    maxWidth: "500px",
    margin: "0 auto",
  },

  emptyBox: {
    textAlign: "center",
    padding: "40px",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
    maxWidth: "500px",
    margin: "0 auto",
    color: "#777",
    fontWeight: "600",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "22px",
  },

  card: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(10px)",
    borderRadius: "22px",
    padding: "22px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid rgba(255,255,255,0.5)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "18px",
  },

  hospital: {
    margin: 0,
    fontSize: "1.2rem",
    color: "#d32f2f",
  },

  requester: {
    marginTop: "8px",
    color: "#555",
    fontSize: "0.95rem",
  },

  highlight: {
    fontWeight: "700",
    color: "#111",
  },

  statusBadge: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: "700",
    textTransform: "capitalize",
    whiteSpace: "nowrap",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "16px",
  },

  infoItem: {
    background: "#fff",
    borderRadius: "14px",
    padding: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  label: {
    display: "block",
    fontSize: "0.8rem",
    color: "#888",
    marginBottom: "4px",
  },

  value: {
    fontWeight: "700",
    color: "#222",
  },

  distance: {
    marginBottom: "16px",
    padding: "10px 14px",
    borderRadius: "12px",
    background: "rgba(25, 118, 210, 0.08)",
    color: "#1976d2",
    fontWeight: "600",
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "10px",
  },

  button: {
    border: "none",
    borderRadius: "12px",
    padding: "11px 16px",
    color: "#fff",
    cursor: "pointer",
    textDecoration: "none",
    fontWeight: "700",
    fontSize: "0.92rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
  },

  acceptBtn: {
    background: "linear-gradient(135deg, #d32f2f, #f44336)",
  },

  callBtn: {
    background: "linear-gradient(135deg, #c62828, #e53935)",
  },

  whatsappBtn: {
    background: "linear-gradient(135deg, #1faa59, #25D366)",
  },

  mapBtn: {
    background: "linear-gradient(135deg, #1565c0, #4285F4)",
  },

  completeBtn: {
    background: "linear-gradient(135deg, #ef6c00, #ff9800)",
  },
};
