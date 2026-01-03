import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller" | null>(null);
  const navigate = useNavigate();

  const handleSelect = (role: "buyer" | "seller") => {
    setSelectedRole(role);
    navigate(`/${role}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "500px" }}>
        <h1>Welcome to Frethan RFQ</h1>
        <p className="auth-subtitle">Select your role to continue</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
          <button
            className="auth-btn"
            onClick={() => handleSelect("buyer")}
            style={{ width: "100%", padding: "16px", fontSize: "1.1rem" }}
          >
            <i className="fas fa-shopping-cart" style={{ marginRight: "10px" }} />
            I'm a Buyer
            <div style={{ fontSize: "0.85rem", marginTop: "4px", opacity: 0.9 }}>
              Create and manage RFQs
            </div>
          </button>

          <button
            className="auth-btn"
            onClick={() => handleSelect("seller")}
            style={{ width: "100%", padding: "16px", fontSize: "1.1rem", background: "linear-gradient(135deg, #1a5f7a, #2a9d8f)" }}
          >
            <i className="fas fa-store" style={{ marginRight: "10px" }} />
            I'm a Seller
            <div style={{ fontSize: "0.85rem", marginTop: "4px", opacity: 0.9 }}>
              View RFQs and create Purchase Orders
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

