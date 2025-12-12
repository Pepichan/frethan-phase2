import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Features: React.FC = () => {
  return (
    <section className="features-section">

      {/* Supplier Verification → Correct Route */}
      <Link to="/supplier-verification" className="card-link">

        <div className="feature-card">
          <h3>Supplier Verification</h3>
          <p>AI-powered supplier checks.</p>
        </div>
      </Link>

      {/* Compliance Placeholder */}
      <Link to="/compliance" className="card-link">
        <div className="feature-card">
          <h3>Compliance</h3>
          <p>Smart contracts & documentation.</p>
        </div>
      </Link>

      {/* Real-Time Shipment Placeholder */}
      <Link to="/shipment" className="card-link">
        <div className="feature-card">
          <h3>Real-Time Shipment</h3>
          <p>Live order and shipment status.</p>
        </div>
      </Link>

      {/* Dispute Resolution Placeholder */}
      <Link to="/dispute" className="card-link">
        <div className="feature-card">
          <h3>Dispute Resolution</h3>
          <p>Transparent case tracking.</p>
        </div>
      </Link>

    </section>
  );
};

export default Features; 

