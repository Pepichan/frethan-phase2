import React from "react";
import "./Auth.css";

type Provider = "google" | "facebook" | "wechat-demo";

interface SocialLoginButtonsProps {
  onSocialClick: (provider: Provider) => void;
  isLoading: boolean;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onSocialClick,
  isLoading,
}) => {
  return (
    <div className="social-login-wrapper">
      <button
        type="button"
        className="social-btn social-google"
        onClick={() => onSocialClick("google")}
        disabled={isLoading}
      >
        {isLoading ? "Connecting…" : "Continue with Google"}
      </button>

      <button
        type="button"
        className="social-btn social-facebook"
        onClick={() => onSocialClick("facebook")}
        disabled={isLoading}
      >
        {isLoading ? "Connecting…" : "Continue with Facebook"}
      </button>

      <button
        type="button"
        className="social-btn social-wechat"
        onClick={() => onSocialClick("wechat-demo")}
        disabled={isLoading}
      >
        {isLoading ? "Connecting…" : "Continue with WeChat (Demo)"}
      </button>

      <p className="wechat-note">WeChat: Demo only – no real login.</p>
    </div>
  );
};

export default SocialLoginButtons;
