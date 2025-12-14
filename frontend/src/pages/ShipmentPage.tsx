import React from "react";

const ShipmentPage: React.FC = () => {
  const shipments = [
    { id: 1, item: "Steel Bars", status: "In Transit", eta: "2025-01-20" },
    { id: 2, item: "Cement Bags", status: "Delivered", eta: "2024-12-30" },
    { id: 3, item: "Safety Helmets", status: "Delayed", eta: "2025-02-03" },
  ];

  const badgeColor = (status: string) => ({
    padding: "4px 10px",
    borderRadius: "5px",
    background:
      status === "Delivered"
        ? "#b2f2bb"
        : status === "In Transit"
        ? "#a5d8ff"
        : "#ffa8a8",
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Real-Time Shipment Tracking</h1>
      <p>Monitor the status and ETA of shipments.</p>

      <table
        style={{
          marginTop: "1.5rem",
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead>
          <tr style={{ background: "#edf2ff" }}>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Item</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
            <th style={{ padding: "10px", border: "1px solid #ddd" }}>ETA</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((ship) => (
            <tr key={ship.id}>
              <td style={{ padding: "10px", border: "1px solid #eee" }}>{ship.item}</td>
              <td style={{ padding: "10px", border: "1px solid #eee" }}>
                <span style={badgeColor(ship.status)}>{ship.status}</span>
              </td>
              <td style={{ padding: "10px", border: "1px solid #eee" }}>{ship.eta}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#e7f5ff",
          borderRadius: "8px",
        }}
      >
        <h3>Coming Soon</h3>
        <p>
          Shipment hashes will be logged on the blockchain to ensure integrity and
          prevent tampering during transport.
        </p>
      </div>
    </div>
  );
};

export default ShipmentPage;
