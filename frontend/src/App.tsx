import React from "react";
import { Routes, Route } from "react-router-dom";

// Global components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import SupplierList from "./pages/SupplierList";

import OrderDashboard from "./pages/OrderDashboard";
import OrderDetail from "./pages/OrderDetail";
import RFQ from "./pages/RFQ";

import Dashboard from "./pages/Dashboard";

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
          <Route
            path="/order"
            element={
              <ProtectedRoute>
                <OrderDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />

          <Route path="/rfq" element={<RFQ />} />

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
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Business Dashboard */}
          <Route
            path="/dashboard/business"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* CREATE RFQ (BUYER) */}
          <Route
            path="/rfq/create"
            element={
              <ProtectedRoute>
                <RFQ />
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
