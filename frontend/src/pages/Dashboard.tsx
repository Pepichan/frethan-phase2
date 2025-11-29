import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Dashboard Page
      </h1>

      <p
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          fontSize: "18px",
          lineHeight: "1.6",
        }}
      >
        This is your procurement dashboard.  
        Later we will add metrics, order tables, supplier verification status, and more.
      </p>
    </div>
  );
};

export default Dashboard;
