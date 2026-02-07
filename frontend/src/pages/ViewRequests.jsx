import { useState, useEffect } from "react";
import { getAllRequests } from "../services/bloodRequestService";

export default function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: null, lon: null });

  useEffect(() => {
    getAllRequests().then((res) => setRequests(res.data.requests));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) =>
        setMyLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      );
    }
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Blood Requests</h2>
      {requests.map((r) => (
        <div
          key={r._id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
            borderRadius: "8px",
          }}
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

          {/* Call */}
          <a href={`tel:${r.contactPhone}`} style={btnStyle}>
            📞 Call
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${r.contactPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            style={btnStyle}
          >
            💬 WhatsApp
          </a>

          {/* Map */}
          {r.location?.lat && r.location?.lon && (
            <a
              href={`https://www.google.com/maps?q=${r.location.lat},${r.location.lon}`}
              target="_blank"
              rel="noopener noreferrer"
              style={btnStyle}
            >
              📍 Map
            </a>
          )}

          {/* Distance */}
          {myLocation.lat && r.location?.lat && (
            <p style={{ marginTop: "10px", fontWeight: "500" }}>
              Distance:{" "}
              {getDistance(
                myLocation.lat,
                myLocation.lon,
                r.location.lat,
                r.location.lon,
              )}{" "}
              km
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

const btnStyle = {
  display: "inline-block",
  marginRight: "10px",
  marginTop: "5px",
  padding: "5px 10px",
  borderRadius: "5px",
  backgroundColor: "#d32f2f",
  color: "#fff",
  textDecoration: "none",
};
