import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  // Check if user is logged in
  const token = localStorage.getItem("token");
  const brandColor = "rgb(177, 18, 38)";

  // logic: if not logged in, go to login. If logged in, go to request page.
  const handleRequestClick = () => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/create-blood-request");
    }
  };

  return (
    <div style={styles.page}>
      {/* SECTION 1: HERO CONTAINER */}
      <section style={styles.container1}>
        <div style={styles.wrapper}>
          <div style={styles.heroSplit}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              style={styles.heroContent}
            >
              <div style={styles.badge}>🇳🇵 Nepal's Network</div>
              <h1 style={styles.title}>
                The Gift of Blood is the <br />
                <span style={{ color: brandColor }}>Gift of Life.</span>
              </h1>
              <p style={styles.subtitle}>
                Connecting donors with patients across all 77 districts. Your
                one contribution can save up to three lives.
              </p>
              <div style={styles.actions}>
                <button
                  style={{ ...styles.mainBtn, backgroundColor: brandColor }}
                  onClick={handleRequestClick}
                >
                  Request Blood
                </button>

                {/* Only show "Be a Donor" if the user is NOT logged in */}
                {!token && (
                  <button
                    style={{
                      ...styles.outlineBtn,
                      borderColor: brandColor,
                      color: brandColor,
                    }}
                    onClick={() => navigate("/register")}
                  >
                    Be a Donor
                  </button>
                )}
              </div>
            </motion.div>

            <div style={styles.imageBox}>
              <img
                src="https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/182FF/production/_107317099_blooddonor976.jpg"
                alt="Blood Donation"
                style={styles.heroImg}
              />
              <div style={styles.floatTag}>❤️ 2.5k+ Lives Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS CONTAINER */}
      {/* <section style={styles.container2}>
        <div style={styles.statsGrid}>
          {[
            { n: "8+", l: "Blood Groups", i: "🩸" },
            { n: "500+", l: "Hospitals", i: "🏥" },
            { n: "10k+", l: "Total Donors", i: "🤝" },
            { n: "77", l: "Districts", i: "📍" },
          ].map((item, idx) => (
            <div key={idx} style={styles.statCard}>
              <div style={styles.statIcon}>{item.i}</div>
              <h2 style={styles.statNumber}>{item.n}</h2>
              <p style={styles.statLabel}>{item.l}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* SECTION 3: PROCESS & CTA CONTAINER */}
      <section style={styles.container3}>
        <div style={styles.wrapper}>
          <h2 style={styles.sectionHeading}>How It Works</h2>
          <div style={styles.processGrid}>
            <div style={styles.pCard}>
              <div style={{ ...styles.pNum, color: brandColor }}>01</div>
              <h3>Post Request</h3>
              <p>Fill in the details of the patient and hospital.</p>
            </div>
            <div style={styles.pCard}>
              <div style={{ ...styles.pNum, color: brandColor }}>02</div>
              <h3>Get Matched</h3>
              <p>Donors nearby receive instant notifications.</p>
            </div>
            <div style={styles.pCard}>
              <div style={{ ...styles.pNum, color: brandColor }}>03</div>
              <h3>Save a Life</h3>
              <p>Directly contact the donor and get help.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: { background: "#fff", fontFamily: "'Inter', sans-serif" },
  wrapper: { maxWidth: "1140px", margin: "0 auto", padding: "0 20px" },
  container1: {
    padding: "100px 0",
    background: "linear-gradient(180deg, #fff5f5 0%, #ffffff 100%)",
  },
  heroSplit: {
    display: "flex",
    alignItems: "center",
    gap: "50px",
    flexWrap: "wrap",
  },
  heroContent: { flex: 1, minWidth: "320px" },
  badge: {
    background: "#fff",
    padding: "8px 16px",
    borderRadius: "20px",
    display: "inline-block",
    fontWeight: "700",
    fontSize: "0.8rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  title: {
    fontSize: "3.5rem",
    fontWeight: "900",
    lineHeight: 1.1,
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#666",
    marginBottom: "35px",
    lineHeight: 1.6,
  },
  actions: { display: "flex", gap: "15px" },
  mainBtn: {
    padding: "15px 30px",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },
  outlineBtn: {
    padding: "15px 30px",
    border: "2px solid",
    borderRadius: "12px",
    background: "none",
    fontWeight: "700",
    cursor: "pointer",
  },
  imageBox: { flex: 1, position: "relative", minWidth: "320px" },
  heroImg: {
    width: "100%",
    borderRadius: "30px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  },
  floatTag: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    background: "#fff",
    padding: "12px 20px",
    borderRadius: "15px",
    fontWeight: "700",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
  },
  container2: {
    marginTop: "-60px",
    padding: "0 20px",
    zIndex: 10,
    position: "relative",
  },
  statsGrid: {
    maxWidth: "1140px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  statCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
  statIcon: { fontSize: "2rem", marginBottom: "10px" },
  statNumber: { fontSize: "2rem", fontWeight: "800", margin: "5px 0" },
  statLabel: {
    color: "#888",
    fontWeight: "600",
    fontSize: "0.8rem",
    textTransform: "uppercase",
  },
  container3: { padding: "100px 0" },
  sectionHeading: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "50px",
  },
  processGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "30px",
  },
  pCard: {
    background: "#f9f9f9",
    padding: "40px",
    borderRadius: "25px",
    textAlign: "center",
  },
  pNum: {
    fontSize: "3rem",
    fontWeight: "900",
    opacity: 0.2,
    marginBottom: "10px",
  },
};
