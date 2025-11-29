import React from "react";
import { Routes, Route } from "react-router-dom";

// Global components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Order from "./pages/Order";
import RFQ from "./pages/RFQ";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app-root">
      {/* Global Navbar (always on top) */}
      <Navbar />

      {/* Switch pages */}
      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/order" element={<Order />} />
          <Route path="/rfq" element={<RFQ />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;