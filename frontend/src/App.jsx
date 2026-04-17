import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRequests from "./pages/AdminRequests";
import AdminContactMessages from "./pages/AdminContactMessages";
import AdminLogin from "./pages/AdminLogin";

// Main Pages
import Home from "./pages/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import CreateBloodRequest from "./pages/CreateBloodRequest";
import DonorRequestsPage from "./pages/DonorRequestsPage";
import ReceiverRequestsPage from "./pages/ReceiverRequestsPage";
import MyAcceptRequest from "./pages/MyAcceptedRequests";

import "./index.css";

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/my-accepted" element={<MyAcceptRequest />} />

        <Route path="/create-blood-request" element={<CreateBloodRequest />} />

        {/* New split pages */}
        <Route path="/donor-requests" element={<DonorRequestsPage />} />

        <Route path="/my-requests" element={<ReceiverRequestsPage />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-requests" element={<AdminRequests />} />
        <Route
          path="/admin-contact-messages"
          element={<AdminContactMessages />}
        />
        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
