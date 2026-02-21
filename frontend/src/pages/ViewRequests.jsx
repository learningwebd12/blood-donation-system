import { useEffect, useState } from "react";
import {
  getAllRequests,
  acceptRequest,
  completeRequest,
} from "../services/bloodRequestService";

// Distance calculator
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: null, lon: null });

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userProvince = localStorage.getItem("province") || "Bagmati";

  useEffect(() => {
    const fetchRequests = () => {
      getAllRequests(undefined, undefined, userProvince).then((res) =>
        setRequests(res.data.requests),
      );
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMyLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          });
          fetchRequests();
        },
        () => fetchRequests(),
      );
    } else {
      fetchRequests();
    }
  }, [userProvince]);

  const requestsWithDistance = requests.map((r) => {
    if (myLocation.lat && r.location?.lat) {
      const distance = calculateDistance(
        myLocation.lat,
        myLocation.lon,
        r.location.lat,
        r.location.lon,
      );
      return { ...r, distance: distance.toFixed(1) };
    }
    return r;
  });

  // ACCEPT REQUEST
  const handleAccept = async (id) => {
    try {
      await acceptRequest(id);

      alert("Request Accepted ✅");

      setRequests((prev) =>
        prev.map((r) =>
          r._id === id
            ? {
                ...r,
                status: "accepted",
                acceptedBy: currentUser._id,
              }
            : r,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept request");
    }
  };

  // COMPLETE REQUEST
  const handleComplete = async (id) => {
    try {
      await completeRequest(id);

      alert("Request Completed 🎯");

      setRequests((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to complete request");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Blood Requests</h2>

      {requestsWithDistance.map((r) => (
        <div
          key={r._id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3>🏥 {r.hospital}</h3>
          <p>
            <strong>Blood Group:</strong> {r.bloodType}
          </p>
          <p>
            <strong>Units:</strong> {r.units}
          </p>
          <p>
            <strong>Location:</strong> {r.district}, {r.province}
          </p>
          <p>
            <strong>Contact:</strong> {r.contactPhone}
          </p>
          <p>
            <strong>Status:</strong> {r.status}
          </p>

          {r.distance && <p>🚗 Distance: {r.distance} km away</p>}

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            {/* Call */}
            <a href={`tel:${r.contactPhone}`} style={btnStyle("#d32f2f")}>
              Call
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${r.contactPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              style={btnStyle("#25D366")}
            >
              WhatsApp
            </a>

            {/* Map */}
            {r.location?.lat && (
              <a
                href={`http://maps.google.com/?q=${r.location.lat},${r.location.lon}`}
                target="_blank"
                rel="noopener noreferrer"
                style={btnStyle("#4285F4")}
              >
                Map
              </a>
            )}

            {/* Accept Button */}
            {currentUser.userType?.includes("donor") &&
              r.status === "pending" && (
                <button
                  style={btnStyle("#1976d2")}
                  onClick={() => handleAccept(r._id)}
                >
                  Accept
                </button>
              )}

            {/* Complete Button */}
            {currentUser.userType?.includes("donor") &&
              r.status === "accepted" &&
              r.acceptedBy === currentUser._id && (
                <button
                  style={btnStyle("#FF9800")}
                  onClick={() => handleComplete(r._id)}
                >
                  Complete
                </button>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}

const btnStyle = (color) => ({
  padding: "6px 12px",
  backgroundColor: color,
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  textDecoration: "none",
  cursor: "pointer",
});
