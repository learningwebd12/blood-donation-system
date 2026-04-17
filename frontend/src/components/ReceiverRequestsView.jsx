import { useEffect, useState } from "react";
import {
  getMyRequests,
  confirmBloodReceived,
} from "../services/bloodRequestService";

export default function ReceiverRequestsView() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const res = await getMyRequests();
      setRequests(res.data.requests || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleConfirmReceived = async (id) => {
    try {
      await confirmBloodReceived(id);
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "completed" } : r)),
      );
      alert("Blood received confirmed successfully ✅");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to confirm");
    }
  };

  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Fetching your requests...</p>
      </div>
    );

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>My Blood Requests</h1>
          <p style={styles.subtitle}>
            Track and manage your urgent blood requirements
          </p>
        </div>
        <div style={styles.countBadge}>{requests.length} Requests</div>
      </header>

      {requests.length === 0 ? (
        <div style={styles.emptyBox}>
          <span style={{ fontSize: "40px" }}>📁</span>
          <p style={{ color: "#64748b", marginTop: "10px" }}>
            No requests found in your history.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {requests.map((req) => (
            <div key={req._id} style={styles.card}>
              <div style={styles.topRow}>
                <div style={styles.bloodCircle}>{req.bloodType}</div>
                <span
                  style={{
                    ...styles.badge,
                    background: getStatusTheme(req.status).bg,
                    color: getStatusTheme(req.status).text,
                  }}
                >
                  {req.status.replace("_", " ")}
                </span>
              </div>

              <div style={styles.infoSection}>
                <InfoRow emoji="👤" label="Patient" value={req.patientName} />
                <InfoRow emoji="🏥" label="Hospital" value={req.hospital} />
                <InfoRow
                  emoji="📍"
                  label="Location"
                  value={`${req.district}, ${req.province}`}
                />
                <InfoRow
                  emoji="💉"
                  label="Units Required"
                  value={`${req.units} Units`}
                />
                <InfoRow emoji="📞" label="Contact" value={req.contactPhone} />
              </div>

              {req.acceptedBy && (
                <div style={styles.donorCard}>
                  <p style={styles.donorTitle}>Matched Donor Info</p>
                  <p style={styles.donorDetail}>
                    <strong>Name:</strong> {req.acceptedBy.name || "Anonymous"}
                  </p>
                  <p style={styles.donorDetail}>
                    <strong>Phone:</strong> {req.acceptedBy.phone || "N/A"}
                  </p>
                </div>
              )}

              {req.status === "waiting_confirmation" && (
                <button
                  onClick={() => handleConfirmReceived(req._id)}
                  style={styles.confirmBtn}
                  onMouseOver={(e) =>
                    (e.target.style.filter = "brightness(1.1)")
                  }
                  onMouseOut={(e) => (e.target.style.filter = "brightness(1)")}
                >
                  Confirm Blood Received
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper components for cleaner JSX
const InfoRow = ({ emoji, label, value }) => (
  <div style={styles.infoRow}>
    <span style={styles.emoji}>{emoji}</span>
    <div>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value}</span>
    </div>
  </div>
);

const getStatusTheme = (status) => {
  switch (status) {
    case "completed":
      return { bg: "#dcfce7", text: "#166534" };
    case "waiting_confirmation":
      return { bg: "#ffedd5", text: "#c2410c" };
    case "accepted":
      return { bg: "#dbeafe", text: "#1d4ed8" };
    default:
      return { bg: "#f1f5f9", text: "#475569" };
  }
};

const styles = {
  page: {
    padding: "40px 20px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  title: {
    color: "#1e293b",
    margin: 0,
    fontSize: "2.25rem",
    fontWeight: "800",
    letterSpacing: "-0.025em",
  },
  subtitle: {
    color: "#64748b",
    margin: "5px 0 0 0",
    fontSize: "1rem",
  },
  countBadge: {
    background: "#fff",
    padding: "8px 16px",
    borderRadius: "12px",
    fontWeight: "600",
    color: "#b11226",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow:
      "0 10px 15px -3px rgba(0,0,0,0.04), 0 4px 6px -2px rgba(0,0,0,0.02)",
    border: "1px solid #ffffff",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease",
  },
  bloodCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "15px",
    background: "#fee2e2",
    color: "#b11226",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "1.2rem",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  badge: {
    padding: "6px 14px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "20px",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  emoji: {
    fontSize: "1.2rem",
    background: "#f1f5f9",
    padding: "8px",
    borderRadius: "10px",
  },
  label: {
    display: "block",
    fontSize: "11px",
    textTransform: "uppercase",
    color: "#94a3b8",
    fontWeight: "600",
    letterSpacing: "0.025em",
  },
  value: {
    display: "block",
    fontSize: "15px",
    color: "#334155",
    fontWeight: "500",
  },
  donorCard: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "16px",
    border: "1px dashed #e2e8f0",
    marginTop: "10px",
  },
  donorTitle: {
    margin: "0 0 8px 0",
    fontSize: "12px",
    color: "#1d4ed8",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  donorDetail: {
    margin: "4px 0",
    fontSize: "14px",
    color: "#475569",
  },
  confirmBtn: {
    width: "100%",
    marginTop: "20px",
    padding: "14px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(22, 163, 74, 0.2)",
    transition: "all 0.2s ease",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    color: "#64748b",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #b11226",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px",
  },
  emptyBox: {
    background: "#fff",
    padding: "60px 20px",
    borderRadius: "32px",
    textAlign: "center",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  },
};
