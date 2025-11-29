import React from "react";
import "./Footer.css";

import facebookIcon from "../assets/facebook.png";
import twitterIcon from "../assets/twitter.png";
import wechatIcon from "../assets/wechat.png";
import linkedinIcon from "../assets/linkedin.png";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Top links row */}
      <div className="footer-links-row">
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms</a>
      </div>

      {/* Social icons row */}
      <div className="footer-social-row">
        <span className="footer-social-label">Connect with us</span>
        <div className="footer-social-icons">
          <a href="#" aria-label="LinkedIn">
            <img src={linkedinIcon} alt="LinkedIn" />
          </a>
          <a href="#" aria-label="Twitter">
            <img src={twitterIcon} alt="Twitter" />
          </a>
          <a href="#" aria-label="Facebook">
            <img src={facebookIcon} alt="Facebook" />
          </a>
          <a href="#" aria-label="WeChat">
            <img src={wechatIcon} alt="WeChat" />
          </a>
        </div>
      </div>

      {/* Copyright row */}
      <div className="footer-copy">
        ©2025 Frethan Technology PTY LTD
      </div>
    </footer>
  );
};

export default Footer;