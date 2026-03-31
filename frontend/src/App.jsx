import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
const isAdminRoute = location.pathname.startsWith("/admin");
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRequests from "./pages/AdminRequests";
import AdminContactMessages from "./pages/AdminContactMessages";

// Pages
import Home from "./pages/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import CreateBloodRequest from "./pages/CreateBloodRequest";
import ViewRequests from "./pages/ViewRequests";
import MyAcceptRequest from "./pages/MyAcceptedRequests";

import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
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
        <Route path="/view-requests" element={<ViewRequests />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-requests" element={<AdminRequests />} />
        <Route
          path="/admin-contact-messages"
          element={<AdminContactMessages />}
        />
      </Routes>

      {!isAdminRoute && <Footer />}
    </BrowserRouter>
  );
}
