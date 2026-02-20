import { useEffect, useState } from "react";
import {
  getAllRequests,
  acceptRequest,
  completeRequest,
} from "../services/bloodRequestService";

// Haversine formula to calculate distance in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: null, lon: null });
  const [hoverId, setHoverId] = useState(null);

  // Get current logged-in user
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const userProvince = localStorage.getItem("province") || "Bagmati";

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setMyLocation({ lat, lon });
          getAllRequests(lat, lon, userProvince).then((res) =>
            setRequests(res.data.requests),
          );
        },
        () => {
          getAllRequests(undefined, undefined, userProvince).then((res) =>
            setRequests(res.data.requests),
          );
        },
      );
    } else {
      getAllRequests(undefined, undefined, userProvince).then((res) =>
        setRequests(res.data.requests),
      );
    }
  }, []);

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
      alert("Request accepted ✅");
      // Refresh requests
      const userProvince = localStorage.getItem("province") || "Bagmati";
      getAllRequests(undefined, undefined, userProvince).then((res) =>
        setRequests(res.data.requests),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeRequest(id);
      alert("Request completed 🎯");
      const userProvince = localStorage.getItem("province") || "Bagmati";
      getAllRequests(undefined, undefined, userProvince).then((res) =>
        setRequests(res.data.requests),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete request");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.title}>Available Blood Requests</h2>
          <p style={styles.subtitle}>
            Every drop counts. Help someone near you today.
          </p>
        </header>

        <div style={styles.grid}>
          {requestsWithDistance.map((r) => (
            <div
              key={r._id}
              onMouseEnter={() => setHoverId(r._id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                ...styles.card,
                transform:
                  hoverId === r._id ? "translateY(-8px)" : "translateY(0)",
                boxShadow:
                  hoverId === r._id
                    ? "0 15px 35px rgba(0,0,0,0.1)"
                    : "0 8px 20px rgba(0,0,0,0.04)",
                borderTop:
                  r.urgency === "critical"
                    ? "6px solid #d32f2f"
                    : "6px solid transparent",
              }}
            >
              {/* Top Section */}
              <div style={styles.cardTop}>
                <div style={styles.bloodBadge}>
                  <span style={styles.labelSmall}>Blood Group</span>
                  <span style={styles.bloodType}>{r.bloodType}</span>
                </div>
                <div
                  style={{
                    ...styles.urgencyBadge,
                    backgroundColor:
                      r.urgency === "critical" ? "#fff5f5" : "#f8f9fa",
                    color: r.urgency === "critical" ? "#d32f2f" : "#636e72",
                    border:
                      r.urgency === "critical"
                        ? "1px solid #feb2b2"
                        : "1px solid #e0e0e0",
                  }}
                >
                  {r.urgency}
                </div>
              </div>

              {/* Info */}
              <div style={styles.cardBody}>
                <div style={styles.infoGroup}>
                  <label style={styles.fieldLabel}>Hospital Name:</label>
                  <h3 style={styles.hospitalName}>🏥 {r.hospital}</h3>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.fieldLabel}>Units:</span>
                  <span style={styles.fieldValue}>{r.units} Units</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.fieldLabel}>Location:</span>
                  <span style={styles.fieldValue}>
                    {r.district}, {r.province}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.fieldLabel}>Urgency:</span>
                  <span
                    style={{
                      ...styles.fieldValue,
                      color: r.urgency === "critical" ? "#d32f2f" : "#2d3436",
                    }}
                  >
                    {r.urgency}
                  </span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.fieldLabel}>Contact:</span>
                  <span style={styles.fieldValue}>{r.contactPhone}</span>
                </div>

                {r.distance && (
                  <div style={styles.distanceAlert}>
                    🚗 <b>{r.distance} km</b> away from your current position
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={styles.actionArea}>
                <a
                  href={`tel:${r.contactPhone}`}
                  style={{ ...styles.actionBtn, backgroundColor: "#d32f2f" }}
                >
                  Call
                </a>
                <a
                  href={`https://wa.me/${r.contactPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.actionBtn, backgroundColor: "#25D366" }}
                >
                  WhatsApp
                </a>
                {r.location?.lat && (
                  <a
                    href={`http://maps.google.com/?q=${r.location.lat},${r.location.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...styles.actionBtn, backgroundColor: "#4285F4" }}
                  >
                    Map
                  </a>
                )}

                {/* Accept / Complete buttons */}
                {r.status === "pending" &&
                  currentUser.userType?.includes("donor") && (
                    <button
                      style={{
                        ...styles.actionBtn,
                        backgroundColor: "#1976d2",
                      }}
                      onClick={() => handleAccept(r._id)}
                    >
                      Accept
                    </button>
                  )}

                {r.status === "accepted" && r.acceptedBy === currentUser.id && (
                  <button
                    style={{ ...styles.actionBtn, backgroundColor: "#FF9800" }}
                    onClick={() => handleComplete(r._id)}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "20px" },
  container: { maxWidth: "900px", margin: "0 auto" },
  header: { marginBottom: "20px" },
  title: { fontSize: "28px", fontWeight: "600" },
  subtitle: { fontSize: "16px", color: "#555" },
  grid: { display: "flex", flexWrap: "wrap", gap: "20px" },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "15px",
    flex: "1 1 300px",
    transition: "0.3s",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  bloodBadge: { display: "flex", flexDirection: "column" },
  labelSmall: { fontSize: "12px", color: "#555" },
  bloodType: { fontSize: "20px", fontWeight: "600" },
  urgencyBadge: { padding: "4px 8px", borderRadius: "6px", fontSize: "12px" },
  cardBody: {},
  infoGroup: { marginBottom: "10px" },
  hospitalName: { margin: "0" },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "5px",
  },
  fieldLabel: { fontWeight: "500" },
  fieldValue: {},
  distanceAlert: { marginTop: "10px", fontWeight: "500" },
  actionArea: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "10px",
  },
  actionBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    color: "#fff",
    textDecoration: "none",
  },
  acceptBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    backgroundColor: "#ff9800",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  completeBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    backgroundColor: "#4caf50",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
