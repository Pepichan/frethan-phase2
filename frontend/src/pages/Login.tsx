import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ----------------------------
  // NORMAL EMAIL/PASSWORD LOGIN
  // ----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Incorrect email or password");
        return;
      }

      const token = data.token || "manual-login-token";
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  // ----------------------------
  // SOCIAL LOGINS
  // ----------------------------

  // Google OAuth
  const handleGoogle = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  // Facebook OAuth
  const handleFacebook = () => {
    window.location.href = "http://localhost:4000/auth/facebook";
  };

  // Fake WeChat Demo
  const handleWeChat = () => {
    alert("WeChat login demo coming soon!");
    // If later you want redirect:
    // window.location.href = "http://localhost:4000/auth/wechat-demo";
  };

  // ----------------------------

  return (
    <div className="login-wrapper">
      <div className="login-container">

        <h2 className="title">Welcome Back</h2>
        <p className="subtitle">Sign in to continue managing your supply chain</p>

        {error && <p className="error-box">{error}</p>}

        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="primary-btn">
            Sign In
          </button>
        </form>

        <div className="divider">or continue with</div>

        {/* Google */}
        <button className="social-btn google" onClick={handleGoogle}>
          Continue with Google
        </button>

        {/* Facebook */}
        <button className="social-btn facebook" onClick={handleFacebook}>
          Continue with Facebook
        </button>

        {/* WeChat Demo */}
        <button className="social-btn wechat" onClick={handleWeChat}>
          Continue with WeChat (Demo)
        </button>

        <p className="signup-text">
          Don’t have an account? <a href="/signup">Create one</a>
        </p>

      </div>
    </div>
  );
};

export default Login;
