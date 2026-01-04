import "./CompliancePage.css";

export default function CompliancePage() {
  return (
    <div className="compliance-container">
      <h1>Compliance Dashboard</h1>

      <p className="subtitle">
        Smart contract validation & documentation summary.
      </p>

      <div className="compliance-grid">

        <div className="compliance-card">
          <h3>Document Status</h3>
          <ul>
            <li>Business License – ✔ Verified</li>
            <li>Insurance Certificate – ✔ Valid</li>
            <li>Safety Compliance – ❌ Pending</li>
          </ul>
        </div>

        <div className="compliance-card">
          <h3>Blockchain Log</h3>
          <p>Every compliance update is stored securely using smart contract events.</p>
          <button>View Blockchain Log</button>
        </div>

      </div>
    </div>
  );
}
