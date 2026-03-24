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

  return (
    <div style={{ padding: "20px" }}>
      <h2>🩸 Your Completed Donations</h2>

      {history.length === 0 && <p>You have not donated blood yet.</p>}

      {history.map((req) => (
        <div
          key={req._id}
          style={{
            border: "1px solid green",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <p>
            <strong>Patient:</strong> {req.patientName || "N/A"}
          </p>
          <p>
            <strong>Blood Group:</strong> {req.bloodType}
          </p>
          <p>
            <strong>Hospital:</strong> {req.hospital}
          </p>
          <p>
            <strong>Location:</strong> {req.district}, {req.province}
          </p>
          <p>
            <strong>Contact:</strong> {req.requester?.phone || "N/A"}
          </p>
          <p>
            <strong>Requester Name:</strong> {req.requester?.name || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> ✅ Completed
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyHistory;
