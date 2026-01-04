import { Link, useNavigate } from "react-router-dom";
import frethanLogo from "../assets/frethan-logo.png";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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

        {/* Only show these if logged in */}
        {token && (
          <>
            <Link to="/order">Order</Link>
            <Link to="/rfq">RFQ</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/supplier-verification">Supplier Verification</Link>
          </>
        )}
      </nav>

      {/* RIGHT: Search + Login/Logout */}
      <div className="nav-right">
        <input type="text" placeholder="Search" className="search-box" />

        {!token ? (
          <Link to="/login" className="login-btn">
            Login / Signup
          </Link>
        ) : (
          <button className="login-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
