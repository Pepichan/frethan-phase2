import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? "" : "http://localhost:5001");

interface RFQ {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  productCategory: string;
  quantity: string;
  description: string;
  specifications?: string;
  priceRange?: string;
  urgency: string;
  deliveryDateISO: string;
  deliveryLocation: string;
  additional?: string;
  createdAt: string;
}

interface PO {
  _id: string;
  rfqId: RFQ;
  quotedPrice: string;
  terms?: string;
  status: string;
  createdAt: string;
}

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [pos, setPos] = useState<PO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rfqs" | "pos">("rfqs");
  const [selectedRfq, setSelectedRfq] = useState<RFQ | null>(null);
  const [showPOForm, setShowPOForm] = useState(false);
  const [poFormData, setPOFormData] = useState({ quotedPrice: "", terms: "", notes: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rfqsRes, posRes] = await Promise.all([
        fetch(`${API_BASE}/api/rfqs`, { headers: { "Content-Type": "application/json" } }),
        fetch(`${API_BASE}/api/pos`, { headers: { "Content-Type": "application/json" } })
      ]);

      if (rfqsRes.ok) {
        const rfqsData = await rfqsRes.json();
        setRfqs(rfqsData);
      }

      if (posRes.ok) {
        const posData = await posRes.json();
        setPos(posData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePO = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedRfq) return;

    try {
      const res = await fetch(`${API_BASE}/api/pos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfqId: selectedRfq._id,
          quotedPrice: poFormData.quotedPrice,
          terms: poFormData.terms,
          notes: poFormData.notes
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create PO");
        return;
      }

      setShowPOForm(false);
      setSelectedRfq(null);
      setPOFormData({ quotedPrice: "", terms: "", notes: "" });
      fetchData();
      alert("Purchase Order created successfully!");
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div>
            <h1>Seller Dashboard</h1>
            <p>View RFQs and create Purchase Orders</p>
          </div>
          <button onClick={handleBack} className="logout-btn">
            <i className="fas fa-arrow-left" /> Back to Home
          </button>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button
          className={activeTab === "rfqs" ? "active" : ""}
          onClick={() => setActiveTab("rfqs")}
        >
          Available RFQs ({rfqs.length})
        </button>
        <button
          className={activeTab === "pos" ? "active" : ""}
          onClick={() => setActiveTab("pos")}
        >
          My Purchase Orders ({pos.length})
        </button>
      </div>

      {activeTab === "rfqs" && (
        <div className="dashboard-content">
          {rfqs.length === 0 ? (
            <div className="empty-state">No RFQs available</div>
          ) : (
            <div className="rfq-grid">
              {rfqs.map((rfq) => (
                <div key={rfq._id} className="rfq-card">
                  <div className="rfq-card-header">
                    <h3>{rfq.companyName}</h3>
                    <span className={`urgency-badge ${rfq.urgency}`}>{rfq.urgency}</span>
                  </div>
                  <div className="rfq-card-body">
                    <p><strong>Product:</strong> {rfq.productCategory}</p>
                    <p><strong>Quantity:</strong> {rfq.quantity}</p>
                    <p><strong>Description:</strong> {rfq.description.substring(0, 100)}...</p>
                    <p><strong>Delivery:</strong> {formatDate(rfq.deliveryDateISO)} to {rfq.deliveryLocation}</p>
                    <p><strong>Contact:</strong> {rfq.contactPerson} ({rfq.email})</p>
                  </div>
                  <button
                    className="create-po-btn"
                    onClick={() => {
                      setSelectedRfq(rfq);
                      setShowPOForm(true);
                    }}
                  >
                    Create Purchase Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "pos" && (
        <div className="dashboard-content">
          {pos.length === 0 ? (
            <div className="empty-state">No Purchase Orders yet</div>
          ) : (
            <div className="po-list">
              {pos.map((po) => (
                <div key={po._id} className="po-card">
                  <div className="po-card-header">
                    <h3>PO #{po._id.substring(0, 8)}</h3>
                    <span className={`status-badge ${po.status}`}>{po.status}</span>
                  </div>
                  <div className="po-card-body">
                    <p><strong>RFQ:</strong> {typeof po.rfqId === "object" ? po.rfqId.companyName : "N/A"}</p>
                    <p><strong>Quoted Price:</strong> {po.quotedPrice}</p>
                    {po.terms && <p><strong>Terms:</strong> {po.terms}</p>}
                    <p><strong>Created:</strong> {formatDate(po.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showPOForm && selectedRfq && (
        <div className="modal-overlay" onClick={() => setShowPOForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Purchase Order</h2>
            <p><strong>RFQ:</strong> {selectedRfq.companyName} - {selectedRfq.productCategory}</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleCreatePO}>
              <div className="form-field">
                <label>Quoted Price *</label>
                <input
                  type="text"
                  value={poFormData.quotedPrice}
                  onChange={(e) => setPOFormData({ ...poFormData, quotedPrice: e.target.value })}
                  required
                  placeholder="e.g., $5,000 AUD"
                />
              </div>

              <div className="form-field">
                <label>Terms & Conditions</label>
                <textarea
                  value={poFormData.terms}
                  onChange={(e) => setPOFormData({ ...poFormData, terms: e.target.value })}
                  rows={4}
                  placeholder="Payment terms, delivery terms, etc."
                />
              </div>

              <div className="form-field">
                <label>Notes</label>
                <textarea
                  value={poFormData.notes}
                  onChange={(e) => setPOFormData({ ...poFormData, notes: e.target.value })}
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowPOForm(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

