import React from "react";
import { Link } from "react-router-dom";
import frethanLogo from "../assets/frethan-logo.png";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar-container">
      {/* LEFT: Logo + Brand */}
      <div className="nav-left">
        <img src={frethanLogo} className="nav-logo" />
        <div className="brand-text">
          <span className="brand-name">FRETHAN</span>
          <span className="brand-sub">MY SUPPLY CHAIN</span>
        </div>
      </div>

      {/* CENTER: Links */}
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/order">Order</Link>
        <Link to="/rfq">RFQ</Link>
      </nav>

      {/* RIGHT: Search + Login */}
      <div className="nav-right">
        <input type="text" placeholder="Search" className="search-box" />
        <Link to="/login" className="login-btn">Login/Signup</Link>
      </div>
    </header>
  );
}
