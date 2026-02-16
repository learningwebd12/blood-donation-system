import { useEffect, useState } from "react";
import { getAllRequests } from "../services/bloodRequestService";

// Haversine formula to calculate distance in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [myLocation] = useState({ lat: null, lon: null });

  // Fetch blood requests from backend
  useEffect(() => {
    getAllRequests().then((res) => setRequests(res.data.requests));
  }, []);

  // Live location tracking
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          // Get province from user profile or default
          const userProvince = localStorage.getItem("province") || "Bagmati";

          getAllRequests(lat, lon, userProvince).then((res) =>
            setRequests(res.data.requests),
          );
        },
        () => {
          const userProvince = localStorage.getItem("province") || "Bagmati";
          getAllRequests(undefined, undefined, userProvince).then((res) =>
            setRequests(res.data.requests),
          );
        },
      );
    } else {
      const userProvince = localStorage.getItem("province") || "Bagmati";
      getAllRequests(undefined, undefined, userProvince).then((res) =>
        setRequests(res.data.requests),
      );
    }
  }, []);

  // Calculate distance dynamically for each request
  const requestsWithDistance = requests.map((r) => {
    if (myLocation.lat && r.location?.lat) {
      const distance = calculateDistance(
        myLocation.lat,
        myLocation.lon,
        r.location.lat,
        r.location.lon,
      );
      return { ...r, distance: distance.toFixed(2) };
    }
    return r;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Blood Requests</h2>
      {requestsWithDistance.map((r) => (
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

          {r.distance && (
            <p style={{ marginTop: "10px", fontWeight: 500 }}>
              📍 {r.distance} km away
            </p>
          )}

          <a href={`tel:${r.contactPhone}`} style={btnStyle}>
            📞 Call
          </a>
          <a
            href={`https://wa.me/${r.contactPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            style={btnStyle}
          >
            💬 WhatsApp
          </a>
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
        </div>
      ))}
    </div>
  );
}

const btnStyle = {
  display: "inline-block",
  marginRight: "10px",
  marginTop: "5px",
  padding: "6px 12px",
  borderRadius: "6px",
  backgroundColor: "#d32f2f",
  color: "#fff",
  textDecoration: "none",
};
