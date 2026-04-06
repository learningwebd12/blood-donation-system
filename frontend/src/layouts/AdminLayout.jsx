import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Droplets,
  LogOut,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin-login");
  };
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Users", path: "/admin-users", icon: <Users size={18} /> },

    { name: "Requests", path: "/admin-requests", icon: <Droplets size={18} /> },
    {
      name: "Contact Messages",
      path: "/admin-contact-messages",
      icon: <MessageSquare size={18} />,
    },
  ];

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.logoBox}>
            <div style={styles.logoIcon}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 style={styles.logoText}>Admin Panel</h2>
              <p style={styles.logoSubText}>Blood Donation</p>
            </div>
          </div>

          <nav style={styles.nav}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    ...styles.link,
                    ...(isActive ? styles.activeLink : {}),
                  }}
                >
                  <span style={styles.icon}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main style={styles.main}>
        <div style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>Admin Dashboard</h1>
            <p style={styles.pageSubtitle}>
              Manage users, blood requests and overall activity
            </p>
          </div>
        </div>

        <div style={styles.content}>{children}</div>
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f7fb",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg, #111827 0%, #1f2937 100%)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "24px 18px",
    boxShadow: "4px 0 18px rgba(0,0,0,0.08)",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
  },
  logoIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    boxShadow: "0 10px 20px rgba(239,68,68,0.3)",
  },
  logoText: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: "700",
  },
  logoSubText: {
    margin: "2px 0 0 0",
    fontSize: "0.82rem",
    color: "#cbd5e1",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "#d1d5db",
    transition: "0.3s ease",
    fontWeight: "500",
  },
  activeLink: {
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutBtn: {
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: "12px 14px",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.95rem",
  },
  main: {
    flex: 1,
    padding: "24px",
  },
  topbar: {
    background: "#fff",
    borderRadius: "18px",
    padding: "22px 24px",
    boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
    marginBottom: "22px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "1.6rem",
    color: "#111827",
  },
  pageSubtitle: {
    margin: "6px 0 0 0",
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  content: {
    minHeight: "calc(100vh - 140px)",
  },
};
