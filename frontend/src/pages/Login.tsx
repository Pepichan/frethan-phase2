import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import SocialLoginButtons from "../components/auth/SocialLoginButtons";
import AuthErrorBanner from "../components/auth/AuthErrorBanner";

import "./Login.css";

type Provider = "google" | "facebook" | "wechat-demo";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  // Check URL for ?error=… from backend redirects
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error === "access_denied") {
      setErrorMsg("Login cancelled. Please try again.");
    } else if (error === "invalid") {
      setErrorMsg("Login failed. Invalid credentials or provider error.");
    } else if (error) {
      setErrorMsg("Something went wrong during login. Please try again.");
    }
  }, [location.search]);

  const handleSocialClick = (provider: Provider) => {
    setErrorMsg("");
    setIsLoading(true);

    let url = "";
    switch (provider) {
      case "google":
        url = "/auth/google";
        break;
      case "facebook":
        url = "/auth/facebook";
        break;
      case "wechat-demo":
        url = "/auth/wechat-demo";
        break;
    }

    // Redirect to backend OAuth route
    window.location.href = url;
  };

  const handleFakeSuccess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // This is just a placeholder to show "success → dashboard"
    // In real app, backend would redirect after login.
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Sign in to Frethan</h2>
          <p className="login-subtitle">
            Access your procurement dashboard and manage your supply chain.
          </p>
        </div>

        {/* Error banner */}
        <AuthErrorBanner message={errorMsg} onClose={() => setErrorMsg("")} />

        {/* Main email/password form */}
        <form className="login-form" onSubmit={handleFakeSuccess}>
          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="Enter your email" required />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="Enter your password" required />
          </label>

          <div className="login-row">
            <label className="remember-me">
              <input type="checkbox" defaultChecked />
              Remember me
            </label>
            <button type="button" className="text-link">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="primary-btn full-width"
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="divider-row">
          <span className="divider-line" />
          <span className="divider-text">or continue with</span>
          <span className="divider-line" />
        </div>

        {/* Social login buttons */}
        <SocialLoginButtons
          onSocialClick={handleSocialClick}
          isLoading={isLoading}
        />

        {/* Footer text */}
        <p className="login-footer-text">
          Don’t have an account? <span className="text-link">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
