import { useEffect, useState } from "react";
import { getAllUsers, deleteUser } from "../services/adminService";
import AdminLayout from "../layouts/AdminLayout";

const thtdStyle = {
  borderBottom: "1px solid #e5e7eb",
  padding: "12px",
  textAlign: "left",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers({
        search,
        role,
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(id);
      alert("User deleted successfully");
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <AdminLayout>
      <div style={styles.section}>
        <h2 style={styles.title}>Admin Users</h2>

        <div style={styles.filterRow}>
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          >
            <option value="">All Roles</option>
            <option value="donor">Donor</option>
            <option value="receiver">Receiver</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={thtdStyle}>Name</th>
                <th style={thtdStyle}>Email</th>
                <th style={thtdStyle}>Phone</th>
                <th style={thtdStyle}>Role</th>
                <th style={thtdStyle}>Blood Group</th>
                <th style={thtdStyle}>Location</th>
                <th style={thtdStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={thtdStyle}>{user.name}</td>
                  <td style={thtdStyle}>{user.email}</td>
                  <td style={thtdStyle}>{user.phone || "N/A"}</td>
                  <td style={thtdStyle}>{user.userType}</td>
                  <td style={thtdStyle}>{user.bloodType || "N/A"}</td>
                  <td style={thtdStyle}>
                    {user.district || "N/A"}, {user.province || "N/A"}
                  </td>
                  <td style={thtdStyle}>
                    <button
                      onClick={() => handleDelete(user._id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td style={thtdStyle} colSpan="7">
                    No users found
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
    minWidth: "220px",
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
