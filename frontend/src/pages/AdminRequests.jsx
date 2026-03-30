import { useEffect, useState } from "react";
import { getAllAdminRequests, deleteRequest } from "../services/adminService";
import AdminLayout from "../layouts/AdminLayout";

const thtdStyle = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
  textAlign: "left",
};

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [urgency, setUrgency] = useState("");
  const [bloodType, setBloodType] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await getAllAdminRequests({
        search,
        status,
        urgency,
        bloodType,
      });
      setRequests(res.data.requests);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [search, status, urgency, bloodType]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request?",
    );
    if (!confirmDelete) return;

    try {
      await deleteRequest(id);
      alert("Request deleted successfully");
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete request");
    }
  };

  const getUrgencyStyle = (urgency) => {
    if (urgency === "critical") return { color: "#dc2626", fontWeight: "700" };
    if (urgency === "high") return { color: "#ea580c", fontWeight: "700" };
    if (urgency === "medium") return { color: "#ca8a04", fontWeight: "700" };
    return { color: "#16a34a", fontWeight: "700" };
  };

  return (
    <AdminLayout>
      <div style={styles.section}>
        <h2 style={styles.title}>Admin Requests</h2>

        <div style={styles.filterRow}>
          <input
            type="text"
            placeholder="Search patient or hospital"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.input}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            style={styles.input}
          >
            <option value="">All Urgency</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            style={styles.input}
          >
            <option value="">All Blood Groups</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={thtdStyle}>Patient</th>
                <th style={thtdStyle}>Blood</th>
                <th style={thtdStyle}>Units</th>
                <th style={thtdStyle}>Hospital</th>
                <th style={thtdStyle}>Location</th>
                <th style={thtdStyle}>Urgency</th>
                <th style={thtdStyle}>Status</th>
                <th style={thtdStyle}>Requester</th>
                <th style={thtdStyle}>Accepted By</th>
                <th style={thtdStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td style={thtdStyle}>{req.patientName || "N/A"}</td>
                  <td style={thtdStyle}>{req.bloodType}</td>
                  <td style={thtdStyle}>{req.units}</td>
                  <td style={thtdStyle}>{req.hospital}</td>
                  <td style={thtdStyle}>
                    {req.district}, {req.province}
                  </td>
                  <td style={{ ...thtdStyle, ...getUrgencyStyle(req.urgency) }}>
                    {req.urgency}
                  </td>
                  <td style={thtdStyle}>{req.status}</td>
                  <td style={thtdStyle}>{req.requester?.name || "N/A"}</td>
                  <td style={thtdStyle}>{req.acceptedBy?.name || "N/A"}</td>
                  <td style={thtdStyle}>
                    <button
                      onClick={() => handleDelete(req._id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td style={thtdStyle} colSpan="10">
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

const styles = {
  section: {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
  },
  title: {
    marginTop: 0,
    marginBottom: "18px",
    color: "#111827",
  },
  filterRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    minWidth: "180px",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
