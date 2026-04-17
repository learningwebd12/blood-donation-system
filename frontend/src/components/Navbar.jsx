import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const brandColor = "rgb(177, 18, 38)";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const getLinkStyle = (id, path) => ({
    ...styles.link,
    color: scrolled
      ? isHovered === id || isActive(path)
        ? brandColor
        : "#4b5563"
      : isHovered === id || isActive(path)
        ? "#ffcccb"
        : "#fff",
    borderBottom: isActive(path)
      ? `2px solid ${scrolled ? brandColor : "#fff"}`
      : "2px solid transparent",
  });

  return (
    <nav
      style={{
        ...styles.nav,
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.95)" : brandColor,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <Link to="/" style={styles.logoContainer}>
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          style={styles.dropIcon}
        >
          🩸
        </motion.span>
        <h2 style={{ ...styles.logo, color: scrolled ? brandColor : "#fff" }}>
          LifeStream
        </h2>
      </Link>

      <ul style={styles.menu}>
        {["Home", "About", "Contact"].map((item) => {
          const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
          return (
            <li key={item}>
              <Link
                to={path}
                style={getLinkStyle(item, path)}
                onMouseEnter={() => setIsHovered(item)}
                onMouseLeave={() => setIsHovered(null)}
              >
                {item}
              </Link>
            </li>
          );
        })}

        {user?.userType?.includes("receiver") && (
          <>
            <li>
              <Link
                to="/create-blood-request"
                style={getLinkStyle(
                  "CreateBloodRequest",
                  "/create-blood-request",
                )}
                onMouseEnter={() => setIsHovered("CreateBloodRequest")}
                onMouseLeave={() => setIsHovered(null)}
              >
                Create Blood Request
              </Link>
            </li>

            <li>
              <Link
                to="/my-requests"
                style={getLinkStyle("MyRequests", "/my-requests")}
                onMouseEnter={() => setIsHovered("MyRequests")}
                onMouseLeave={() => setIsHovered(null)}
              >
                My Requests
              </Link>
            </li>
          </>
        )}

        {user?.userType?.includes("donor") && (
          <>
            <li>
              <Link
                to="/donor-requests"
                style={getLinkStyle("DonorRequests", "/donor-requests")}
                onMouseEnter={() => setIsHovered("DonorRequests")}
                onMouseLeave={() => setIsHovered(null)}
              >
                Donor Requests
              </Link>
            </li>

            <li>
              <Link
                to="/my-accepted"
                style={getLinkStyle("MyAccepted", "/my-accepted")}
                onMouseEnter={() => setIsHovered("MyAccepted")}
                onMouseLeave={() => setIsHovered(null)}
              >
                My Accepted Requests
              </Link>
            </li>
          </>
        )}
      </ul>

      <div style={styles.authButtons}>
        {!user ? (
          <>
            <Link
              to="/login"
              style={{
                ...styles.loginBtn,
                color: scrolled ? "#4b5563" : "#fff",
              }}
            >
              Login
            </Link>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                style={{
                  ...styles.registerBtn,
                  backgroundColor: scrolled ? brandColor : "#fff",
                  color: scrolled ? "#fff" : brandColor,
                }}
              >
                Register Now
              </Link>
            </motion.div>
          </>
        ) : (
          <div style={styles.userSection}>
            <Link
              to="/profile"
              style={{
                ...styles.profileBtn,
                borderColor: scrolled ? brandColor : "rgba(255,255,255,0.4)",
                color: scrolled ? brandColor : "#fff",
              }}
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              style={{
                ...styles.logoutBtn,
                backgroundColor: scrolled
                  ? "rgba(177, 18, 38, 0.1)"
                  : "rgba(255,255,255,0.2)",
                color: scrolled ? brandColor : "#fff",
              }}
            >
              Logout
            </button>
          </div>
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
    padding: "15px 50px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
  },
  dropIcon: { fontSize: "1.6rem" },
  logo: {
    margin: 0,
    fontSize: "1.6rem",
    fontWeight: "800",
    letterSpacing: "-0.5px",
    transition: "color 0.4s ease",
  },
  menu: {
    listStyle: "none",
    display: "flex",
    gap: "25px",
    margin: 0,
    padding: 0,
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "0.95rem",
    paddingBottom: "4px",
    transition: "all 0.3s ease",
  },
  authButtons: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  loginBtn: {
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  registerBtn: {
    textDecoration: "none",
    padding: "10px 24px",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "0.95rem",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  profileBtn: {
    textDecoration: "none",
    fontWeight: "600",
    padding: "7px 18px",
    borderRadius: "10px",
    border: "1px solid",
    fontSize: "0.9rem",
    transition: "all 0.3s ease",
  },
  logoutBtn: {
    padding: "8px 18px",
    borderRadius: "10px",
    border: "none",
    fontWeight: "600",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};
