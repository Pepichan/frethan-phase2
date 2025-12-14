import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();

  // ✅ NEW: handle Google OAuth token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Store token (Google login)
      localStorage.setItem("token", token);
      localStorage.setItem("role", "individual"); // default role for Google

      // Clean URL
      window.history.replaceState({}, document.title, "/login");

      // Redirect to dashboard
      navigate("/dashboard");
    }
  }, [navigate]);

  const [selectedRole, setSelectedRole] = useState<"individual" | "business">(
    "individual"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Invalid email or password");
        return;
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("role", data.role);

      if (data.role === "business") {
        navigate("/dashboard/business");
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="title">Welcome back</h2>
        <p className="subtitle">
          Sign in to access your procurement dashboard
        </p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* ROLE SELECTOR */}
          <div className="role-selector">
            <span className="role-label">Sign in as</span>
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
            <label>Email</label>
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

          <div className="login-extra">
            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember me
            </label>

            <a href="/forgot-password" className="forgot">
              Forgot password?
            </a>
          </div>

          <button className="primary-btn" type="submit">
            Sign In
          </button>
        </form>

        <div className="divider">or continue with</div>

        <button
          className="social-btn google"
          onClick={() =>
            (window.location.href = "http://localhost:4000/auth/google")
          }
        >
          Continue with Google
        </button>

        <button
          className="social-btn facebook"
          onClick={() =>
            (window.location.href = "http://localhost:4000/auth/facebook")
          }
        >
          Continue with Facebook
        </button>

        <button
          className="social-btn wechat"
          onClick={() => alert("WeChat login (demo)")}
        >
          Continue with WeChat (Demo)
        </button>

        <p className="signup-text">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
