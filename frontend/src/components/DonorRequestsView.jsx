import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllRequests,
  acceptRequest,
  markAsDonated,
} from "../services/bloodRequestService";

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
    return null;
  }

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

export default function DonorRequestsView() {
  const [requests, setRequests] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("priority");

  const brandColor = "rgb(177, 18, 38)";
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const userProvince = currentUser?.location?.province || "Bagmati";
  const userDistrict = currentUser?.location?.district || "";

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await getAllRequests(undefined, undefined, userProvince);

        const donorVisibleRequests = (res.data.requests || []).filter((r) => {
          const isMine =
            r.acceptedBy === currentUser._id ||
            r.acceptedBy?._id === currentUser._id;

          return (
            r.status === "pending" ||
            (r.status === "accepted" && isMine) ||
            (r.status === "waiting_confirmation" && isMine)
          );
        });

        setRequests(donorVisibleRequests);
      } catch (error) {
        console.error("Fetch failed", error);
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
  }, [userProvince, currentUser?._id]);

  const sortedRequests = useMemo(() => {
    const normalize = (v) => (v || "").toString().trim().toLowerCase();

    const urgencyMap = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    const processed = requests.map((r) => ({
      ...r,
      distanceValue: calculateDistance(
        myLocation.lat,
        myLocation.lon,
        r.location?.lat,
        r.location?.lon,
      ),
    }));

    const copy = [...processed];

    if (activeFilter === "nearest") {
      return copy.sort((a, b) => {
        const da =
          typeof a.distanceValue === "number" ? a.distanceValue : Infinity;
        const db =
          typeof b.distanceValue === "number" ? b.distanceValue : Infinity;

        if (da !== db) return da - db;
        return (urgencyMap[b.urgency] || 0) - (urgencyMap[a.urgency] || 0);
      });
    }

    if (activeFilter === "urgent") {
      return copy.sort((a, b) => {
        const ua = urgencyMap[a.urgency] || 0;
        const ub = urgencyMap[b.urgency] || 0;

        if (ub !== ua) return ub - ua;

        const da =
          typeof a.distanceValue === "number" ? a.distanceValue : Infinity;
        const db =
          typeof b.distanceValue === "number" ? b.distanceValue : Infinity;

        return da - db;
      });
    }

    return copy.sort((a, b) => {
      const aSameDistrict = normalize(a.district) === normalize(userDistrict);
      const bSameDistrict = normalize(b.district) === normalize(userDistrict);

      const aSameProvince = normalize(a.province) === normalize(userProvince);
      const bSameProvince = normalize(b.province) === normalize(userProvince);

      const getScore = (sameDistrict, sameProvince) => {
        if (sameDistrict) return 2;
        if (sameProvince) return 1;
        return 0;
      };

      const aScore = getScore(aSameDistrict, aSameProvince);
      const bScore = getScore(bSameDistrict, bSameProvince);

      if (bScore !== aScore) return bScore - aScore;

      const ua = urgencyMap[a.urgency] || 0;
      const ub = urgencyMap[b.urgency] || 0;

      if (ub !== ua) return ub - ua;

      const da =
        typeof a.distanceValue === "number" ? a.distanceValue : Infinity;
      const db =
        typeof b.distanceValue === "number" ? b.distanceValue : Infinity;

      return da - db;
    });
  }, [
    requests,
    activeFilter,
    myLocation.lat,
    myLocation.lon,
    userDistrict,
    userProvince,
  ]);

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
      alert(err.response?.data?.message || "Failed to accept");
    }
  };

  const handleMarkDonated = async (id) => {
    try {
      await markAsDonated(id);

      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "waiting_confirmation" } : r,
        ),
      );

      alert("Marked as donated. Waiting for requester confirmation ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark as donated");
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center", padding: "30px" }}>Loading...</h2>;
  }

  return (
    <div style={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.header}
      >
        <h1 style={{ ...styles.title, color: brandColor }}>
          🩸 Donor Requests
        </h1>

        <div style={styles.filterContainer}>
          {["priority", "nearest", "urgent"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                ...styles.filterBtn,
                ...(activeFilter === f ? styles.activeFilter : {}),
              }}
            >
              {f === "priority" && "Priority"}
              {f === "nearest" && "Nearest"}
              {f === "urgent" && "Urgent"}
            </button>
          ))}
        </div>

        <p style={styles.filterText}>
          {activeFilter === "priority" &&
            "Showing same district first, then province, then urgency"}
          {activeFilter === "nearest" && "Showing nearest requests first"}
          {activeFilter === "urgent" && "Showing most urgent requests first"}
        </p>
      </motion.div>

      {sortedRequests.length === 0 ? (
        <div style={styles.emptyBox}>No requests found.</div>
      ) : (
        <div style={styles.grid}>
          <AnimatePresence mode="popLayout">
            {sortedRequests.map((r) => {
              const isAcceptedByMe =
                r.acceptedBy === currentUser._id ||
                r.acceptedBy?._id === currentUser._id;

              const isSameDistrict =
                (r.district || "").toLowerCase().trim() ===
                (userDistrict || "").toLowerCase().trim();

              return (
                <motion.div
                  key={r._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={styles.card}
                >
                  {isSameDistrict ? (
                    <div style={styles.nearbyTag}>Same District</div>
                  ) : (
                    <div style={styles.provinceTag}>Same Province</div>
                  )}

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
                          r.urgency === "critical"
                            ? "rgba(177, 18, 38, 0.1)"
                            : r.urgency === "high"
                              ? "rgba(249, 115, 22, 0.1)"
                              : r.urgency === "medium"
                                ? "rgba(234, 179, 8, 0.1)"
                                : "rgba(34, 197, 94, 0.1)",
                        color:
                          r.urgency === "critical"
                            ? brandColor
                            : r.urgency === "high"
                              ? "#ea580c"
                              : r.urgency === "medium"
                                ? "#ca8a04"
                                : "#22c55e",
                        border:
                          r.urgency === "critical"
                            ? `1px solid ${brandColor}`
                            : r.urgency === "high"
                              ? "1px solid #ea580c"
                              : r.urgency === "medium"
                                ? "1px solid #ca8a04"
                                : "1px solid #22c55e",
                      }}
                    >
                      {r.urgency?.toUpperCase()}
                    </span>
                  </div>

                  <div style={styles.hospitalInfo}>
                    <h3 style={styles.hospitalName}>🏥 {r.hospital}</h3>
                    <p style={styles.locationSub}>
                      {r.district}, {r.province}
                    </p>
                    <p style={styles.postedBy}>
                      Patient: <b>{r.patientName}</b>
                    </p>

                    {activeFilter === "nearest" && r.distanceValue !== null && (
                      <p style={styles.modeInfoNearest}>
                        Nearest: {r.distanceValue.toFixed(1)} km
                      </p>
                    )}

                    {activeFilter === "urgent" && (
                      <p style={styles.modeInfoUrgent}>
                        Urgency: {r.urgency?.toUpperCase()}
                      </p>
                    )}
                  </div>

                  <div style={styles.statsRow}>
                    <div style={styles.statItem}>
                      <span style={styles.statLabel}>UNITS</span>
                      <span style={styles.statValue}>{r.units} Pint</span>
                    </div>
                    <div style={styles.statItem}>
                      <span style={styles.statLabel}>PHONE</span>
                      <span style={styles.statValue}>{r.contactPhone}</span>
                    </div>
                  </div>

                  {r.distanceValue !== null && (
                    <div style={styles.distanceBadge}>
                      📍 {r.distanceValue.toFixed(1)} km away
                    </div>
                  )}

                  <div style={styles.actions}>
                    {currentUser?.userType?.includes("donor") &&
                      r.status === "pending" && (
                        <button
                          style={{
                            ...styles.btn,
                            background: brandColor,
                            width: "100%",
                          }}
                          onClick={() => handleAccept(r._id)}
                        >
                          Accept to Save Life
                        </button>
                      )}

                    {r.status === "accepted" && isAcceptedByMe && (
                      <div style={styles.acceptedGrid}>
                        <a
                          href={`tel:${r.contactPhone}`}
                          style={{
                            ...styles.btn,
                            background: "#2563eb",
                            flex: 1,
                          }}
                        >
                          📞 Call
                        </a>

                        <a
                          href={`https://wa.me/${r.contactPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            ...styles.btn,
                            background: "#1faa59",
                            flex: 1,
                          }}
                        >
                          💬 WhatsApp
                        </a>

                        {r.location?.lat && r.location?.lon && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${r.location.lat},${r.location.lon}`}
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
                          onClick={() => handleMarkDonated(r._id)}
                        >
                          Mark as Donated
                        </button>
                      </div>
                    )}

                    {r.status === "waiting_confirmation" && isAcceptedByMe && (
                      <div style={styles.waitBox}>
                        Waiting for requester confirmation ⏳
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
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "800",
    marginBottom: "15px",
  },
  filterContainer: {
    display: "flex",
    gap: "8px",
    background: "#f1f5f9",
    padding: "6px",
    borderRadius: "14px",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
  },
  filterBtn: {
    padding: "8px 20px",
    border: "none",
    borderRadius: "10px",
    fontSize: "0.85rem",
    fontWeight: "700",
    cursor: "pointer",
    color: "#64748b",
    background: "transparent",
    transition: "0.3s",
  },
  activeFilter: {
    background: "#fff",
    color: "rgb(177, 18, 38)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  filterText: {
    marginTop: "12px",
    color: "#64748b",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
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
    position: "relative",
  },
  nearbyTag: {
    position: "absolute",
    top: "-10px",
    right: "20px",
    background: "#1faa59",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "8px",
    fontSize: "0.7rem",
    fontWeight: "bold",
    zIndex: 1,
  },
  provinceTag: {
    position: "absolute",
    top: "-10px",
    right: "20px",
    background: "#2563eb",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "8px",
    fontSize: "0.7rem",
    fontWeight: "bold",
    zIndex: 1,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
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
  groupValue: {
    fontSize: "1.4rem",
    fontWeight: "800",
  },
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
  locationSub: {
    fontSize: "0.9rem",
    color: "#64748b",
    margin: "4px 0",
  },
  postedBy: {
    fontSize: "0.85rem",
    color: "#94a3b8",
    margin: 0,
  },
  modeInfoNearest: {
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#2563eb",
    margin: "4px 0 0",
  },
  modeInfoUrgent: {
    fontSize: "0.8rem",
    fontWeight: "700",
    color: "#dc2626",
    margin: "4px 0 0",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    margin: "15px 0",
  },
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
  statValue: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#334155",
  },
  distanceBadge: {
    background: "rgba(177, 18, 38, 0.05)",
    color: "rgb(177, 18, 38)",
    padding: "10px",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "10px",
  },
  actions: {
    marginTop: "10px",
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
    transition: "0.2s",
  },
  acceptedGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  waitBox: {
    marginTop: "10px",
    background: "#fff7ed",
    color: "#c2410c",
    padding: "12px",
    borderRadius: "12px",
    fontWeight: "700",
    textAlign: "center",
    border: "1px solid #fdba74",
  },
  emptyBox: {
    textAlign: "center",
    padding: "50px",
    color: "#64748b",
    background: "#fff",
    borderRadius: "20px",
  },
};
