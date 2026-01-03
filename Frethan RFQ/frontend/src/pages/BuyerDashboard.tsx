import React from "react";
import { useNavigate } from "react-router-dom";
import RFQ from "./RFQ";
import "./Dashboard.css";

export default function BuyerDashboard() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1>Buyer Dashboard</h1>
            <p>Create and manage your RFQs</p>
          </div>
          <button onClick={handleBack} className="logout-btn">
            <i className="fas fa-arrow-left" /> Back to Home
          </button>
        </div>
      </header>
      <RFQ />
    </div>
  );
}

