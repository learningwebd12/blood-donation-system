import { useEffect, useState } from "react";
import {
  getMyAcceptedRequests,
  completeRequest,
} from "../services/bloodRequestService";

const MyAcceptedRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchAccepted = async () => {
    try {
      const res = await getMyAcceptedRequests();
      setRequests(res.data.requests);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {}, []);

  const handleComplete = async (id) => {
    try {
      await completeRequest(id);
      alert("Donation marked as completed!");
      fetchAccepted();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Failed to complete request");
    }
  };

  return (
    <div>
      <h2>My Accepted Requests</h2>

      {requests.length === 0 && <p>No accepted requests yet.</p>}

      {requests.map((req) => (
        <div
          key={req._id}
          style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
        >
          <p>
            <strong>Patient:</strong> {req.patientName}
          </p>
          <p>
            <strong>Blood Group:</strong> {req.bloodGroup}
          </p>
          <p>
            <strong>Hospital:</strong> {req.hospital}
          </p>
          <p>
            <strong>Province:</strong> {req.province}
          </p>
          <p>
            <strong>Phone:</strong> {req.user?.phone}
          </p>

          {/* Map */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${req.latitude},${req.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            View Location
          </a>

          <br />

          {/* Call */}
          <a href={`tel:${req.user?.phone}`}>Call</a>

          <br />

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${req.user?.phone}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>

          <br />
          <br />

          <button onClick={() => handleComplete(req._id)}>
            Mark as Completed
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyAcceptedRequests;
