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
          {requests.map((req) => {
            const hoursLeft = req.expiresAt
              ? Math.max(
                  0,
                  Math.ceil(
                    (new Date(req.expiresAt) - new Date()) / (1000 * 60 * 60),
                  ),
                )
              : null;

            return (
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
                  <InfoRow
                    emoji="📞"
                    label="Contact"
                    value={req.contactPhone}
                  />
                </div>

                {hoursLeft !== null && req.status === "pending" && (
                  <p
                    style={{
                      color: hoursLeft <= 3 ? "#dc2626" : "#ea580c",
                      fontWeight: "bold",
                      marginTop: "12px",
                    }}
                  >
                    ⏳ Expires in {hoursLeft} hrs
                  </p>
                )}

                {req.acceptedBy && (
                  <div style={styles.donorCard}>
                    <p style={styles.donorTitle}>Matched Donor Info</p>
                    <p style={styles.donorDetail}>
                      <strong>Name:</strong>{" "}
                      {req.acceptedBy.name || "Anonymous"}
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
                  >
                    Confirm Blood Received
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const InfoRow = ({ emoji, label, value }) => (
  <div style={styles.infoRow}>
    <span>{emoji}</span>
    <div>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
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
    case "expired":
      return { bg: "#fee2e2", text: "#b91c1c" };
    default:
      return { bg: "#f1f5f9", text: "#475569" };
  }
};

const styles = {
  page: { padding: "30px" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  title: { fontSize: "28px", fontWeight: "bold" },
  subtitle: { color: "#64748b" },
  countBadge: {
    background: "#ef4444",
    color: "white",
    padding: "10px 18px",
    borderRadius: "999px",
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  bloodCircle: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#ef4444",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  badge: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "600",
  },
  infoSection: { marginTop: "10px" },
  infoRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "10px",
  },
  label: {
    fontSize: "12px",
    color: "#64748b",
  },
  value: {
    fontWeight: "600",
  },
  donorCard: {
    marginTop: "15px",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "12px",
  },
  donorTitle: {
    fontWeight: "bold",
    marginBottom: "10px",
  },
  donorDetail: {
    marginBottom: "5px",
  },
  confirmBtn: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    border: "none",
    background: "#16a34a",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
