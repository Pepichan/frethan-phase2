import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import "../styles/Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const oauthError = params.get("oauthError");

  const [selectedRole, setSelectedRole] = useState<"individual" | "business">(
    "individual"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [oauthStatus, setOauthStatus] = useState<
    | { status: "idle" }
    | { status: "loading"; provider: "google" | "facebook" | "wechat" }
    | { status: "error"; message: string }
  >({ status: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOauthStatus({ status: "idle" });

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
        role: selectedRole,
      });

      const token = typeof res.data?.token === "string" ? res.data.token : null;
      const role = typeof res.data?.role === "string" ? res.data.role : selectedRole;

      if (!token) {
        setError("Login endpoint did not return a token (not implemented yet)");
        return;
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", token);
      storage.setItem("role", role);
      navigate("/dashboard");
    } catch {
      setError("Login failed (endpoint not implemented yet)");
    }
  };

  const handleOAuth = async (provider: "google" | "facebook" | "wechat") => {
    setError("");
    setOauthStatus({ status: "loading", provider });

    try {
      // Redirect-based OAuth flow: backend sends user to provider, then back to /oauth/callback.
      // Use Vite proxy by keeping the URL relative.
      window.location.assign(`/api/auth/${provider}`);
    } catch (e: any) {
      const msg =
        typeof e?.message === "string"
          ? e.message
          : "OAuth failed. Please try again.";
      setOauthStatus({ status: "error", message: msg });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h2 className="title">Welcome back</h2>
        <p className="subtitle">
          Sign in to access your procurement dashboard
        </p>

        {oauthError && <div className="error-box">{oauthError}</div>}
        {error && <div className="error-box">{error}</div>}
        {oauthStatus.status === "error" && (
          <div className="error-box">{oauthStatus.message}</div>
        )}

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

          {/* REMEMBER ME + FORGOT */}
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
          type="button"
          disabled={oauthStatus.status === "loading"}
          onClick={() => handleOAuth("google")}
        >
          {oauthStatus.status === "loading" && oauthStatus.provider === "google"
            ? "Connecting to Google…"
            : "Continue with Google"}
        </button>

        <button
          className="social-btn facebook"
          type="button"
          disabled={oauthStatus.status === "loading"}
          onClick={() => handleOAuth("facebook")}
        >
          {oauthStatus.status === "loading" &&
          oauthStatus.provider === "facebook"
            ? "Connecting to Facebook…"
            : "Continue with Facebook"}
        </button>

        <button
          className="social-btn wechat"
          type="button"
          disabled={oauthStatus.status === "loading"}
          onClick={() => handleOAuth("wechat")}
        >
          {oauthStatus.status === "loading" && oauthStatus.provider === "wechat"
            ? "Opening WeChat QR demo…"
            : "Continue with WeChat (QR demo)"}
        </button>

        <p className="signup-text">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
