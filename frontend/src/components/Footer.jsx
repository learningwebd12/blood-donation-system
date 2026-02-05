import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Column 1: Brand & Mission */}
        <div style={styles.column}>
          <h2 style={styles.logo}>LifeStream 🩸</h2>
          <p style={styles.description}>
            Bridging the gap between donors and those in need across Nepal.
            Every drop counts. Join our mission to save lives.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Quick Links</h4>
          <ul style={styles.list}>
            <li>
              <Link to="/search" style={styles.link}>
                Find Donors
              </Link>
            </li>
            <li>
              <Link to="/register" style={styles.link}>
                Register as Donor
              </Link>
            </li>
            <li>
              <Link to="/about" style={styles.link}>
                How it Works
              </Link>
            </li>
            <li>
              <Link to="/contact" style={styles.link}>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Get in Touch</h4>
          <p style={styles.contactItem}>📍 Kathmandu, Nepal</p>
          <p style={styles.contactItem}>📞 +977 98XXXXXXXX</p>
          <p style={styles.contactItem}>✉️ support@lifestream.com</p>
        </div>

        {/* Column 4: Social/Newsletter */}
        <div style={styles.column}>
          <h4 style={styles.heading}>Follow Us</h4>
          <div style={styles.socialIcons}>
            <span style={styles.icon}>Facebook</span>
            <span style={styles.icon}>Twitter</span>
            <span style={styles.icon}>Instagram</span>
          </div>
          <p style={styles.emergency}>Emergency? Call 102</p>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <p style={styles.copyright}>
          © {new Date().getFullYear()} LifeStream Nepal. All rights reserved.
          <span style={{ marginLeft: "10px", color: "#ffcccb" }}>
            Made with ❤️ for the community.
          </span>
        </p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: "60px 20px 20px 20px",
    marginTop: "50px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    paddingBottom: "40px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: 0,
    color: "#fff",
  },
  description: {
    fontSize: "0.9rem",
    lineHeight: "1.6",
    color: "#bbbbbb",
  },
  heading: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "5px",
    color: "#d32f2f", // Using your brand red for highlights
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    color: "#bbbbbb",
    textDecoration: "none",
    fontSize: "0.9rem",
    transition: "color 0.2s",
  },
  contactItem: {
    fontSize: "0.9rem",
    color: "#bbbbbb",
    margin: 0,
  },
  emergency: {
    marginTop: "10px",
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#ff4d4d",
    border: "1px dashed #ff4d4d",
    padding: "5px 10px",
    textAlign: "center",
    borderRadius: "5px",
  },
  socialIcons: {
    display: "flex",
    gap: "10px",
    fontSize: "0.8rem",
    color: "#bbbbbb",
  },
  icon: {
    cursor: "pointer",
  },
  bottomBar: {
    borderTop: "1px solid #333",
    paddingTop: "20px",
    textAlign: "center",
  },
  copyright: {
    fontSize: "0.85rem",
    color: "#777",
    margin: 0,
  },
};
