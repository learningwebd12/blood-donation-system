import React from "react";

export default function About() {
  return (
    <div style={styles.page}>
      {/* Section 1: Hero */}
      <section style={styles.hero}>
        <h1 style={styles.title}>Our Mission: Saving Lives</h1>
        <p style={styles.subtitle}>
          LifeStream is a non-profit initiative dedicated to bridging the gap
          between blood donors and those in urgent need across Nepal.
        </p>
      </section>

      {/* Section 2: How It Works */}
      <section style={styles.howSection}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.stepNum}>1</div>
            <h3>Register</h3>
            <p>
              Create an account and join our community of life-savers by
              providing your blood group and location.
            </p>
          </div>
          <div style={styles.card}>
            <div style={styles.stepNum}>2</div>
            <h3>Search</h3>
            <p>
              People in need can search for specific blood groups in their
              district using our real-time database.
            </p>
          </div>
          <div style={styles.card}>
            <div style={styles.stepNum}>3</div>
            <h3>Connect</h3>
            <p>
              Get in touch via phone and coordinate the donation. One small act,
              one huge impact.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Why Choose Us */}
      <section style={styles.missionSection}>
        <div style={styles.missionText}>
          <h2 style={{ color: "#d32f2f" }}>Why LifeStream?</h2>
          <p>
            In Nepal, finding a blood donor in an emergency often depends on
            frantic social media posts. We aim to digitize this process, making
            it
            <b> faster, more reliable, and accessible</b> to everyone, from
            Kathmandu to the remotest districts.
          </p>
          <ul style={styles.points}>
            <li>✅ 100% Free for everyone</li>
            <li>✅ Verified donor contact details</li>
            <li>✅ Privacy-first approach</li>
          </ul>
        </div>
        <div style={styles.missionImage}>
          {/* Placeholder for a nice illustration */}
          <div style={styles.imageBox}>🩸</div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Inter', sans-serif",
    color: "#2d3436",
    lineHeight: "1.6",
  },
  hero: {
    padding: "80px 20px",
    textAlign: "center",
    backgroundColor: "#b11226",
    color: "#fff",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "1.2rem",
    maxWidth: "800px",
    margin: "0 auto",
    opacity: "0.9",
  },
  howSection: {
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "2.2rem",
    marginBottom: "50px",
    color: "#2d3436",
  },
  grid: {
    display: "flex",
    gap: "30px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    flex: "1",
    minWidth: "280px",
    padding: "40px 20px",
    backgroundColor: "#fff",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
    position: "relative",
  },
  stepNum: {
    width: "40px",
    height: "40px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontWeight: "bold",
  },
  missionSection: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "50px",
    padding: "80px 20px",
    maxWidth: "1100px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "20px",
    marginBottom: "80px",
  },
  missionText: {
    flex: "1",
    minWidth: "300px",
  },
  points: {
    listStyle: "none",
    padding: 0,
    marginTop: "20px",
  },
  missionImage: {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    minWidth: "300px",
  },
  imageBox: {
    width: "200px",
    height: "200px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "5rem",
    boxShadow: "0 10px 40px rgba(211, 47, 47, 0.2)",
  },
};
