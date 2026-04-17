// import { useEffect, useState } from "react";
// import {
//   getMyRequests,
//   confirmBloodReceived,
// } from "../services/bloodRequestService";

// export default function MyRequests() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadRequests = async () => {
//     try {
//       const res = await getMyRequests();
//       setRequests(res.data.requests || []);
//     } catch (error) {
//       console.error(error);
//       alert("Failed to load your requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadRequests();
//   }, []);

//   const handleConfirmReceived = async (id) => {
//     try {
//       await confirmBloodReceived(id);
//       setRequests((prev) =>
//         prev.map((r) => (r._id === id ? { ...r, status: "completed" } : r)),
//       );
//       alert("Blood received confirmed successfully ✅");
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to confirm");
//     }
//   };

//   if (loading) return <p style={{ padding: "30px" }}>Loading requests...</p>;

//   return (
//     <div style={{ padding: "30px", maxWidth: "1100px", margin: "0 auto" }}>
//       <h1 style={{ marginBottom: "20px", color: "#b11226" }}>
//         My Blood Requests
//       </h1>

//       {requests.length === 0 ? (
//         <div
//           style={{
//             background: "#fff",
//             padding: "30px",
//             borderRadius: "16px",
//             textAlign: "center",
//           }}
//         >
//           No requests found.
//         </div>
//       ) : (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
//             gap: "20px",
//           }}
//         >
//           {requests.map((req) => (
//             <div
//               key={req._id}
//               style={{
//                 background: "#fff",
//                 borderRadius: "18px",
//                 padding: "20px",
//                 boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
//                 border: "1px solid #f1f5f9",
//               }}
//             >
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <h3 style={{ margin: 0 }}>{req.bloodType}</h3>
//                 <span
//                   style={{
//                     padding: "6px 10px",
//                     borderRadius: "999px",
//                     fontSize: "12px",
//                     fontWeight: "700",
//                     background:
//                       req.status === "completed"
//                         ? "#dcfce7"
//                         : req.status === "waiting_confirmation"
//                           ? "#ffedd5"
//                           : req.status === "accepted"
//                             ? "#dbeafe"
//                             : "#f3f4f6",
//                     color:
//                       req.status === "completed"
//                         ? "#166534"
//                         : req.status === "waiting_confirmation"
//                           ? "#c2410c"
//                           : req.status === "accepted"
//                             ? "#1d4ed8"
//                             : "#374151",
//                   }}
//                 >
//                   {req.status}
//                 </span>
//               </div>

//               <p>
//                 <strong>Patient:</strong> {req.patientName}
//               </p>
//               <p>
//                 <strong>Hospital:</strong> {req.hospital}
//               </p>
//               <p>
//                 <strong>Location:</strong> {req.district}, {req.province}
//               </p>
//               <p>
//                 <strong>Contact:</strong> {req.contactPhone}
//               </p>

//               {req.acceptedBy && (
//                 <>
//                   <p>
//                     <strong>Donor Name:</strong> {req.acceptedBy.name || "N/A"}
//                   </p>
//                   <p>
//                     <strong>Donor Phone:</strong>{" "}
//                     {req.acceptedBy.phone || "N/A"}
//                   </p>
//                 </>
//               )}

//               {req.status === "waiting_confirmation" && (
//                 <button
//                   onClick={() => handleConfirmReceived(req._id)}
//                   style={{
//                     width: "100%",
//                     marginTop: "12px",
//                     padding: "12px",
//                     border: "none",
//                     borderRadius: "12px",
//                     background: "#16a34a",
//                     color: "#fff",
//                     fontWeight: "700",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Confirm Blood Received
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
