import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  getAllContactMessages,
  deleteContactMessage,
} from "../services/contactAdminService";

const thtdStyle = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
  textAlign: "left",
  verticalAlign: "top",
};

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await getAllContactMessages();
      setMessages(res.data.messages);
    } catch (error) {
      console.error(error);
      alert("Failed to load contact messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?",
    );
    if (!confirmDelete) return;

    try {
      await deleteContactMessage(id);
      alert("Message deleted successfully");
      fetchMessages();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete message");
    }
  };

  return (
    <AdminLayout>
      <div style={styles.section}>
        <h2 style={styles.title}>Contact Messages</h2>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={thtdStyle}>Name</th>
                <th style={thtdStyle}>Email</th>
                <th style={thtdStyle}>Subject</th>
                <th style={thtdStyle}>Message</th>
                <th style={thtdStyle}>Status</th>
                <th style={thtdStyle}>Date</th>
                <th style={thtdStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id}>
                  <td style={thtdStyle}>{msg.name}</td>
                  <td style={thtdStyle}>{msg.email}</td>
                  <td style={thtdStyle}>{msg.subject}</td>
                  <td style={{ ...thtdStyle, maxWidth: "300px" }}>
                    {msg.message}
                  </td>
                  <td style={thtdStyle}>
                    <span style={styles.statusBadge}>{msg.status}</span>
                  </td>
                  <td style={thtdStyle}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                  <td style={thtdStyle}>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {messages.length === 0 && (
                <tr>
                  <td style={thtdStyle} colSpan="7">
                    No contact messages found
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
  statusBadge: {
    background: "#e0f2fe",
    color: "#0369a1",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: "600",
    textTransform: "capitalize",
  },
};
