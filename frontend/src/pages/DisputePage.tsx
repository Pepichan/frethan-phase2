import React from "react";

const DisputePage: React.FC = () => {
  const disputes = [
    { id: 1, title: "Damaged Shipment", status: "Open", created: "2025-01-02" },
    { id: 2, title: "Incorrect Quantity", status: "Resolved", created: "2024-12-18" },
    { id: 3, title: "Payment Delay", status: "Under Review", created: "2024-12-28" },
  ];

  const badgeStyle = (status: string) => ({
    padding: "4px 10px",
    borderRadius: "5px",
    background:
      status === "Resolved"
        ? "#b2f2bb"
        : status === "Open"
        ? "#ffa8a8"
        : "#ffe066",
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dispute Resolution Center</h1>
      <p>Manage and track disputes raised between buyers and suppliers.</p>

      <table
        style={{
          marginTop: "1.5rem",
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead>
          <tr style={{ background: "#f8f9fa" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Issue</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {disputes.map((dispute) => (
            <tr key={dispute.id}>
              <td style={{ padding: "10px", border: "1px solid #eee" }}>{dispute.title}</td>
              <td style={{ padding: "10px", border: "1px solid #eee" }}>
                <span style={badgeStyle(dispute.status)}>{dispute.status}</span>
              </td>
              <td style={{ padding: "10px", border: "1px solid #eee" }}>{dispute.created}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#fff5f5",
          borderRadius: "8px",
        }}
      >
        <h3>Coming Soon</h3>
        <p>
          The dispute resolution workflow will integrate with a smart contract to ensure
          transparent and immutable dispute tracking.
        </p>
      </div>
    </div>
  );
};

export default DisputePage;
