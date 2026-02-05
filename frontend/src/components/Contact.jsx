import React, { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Get in Touch</h1>
        <p style={styles.subtitle}>
          Have questions? We're here to help. Send us a message and our team
          will respond as soon as possible.
        </p>
      </div>

      <div style={styles.container}>
        {/* Left Side: Contact Info */}
        <div style={styles.infoSide}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoHeading}>Contact Information</h3>
            <div style={styles.contactLink}>
              <span style={styles.icon}>📍</span>
              <div>
                <p style={styles.infoLabel}>Our Location</p>
                <p style={styles.infoText}>Kathmandu, Bagmati, Nepal</p>
              </div>
            </div>
            <div style={styles.contactLink}>
              <span style={styles.icon}>📞</span>
              <div>
                <p style={styles.infoLabel}>Phone Number</p>
                <p style={styles.infoText}>+977 98XXXXXXXX</p>
              </div>
            </div>
            <div style={styles.contactLink}>
              <span style={styles.icon}>✉️</span>
              <div>
                <p style={styles.infoLabel}>Email Address</p>
                <p style={styles.infoText}>support@lifestream.com</p>
              </div>
            </div>
          </div>

          <div style={styles.alertBox}>
            <p>
              <strong>Note:</strong> If this is a medical emergency, please
              contact <b>102</b> or your nearest hospital immediately.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div style={styles.formSide}>
          {submitted ? (
            <div style={styles.successMsg}>
              <h3>Thank you! Message Sent.</h3>
              <p>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.row}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    placeholder="Email Address"
                    style={styles.input}
                    required
                  />
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Subject</label>
                <select style={styles.input}>
                  <option>General Inquiry</option>
                  <option>Technical Issue</option>
                  <option>Partnership</option>
                  <option>Donation Help</option>
                </select>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Message</label>
                <textarea
                  placeholder="How can we help you?"
                  style={{ ...styles.input, height: "150px", resize: "none" }}
                  required
                />
              </div>
              <button type="submit" style={styles.btn}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "60px 20px",
    backgroundColor: "#fcfcfc",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "50px",
  },
  title: {
    fontSize: "2.5rem",
    color: "#2d3436",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#636e72",
    maxWidth: "600px",
    margin: "0 auto",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    gap: "40px",
  },
  infoSide: {
    flex: "1",
    minWidth: "320px",
  },
  infoCard: {
    backgroundColor: "#b11226",
    padding: "40px",
    borderRadius: "20px",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(177, 18, 38, 0.2)",
  },
  infoHeading: {
    fontSize: "1.5rem",
    marginBottom: "30px",
  },
  contactLink: {
    display: "flex",
    gap: "20px",
    marginBottom: "25px",
    alignItems: "flex-start",
  },
  icon: {
    fontSize: "1.5rem",
    background: "rgba(255,255,255,0.1)",
    padding: "10px",
    borderRadius: "10px",
  },
  infoLabel: {
    margin: 0,
    fontSize: "0.85rem",
    opacity: "0.8",
  },
  infoText: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: "500",
  },
  alertBox: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#fff5f5",
    borderLeft: "5px solid #d32f2f",
    borderRadius: "8px",
    fontSize: "0.9rem",
    color: "#444",
  },
  formSide: {
    flex: "1.5",
    minWidth: "320px",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  row: {
    display: "flex",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#2d3436",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outlineColor: "#b11226",
  },
  btn: {
    padding: "15px",
    backgroundColor: "#b11226",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  successMsg: {
    textAlign: "center",
    padding: "40px 0",
    color: "#27ae60",
  },
};
