import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/adminService";
import AdminLayout from "../layouts/AdminLayout";
import { Users, UserCheck, Activity, CheckCircle } from "lucide-react";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thtdStyle = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
  textAlign: "left",
  fontSize: "0.95rem",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.stats);
        setRecentRequests(res.data.recentRequests);
        setRecentUsers(res.data.recentUsers);
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, []);

  if (!stats) {
    return (
      <AdminLayout>
        <p>Loading dashboard...</p>
      </AdminLayout>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={20} />,
      color: "#2563eb",
    },
    {
      title: "Total Donors",
      value: stats.totalDonors,
      icon: <UserCheck size={20} />,
      color: "#16a34a",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: <Activity size={20} />,
      color: "#f59e0b",
    },
    {
      title: "Completed",
      value: stats.completedRequests,
      icon: <CheckCircle size={20} />,
      color: "#dc2626",
    },
  ];

  return (
    <AdminLayout>
      <div style={styles.cardsGrid}>
        {cards.map((card) => (
          <div key={card.title} style={styles.card}>
            <div
              style={{
                ...styles.iconWrap,
                background: card.color,
              }}
            >
              {card.icon}
            </div>
            <div>
              <p style={styles.cardTitle}>{card.title}</p>
              <h3 style={styles.cardValue}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Blood Requests</h2>
        <div style={styles.tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thtdStyle}>Patient</th>
                <th style={thtdStyle}>Blood</th>
                <th style={thtdStyle}>Hospital</th>
                <th style={thtdStyle}>Urgency</th>
                <th style={thtdStyle}>Status</th>
                <th style={thtdStyle}>Requester</th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((req) => (
                <tr key={req._id}>
                  <td style={thtdStyle}>{req.patientName || "N/A"}</td>
                  <td style={thtdStyle}>{req.bloodType}</td>
                  <td style={thtdStyle}>{req.hospital}</td>
                  <td style={thtdStyle}>{req.urgency}</td>
                  <td style={thtdStyle}>{req.status}</td>
                  <td style={thtdStyle}>{req.requester?.name || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Users</h2>
        <div style={styles.tableWrap}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thtdStyle}>Name</th>
                <th style={thtdStyle}>Email</th>
                <th style={thtdStyle}>Role</th>
                <th style={thtdStyle}>Location</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user._id}>
                  <td style={thtdStyle}>{user.name}</td>
                  <td style={thtdStyle}>{user.email}</td>
                  <td style={thtdStyle}>{user.userType}</td>
                  <td style={thtdStyle}>
                    {user.district}, {user.province}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

const styles = {
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  iconWrap: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0,
  },
  cardTitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "0.92rem",
  },
  cardValue: {
    margin: "6px 0 0 0",
    fontSize: "1.5rem",
    color: "#111827",
  },
  section: {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
    marginBottom: "22px",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "16px",
    color: "#111827",
  },
  tableWrap: {
    overflowX: "auto",
  },
};
