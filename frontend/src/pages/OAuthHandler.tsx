import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
      return;
    }

    if (error) {
      navigate(`/login?oauthError=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    navigate("/login", { replace: true });
  }, [navigate]);

  return <p>Signing you in...</p>;
};

export default OAuthHandler;
