import { useEffect, useState } from "react";
import { getMyAcceptedRequests } from "../services/bloodRequestService";

const MyHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await getMyAcceptedRequests();
        setHistory(res.data.requests);
      } catch (error) {
        console.error(error);
      }
    };

    loadHistory();
  }, []);

  const brandColor = "rgb(177, 18, 38)";

  return (
    <>
      <style>{`
        .history-page {
          min-height: 100vh;
          padding: 60px 20px;
          background: linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #fff0f1 100%);
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .history-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .history-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .history-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: ${brandColor};
          margin-bottom: 12px;
          letter-spacing: -0.5px;
          animation: fadeDown 0.8s ease;
        }

        .history-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
          animation: fadeDown 1s ease;
        }

        .empty-box {
          background: white;
          padding: 60px 20px;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          border: 1px dashed #cbd5e1;
          animation: fadeIn 0.8s ease;
        }

        .history-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 25px;
        }

        .history-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          border: 1px solid #f1f5f9;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: fadeUp 0.7s ease forwards;
          opacity: 0;
        }

        .history-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: ${brandColor};
        }

        .history-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(177, 18, 38, 0.12);
          border-color: rgba(177, 18, 38, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .blood-badge {
          background: rgba(177, 18, 38, 0.1);
          color: ${brandColor};
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1.1rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #059669;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          color: #94a3b8;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .info-value {
          color: #1e293b;
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .contact-section {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #f1f5f9;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="history-page">
        <div className="history-container">
          <header className="history-header">
            <h2 className="history-title">Donation History</h2>
            <p className="history-subtitle">
              Your compassion makes a difference. Here is a record of the lives
              you've helped save.
            </p>
          </header>

          {history.length === 0 ? (
            <div className="empty-box">
              <p style={{ fontSize: "1.2rem", color: "#475569" }}>
                No donation records found.
              </p>
              <p style={{ marginTop: "10px" }}>
                When you complete a request, it will appear here.
              </p>
            </div>
          ) : (
            <div className="history-grid">
              {history.map((req, index) => (
                <div
                  key={req._id}
                  className="history-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="card-header">
                    <span className="blood-badge">{req.bloodType}</span>
                    <span className="status-badge">
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Completed
                    </span>
                  </div>

                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">Patient Name</span>
                      <span className="info-value">
                        {req.patientName || "Anonymous"}
                      </span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Hospital</span>
                      <span className="info-value">{req.hospital}</span>
                    </div>

                    <div className="contact-section">
                      <div className="info-item">
                        <span className="info-value">
                          <strong>Location:</strong> {req.district},{" "}
                          {req.province}
                        </span>
                        <span className="info-value">
                          <strong>Contact:</strong>{" "}
                          {req.requester?.phone || "N/A"}
                        </span>
                        <span className="info-value">
                          <strong>Requester Name:</strong>{" "}
                          {req.requester?.name || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyHistory;
