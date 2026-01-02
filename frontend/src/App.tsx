import React from "react";
import { Routes, Route } from "react-router-dom";

// Global components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Order from "./pages/Order";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SupplierList from "./pages/SupplierList";
import CreateRFQ from "./pages/CreateRFQ";

// Dashboards
import BuyerDashboard from "./pages/dashboard/BuyerDashboard";
import BusinessDashboard from "./pages/dashboard/BusinessDashboard";

// Placeholder pages
import Compliance from "./pages/CompliancePage";
import ShipmentPage from "./pages/ShipmentPage";
import DisputePage from "./pages/DisputePage";

// OAuth handler
import OAuthHandler from "./pages/OAuthHandler";

// ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-root">
      <Navbar />

      <main className="page-content">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order" element={<Order />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* OAuth callback */}
          <Route path="/oauth/callback" element={<OAuthHandler />} />

          {/* Buyer Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Business Dashboard */}
          <Route
            path="/dashboard/business"
            element={
              <ProtectedRoute>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />

          {/* CREATE RFQ (BUYER) */}
          <Route
            path="/rfq/create"
            element={
              <ProtectedRoute>
                <CreateRFQ />
              </ProtectedRoute>
            }
          />

          {/* Supplier verification */}
          <Route path="/supplier-verification" element={<SupplierList />} />

          {/* Placeholder feature pages */}
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/shipment" element={<ShipmentPage />} />
          <Route path="/dispute" element={<DisputePage />} />

          {/* 404 */}
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
