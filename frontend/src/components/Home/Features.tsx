import React from "react";
import "./Home.css";

const Features: React.FC = () => {
  return (
    <section className="features-section">
      <div className="feature-card">
        <h3>Supplier Verification</h3>
        <p>AI-powered supplier checks.</p>
      </div>

      <div className="feature-card">
        <h3>Compliance</h3>
        <p>Smart contracts & documentation.</p>
      </div>

      <div className="feature-card">
        <h3>Real-Time Shipment</h3>
        <p>Live order and shipment status.</p>
      </div>

      <div className="feature-card">
        <h3>Dispute Resolution</h3>
        <p>Transparent case tracking.</p>
      </div>
    </section>
  );
};

export default Features;
