import React, { useState } from "react";
import "./Signup.css";


const Signup: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<
    "individual" | "business"
  >("individual");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: selectedRole, // ✅ IMPORTANT
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Signup failed");
        return;
      }

      alert(`Account created as ${selectedRole}! Please login.`);
      window.location.href = "/login";
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-container">
        <h2 className="title">Create an Account</h2>
        <p className="subtitle">
          Join Frethan and start managing your workflow
        </p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* ROLE SELECTOR (SAME AS LOGIN) */}
          <div className="role-selector">
            <span className="role-label">Sign up as</span>
            <div className="role-options">
              <button
                type="button"
                className={`role-btn ${
                  selectedRole === "individual" ? "active" : ""
                }`}
                onClick={() => setSelectedRole("individual")}
              >
                Buyer
              </button>

              <button
                type="button"
                className={`role-btn ${
                  selectedRole === "business" ? "active" : ""
                }`}
                onClick={() => setSelectedRole("business")}
              >
                Business
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button className="primary-btn" type="submit">
            Create Account
          </button>
        </form>

        <p className="signup-text">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
