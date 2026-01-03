import React, { useMemo, useState, ChangeEvent, FormEvent } from "react";

interface RFQFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  productCategory: string;
  quantity: string;
  description: string;
  specifications: string;
  priceRange: string;
  urgency: string;
  deliveryDate: string; // DD/MM/YYYY
  deliveryLocation: string;
  additional: string;
}
interface FormErrors { [key: string]: string; }

const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? "" : "http://localhost:5001");

function ddmmyyyyToISO(ddmmyyyy: string): string | null {
  const m = ddmmyyyy.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const dd = Number(m[1]), mm = Number(m[2]), yyyy = Number(m[3]);
  const d = new Date(Date.UTC(yyyy, mm - 1, dd));
  if (d.getUTCFullYear() !== yyyy || d.getUTCMonth() !== mm - 1 || d.getUTCDate() !== dd) return null;
  return d.toISOString();
}

export default function RFQ() {
  const initialFormData: RFQFormData = useMemo(() => ({
    companyName:"", contactPerson:"", email:"", phone:"",
    productCategory:"", quantity:"", description:"", specifications:"",
    priceRange:"", urgency:"", deliveryDate:"", deliveryLocation:"", additional:""
  }), []);

  const [formData, setFormData] = useState<RFQFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const productCategories = [
    { value: "", label: "Select product category" },
    { value: "steel", label: "Steel & Metal Products" },
    { value: "cement", label: "Cement & Concrete" },
    { value: "lumber", label: "Lumber & Wood Products" },
    { value: "electrical", label: "Electrical Materials" },
    { value: "plumbing", label: "Plumbing Materials" },
    { value: "tools", label: "Tools & Equipment" },
    { value: "other", label: "Other" }
  ];
  const urgencyLevels = [
    { value: "", label: "Select urgency level" },
    { value: "low", label: "Low (1-2 months)" },
    { value: "medium", label: "Medium (2-4 weeks)" },
    { value: "high", label: "High (1-2 weeks)" },
    { value: "critical", label: "Critical (Less than 1 week)" }
  ];

  const validateForm = (): boolean => {
    const e: FormErrors = {};
    if (!formData.companyName.trim()) e.companyName = "Company name is required";
    if (!formData.contactPerson.trim()) e.contactPerson = "Contact person is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Email is invalid";
    if (!formData.phone.trim()) e.phone = "Phone number is required";
    else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(formData.phone)) e.phone = "Phone number is invalid";
    if (!formData.productCategory) e.productCategory = "Product category is required";
    if (!formData.quantity.trim()) e.quantity = "Quantity is required";
    if (!formData.description.trim()) e.description = "Description is required";
    if (!formData.urgency) e.urgency = "Urgency level is required";
    if (!formData.deliveryDate.trim()) e.deliveryDate = "Delivery date is required";
    else if (!ddmmyyyyToISO(formData.deliveryDate)) e.deliveryDate = "Date must be valid (DD/MM/YYYY)";
    if (!formData.deliveryLocation.trim()) e.deliveryLocation = "Delivery location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (ev: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value } = ev.target;
    let v = value;
    if (name === "deliveryDate") {
      v = value.replace(/\D/g, "");
      if (v.length >= 2) v = v.substring(0,2) + "/" + v.substring(2);
      if (v.length >= 5) v = v.substring(0,5) + "/" + v.substring(5,9);
    }
    setFormData(prev => ({ ...prev, [name]: v }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const scrollToForm = () => document.querySelector(".form-section")?.scrollIntoView({ behavior:"smooth", block:"start" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const deliveryDateISO = ddmmyyyyToISO(formData.deliveryDate);
      if (!deliveryDateISO) { setErrors({ deliveryDate: "Date must be valid (DD/MM/YYYY)" }); return; }

      const res = await fetch(`${API_BASE}/api/rfqs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, deliveryDateISO })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data?.errors) setErrors(data.errors);
        else setErrors({ submit: "Failed to submit RFQ. Please try again." });
        return;
      }

      setFormData(initialFormData);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 4500);
    } catch {
      setErrors({ submit: "Network error. Make sure backend is running." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rfq-container">
      {isSubmitted && (
        <div className="toast success">
          <i className="fas fa-check-circle" />
          <div>
            <div className="toast-title">RFQ Submitted</div>
            <div className="toast-sub">We’ll get you quotes within 24 hours.</div>
          </div>
        </div>
      )}

      <section className="hero">
        <div className="container">
          <div className="badge"><i className="fas fa-shield-alt" /> Verified suppliers • Smart workflow • Fast quotes</div>
          <h1>Request for Quote</h1>
          <p>Submit your RFQ and receive competitive offers from verified suppliers — with compliance and tracking.</p>
          <div className="hero-actions">
            <button className="btn primary" onClick={scrollToForm}>Start RFQ</button>
            <div className="meta"><i className="fas fa-clock" /> Typical response: within 24 hours</div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="grid4">
          <div className="card feature"><i className="fas fa-robot" /><h3>AI Supplier Verification</h3><p>Screen suppliers and reduce risk with compliance checks.</p></div>
          <div className="card feature"><i className="fas fa-link" /><h3>Smart Contracts</h3><p>Clear milestones and terms for transparent trade.</p></div>
          <div className="card feature"><i className="fas fa-shipping-fast" /><h3>Shipment Tracking</h3><p>Real-time visibility from dispatch to delivery.</p></div>
          <div className="card feature"><i className="fas fa-headset" /><h3>24/7 Support</h3><p>Help and resolution whenever you need it.</p></div>
        </div>
      </section>

      <section className="container form-section">
        <div className="card form-card">
          <div className="title">
            <h2>Request for Quote</h2>
            <p>Get competitive quotes from verified suppliers in China</p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="section">
              <div className="section-h">Company Information</div>

              <div className="row">
                <div className="field">
                  <label className="req">Company Name</label>
                  <input name="companyName" value={formData.companyName} onChange={handleInputChange} className={errors.companyName ? "error" : ""} placeholder="Enter your company name" />
                  {errors.companyName && <div className="err">{errors.companyName}</div>}
                </div>
                <div className="field">
                  <label className="req">Contact Person</label>
                  <input name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className={errors.contactPerson ? "error" : ""} placeholder="Enter contact person name" />
                  {errors.contactPerson && <div className="err">{errors.contactPerson}</div>}
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label className="req">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={errors.email ? "error" : ""} placeholder="Enter email address" />
                  {errors.email && <div className="err">{errors.email}</div>}
                </div>
                <div className="field">
                  <label className="req">Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} className={errors.phone ? "error" : ""} placeholder="Enter phone number" />
                  {errors.phone && <div className="err">{errors.phone}</div>}
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-h">Product Information</div>
              <div className="row">
                <div className="field">
                  <label className="req">Product Category</label>
                  <select name="productCategory" value={formData.productCategory} onChange={handleInputChange} className={errors.productCategory ? "error" : ""}>
                    {productCategories.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  {errors.productCategory && <div className="err">{errors.productCategory}</div>}
                </div>
                <div className="field">
                  <label className="req">Estimated Quantity</label>
                  <input name="quantity" value={formData.quantity} onChange={handleInputChange} className={errors.quantity ? "error" : ""} placeholder="e.g., 100 tons, 500 units" />
                  {errors.quantity && <div className="err">{errors.quantity}</div>}
                </div>
              </div>

              <div className="row">
                <div className="field full">
                  <label className="req">Product Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className={errors.description ? "error" : ""} rows={4} placeholder="Provide detailed description of the products you need" />
                  {errors.description && <div className="err">{errors.description}</div>}
                </div>
              </div>

              <div className="row">
                <div className="field full">
                  <label>Technical Specifications</label>
                  <textarea name="specifications" value={formData.specifications} onChange={handleInputChange} rows={4} placeholder="Dimensions, materials, standards, certifications..." />
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-h">Project Details</div>
              <div className="row">
                <div className="field">
                  <label>Target Price Range</label>
                  <input name="priceRange" value={formData.priceRange} onChange={handleInputChange} placeholder="e.g., $5,000 - $10,000 AUD" />
                </div>
                <div className="field">
                  <label className="req">Urgency</label>
                  <select name="urgency" value={formData.urgency} onChange={handleInputChange} className={errors.urgency ? "error" : ""}>
                    {urgencyLevels.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  {errors.urgency && <div className="err">{errors.urgency}</div>}
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label className="req">Required Delivery Date</label>
                  <input name="deliveryDate" value={formData.deliveryDate} onChange={handleInputChange} className={errors.deliveryDate ? "error" : ""} placeholder="DD/MM/YYYY" />
                  {errors.deliveryDate && <div className="err">{errors.deliveryDate}</div>}
                </div>
                <div className="field">
                  <label className="req">Delivery Location</label>
                  <input name="deliveryLocation" value={formData.deliveryLocation} onChange={handleInputChange} className={errors.deliveryLocation ? "error" : ""} placeholder="City, State, Australia" />
                  {errors.deliveryLocation && <div className="err">{errors.deliveryLocation}</div>}
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-h">Additional Requirements</div>
              <div className="row">
                <div className="field full">
                  <label>Special Requirements or Instructions</label>
                  <textarea name="additional" value={formData.additional} onChange={handleInputChange} rows={4} placeholder="Packaging, compliance, inspection, handling, etc." />
                </div>
              </div>
            </div>

            {errors.submit && <div className="submitErr"><i className="fas fa-triangle-exclamation" /> {errors.submit}</div>}

            <button className="btn submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (<><i className="fas fa-spinner fa-spin" /> Submitting...</>) : "Submit RFQ Request"}
            </button>

            <div className="privacy"><i className="fas fa-lock" /> Your details are used only to process your RFQ.</div>
          </form>
        </div>
      </section>
    </div>
  );
}
