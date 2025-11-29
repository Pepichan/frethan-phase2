import React from "react";
import "./Auth.css";

interface AuthErrorBannerProps {
  message: string;
  onClose: () => void;
}

const AuthErrorBanner: React.FC<AuthErrorBannerProps> = ({
  message,
  onClose,
}) => {
  if (!message) return null;

  return (
    <div className="auth-error-banner">
      <span>{message}</span>
      <button
        type="button"
        className="auth-error-close"
        onClick={onClose}
        aria-label="Close error"
      >
        ×
      </button>
    </div>
  );
};

export default AuthErrorBanner;
