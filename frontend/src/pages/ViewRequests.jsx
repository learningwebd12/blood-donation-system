import { useEffect, useState } from "react";
import { getAllRequests } from "../services/bloodRequestService";

export default function ViewRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getAllRequests().then((res) => setRequests(res.data.requests));
  }, []);

  return (
    <div>
      <h2>Available Blood Requests</h2>
      {requests.map((r) => (
        <div
          key={r._id}
          style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
        >
          <p>
            <strong>Blood Group:</strong> {r.bloodType}
          </p>
          <p>
            <strong>Units:</strong> {r.units}
          </p>
          <p>
            <strong>Hospital:</strong> {r.hospital}
          </p>
          <p>
            <strong>Location:</strong> {r.district}, {r.province}
          </p>
          <p>
            <strong>Urgency:</strong> {r.urgency}
          </p>
          <p>
            <strong>Contact:</strong> {r.contactPhone}
          </p>
        </div>
      ))}
    </div>
  );
}
