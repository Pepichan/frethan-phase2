import React from "react";
import "./Home.css";
import supplyImg from "../../assets/supply.avif";  // <-- Import image

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Streamline procurement with trusted suppliers</h1>
        <p>
          AI powered Verification, Blockchain Contracts and real-time Tracking.
        </p>
        <button className="verify-btn">Verify Suppliers</button>
      </div>

      {/* Image box */}
      <div className="hero-image">
        <img src={supplyImg} alt="Supply Chain" />
      </div>
    </section>
  );
};

export default Hero;
