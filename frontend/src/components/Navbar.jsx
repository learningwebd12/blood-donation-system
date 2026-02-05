import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getLinkStyle = (id) => ({
    ...styles.link,
    color: isHovered === id ? "#ffcccb" : "#fff",
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.logoContainer}>
        <span style={styles.dropIcon}>🩸</span>
        <h2 style={styles.logo}>LifeStream</h2>
      </div>

      {/* Menu */}
      <ul style={styles.menu}>
        {["Home", "About", "Contact"].map((item) => (
          <li key={item}>
            <Link
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              style={getLinkStyle(item)}
              onMouseEnter={() => setIsHovered(item)}
              onMouseLeave={() => setIsHovered(null)}
            >
              {item}
            </Link>
          </li>
        ))}

        {/* Additional links for logged-in users */}
        {user && user.userType.includes("receiver") && (
          <>
            <li>
              <Link
                to="/create-blood-request"
                style={getLinkStyle("CreateBloodRequest")}
                onMouseEnter={() => setIsHovered("CreateBloodRequest")}
                onMouseLeave={() => setIsHovered(null)}
              >
                Create Blood Request
              </Link>
            </li>
            <li>
              <Link
                to="/view-requests"
                style={getLinkStyle("ViewRequests")}
                onMouseEnter={() => setIsHovered("ViewRequests")}
                onMouseLeave={() => setIsHovered(null)}
              >
                View Requests
              </Link>
            </li>
          </>
        )}

        {user && user.userType.includes("donor") && (
          <li>
            <Link
              to="/view-requests"
              style={getLinkStyle("ViewRequests")}
              onMouseEnter={() => setIsHovered("ViewRequests")}
              onMouseLeave={() => setIsHovered(null)}
            >
              View Requests
            </Link>
          </li>
        )}
      </ul>

      {/* Auth Buttons */}
      <div style={styles.authButtons}>
        {!user ? (
          <>
            <Link to="/login" style={styles.loginBtn}>
              Login
            </Link>
            <Link to="/register" style={styles.registerBtn}>
              Register Now
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" style={styles.profileBtn}>
              Profile
            </Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "linear-gradient(90deg, #8b0000 0%, #d32f2f 100%)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  logoContainer: { display: "flex", alignItems: "center", gap: "10px" },
  dropIcon: { fontSize: "1.5rem" },
  logo: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "bold",
    letterSpacing: "1px",
    color: "#fff",
  },
  menu: {
    listStyle: "none",
    display: "flex",
    gap: "25px",
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
  authButtons: { display: "flex", alignItems: "center", gap: "15px" },
  loginBtn: { textDecoration: "none", color: "#fff", fontWeight: "500" },
  registerBtn: {
    textDecoration: "none",
    backgroundColor: "#fff",
    color: "#d32f2f",
    padding: "8px 20px",
    borderRadius: "25px",
    fontWeight: "bold",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
  },
  profileBtn: {
    textDecoration: "none",
    color: "#fff",
    fontWeight: "500",
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid #fff",
  },
  logoutBtn: {
    padding: "6px 12px",
    borderRadius: "20px",
    border: "1px solid #fff",
    backgroundColor: "transparent",
    color: "#fff",
    cursor: "pointer",
  },
};
